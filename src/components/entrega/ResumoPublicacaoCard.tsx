import { useMemo } from "react";
import { Rocket, AlertTriangle, Globe } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useProjectContext, type ProjectContext } from "@/hooks/useProjectContext";

/**
 * Resumo de publicação baseado no Contexto do Projeto em foco. Orienta a
 * aluna a publicar o APP DELA com segurança: link público, domínio,
 * preview vs produção, favicon, imagem social e testes finais. Não
 * altera login, banco, área paga, admin ou a publicação real da
 * Fábrica de Apps.
 */

const norm = (s: string) => s.toLowerCase();

type Suggestion = {
  tipo: string;
  objetivo: string;
  paginasPublicas: string;
  paginasProtegidas: string;
  ctaPrincipal: string;
  dominioSugerido: string;
  tituloSugerido: string;
  descricaoSocial: string;
  imagemSocial: string;
  naoPublicarAinda: string[];
};

const GENERIC_BLOCKERS = [
  "app com checkout quebrado ou link de pagamento sem teste",
  "área paga, entrega ou painel admin expostos sem proteção",
  "termos de uso, privacidade ou suporte ausentes",
  "telas sem responsividade no celular",
  "promessa exagerada, garantia absoluta ou texto enganoso",
  "placeholders, textos de teste ou imagens quebradas visíveis",
];

function buildSuggestion(ctx: ProjectContext): Suggestion {
  const hay = norm(
    `${ctx.appName} ${ctx.appDoes} ${ctx.audience} ${ctx.problem} ${ctx.promise} ${ctx.productSold}`,
  );
  const has = (...w: string[]) => w.some((x) => hay.includes(x));
  const appName = ctx.appName?.trim() || "seu app";

  if (has("jogo do amor", "amor", "relacionament", "casal", "namor")) {
    return {
      tipo: ctx.appDoes?.trim() || "jogo/quiz interativo de relacionamento",
      objetivo: "disponibilizar o app em um link público testável antes da divulgação",
      paginasPublicas:
        "página inicial, início do jogo, prévia do resultado e página de venda/CTA",
      paginasProtegidas:
        "resultado completo, área paga, entrega e painel admin (se existirem)",
      ctaPrincipal: "Começar o jogo ou Desbloquear meu resultado completo",
      dominioSugerido:
        "use domínio próprio só quando estiver pronto para divulgar; no MVP valide primeiro com o link público",
      tituloSugerido: appName,
      descricaoSocial:
        "Descubra uma leitura simbólica e reflexiva sobre sua vida amorosa.",
      imagemSocial:
        "imagem clara, leve, com o nome do app e tema de relacionamento (sem clichês ou promessa garantida)",
      naoPublicarAinda: GENERIC_BLOCKERS,
    };
  }

  return {
    tipo: ctx.appDoes?.trim() || "(descreva o que seu app faz em Contexto do meu app)",
    objetivo: "disponibilizar o app em um link público testável antes da divulgação",
    paginasPublicas:
      "página inicial, página de venda/CTA, FAQ, contato e fluxo principal acessível sem login",
    paginasProtegidas:
      "área paga, entrega, painel do usuário e admin — devem exigir login",
    ctaPrincipal: ctx.mainAction?.trim() || "(defina a ação principal em Contexto do meu app)",
    dominioSugerido:
      "use domínio próprio só quando o app estiver pronto; no MVP valide primeiro com o link público da plataforma",
    tituloSugerido: appName,
    descricaoSocial:
      ctx.promise?.trim() ||
      "(escreva uma descrição curta e honesta — sem promessa exagerada)",
    imagemSocial:
      "imagem clara, legível, com nome do app e contexto do produto (evite imagem genérica ou quebrada)",
    naoPublicarAinda: GENERIC_BLOCKERS,
  };
}

export function ResumoPublicacaoCard() {
  const { context, isFilled, openEditor } = useProjectContext();
  const suggestion = useMemo(() => buildSuggestion(context), [context]);

  return (
    <GlassCard className="mb-6 p-5 md:p-6 border-accent/30 bg-gradient-to-br from-accent/10 via-white/[0.02] to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
          <Rocket size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
            Resumo de publicação{context.appName ? ` — ${context.appName}` : ""}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Use este resumo antes de pedir publicação, domínio, favicon e
            imagem social ao Lovable. Ele orienta o conteúdo a partir do
            seu contexto e ajuda a evitar publicar com algo quebrado.
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
          ["Objetivo da publicação", suggestion.objetivo],
          ["Páginas públicas para testar", suggestion.paginasPublicas],
          ["Páginas protegidas para testar", suggestion.paginasProtegidas],
          ["CTA principal", suggestion.ctaPrincipal],
          ["Domínio sugerido", suggestion.dominioSugerido],
          ["Título sugerido", suggestion.tituloSugerido],
          ["Descrição social sugerida", suggestion.descricaoSocial],
          ["Imagem social", suggestion.imagemSocial],
        ].map(([term, def]) => (
          <div key={term} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <dt className="text-[11px] uppercase tracking-wider text-accent/90 mb-1">{term}</dt>
            <dd className="text-foreground/90 leading-relaxed">{def}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3 text-[13px] text-sky-100 flex items-start gap-2">
        <Globe size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">Diferencie antes de publicar:</div>
          <ul className="list-disc list-inside space-y-0.5">
            <li><strong>Preview</strong>: ambiente de teste dentro do Lovable, só para você.</li>
            <li><strong>Produção</strong>: versão pública que pessoas reais acessam.</li>
            <li><strong>Domínio</strong>: endereço personalizado do app (ex.: seuapp.com.br).</li>
            <li><strong>Link público</strong>: URL que pode ser enviada para outras pessoas.</li>
          </ul>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-[13px] text-amber-100 flex items-start gap-2">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">O que NÃO publicar ainda:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {suggestion.naoPublicarAinda.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">
        <strong className="text-foreground/90">Regra de ouro:</strong> publique
        somente depois de testar o app <em>como visitante</em>, <em>como
        comprador</em> e <em>no celular</em>. Esta etapa não promete publicação
        perfeita nem segurança 100%; ela reduz risco antes da divulgação.
      </p>
    </GlassCard>
  );
}
