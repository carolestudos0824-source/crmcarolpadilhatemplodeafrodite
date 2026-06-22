import { useState } from "react";
import { Rocket, FolderPlus, Search, Code2, Bot, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAppProjects } from "@/hooks/useAppProjects";

/**
 * Onboarding guiado de 3 passos para usuário leigo que abre /entrega
 * pela primeira vez. Não altera nenhum motor de prompt — apenas orienta
 * o caminho: criar/selecionar app → usar Busca Inteligente → copiar prompt.
 */
export const FirstAppOnboarding = () => {
  const { activeProject, openDrawer } = useAppProjects();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const scrollTo = (id: string, focus = false) => {
    const el = document.getElementById(id);
    if (!el) {
      toast.info("Role a página para encontrar a seção indicada.");
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (focus) {
      const input = el.querySelector<HTMLInputElement>('input[type="text"]');
      input?.focus();
      el.classList.add("ring-2", "ring-accent");
      setTimeout(() => el.classList.remove("ring-2", "ring-accent"), 2000);
    }
  };

  return (
    <section
      aria-label="Comece aqui em 3 passos"
      className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5"
    >
      <header className="flex items-start gap-3 mb-4">
        <div className="rounded-lg bg-accent/15 p-2 text-accent shrink-0">
          <Rocket size={18} />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-foreground">
            Comece aqui: crie seu primeiro app em 3 passos
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use este caminho se você ainda está perdido ou criando seu primeiro app no Lovable.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-[11px] text-muted-foreground hover:text-foreground transition"
          aria-label="Ocultar onboarding"
        >
          Ocultar
        </button>
      </header>

      {activeProject ? (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>
            App ativo: <strong>{activeProject.name}</strong>
          </span>
        </div>
      ) : (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>
            Nenhum app ativo selecionado. Comece criando ou selecionando um app em <strong>Meus Apps</strong>.
          </span>
        </div>
      )}

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Step
          icon={<FolderPlus size={15} />}
          title="1. Crie ou selecione seu app"
          text="Antes de gerar prompts, escolha qual aplicativo você está construindo. Isso evita contexto errado."
          buttonLabel="Abrir Meus Apps"
          onClick={openDrawer}
        />
        <Step
          icon={<Search size={15} />}
          title="2. Diga o que você quer resolver"
          text="Use a Busca Inteligente para escrever sua dor: vender, monetizar, melhorar tela, corrigir erro ou próximo passo."
          buttonLabel="Usar Busca Inteligente"
          onClick={() => scrollTo("pain-search", true)}
        />
        <Step
          icon={<Code2 size={15} />}
          title="3. Copie o prompt certo"
          text="Use Planejar com o Agente para decidir antes. Use Copiar para o Lovable quando já souber o que implementar."
          buttonLabel="Ver módulos"
          onClick={() => scrollTo("modules-list")}
        />
      </ol>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-muted-foreground">
          <Bot size={12} className="text-accent" />
          <span>
            <strong className="text-foreground">Planejar com o Agente</strong> = pensar antes de mexer
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-muted-foreground">
          <Code2 size={12} className="text-accent" />
          <span>
            <strong className="text-foreground">Copiar para o Lovable</strong> = executar no app
          </span>
        </div>
      </div>
    </section>
  );
};

const Step = ({
  icon,
  title,
  text,
  buttonLabel,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  buttonLabel: string;
  onClick: () => void;
}) => (
  <li className="rounded-xl border border-white/10 bg-background/40 p-3 flex flex-col">
    <div className="flex items-center gap-2 mb-1 text-foreground">
      <span className="text-accent">{icon}</span>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    <p className="text-xs text-muted-foreground flex-1 mb-3">{text}</p>
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 transition"
    >
      {buttonLabel}
      <ArrowRight size={12} />
    </button>
  </li>
);
