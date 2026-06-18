import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuthState } from "@/hooks/useAuthState";

export const Footer = () => {
  const auth = useAuthState();
  const restrictedLink =
    auth.status === "authed" && auth.hasAccess
      ? { to: "/entrega", label: "Minha área" }
      : { to: "/login", label: "Acesso restrito" };

  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="container py-12 grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <Logo size="sm" showText />
          <p className="text-sm text-muted-foreground max-w-md">
            Fábrica de Apps com IA — Clareza, estrutura e velocidade para criar aplicativos com inteligência artificial.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 md:justify-end items-start text-sm">
          <Link to="/precos" className="text-muted-foreground hover:text-foreground">Preço único</Link>
          <Link to={restrictedLink.to} className="text-muted-foreground hover:text-foreground">{restrictedLink.label}</Link>
          <Link to="/suporte" className="text-muted-foreground hover:text-foreground">Suporte</Link>
          <Link to="/termos" className="text-muted-foreground hover:text-foreground">Termos</Link>
          <Link to="/privacidade" className="text-muted-foreground hover:text-foreground">Privacidade</Link>
        </div>
      </div>
      <div className="container py-4 text-xs text-muted-foreground/60 border-t border-white/5">
        © {new Date().getFullYear()} Fábrica de Apps com IA. Todos os direitos reservados.
      </div>
    </footer>
  );
};
