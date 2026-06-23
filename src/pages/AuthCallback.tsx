import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { checkProgramAccess } from "@/lib/auth";

const hasAuthError = () => {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return (
    search.has("error") ||
    search.has("error_description") ||
    hash.has("error") ||
    hash.has("error_description")
  );
};

const safeNextPath = (next: string | null) => {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/entrega";
  return next;
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const [message, setMessage] = useState("Validando seu acesso…");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let cancelled = false;
    console.info({ auth_flow: "auth_callback_loaded" });

    const finishLogin = async () => {
      if (hasAuthError()) {
        setExpired(true);
        return;
      }

      try {
        await supabase.auth.getSession();
        const { data, error } = await supabase.auth.getUser();
        const user = data.user;

        if (error || !user) {
          setExpired(true);
          return;
        }

        setMessage("Conferindo sua liberação…");
        const access = await checkProgramAccess(user.id);
        if (cancelled) return;

        if (access.canEnter) {
          navigate(nextPath, { replace: true });
          return;
        }

        navigate("/login?sem_acesso=1", { replace: true });
      } catch {
        if (!cancelled) setExpired(true);
      }
    };

    void finishLogin();

    return () => {
      cancelled = true;
    };
  }, [navigate, nextPath]);

  if (expired) {
    return (
      <Section>
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="lg" asLink={false} />
          </div>
          <div className="glass-strong p-8 text-center">
            <Mail className="mx-auto mb-4 text-accent" size={32} />
            <h1 className="text-2xl font-heading font-bold mb-2">Link seguro expirado</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Este link expirou ou já foi usado. Peça um novo link seguro para acessar.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login", { replace: true })}
              className="btn-primary w-full justify-center"
            >
              Enviar novo link
            </button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" asLink={false} />
        </div>
        <div className="glass-strong p-8 text-center">
          <Loader2 className="mx-auto mb-4 text-accent animate-spin" size={32} />
          <h1 className="text-2xl font-heading font-bold mb-2">{message}</h1>
          <p className="text-sm text-muted-foreground">
            Estamos confirmando seu login e liberando sua área do programa.
          </p>
        </div>
      </div>
    </Section>
  );
}