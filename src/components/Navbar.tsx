import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { useAuthState } from "@/hooks/useAuthState";
import { clearSession } from "@/lib/auth";

type NavLink = { to: string; label: string };

const BASE_PUBLIC_LINKS: NavLink[] = [
  { to: "/", label: "Início" },
  { to: "/precos", label: "Preço único" },
  { to: "/#incluso", label: "O que está incluso" },
];

export const Navbar = ({ offsetTop: _offsetTop = false }: { offsetTop?: boolean } = {}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onCheckout = pathname.startsWith("/checkout");
  const onLogin = pathname === "/login";
  const auth = useAuthState();

  const doLogout = async () => {
    await clearSession();
    navigate("/");
  };

  if (onCheckout) {
    return (
      <div className="w-full backdrop-blur-xl bg-background/60 border-b border-white/5">
        <div className="container flex items-center justify-between h-16">
          <Logo size="md" showText />
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground/80 tracking-wide hidden sm:inline">Ambiente seguro</span>
            <button
              className="btn-primary text-xs sm:text-sm"
              onClick={() => navigate("/login?tab=signup")}
            >
              Criar conta / Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine nav links + primary CTA per auth state + route
  let navLinks: NavLink[] = [];
  let ctaLabel = "Já sou aluno";
  let ctaTarget = "/login";

  if (auth.status === "authed") {
    const authed: NavLink[] = [
      { to: "/", label: "Início" },
      { to: "/entrega?modulo=comece-aqui", label: "Minha área" },
    ];
    if (auth.isAdmin) authed.push({ to: "/admin/acessos", label: "Admin" });
    navLinks = authed;

    if (auth.hasAccess || auth.isAdmin) {
      ctaLabel = "Minha área";
      ctaTarget = "/entrega?modulo=comece-aqui";
    } else {
      ctaLabel = "Ver status do acesso";
      ctaTarget = "/entrega";
    }
  } else {
    // anonymous (also covers loading; harmless defaults)
    if (onLogin) {
      navLinks = [
        { to: "/", label: "Início" },
        { to: "/precos", label: "Preço único" },
        { to: "/#incluso", label: "O que está incluso" },
      ];
      ctaLabel = "Garantir acesso";
      ctaTarget = "/checkout?plano=fabrica";
    } else {
      navLinks = [
        ...BASE_PUBLIC_LINKS,
        { to: "/login?tab=login", label: "Já sou aluno" },
      ];
      ctaLabel = "Criar conta / Entrar";
      ctaTarget = "/login?tab=signup";
    }
  }

  return (
    <div className="w-full backdrop-blur-xl bg-background/60 border-b border-white/5">
      <div className="container flex items-center justify-between h-16">
        <Logo size="md" showText />
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {auth.status === "authed" && auth.email && (
            <span
              className="text-[11px] text-muted-foreground/80 hidden lg:inline"
              title={`Logado como: ${auth.email}`}
            >
              Logado como: <span className="text-foreground/80">{auth.email}</span>
            </span>
          )}
          <button className="btn-primary text-sm inline-flex items-center gap-2" onClick={() => navigate(ctaTarget)}>
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
              <Link
                key={l.to + l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm py-2 text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {auth.status === "authed" && auth.email && (
              <span className="text-[11px] text-muted-foreground/80 pt-1">
                Logado como: <span className="text-foreground/80">{auth.email}</span>
              </span>
            )}
            <button
              className="btn-primary text-sm mt-2 inline-flex items-center justify-center gap-2"
              onClick={() => {
                setOpen(false);
                navigate(ctaTarget);
              }}
            >
              {ctaLabel}
            </button>
            {auth.status === "authed" && (
              <button
                onClick={() => {
                  setOpen(false);
                  doLogout();
                }}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1 py-2"
              >
                <LogOut size={14} /> Sair
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
