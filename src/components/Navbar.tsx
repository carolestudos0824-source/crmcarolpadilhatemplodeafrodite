import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Lock } from "lucide-react";
import { Logo } from "./Logo";
import { useAuthState } from "@/hooks/useAuthState";
import { clearSession } from "@/lib/auth";

const links = [
  { to: "/", label: "Início" },
  { to: "/precos", label: "Preço único" },
];

export const Navbar = ({ offsetTop: _offsetTop = false }: { offsetTop?: boolean } = {}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onCheckout = pathname.startsWith("/checkout");
  const auth = useAuthState();

  // Determine CTA based on auth state
  let ctaLabel = "Acesso restrito";
  let ctaTarget = "/login";
  let ctaIcon = <Lock size={14} />;

  if (auth.status === "authed") {
    if (auth.hasAccess || auth.isAdmin) {
      ctaLabel = "Minha área";
      ctaTarget = "/entrega";
      ctaIcon = null as any;
    } else {
      ctaLabel = "Regularizar acesso";
      ctaTarget = "/precos";
      ctaIcon = null as any;
    }
  }

  const doLogout = async () => {
    await clearSession();
    navigate("/");
  };

  if (onCheckout) {
    return (
      <header
        className="fixed inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-white/5"
        style={{ top: offsetTop ? 40 : 0 }}
      >
        <div className="container flex items-center justify-between h-16">
          <Logo size="md" showText />
          <span className="text-xs text-muted-foreground/80 tracking-wide">Ambiente seguro</span>
        </div>
      </header>
    );
  }

  const navLinks = [
    ...links,
    auth.status === "authed" && (auth.hasAccess || auth.isAdmin)
      ? { to: "/entrega", label: "Minha área" }
      : { to: "/login", label: "Acesso restrito" },
    ...(auth.status === "authed" && auth.isAdmin
      ? [{ to: "/admin/acessos", label: "Admin" }]
      : []),
  ];

  return (
    <header
      className="fixed inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-white/5"
      style={{ top: offsetTop ? 40 : 0 }}
    >
      <div className="container flex items-center justify-between h-16">
        <Logo size="md" showText />
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {auth.status === "authed" && auth.email && (
            <span className="text-[11px] text-muted-foreground/80 hidden lg:inline" title={`Logado como: ${auth.email}`}>
              Logado como: <span className="text-foreground/80">{auth.email}</span>
            </span>
          )}
          <button className="btn-primary text-sm inline-flex items-center gap-2" onClick={() => navigate(ctaTarget)}>
            {ctaIcon}
            {ctaLabel}
          </button>
          {auth.status === "authed" && (
            <button
              onClick={doLogout}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition"
              aria-label="Sair"
            >
              <LogOut size={14} /> Sair
            </button>
          )}
        </div>
        <button className="md:hidden text-foreground p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm py-2 text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
            <button className="btn-primary text-sm mt-2 inline-flex items-center justify-center gap-2" onClick={() => { setOpen(false); navigate(ctaTarget); }}>
              {ctaIcon}
              {ctaLabel}
            </button>
            {auth.status === "authed" && (
              <button
                onClick={() => { setOpen(false); doLogout(); }}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1 py-2"
              >
                <LogOut size={14} /> Sair
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
