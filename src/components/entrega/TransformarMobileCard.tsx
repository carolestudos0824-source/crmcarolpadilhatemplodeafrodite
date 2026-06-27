import { useState } from "react";
import {
  Smartphone,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Check,
  Copy,
  Globe,
  Download,
  Package,
  Apple,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { toast } from "@/hooks/use-toast";

/**
 * Card educativo OPCIONAL — "Transformar em App Mobile".
 *
 * Importante:
 * - NÃO é um módulo da jornada.
 * - NÃO conta no TOTAL_COMMANDS (54).
 * - NÃO altera progresso, IDs, MODULES, MODULE_ORDER.
 * - Checklist é apenas visual (useState local, não persistido).
 */

const CHECKLIST_ITEMS = [
  "Responsividade mobile testada",
  "Login funcionando no celular",
  "Performance aceitável em 4G",
  "Manifest/PWA configurado (se aplicável)",
  "Ícones do app prontos",
  "Política de privacidade publicada",
  "Termos de uso publicados",
  "Screenshots prontos para loja",
  "Fluxo de pagamento testado no celular",
];

const PROMPTS = [
  {
    title: "Revisar responsividade mobile",
    body:
      "Atue como auditor de UX mobile. Revise as telas principais do meu app no Lovable e liste problemas de responsividade em telas pequenas (320px, 375px, 414px). Não altere código nesta rodada. Apenas aponte: o que quebra, o que fica apertado, o que precisa virar mobile-first.",
  },
  {
    title: "Auditar prontidão PWA",
    body:
      "Atue como auditor PWA. Verifique se meu app tem manifest, ícones, theme-color, viewport e comportamento adequado em iOS e Android. Liste o que falta para o app ser instalável na tela inicial. Não implemente nada ainda.",
  },
  {
    title: "Vale publicar em loja agora?",
    body:
      "Atue como consultor de produto. Com base no estado atual do meu app (validação, usuários, receita, recursos nativos necessários), me ajude a decidir se faz sentido publicar na Google Play / App Store AGORA, ou se devo continuar como web/PWA por mais tempo. Liste prós, contras e pré-requisitos.",
  },
];

export function TransformarMobileCard() {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  

  const toggle = (i: number) =>
    setChecked((p) => ({ ...p, [i]: !p[i] }));

  const copyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Prompt copiado", description: "Cole no Agente Arquiteto ou no Lovable." });
    } catch {
      toast({ title: "Não consegui copiar", description: "Selecione manualmente.", variant: "destructive" });
    }
  };

  return (
    <GlassCard className="mt-6 border-accent/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
            <Smartphone size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base md:text-lg font-heading font-bold leading-tight">
                Transformar em App Mobile
              </h3>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/15 text-muted-foreground">
                Extra opcional
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Entenda quando usar web, PWA, app híbrido ou loja de aplicativos — sem sair da jornada principal.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-muted-foreground mt-1">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="mt-5 space-y-6">
          {/* Aviso crítico */}
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3 flex gap-2">
            <AlertTriangle size={16} className="text-amber-300 shrink-0 mt-0.5" />
            <p className="text-[13px] text-foreground/90 leading-snug">
              <strong className="text-amber-200">Lovable não gera app nativo automático.</strong>{" "}
              O caminho mais comum é começar com web/PWA e, se fizer sentido, evoluir para
              empacotamento híbrido ou publicação em loja.
            </p>
          </div>

          {/* 1. Antes de começar */}
          <section>
            <h4 className="text-sm font-heading font-bold text-foreground/95 mb-1">1. Antes de começar</h4>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              A maioria dos apps deve primeiro validar a versão web (com usuários reais, feedback e
              ajustes) antes de pensar em loja. Publicar cedo demais costuma significar retrabalho,
              custos com conta de desenvolvedor e revisões reprovadas.
            </p>
          </section>

          {/* 2. Web / PWA / Híbrido / Nativo */}
          <section>
            <h4 className="text-sm font-heading font-bold text-foreground/95 mb-2">
              2. Web, PWA, híbrido ou nativo?
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              <OptionRow icon={<Globe size={14} />} title="Web app" text="Acessado por link no navegador. É como seu app no Lovable funciona hoje." />
              <OptionRow icon={<Download size={14} />} title="PWA" text="Pode parecer app, com ícone na tela inicial — depende do navegador e do sistema." />
              <OptionRow icon={<Package size={14} />} title="Híbrido (Capacitor)" text="Empacota o app web para Android/iOS. Exige configuração técnica e ferramentas." />
              <OptionRow icon={<Apple size={14} />} title="Nativo" text="Desenvolvimento específico para Android/iOS. Não é o foco inicial do programa." />
            </div>
          </section>

          {/* 3. Árvore de decisão */}
          <section>
            <h4 className="text-sm font-heading font-bold text-foreground/95 mb-2">3. Árvore de decisão</h4>
            <ul className="text-[13px] text-foreground/90 space-y-1.5">
              <li>• <strong>Quer validar rápido?</strong> Comece como web app.</li>
              <li>• <strong>Quer aparência de app no celular?</strong> Avalie PWA.</li>
              <li>• <strong>Precisa publicar em loja?</strong> Avalie app híbrido (Capacitor).</li>
              <li>• <strong>Precisa de recursos nativos avançados</strong> (câmera, push, sensores)? Considere apoio técnico adicional.</li>
            </ul>
          </section>

          {/* 4. Checklist visual */}
          <section>
            <h4 className="text-sm font-heading font-bold text-foreground/95 mb-2">
              4. Checklist de prontidão mobile
            </h4>
            <p className="text-[11px] text-muted-foreground mb-2">
              Apenas visual — não conta no progresso da jornada.
            </p>
            <div className="grid sm:grid-cols-2 gap-1.5">
              {CHECKLIST_ITEMS.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  className={`flex items-center gap-2 p-2 rounded-md border text-left text-[13px] transition ${
                    checked[i]
                      ? "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-100"
                      : "border-white/10 bg-white/[0.02] text-foreground/90 hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      checked[i] ? "bg-emerald-400/20 border-emerald-400/50" : "border-white/20"
                    }`}
                  >
                    {checked[i] && <Check size={10} className="text-emerald-200" />}
                  </span>
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 5. Riscos */}
          <section>
            <h4 className="text-sm font-heading font-bold text-foreground/95 mb-1">5. Riscos</h4>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Publicar em loja exige conta de desenvolvedor paga (Google Play / Apple Developer),
              políticas próprias da plataforma, screenshots, descrição, revisão humana e
              requisitos técnicos específicos. Aprovação <strong>não é garantida</strong> e pode
              levar dias ou semanas.
            </p>
          </section>

          {/* 6. O que NÃO fazer agora */}
          <section>
            <h4 className="text-sm font-heading font-bold text-foreground/95 mb-2">
              6. O que NÃO fazer agora
            </h4>
            <ul className="text-[13px] text-foreground/90 space-y-1">
              <li>• Não publicar em loja antes de validar o app com usuários reais.</li>
              <li>• Não prometer aprovação garantida na App Store ou Google Play.</li>
              <li>• Não instalar Capacitor sem decisão consciente — muda a estrutura do projeto.</li>
              <li>• Não transformar isso em etapa obrigatória do MVP.</li>
            </ul>
          </section>

          {/* 7. Prompts */}
          <section>
            <h4 className="text-sm font-heading font-bold text-foreground/95 mb-2">7. Prompts úteis</h4>
            <div className="space-y-2">
              {PROMPTS.map((p) => (
                <div key={p.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[13px] font-semibold text-foreground/95">{p.title}</span>
                    <button
                      type="button"
                      onClick={() => copyPrompt(p.body)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 text-[11px] font-semibold"
                    >
                      <Copy size={11} /> Copiar
                    </button>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-snug">{p.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </GlassCard>
  );
}

function OptionRow({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2 mb-1 text-accent">
        {icon}
        <span className="text-[13px] font-semibold text-foreground/95">{title}</span>
      </div>
      <p className="text-[12px] text-muted-foreground leading-snug">{text}</p>
    </div>
  );
}
