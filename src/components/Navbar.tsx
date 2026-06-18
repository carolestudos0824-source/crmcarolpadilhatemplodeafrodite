import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Início" },
  { to: "/precos", label: "Preços" },
  { to: "/entrega", label: "Entrega" },
];

export const Navbar = ({ offsetTop = false }: { offsetTop?: boolean }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onCheckout = pathname.startsWith("/checkout");
  const onEntrega = pathname.startsWith("/entrega");
  const ctaLabel = onEntrega ? "Minha área" : "Acessar por R$47";
  const ctaTarget = onEntrega ? "/entrega" : "/checkout?plano=fabrica";

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

  return (
    <header
      className="fixed inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-white/5"
      style={{ top: offsetTop ? 40 : 0 }}
    >
      <div className="container flex items-center justify-between h-16">
        <Logo size="md" showText />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <button className="btn-primary text-sm" onClick={() => navigate(ctaTarget)}>
            {ctaLabel}
          </button>
        </div>
        <button className="md:hidden text-foreground p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm py-2 text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
            <button className="btn-primary text-sm mt-2" onClick={() => { setOpen(false); navigate(ctaTarget); }}>
              {ctaLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

