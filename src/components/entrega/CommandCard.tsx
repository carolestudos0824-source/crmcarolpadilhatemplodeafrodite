import { useState } from "react";
import { Copy, Check, ChevronDown, Sparkles, Wrench, Target, Compass, Bot, Code2, ExternalLink, FileText, Info, ShieldCheck } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { APP_CONFIG } from "@/config/appConfig";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import { wrapLovable, LOVABLE_AUDIT_PROMPT } from "@/components/entrega/CopyCommandWarning";
import { useProjectContext } from "@/hooks/useProjectContext";
import { buildAgentPrompt, buildLovablePrompt } from "@/lib/promptBuilder";
import { PromptReviewDialog } from "@/components/entrega/PromptReviewDialog";
import { EditablePromptBox } from "@/components/entrega/EditablePromptBox";
import { openAgenteArquiteto } from "@/lib/agenteArquiteto";


type Props = {
  number: number;
  title: string;
  description: string; // purpose
  whenToUse: string;
  whereToPaste: string;
  expectedResult: string;
  commandText: string;
  defaultOpen?: boolean;
  completedKey: string;
  moduleId?: string;
  // Campos opcionais — usados pelo módulo "Construir app" (central guiada).
  objective?: string;
  whenLovableDirect?: string;
  whenAgentFirst?: string;
  agentPrompt?: string;
  correctionPrompt?: string;
  advanceCriteria?: string;
};


