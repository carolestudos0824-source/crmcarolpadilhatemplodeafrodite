import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, Search, X, ExternalLink, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";
import {
  MODULES,
  COMMANDS_CONSTRUIR,
  COMMANDS_LOGIN,
  COMMANDS_VENDA,
  COMMANDS_CHECKOUT,
  COMMANDS_SEO,
  COMMANDS_CAMPANHAS,
  COMMANDS_CRIATIVOS,
  COMMANDS_VALIDACAO,
  COMMANDS_MONETIZACAO,
  type Command,
  type ModuleId,
} from "@/data/entregaModules";
import { TECHNICAL_GLOSSARY } from "@/data/technicalGlossary";
import { AGENTE_ARQUITETO_URL } from "@/lib/agenteArquiteto";

type Scope = "public" | "no-access" | "buyer" | "admin";

type Result = {
  id: string;
  kind: "modulo" | "comando" | "glossario" | "ajuda" | "pagina";
  title: string;
  excerpt: string;
  moduleLabel?: string;
  action: () => void;
  copyContent?: string;
};

type PublicTopic = {
  id: string;
  title: string;
  excerpt: string;
  keywords: string[];
  to: string;
};

const PUBLIC_TOPICS: PublicTopic[] = [
  { id: "preco", title: "Preço e oferta", excerpt: "R$197 à vista ou 12x de R$19,70. Liberação após confirmação do pagamento.", keywords: ["preco", "preço", "valor", "quanto custa", "oferta", "promoção", "parcelar"], to: "/precos" },
  { id: "garantia", title: "Garantia", excerpt: "Veja a política de garantia e devolução na página de confiança.", keywords: ["garantia", "devolução", "reembolso", "arrependimento", "7 dias"], to: "/confianca" },
  { id: "suporte", title: "Suporte", excerpt: "Fale com a equipe pelo canal de suporte oficial.", keywords: ["suporte", "ajuda", "contato", "email", "fala"], to: "/suporte" },
  { id: "login", title: "Entrar / criar conta", excerpt: "Acesse sua área de aluna ou crie uma conta.", keywords: ["login", "entrar", "conta", "cadastro", "criar conta", "senha", "esqueci"], to: "/login" },
  { id: "comprar", title: "Como comprar", excerpt: "Garanta acesso pela página de checkout.", keywords: ["comprar", "checkout", "pagar", "pagamento", "acesso", "liberação"], to: "/checkout?plano=fabrica" },
  { id: "termos", title: "Termos de uso", excerpt: "Regras do programa.", keywords: ["termos", "uso", "regra", "contrato"], to: "/termos" },
  { id: "privacidade", title: "Privacidade", excerpt: "Como tratamos dados pessoais.", keywords: ["privacidade", "lgpd", "dados", "cookies"], to: "/privacidade" },
  { id: "seguranca", title: "Segurança", excerpt: "Como protegemos o programa e seus dados.", keywords: ["segurança", "seguro", "hack", "vazamento"], to: "/seguranca" },
  { id: "proposta", title: "O que é o programa", excerpt: "Fábrica de Apps com IA — programa-guia para criar apps no Lovable.", keywords: ["o que é", "programa", "fabrica", "fábrica", "como funciona", "apps", "ia"], to: "/" },
];

const ALL_COMMANDS: { mod: ModuleId; list: Command[] }[] = [
  { mod: "construir", list: COMMANDS_CONSTRUIR },
  { mod: "login", list: COMMANDS_LOGIN },
  { mod: "venda", list: COMMANDS_VENDA },
  { mod: "checkout", list: COMMANDS_CHECKOUT },
  { mod: "seo", list: COMMANDS_SEO },
  { mod: "campanhas", list: COMMANDS_CAMPANHAS },
  { mod: "criativos", list: COMMANDS_CRIATIVOS },
  { mod: "validacao", list: COMMANDS_VALIDACAO },
  { mod: "monetizacao", list: COMMANDS_MONETIZACAO },
];

