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
  ShoppingCart,
  Activity,
} from "lucide-react";

export type AdminSectionKey =
  | "overview"
  | "vendas"
  | "acessos"
  | "compradores"
  | "codigos"
  | "metricas"
  | "pendencias"
  | "mensagens"
  | "inbox"
  | "config";

export const ADMIN_SECTIONS: {
  key: AdminSectionKey;
  label: string;
  icon: typeof LayoutGrid;
  title: string;
  subtitle: string;
}[] = [
  { key: "overview", label: "Visão geral", icon: LayoutGrid, title: "Visão geral", subtitle: "Painel operacional com dados das vendas manuais e acessos." },
  { key: "vendas", label: "Vendas", icon: ShoppingCart, title: "Vendas manuais", subtitle: "Registre vendas confirmadas e libere acesso enquanto o checkout automático não está conectado." },
  { key: "compradores", label: "Compradores", icon: Users, title: "Compradores", subtitle: "Consolidação de compradores, vendas, acessos e códigos premium." },
  { key: "acessos", label: "Acessos", icon: ShieldCheck, title: "Gerenciar acesso", subtitle: "Libere ou revogue acesso depois de confirmar pagamento, teste, cortesia ou código." },
  { key: "codigos", label: "Códigos premium", icon: KeyRound, title: "Códigos premium", subtitle: "Crie, consulte e acompanhe códigos de acesso." },
  { key: "metricas", label: "Métricas", icon: Activity, title: "Métricas do programa", subtitle: "Acessos, usuários online, atividade recente e módulos mais usados. Estimativas operacionais, não tempo real." },
  { key: "inbox", label: "Suporte por e-mail", icon: Inbox, title: "Suporte por e-mail", subtitle: "Canal oficial de suporte do programa Fábrica de Apps com IA." },
  { key: "mensagens", label: "Respostas rápidas", icon: MessageSquare, title: "Respostas rápidas", subtitle: "Modelos de resposta para copiar e usar manualmente no e-mail oficial de suporte." },
  { key: "pendencias", label: "Pendências", icon: ListChecks, title: "Prontidão para venda pública", subtitle: "Conferência final antes de divulgar e vender o programa." },
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
    <div className="min-h-screen bg-[hsl(var(--admin-surface-1))] text-foreground flex overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-[hsl(var(--admin-border-subtle))] bg-[hsl(var(--admin-surface-2))] flex-col sticky top-0 h-screen">
        <SidebarInner active={active} onNav={handleNav} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[hsl(var(--admin-surface-2))] border-r border-[hsl(var(--admin-border-subtle))] lg:hidden flex flex-col">
            <SidebarInner active={active} onNav={handleNav} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[hsl(var(--admin-surface-1))]/85 backdrop-blur-md border-b border-[hsl(var(--admin-border-subtle))]">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8 h-14">
            <button
              type="button"
              className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-white/5 active:bg-white/10 transition"
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--admin-surface-2))] border border-[hsl(var(--admin-border-subtle))] min-w-0">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_hsl(152_64%_48%_/_0.7)]" aria-hidden />
              <span className="text-xs text-foreground/85 truncate max-w-[200px]">{adminEmail ?? "—"}</span>
            </div>
            <Link
              to="/entrega"
              className="hidden md:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[hsl(var(--admin-border-strong))] bg-[hsl(var(--admin-surface-2))] hover:bg-[hsl(var(--admin-surface-3))] hover:border-accent/40 transition"
            >
              <ExternalLink size={12} /> Minha área
            </Link>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Sair"
              className="inline-flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg border border-red-500/30 text-red-200 hover:bg-red-500/10 hover:border-red-500/50 transition"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 pb-4 border-b border-[hsl(var(--admin-border-subtle))]">
              <div className="text-[10px] uppercase tracking-[0.18em] text-accent/80 font-semibold mb-1.5">
                Painel Admin
              </div>
              <h1 className="text-xl md:text-2xl font-heading font-bold mb-1">{current.title}</h1>
              <p className="text-sm text-muted-foreground max-w-2xl">{current.subtitle}</p>
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
      <div className="px-5 py-5 border-b border-[hsl(var(--admin-border-subtle))] flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center size-7 rounded-lg bg-accent/15 border border-accent/30 text-accent">
              <ShieldAlert size={14} />
            </span>
            <span className="text-base font-heading font-bold tracking-tight">Admin</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">Fábrica de Apps com IA</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 transition"
            aria-label="Fechar menu admin"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-1 px-3">
          {ADMIN_SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => onNav(s.key)}
                  className={`group relative w-full text-left flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-accent/10 text-accent font-medium shadow-[inset_2px_0_0_hsl(var(--admin-accent))]"
                      : "text-foreground/75 hover:bg-white/[0.04] hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground/80 transition"}
                  />
                  <span className="truncate">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-5 py-3 border-t border-[hsl(var(--admin-border-subtle))] text-[10px] text-muted-foreground flex items-center justify-between">
        <span>v1 · Admin interno</span>
        <span className="size-1.5 rounded-full bg-emerald-400/80" aria-hidden />
      </div>
    </>
  );
}
