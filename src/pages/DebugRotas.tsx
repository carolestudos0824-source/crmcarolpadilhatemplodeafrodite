import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

const ROUTES = [
  "/",
  "/preco",
  "/login",
  "/entrega",
  "/admin/acessos",
  "/confianca",
  "/obrigado",
  "/suporte",
];

export default function DebugRotas() {
  const auth = useAuthState();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Hide in production
  if (import.meta.env.PROD) return <Navigate to="/" replace />;

  useEffect(() => {
    if (auth.status !== "authed") {
      setIsAdmin(false);
      return;
    }
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(!!data));
  }, [auth.status]);

  // Even in dev/preview, only admins can see this page.
  if (auth.status === "loading" || isAdmin === null) {
    return (
      <Section>
        <div className="max-w-2xl mx-auto text-center text-sm text-muted-foreground">
          Verificando permissões…
        </div>
      </Section>
    );
  }
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <Section>
      <div className="max-w-2xl mx-auto glass-strong p-8 space-y-4">
        <h1 className="text-2xl font-heading font-bold">Debug de Rotas</h1>
        <div className="text-sm space-y-1">
          <p>
            <b>Status:</b> {auth.status}
          </p>
          <p>
            <b>E-mail:</b>{" "}
            {auth.status === "authed" ? auth.email ?? "—" : "—"}
          </p>
          <p>
            <b>user_id:</b>{" "}
            {auth.status === "authed" ? auth.userId : "—"}
          </p>
          <p>
            <b>has_access:</b>{" "}
            {auth.status === "authed" ? String(auth.hasAccess) : "—"}
          </p>
          <p>
            <b>is_admin:</b> {isAdmin === null ? "…" : String(isAdmin)}
          </p>
        </div>
        <div>
          <h2 className="font-heading font-bold mt-6 mb-2">Rotas oficiais</h2>
          <ul className="space-y-1 text-sm">
            {ROUTES.map((r) => (
              <li key={r}>
                <Link to={r} className="text-accent hover:underline">
                  {r}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground pt-4 border-t border-white/10">
          Visível apenas em ambiente de preview/desenvolvimento.
        </p>
      </div>
    </Section>
  );
}