export const CommandCard = ({
  number,
  title,
  description,
  whenToUse,
  whereToPaste,
  expectedResult,
  commandText,
  defaultOpen = false,
  completedKey,
  moduleId,
  objective,
  whenLovableDirect,
  whenAgentFirst,
  agentPrompt,
  correctionPrompt,
  advanceCriteria,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [tab, setTab] = useState<"lovable" | "agent" | "fix" | "advance">("lovable");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [editedCommand, setEditedCommand] = useState(commandText);
  const [editedAgent, setEditedAgent] = useState(agentPrompt ?? "");
  const [editedCorrection, setEditedCorrection] = useState(correctionPrompt ?? "");
  const { isCommandDone, toggleCommand } = useUserProgress();
  const { context, isFilled, openEditor } = useProjectContext();
  const done = isCommandDone(completedKey);

  const enrichedLovable = () =>
    buildLovablePrompt({
      context,
      stepName: title,
      stepObjective: objective ?? description,
      command: editedCommand,
      moduleId,
    });
  const enrichedAgent = () =>
    buildAgentPrompt({
      context,
      stepName: title,
      stepObjective: objective ?? description,
      command: editedAgent || editedCommand,
      moduleId,
    });


  const toggleDone = () => {
    toggleCommand(completedKey);
  };

  const copyText = async (
    text: string,
    key: string,
    successMsg: string,
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(successMsg);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
    } catch {
      toast.error("Não foi possível copiar. Selecione e copie manualmente.");
    }
  };

  const isGuided =
    !!objective ||
    !!whenLovableDirect ||
    !!whenAgentFirst ||
    !!agentPrompt ||
    !!correctionPrompt ||
    !!advanceCriteria;

  return (
    <>
    <GlassCard className="p-5 md:p-6 space-y-4 scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-4 text-left"
      >
        <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent font-heading font-bold flex items-center justify-center">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-semibold text-base md:text-lg leading-snug">
              {title}
            </h3>
            {done && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Concluído
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-2 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !isGuided && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          {!isFilled && (
            <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 flex items-start gap-2 text-[12px]">
              <Info size={14} className="text-amber-300 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-foreground/90">
                  Preencha o <strong>Contexto do meu app</strong> para os comandos ficarem mais precisos.
                </p>
                <button
                  type="button"
                  onClick={openEditor}
                  className="mt-1 text-amber-200 underline underline-offset-2 hover:text-amber-100"
                >
                  Preencher contexto
                </button>
              </div>
            </div>
          )}
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              ["Quando usar", whenToUse],
              ["Onde colar", whereToPaste],
              ["Resultado esperado", expectedResult],
            ].map(([label, text]) => (
              <div
                key={label}
                className="rounded-lg bg-white/5 border border-white/10 p-3"
              >
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
                  {label}
                </dt>
                <dd className="text-foreground/85 text-[13px] leading-snug">
                  {text}
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent mb-1.5">
              <Sparkles size={12} /> Texto pronto para colar no Lovable
            </div>
            <EditablePromptBox
              originalPrompt={commandText}
              storageKey={`cmdcard__${completedKey}__main`}
              onChange={setEditedCommand}
              hideCopyButton
              saveTitle={title}
              saveSourceModule={moduleId}
            />

            <div className="mt-2 flex flex-col items-end gap-2">
              <p className="w-full text-xs text-cyan-300/90 bg-cyan-500/[0.06] border border-cyan-400/25 rounded-lg px-3 py-2 text-left">
                <strong className="font-semibold text-cyan-200">Dica para iniciantes:</strong>{" "}
                revise este prompt com o Agente Arquiteto antes de colar no Lovable.
              </p>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  className="text-sm inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl border border-white/15 hover:bg-white/5"
                >
                  <FileText size={14} /> Revisar prompt antes de copiar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    copyText(enrichedAgent(), "agent-rev", "Prompt de revisão para o Agente copiado.");
                    openAgenteArquiteto();
                  }}
                  className="text-sm inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                >
                  {copiedKey === "agent-rev" ? <Check size={14} /> : <Bot size={14} />}
                  Revisar com o Agente
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      LOVABLE_AUDIT_PROMPT(editedCommand),
                      "audit",
                      "Prompt de auditoria copiado",
                      "Cole no Lovable para ele analisar sem alterar seu app.",
                    )
                  }
                  className="text-sm inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15"
                >
                  {copiedKey === "audit" ? <Check size={14} /> : <ShieldCheck size={14} />}
                  Copiar auditoria para o Lovable
                </button>
                <button
                  onClick={() =>
                    copyText(enrichedLovable(), "main", "Copiado para o Lovable.")
                  }
                  className="btn-primary text-sm"
                  type="button"
                >
                  {copiedKey === "main" ? <Check size={16} /> : <Copy size={16} />}
                  Copiar para o Lovable
                </button>
              </div>
              <span className="text-[11px] text-muted-foreground/90 text-right max-w-md">
                Está começando? Revise com o Agente primeiro. Já sabe o que quer alterar? Copie direto para o Lovable. A auditoria é o caminho do meio: o Lovable analisa sem alterar nada.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-white/5">
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={done}
                onChange={toggleDone}
                className="accent-accent w-4 h-4"
              />
              Já colei este texto no Lovable
            </label>
          </div>
        </div>
      )}

      {open && isGuided && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          {!isFilled && (
            <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 flex items-start gap-2 text-[12px]">
              <Info size={14} className="text-amber-300 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-foreground/90">
                  Preencha o <strong>Contexto do meu app</strong> para os comandos ficarem mais precisos.
                </p>
                <button
                  type="button"
                  onClick={openEditor}
                  className="mt-1 text-amber-200 underline underline-offset-2 hover:text-amber-100"
                >
                  Preencher contexto
                </button>
              </div>
            </div>
          )}
          {objective && (
            <div className="rounded-lg border border-accent/25 bg-accent/5 p-3 flex items-start gap-2">
              <Target size={14} className="text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-accent mb-0.5">
                  Objetivo da etapa
                </div>
                <p className="text-[13px] text-foreground/90 leading-snug">{objective}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-2 -mb-1">
            {[
              { id: "lovable", label: "Fazer no Lovable", icon: Code2, color: "text-accent border-accent/50 bg-accent/10" },
              { id: "agent", label: "Pensar com o Agente", icon: Bot, color: "text-amber-200 border-amber-400/50 bg-amber-400/10", disabled: !agentPrompt && !whenAgentFirst },
              { id: "fix", label: "Corrigir erro", icon: Wrench, color: "text-rose-200 border-rose-400/50 bg-rose-400/10", disabled: !correctionPrompt },
              { id: "advance", label: "Quando avançar", icon: Compass, color: "text-emerald-200 border-emerald-400/50 bg-emerald-400/10" },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={t.disabled}
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`inline-flex items-center gap-1.5 text-[11px] md:text-xs px-3 py-2 rounded-lg border min-h-[40px] transition ${
                    active
                      ? t.color
                      : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5"
                  }`}
                >
                  <Icon size={12} /> {t.label}
                </button>
              );
            })}
          </div>

          {tab === "lovable" && (
            <div className="space-y-3">
              {whenLovableDirect && (
                <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary mb-1">
                    <Code2 size={12} /> Usar direto no Lovable quando
                  </div>
                  <p className="text-[13px] text-foreground/85 leading-snug">{whenLovableDirect}</p>
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-accent mb-1.5">
                  <Sparkles size={12} /> Texto pronto para colar no Lovable
                </div>
                <div className="text-[11px] text-amber-200/90 bg-amber-400/5 border border-amber-400/20 rounded-md px-3 py-2 mb-2">
                  Onde tiver texto entre colchetes, apague e escreva as informações do seu app.
                </div>
                <EditablePromptBox
                  originalPrompt={commandText}
                  storageKey={`cmdcard__${completedKey}__guided`}
                  onChange={setEditedCommand}
                  hideCopyButton
                  saveTitle={title}
                  saveSourceModule={moduleId}
                />

                <div className="mt-2 flex flex-col items-end gap-2">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewOpen(true)}
                      className="text-sm inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
                    >
                      <FileText size={14} /> Revisar prompt antes de copiar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        copyText(enrichedAgent(), "agent-rev", "Prompt de revisão para o Agente copiado.");
                        openAgenteArquiteto();
                      }}
                      className="text-sm inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                    >
                      {copiedKey === "agent-rev" ? <Check size={14} /> : <Bot size={14} />}
                      Revisar com o Agente
                    </button>
                    <button
                      onClick={() =>
                        copyText(enrichedLovable(), "main", "Copiado para o Lovable.")
                      }
                      className="btn-primary text-sm min-h-[44px]"
                      type="button"
                    >
                      {copiedKey === "main" ? <Check size={16} /> : <Copy size={16} />}
                      Copiar para o Lovable
                    </button>
                  </div>
                  <span className="text-[10px] text-muted-foreground/80">
                    Cole no projeto do seu app no Lovable.
                  </span>
                </div>
              </div>
            </div>
          )}

          {tab === "agent" && (
            <div className="space-y-3">
              {whenAgentFirst && (
                <div className="rounded-lg border border-amber-400/25 bg-amber-400/5 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-300 mb-1">
                    <Bot size={12} /> Usar o Agente antes quando
                  </div>
                  <p className="text-[13px] text-foreground/85 leading-snug">{whenAgentFirst}</p>
                </div>
              )}
              {agentPrompt ? (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-300 mb-1.5">
                    <Bot size={12} /> Texto pronto para conversar com o Agente
                  </div>
                  <EditablePromptBox
                    originalPrompt={agentPrompt}
                    storageKey={`cmdcard__${completedKey}__agent`}
                    onChange={setEditedAgent}
                    hideCopyButton
                    saveTitle={`${title} — Agente`}
                    saveSourceModule={moduleId}
                  />

                  <div className="mt-2 flex flex-col items-end gap-1">
                    <div className="flex flex-wrap justify-end gap-2">
                      <a
                        href={APP_CONFIG.GPT_AGENT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl border border-white/15 hover:bg-white/5"
                      >
                        <ExternalLink size={14} /> Abrir Agente Arquiteto
                      </a>
                      <button
                        onClick={() => copyText(editedAgent || agentPrompt, "agent", "Prompt do Agente copiado.")}
                        type="button"
                        className="text-sm inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15"
                      >
                        {copiedKey === "agent" ? <Check size={16} /> : <Copy size={16} />}
                        {copiedKey === "agent" ? "Copiado" : "Copiar para o Agente"}
                      </button>
                    </div>
                    <span className="text-[10px] text-muted-foreground/80">
                      Use para pensar antes de aplicar.
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Sem prompt do Agente para esta etapa.</p>
              )}
            </div>
          )}

          {tab === "fix" && (
            <div className="space-y-3">
              {correctionPrompt ? (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-rose-300 mb-1.5">
                    <Wrench size={12} /> Se o Lovable errar, cole este texto
                  </div>
                  <EditablePromptBox
                    originalPrompt={correctionPrompt}
                    storageKey={`cmdcard__${completedKey}__fix`}
                    onChange={setEditedCorrection}
                    hideCopyButton
                    saveTitle={`${title} — Correção`}
                    saveSourceModule={moduleId}
                  />
                  <div className="mt-2 flex flex-col items-end gap-1">
                    <button
                      onClick={() => copyText(wrapLovable(editedCorrection || correctionPrompt), "fix", "Correção copiada.")}
                      type="button"
                      className="text-sm inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl border border-rose-400/40 bg-rose-400/10 text-rose-200 hover:bg-rose-400/15"
                    >
                      {copiedKey === "fix" ? <Check size={16} /> : <Copy size={16} />}
                      {copiedKey === "fix" ? "Copiado" : "Copiar correção"}
                    </button>

                    <span className="text-[10px] text-muted-foreground/80">
                      Use quando o Lovable não entregar o resultado esperado.
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Sem prompt de correção para esta etapa.</p>
              )}
            </div>
          )}

          {tab === "advance" && (
            <div className="space-y-3">
              <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
                  Resultado esperado
                </div>
                <p className="text-foreground/85 text-[13px] leading-snug">{expectedResult}</p>
              </div>
              {advanceCriteria && (
                <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3 flex items-start gap-2">
                  <Compass size={14} className="text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-300 mb-0.5">
                      Critério para avançar
                    </div>
                    <p className="text-[13px] text-foreground/90 leading-snug">{advanceCriteria}</p>
                  </div>
                </div>
              )}
              <label className="inline-flex items-center gap-2 text-sm text-foreground/85 cursor-pointer min-h-[40px]">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={toggleDone}
                  className="accent-accent w-4 h-4"
                />
                Já colei este texto no Lovable
              </label>
            </div>
          )}

          {tab !== "advance" && (
            <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-white/5">
              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={toggleDone}
                  className="accent-accent w-4 h-4"
                />
                Já colei este texto no Lovable
              </label>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Etapa guiada
              </span>
            </div>
          )}
        </div>
      )}
    </GlassCard>
    <PromptReviewDialog
      open={reviewOpen}
      onClose={() => setReviewOpen(false)}
      stepName={title}
      stepObjective={objective ?? description}
      command={commandText}
      moduleId={moduleId}
    />
    </>
  );
};
