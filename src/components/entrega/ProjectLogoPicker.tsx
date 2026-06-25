import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAppProjects } from "@/hooks/useAppProjects";
import {
  getProjectLogoSignedUrl,
  removeProjectLogo,
  uploadProjectLogo,
} from "@/lib/projectLogo";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp"] as const;
const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT_HINT = "Envie uma imagem PNG, JPG ou WEBP de até 2 MB.";

/**
 * Discrete logo manager for the active project.
 * - Reads logo_path from the active project; never persists signed URLs.
 * - Generates a 1h signed URL on demand (TanStack Query, staleTime 30min).
 * - All DB writes scope by user_id + project_id.
 * - Project switch mid-flight is detected and side-effects are ignored.
 */
export const ProjectLogoPicker = () => {
  const qc = useQueryClient();
  const { activeProject, refreshProjects } = useAppProjects();
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUserId(data.session?.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserId(s?.user?.id ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const projectId = activeProject?.id ?? null;
  const logoPath = activeProject?.logoPath ?? null;
  const logoVersion = activeProject?.logoUpdatedAt ?? "";

  const { data: signedUrl, isLoading: loadingUrl } = useQuery({
    queryKey: ["project-logo", projectId, logoPath, logoVersion],
    queryFn: () => (logoPath ? getProjectLogoSignedUrl(logoPath, 60 * 60) : null),
    enabled: !!logoPath && !!projectId,
    staleTime: 30 * 60 * 1000,
    gcTime: 45 * 60 * 1000,
  });

  if (!activeProject) return null;

  const writeLogoPath = async (
    nextPath: string | null,
    requestedProjectId: string,
    requestedUserId: string,
  ) => {
    // Guard: project switched during request
    if (activeProject?.id !== requestedProjectId) return false;
    const { error } = await supabase
      .from("user_app_projects")
      .update({
        logo_path: nextPath,
        logo_updated_at: nextPath ? new Date().toISOString() : null,
      })
      .eq("id", requestedProjectId)
      .eq("user_id", requestedUserId);
    return !error;
  };

  const handlePick = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!userId || !projectId) return;
    if (!ACCEPTED.includes(file.type as (typeof ACCEPTED)[number])) {
      toast.error(ACCEPT_HINT);
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(ACCEPT_HINT);
      return;
    }
    const startProject = projectId;
    const startUser = userId;
    const previousPath = logoPath;
    setBusy(true);
    try {
      const { path } = await uploadProjectLogo(startUser, startProject, file);
      const ok = await writeLogoPath(path, startProject, startUser);
      if (!ok) throw new Error("write failed");
      // Cleanup previous file if path actually changed (e.g. logo.png -> logo.webp).
      // Failure here must not break the new upload — log safely and continue.
      if (previousPath && previousPath !== path) {
        try {
          await removeProjectLogo(previousPath);
        } catch (cleanupErr) {
          console.warn("[ProjectLogoPicker] orphan cleanup failed", cleanupErr);
        }
      }
      await refreshProjects();
      void qc.invalidateQueries({ queryKey: ["project-logo", startProject] });
      toast.success("Logotipo atualizado com sucesso.");
    } catch {
      toast.error("Não foi possível atualizar o logotipo agora.");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!userId || !projectId || !logoPath) return;
    const startProject = projectId;
    const startUser = userId;
    const startPath = logoPath;
    setBusy(true);
    try {
      await removeProjectLogo(startPath);
      const ok = await writeLogoPath(null, startProject, startUser);
      if (!ok) throw new Error("write failed");
      await refreshProjects();
      void qc.invalidateQueries({ queryKey: ["project-logo", startProject] });
      toast.success("Logotipo removido.");
    } catch {
      toast.error("Não foi possível atualizar o logotipo agora.");
    } finally {
      setBusy(false);
    }
  };

  const hasLogo = !!logoPath;
  const showSpinner = busy || (hasLogo && loadingUrl);

  return (
    <div
      aria-label="Logotipo do projeto"
      className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5"
    >
      <div
        className={cn(
          "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center",
        )}
      >
        {showSpinner ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : hasLogo && signedUrl ? (
          <img
            src={signedUrl}
            alt={`Logotipo de ${activeProject.name}`}
            className="h-full w-full object-contain"
            onError={() => qc.invalidateQueries({ queryKey: ["project-logo", projectId] })}
          />
        ) : (
          <ImagePlus className="h-4 w-4 text-muted-foreground/70" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
          Logotipo do projeto
        </div>
        <div className="text-[11px] text-muted-foreground/70 truncate">
          {hasLogo ? "Visível apenas para você." : ACCEPT_HINT}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={handleFile}
      />

      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={handlePick}
          disabled={busy || !userId}
          className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-white/10 transition disabled:opacity-60"
        >
          {hasLogo ? <RefreshCw size={12} /> : <ImagePlus size={12} />}
          {hasLogo ? "Trocar" : "Enviar logotipo"}
        </button>
        {hasLogo && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={busy}
            aria-label="Remover logotipo"
            className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-muted-foreground hover:bg-white/10 hover:text-foreground transition disabled:opacity-60"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
};
