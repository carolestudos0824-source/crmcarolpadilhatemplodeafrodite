import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  ShieldCheck,
  KeyRound,
  ListChecks,
  MessageSquare,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

export type AdminSectionKey =
  | "overview"
  | "acessos"
  | "compradores"
  | "codigos"
  | "pendencias"
  | "mensagens"
  | "config";

export const ADMIN_SECTIONS: {
  key: AdminSectionKey;
  label: string;
  icon: typeof LayoutGrid;
  title: string;
  subtitle: string;
}[] = [
  { key: "overview", label: "Visão geral", icon: LayoutGrid, title: "Visão geral", subtitle: "Status operacional do painel admin." },
  { key: "acessos", label: "Acessos", icon: ShieldCheck, title: "Painel Admin de Acessos", subtitle: "Libere, consulte ou revogue o acesso de compradores." },
  { key: "compradores", label: "Compradores", icon: Users, title: "Compradores", subtitle: "Busca operacional por e-mail do comprador." },
  { key: "codigos", label: "Códigos premium", icon: KeyRound, title: "Códigos premium", subtitle: "Crie, consulte e acompanhe códigos de acesso." },
  { key: "pendencias", label: "Pendências", icon: ListChecks, title: "Pendências", subtitle: "Checklist antes da venda pública." },
  { key: "mensagens", label: "Mensagens rápidas", icon: MessageSquare, title: "Mensagens rápidas", subtitle: "Modelos copiáveis para suporte." },
  { key: "config", label: "Configurações admin", icon: Settings, title: "Configurações admin", subtitle: "Status de configuração do sistema." },
];

export function AdminShell({
  active,
  onChange,
  adminEmail,
  onLogout,
  children,
}: {
  active: AdminSectionKey;
  onChange: (k: AdminSectionKey) => void;
  adminEmail: string | null;
  onLogout: () => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = ADMIN_SECTIONS.find((s) => s.key === active) ?? ADMIN_SECTIONS[0];

  // Lock body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNav = (k: AdminSectionKey) => {
    onChange(k);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-foreground flex overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/10 bg-[#0B1020] flex-col sticky top-0 h-screen">
        <SidebarInner active={active} onNav={handleNav} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#0B1020] border-r border-white/10 lg:hidden flex flex-col">
            <SidebarInner active={active} onNav={handleNav} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#05070D]/90 backdrop-blur border-b border-white/10">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8 h-14">
            <button
              type="button"
              className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-white/5 active:bg-white/10"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu admin"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none hidden sm:block">
                Painel Admin
              </div>
              <div className="text-sm font-heading font-semibold truncate">{current.label}</div>
              <div className="text-[10px] text-muted-foreground truncate sm:hidden">{adminEmail ?? "—"}</div>
            </div>
            <div className="hidden sm:flex flex-col items-end leading-tight min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Logado</span>
              <span className="text-xs text-foreground/85 truncate max-w-[180px]">{adminEmail ?? "—"}</span>
            </div>
            <Link
              to="/entrega"
              className="hidden md:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5"
            >
              <ExternalLink size={12} /> Minha área
            </Link>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Sair"
              className="inline-flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg border border-red-500/30 text-red-200 hover:bg-red-500/10"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-5">
              <h1 className="text-xl md:text-2xl font-heading font-bold mb-1">{current.title}</h1>
              <p className="text-sm text-muted-foreground">{current.subtitle}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarInner({
  active,
  onNav,
  onClose,
}: {
  active: AdminSectionKey;
  onNav: (k: AdminSectionKey) => void;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="px-5 py-5 border-b border-white/10 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={16} className="text-accent" />
            <span className="text-base font-heading font-bold tracking-tight">Admin</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">Fábrica de Apps com IA</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5"
            aria-label="Fechar menu admin"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {ADMIN_SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => onNav(s.key)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "text-foreground/80 hover:bg-white/5 border border-transparent"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={15} className={isActive ? "text-accent" : "text-muted-foreground"} />
                  <span>{s.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-5 py-3 border-t border-white/10 text-[10px] text-muted-foreground">
        v1 · Admin interno
      </div>
    </>
  );
}