function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function determineScope(auth: ReturnType<typeof useAuthState>): Scope {
  if (auth.status === "authed") {
    if (auth.isAdmin) return "admin";
    if (auth.hasAccess) return "buyer";
    return "no-access";
  }
  return "public";
}

// Routes/paths where we hide the FAB to avoid clutter (none right now;
// chromeless area /entrega already has its own internal helpers, but we
// still want the global help accessible there too).
const HIDDEN_ON: string[] = [];

export const FabricaQuickHelp = () => {
  const auth = useAuthState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const scope = determineScope(auth);

  // Keyboard shortcut: "?" opens the dialog (when not typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (!inEditable && e.key === "?") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  const moduleLabelById = useMemo(() => {
    const map = new Map<string, string>();
    MODULES.forEach((m) => map.set(m.id, m.label));
    return map;
  }, []);

  const results = useMemo<Result[]>(() => {
    const term = norm(q.trim());
    if (!term) return [];
    const out: Result[] = [];

    // 1) Public topics — always available
    for (const t of PUBLIC_TOPICS) {
      const hay = norm([t.title, t.excerpt, t.keywords.join(" ")].join(" "));
      if (hay.includes(term)) {
        out.push({
          id: `pub-${t.id}`,
          kind: "pagina",
          title: t.title,
          excerpt: t.excerpt,
          action: () => {
            navigate(t.to);
            setOpen(false);
          },
        });
      }
    }

    // 2) Buyer/admin scope — modules, commands, glossary
    if (scope === "buyer" || scope === "admin") {
      for (const m of MODULES) {
        if (norm(m.label).includes(term)) {
          out.push({
            id: `mod-${m.id}`,
            kind: "modulo",
            title: m.label,
            excerpt: "Abrir este módulo na sua área.",
            action: () => {
              navigate(`/entrega?modulo=${encodeURIComponent(m.id)}`);
              setOpen(false);
            },
          });
        }
      }
      for (const group of ALL_COMMANDS) {
        for (const c of group.list) {
          const hay = norm(
            [c.title, c.purpose, c.when, c.where, c.result, c.objective ?? ""].join(" "),
          );
          if (hay.includes(term)) {
            out.push({
              id: `cmd-${group.mod}-${c.n}`,
              kind: "comando",
              title: c.title,
              excerpt: c.purpose || c.result || "",
              moduleLabel: moduleLabelById.get(group.mod),
              copyContent: c.content,
              action: () => {
                const targetHash = `cmd-${group.mod}-${c.n}`;
                navigate(`/entrega?modulo=${encodeURIComponent(group.mod)}#${targetHash}`);
                setOpen(false);
                // Garante o foco/abertura mesmo quando já estamos no módulo
                // (mesmo hash não dispara hashchange por si só).
                setTimeout(() => {
                  if (typeof window === "undefined") return;
                  if (window.location.hash.replace(/^#/, "") === targetHash) {
                    window.dispatchEvent(new HashChangeEvent("hashchange"));
                  }
                }, 80);
              },
            });
          }
        }
      }
      for (const g of TECHNICAL_GLOSSARY) {
        const hay = norm([g.name, g.simple, g.whyItMatters].join(" "));
        if (hay.includes(term)) {
          const fullExcerpt = g.whyItMatters
            ? `${g.simple} — ${g.whyItMatters}`
            : g.simple;
          out.push({
            id: `glos-${g.slug}`,
            kind: "glossario",
            title: g.name,
            excerpt: fullExcerpt,
            moduleLabel: g.relatedModuleId ? moduleLabelById.get(g.relatedModuleId) : undefined,
            action: () => {
              navigate(`/entrega?modulo=${encodeURIComponent(g.relatedModuleId ?? "fundamentos")}`);
              setOpen(false);
            },
          });
        }
      }
    }


    // 3) No-access — restrict to purchase/access/support topics
    if (scope === "no-access") {
      return out.filter((r) =>
        ["pub-comprar", "pub-login", "pub-suporte", "pub-preco", "pub-garantia", "pub-proposta"].includes(r.id),
      );
    }

    return out.slice(0, 30);
  }, [q, scope, navigate, moduleLabelById]);

  // Mostrar apenas dentro da área logada de entrega (ferramenta interna).
  if (!pathname.startsWith("/entrega")) return null;
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ajuda do Programa"
        title="Ajuda do Programa — dúvidas frequentes (atalho: ?)"
        className="fixed z-[70] bottom-4 right-4 md:bottom-6 md:right-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-background/90 backdrop-blur-md px-4 py-3 min-h-[48px] text-sm font-medium text-foreground shadow-lg hover:bg-white/5 transition"
      >
        <HelpCircle size={18} />
        <span className="hidden sm:inline">Ajuda do Programa</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Entenda o programa"
            className="w-full sm:max-w-2xl bg-background border border-white/10 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 p-4 border-b border-white/10">
              <div className="min-w-0">
                <h2 className="font-heading font-bold text-base sm:text-lg">Entenda o programa</h2>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-snug">
                  Use primeiro para encontrar respostas dentro do programa. Para revisar estratégia, prompts, erros ou decisões do app, abra o Agente Arquiteto.
                  <br />
                  <span className="text-muted-foreground/70">Não substitui o Agente Arquiteto oficial.</span>
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={
                    scope === "public"
                      ? "Buscar: preço, garantia, login, suporte…"
                      : scope === "no-access"
                      ? "Buscar: comprar, acesso, checkout, login…"
                      : "Buscar: módulo, comando, glossário, prompt…"
                  }
                  className="w-full h-12 rounded-lg border border-white/15 bg-black/40 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {!q.trim() ? (
                <p className="text-xs text-muted-foreground p-3">
                  Digite o que você quer encontrar dentro do programa.
                </p>
              ) : results.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground space-y-2">
                  <p>Nenhum resultado encontrado.</p>
                  <p className="text-xs">
                    Tente buscar por{" "}
                    <span className="text-foreground/80">
                      {scope === "public"
                        ? "preço, garantia, login ou suporte"
                        : scope === "no-access"
                        ? "comprar, acesso, garantia ou suporte"
                        : scope === "admin"
                        ? "login, checkout, domínio, RLS, prompt, publicar, segurança ou acesso"
                        : "login, checkout, domínio, RLS, prompt, publicar ou segurança"}
                    </span>
                    .
                  </p>
                </div>
              ) : (
                results.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">
                            {r.kind}
                          </span>
                          {r.moduleLabel && (
                            <span className="text-[10px] text-muted-foreground">{r.moduleLabel}</span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground truncate">{r.title}</h3>
                        <p className={`text-xs text-muted-foreground mt-1 ${r.kind === "glossario" ? "" : "line-clamp-2"}`}>{r.excerpt}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        onClick={r.action}
                        className="inline-flex items-center gap-1 text-xs px-3 py-1.5 min-h-[36px] rounded-md border border-white/15 hover:bg-white/5"
                      >
                        Abrir este conteúdo <ArrowRight size={12} />
                      </button>
                      {r.copyContent && (
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(r.copyContent!);
                              toast.success("Prompt copiado.");
                            } catch {
                              toast.error("Não foi possível copiar.");
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 min-h-[36px] rounded-md border border-white/15 hover:bg-white/5"
                        >
                          <Copy size={12} /> Copiar prompt
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-white/10 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <p className="text-[11px] text-muted-foreground">
                Não resolveu? Abra o Agente Arquiteto para revisar estratégia, prompts ou erros.
              </p>
              <a
                href={AGENTE_ARQUITETO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 min-h-[40px] rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
              >
                Não resolveu? Abrir Agente Arquiteto <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
