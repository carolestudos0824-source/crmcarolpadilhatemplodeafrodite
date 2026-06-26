import { useMemo } from "react";
import { ClipboardCheck, AlertTriangle, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo de teste final baseado no Contexto do Projeto em foco. Orienta
 * a aluna a testar o APP DELA antes da divulgação: fluxo principal,
 * perfis (visitante, logado, comprador, admin), rotas públicas e
 * protegidas, pontos críticos e bloqueadores. Não altera login, banco,
 * checkout, entrega real, área paga ou admin.
 */

const norm = (s: string) => s.toLowerCase();

type Suggestion = {
  tipo: string;
  fluxoPrincipal: string;
  perfis: string;
  rotasPublicas: string;
  rotasProtegidas: string;
  pontosCriticos: string;
  bloqueadores: string[];
  proximoPasso: string;
};

const GENERIC_BLOCKERS = [
  "login quebrado ou usuário sem acesso conseguindo entrar",
  "checkout/link de pagamento errado ou sem teste",
  "entrega ou área paga acessível sem login",
  "botão principal/CTA quebrado",
  "mobile ruim (textos cortados, botões pequenos, scroll horizontal)",
  "dados de teste, e-mails fictícios ou placeholders visíveis",
  "promessa exagerada ou resultado garantido em texto público",
];

function buildSuggestion(ctx: ProjectContext): Suggestion {
  const hay = norm(
    `${ctx.appName} ${ctx.appDoes} ${ctx.audience} ${ctx.problem} ${ctx.promise} ${ctx.productSold}`,
  );
  const has = (...w: string[]) => w.some((x) => hay.includes(x));

  if (has("jogo do amor", "amor", "relacionament", "casal", "namor")) {
    return {
      tipo: ctx.appDoes?.trim() || "jogo/quiz interativo de relacionamento",
      fluxoPrincipal:
        "abrir o app → começar o jogo → responder as perguntas → ver a prévia → clicar no CTA → desbloquear o resultado completo",
      perfis: "visitante, usuário logado, comprador/autorizado e admin (se existir)",
      rotasPublicas: "página inicial, início do jogo, prévia do resultado e página de venda/CTA",
      rotasProtegidas:
        "resultado completo, área paga, entrega e painel admin (se existirem)",
      pontosCriticos:
        "botão principal, formulário do quiz, geração do resultado, checkout, página de obrigado, entrega protegida, recuperação de acesso e experiência no celular",
      bloqueadores: GENERIC_BLOCKERS,
      proximoPasso:
        "só avance para SEO e GEO depois que os testes críticos passarem (login, checkout, entrega, CTA principal, mobile).",
    };
  }

  return {
    tipo: ctx.appDoes?.trim() || "(descreva o que seu app faz em Contexto do meu app)",
    fluxoPrincipal:
      ctx.mainAction?.trim()
        ? `abrir o app → ${ctx.mainAction.trim()} → concluir o fluxo principal`
        : "abrir o app → executar a ação principal → concluir o fluxo principal",
    perfis: "visitante, usuário logado, comprador/autorizado e admin (se existir)",
    rotasPublicas:
      "página inicial, página de venda/CTA, FAQ, contato e fluxo principal acessível sem login",
    rotasProtegidas:
      "área paga, entrega, painel do usuário e admin — devem exigir login",
    pontosCriticos:
      "botão principal, formulários, fluxo de compra, página de obrigado, entrega protegida, recuperação de acesso e experiência no celular",
    bloqueadores: GENERIC_BLOCKERS,
    proximoPasso:
      "só avance para SEO e GEO depois que os testes críticos passarem (login, checkout, entrega, CTA principal, mobile).",
  };
}

export function ResumoTesteFinalCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const suggestion = useMemo(() => buildSuggestion(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <ClipboardCheck size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo de teste final{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Use este resumo como controle antes de divulgar. Ele orienta o
            que testar a partir do seu contexto e evita publicar com algo
            quebrado.
          </p>
        </div>
        {!isFilled && (
          <button
            type="button"
            onClick={openEditor}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/15"
          >
            Preencher contexto
          </button>
        )}
      </div>

      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        {[
          ["Tipo de app", suggestion.tipo],
          ["Fluxo principal a testar", suggestion.fluxoPrincipal],
          ["Perfis de teste", suggestion.perfis],
          ["Rotas públicas", suggestion.rotasPublicas],
          ["Rotas protegidas", suggestion.rotasProtegidas],
          ["Pontos críticos", suggestion.pontosCriticos],
        ].map(([term, def]) => (
          <div key={term} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">{term}</dt>
            <dd className="text-foreground/90 leading-relaxed">{def}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-[13px] text-rose-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Bloqueadores de divulgação:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {suggestion.bloqueadores.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-[13px] text-emerald-100 flex items-start gap-2">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Próximo passo seguro:</div>
          {suggestion.proximoPasso}
        </div>
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        Esta etapa não promete app perfeito nem segurança 100%. Ela reduz
        risco antes da divulgação. Faça os testes como visitante, como
        comprador e no celular antes de mandar o link para alguém.
      </p>
    </GlassCard>
  );
}
