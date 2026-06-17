import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Início" },
  { to: "/precos", label: "Preços" },
  { to: "/entrega", label: "Entrega" },
  { to: "/suporte", label: "Suporte" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-white/5">
      <div className="container flex items-center justify-between h-16">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <button className="btn-primary text-sm" onClick={() => navigate("/checkout?plano=fabrica")}>
            Comprar agora
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
            <button className="btn-primary text-sm mt-2" onClick={() => { setOpen(false); navigate("/checkout?plano=fabrica"); }}>
              Comprar agora
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
