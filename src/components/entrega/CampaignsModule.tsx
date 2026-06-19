import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Target,
  Wand2,
  Layers,
  Image as ImageIcon,
  CalendarDays,
  BarChart3,
  Stethoscope,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ChevronDown,
  ClipboardList,
  Rocket,
  HelpCircle,
  BookOpen,
  ExternalLink,
  Bot,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { APP_CONFIG } from "@/config/appConfig";

type Checklist = Record<string, boolean>;
type SetChecklist = (v: Checklist | ((p: Checklist) => Checklist)) => void;

type TabId =
  | "diagnostico"
  | "gerador"
  | "prontas"
  | "criativos"
  | "plano"
  | "metricas"
  | "melhorar"
  | "resumo";

const TABS: { id: TabId; label: string; icon: typeof Target }[] = [
  { id: "diagnostico", label: "Diagnóstico", icon: Stethoscope },
  { id: "gerador", label: "Criar campanha", icon: Wand2 },
  { id: "prontas", label: "Campanhas prontas", icon: Layers },
  { id: "criativos", label: "Criativos", icon: ImageIcon },
  { id: "plano", label: "Plano de 7 dias", icon: CalendarDays },
  { id: "metricas", label: "Métricas", icon: BarChart3 },
  { id: "melhorar", label: "Melhorar", icon: Target },
  { id: "resumo", label: "Campanha pronta", icon: ClipboardList },
];

const GLOSSARIO: { termo: string; def: string }[] = [
  { termo: "Aquisição", def: "Trazer pessoas para conhecer seu app." },
  { termo: "Campanha", def: "Conjunto de mensagens para divulgar uma oferta." },
  { termo: "Canal", def: "Lugar onde você divulga: Instagram, WhatsApp, TikTok, e-mail, comunidade." },
  { termo: "Criativo", def: "Imagem, vídeo ou texto usado na divulgação." },
  { termo: "Lead", def: "Pessoa interessada." },
  { termo: "CTA", def: "Chamada para ação, como 'testar agora' ou 'comprar'." },
  { termo: "Conversão", def: "Quando a pessoa faz a ação desejada." },
  { termo: "Métrica", def: "Número usado para medir resultado." },
  { termo: "Tráfego", def: "Pessoas chegando até sua página ou app." },
  { termo: "Validação", def: "Teste para saber se existe interesse real." },
  { termo: "Escalar", def: "Aumentar a divulgação depois que a campanha já mostrou sinais de funcionar." },
  { termo: "Orgânico", def: "Divulgação sem anúncio pago." },
  { termo: "Pago", def: "Divulgação com investimento em anúncios." },
];

// ===== utils =====

function CopyBtn({
  text,
  label = "Copiar comando",
  full = false,
}: {
  text: string;
  label?: string;
  full?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    const clean = (text ?? "").trim();
    if (!clean) {
      toast.error("Nada para copiar ainda. Preencha os campos primeiro.");
      return;
    }
    try {
      await navigator.clipboard.writeText(clean);
      setCopied(true);
      toast.success("Copiado! Agora cole no Lovable.");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };
  return (
    <button
      onClick={handle}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition ${
        copied
          ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
          : "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
      } ${full ? "w-full sm:w-auto" : ""}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copiado!" : label}
    </button>
  );
}


function CommandBox({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 max-h-72 overflow-auto">
      <pre className="text-xs p-4 whitespace-pre-wrap font-mono text-foreground/90">
        {text}
      </pre>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-accent/50 outline-none text-sm placeholder:text-muted-foreground/60"
      />
    </label>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-accent/50 outline-none text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

// Checklist visual (não persistente — só lista de verificação)
function VisualCheck({ items }: { items: string[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  return (
    <ul className="space-y-2">
      {items.map((it) => {
        const v = !!done[it];
        return (
          <li key={it}>
            <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
              <input
                type="checkbox"
                checked={v}
                onChange={() => setDone((p) => ({ ...p, [it]: !p[it] }))}
                className="accent-accent w-4 h-4"
              />
              <span className={`text-sm ${v ? "line-through text-muted-foreground" : ""}`}>
                {it}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

// ===== Conteúdo de cada bloco =====

function BlocoDiagnostico() {
  const command = `Analise a oferta do meu app e deixe ela mais clara para vender.

App:
[descreva o app]

Público:
[quem vai usar]

Problema:
[qual dor resolve]

Solução:
[o que o app faz]

Preço ou modelo de venda:
[informe ou escreva "ainda não definido"]

Página atual ou descrição:
[cole aqui o texto da página, se tiver]

Quero que você entregue:
1. Diagnóstico da oferta
2. O que está confuso
3. Promessa principal melhorada
4. Público ideal
5. Dor mais forte
6. Benefício principal
7. Headline melhor
8. CTA melhor
9. O que remover da página
10. O que testar primeiro

Regras:
- Seja direto.
- Não prometa resultado garantido.
- Melhore a clareza.
- Foque em conversão.
- Explique como se fosse para um iniciante.`;
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-lg">
          Antes de divulgar, veja se sua oferta está clara
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Se a pessoa não entende o que seu app faz, ela não clica, não testa e não compra.
        </p>
      </div>
      <GlassCard className="p-5">
        <VisualCheck
          items={[
            "O app resolve uma dor clara?",
            "O público está definido?",
            "A promessa é fácil de entender?",
            "Existe uma ação principal?",
            "A página explica o que o usuário recebe?",
            "Existe CTA claro?",
            "Existe preço ou próximo passo?",
            "O usuário entende sem tutorial?",
          ]}
        />
      </GlassCard>
      <p className="text-xs text-muted-foreground">
        Copie este comando e cole no Lovable.
      </p>
      <CommandBox text={command} />
      <CopyBtn text={command} label="Copiar comando para melhorar minha oferta" />
    </div>
  );
}

function BlocoGerador() {
  const [f, setF] = useState({
    name: "",
    audience: "",
    pain: "",
    benefit: "",
    objective: "Conseguir primeiros usuários",
    channel: "Instagram",
    budget: "",
    cta: "",
  });
  const [out, setOut] = useState("");

  const generate = () => {
    const text = `Crie uma campanha para divulgar meu app no Lovable.

Nome do app:
${f.name || "[nome]"}

Público:
${f.audience || "[público]"}

Dor principal:
${f.pain || "[dor]"}

Benefício principal:
${f.benefit || "[benefício]"}

Objetivo:
${f.objective}

Canal:
${f.channel}

Orçamento:
${f.budget || "[orçamento]"}

CTA:
${f.cta || "[cta]"}

Entregue:
1. Estratégia da campanha
2. Mensagem principal
3. Público ideal
4. Melhor canal para começar
5. 5 ângulos de comunicação
6. 10 headlines
7. 10 textos curtos
8. 5 chamadas para ação
9. 5 ideias de criativos
10. Plano de 7 dias
11. Métrica principal
12. O que testar primeiro
13. Quando pausar
14. Quando melhorar
15. Quando escalar

Regras:
- Começar pequeno.
- Não prometer venda garantida.
- Criar mensagens simples.
- Focar em aprendizado.
- Explicar o que fazer hoje.`;
    setOut(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-lg">Gerador rápido de campanha</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Preencha os campos. Depois copie o comando gerado e cole no Lovable.
        </p>
      </div>
      <GlassCard className="p-5">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nome do app" value={f.name} onChange={(v) => setF({ ...f, name: v })} placeholder="Ex: AgendaPro Local" />
          <Field label="Público" value={f.audience} onChange={(v) => setF({ ...f, audience: v })} placeholder="Ex: barbeiros e manicures" />
          <Field label="Dor principal" value={f.pain} onChange={(v) => setF({ ...f, pain: v })} placeholder="Ex: perdem horários no WhatsApp" />
          <Field label="Benefício principal" value={f.benefit} onChange={(v) => setF({ ...f, benefit: v })} placeholder="Ex: organizar agenda" />
          <FieldSelect
            label="Objetivo"
            value={f.objective}
            onChange={(v) => setF({ ...f, objective: v })}
            options={[
              "Conseguir primeiros usuários",
              "Vender",
              "Captar leads",
              "Criar lista de espera",
              "Validar ideia",
              "Divulgar lançamento",
              "Reativar usuários",
            ]}
          />
          <FieldSelect
            label="Canal principal"
            value={f.channel}
            onChange={(v) => setF({ ...f, channel: v })}
            options={[
              "WhatsApp",
              "Instagram",
              "TikTok",
              "Google",
              "Comunidades",
              "LinkedIn",
              "Indicação",
              "Meta Ads",
              "Google Ads",
            ]}
          />
          <Field label="Orçamento" value={f.budget} onChange={(v) => setF({ ...f, budget: v })} placeholder="Ex: R$0, R$20/dia" />
          <Field label="CTA" value={f.cta} onChange={(v) => setF({ ...f, cta: v })} placeholder="Ex: Testar agora" />
        </div>
        <button onClick={generate} className="btn-primary mt-4 text-sm">
          <Sparkles size={14} /> Gerar comando de campanha
        </button>
      </GlassCard>
      {out && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Copie este comando e cole no Lovable.
          </p>
          <CommandBox text={out} />
          <CopyBtn text={out} label="Copiar comando gerado" />
        </div>
      )}
    </div>
  );
}

type Prontas = {
  id: string;
  title: string;
  when: string;
  result: string;
  command: string;
};

const PRONTAS: Prontas[] = [
  {
    id: "primeiros10",
    title: "Conseguir os primeiros 10 usuários",
    when: "Use quando o app ainda está no começo.",
    result: "10 pessoas reais testando e dando feedback.",
    command: `Crie uma campanha para conseguir os primeiros 10 usuários reais do meu app.

App:
[descreva o app]

Público:
[quem deve testar]

Problema:
[qual dor resolve]

O que já tenho pronto:
[plano, protótipo, landing page, app publicado ou ainda nada]

Entregue:
1. Quem são os 10 usuários ideais
2. Onde encontrar essas pessoas
3. Mensagem de convite
4. Mensagem para WhatsApp
5. Texto para Instagram
6. Roteiro de stories
7. Tarefa que cada usuário deve fazer
8. Perguntas de feedback
9. Métrica principal
10. Critério para saber se a ideia tem potencial
11. O que melhorar depois dos testes

Regras:
- Foco em pessoas reais.
- Não buscar volume.
- Buscar aprendizado.
- Mensagens humanas, sem parecer spam.`,
  },
  {
    id: "listaespera",
    title: "Criar lista de espera",
    when: "Use antes do app estar pronto.",
    result: "Pessoas interessadas esperando o lançamento.",
    command: `Crie uma campanha para captar lista de espera do meu app.

App:
[descreva]

Público:
[quem]

Promessa:
[o que vai resolver]

Entregue:
1. Texto da página de espera
2. Headline e subheadline
3. CTA da página
4. Mensagem de WhatsApp
5. 5 posts para Instagram
6. Roteiro de stories
7. E-mail de boas-vindas
8. Como manter a lista aquecida
9. Métrica principal
10. Quando lançar

Regras:
- Promessa clara.
- Sem prometer data exata se não tiver.
- Foco em quem realmente tem a dor.`,
  },
  {
    id: "venderacesso",
    title: "Vender o acesso",
    when: "Use quando já existe página de venda.",
    result: "Mais cliques no botão de compra.",
    command: `Crie uma campanha para vender o acesso do meu app.

App:
[descreva]

Público:
[quem compra]

Preço:
[informe]

Página de venda:
[cole o texto ou link]

Entregue:
1. Mensagem principal
2. 5 ângulos de venda
3. 10 headlines
4. 10 textos curtos para anúncio
5. 5 mensagens de WhatsApp
6. 3 ideias de criativo
7. Plano de 7 dias
8. Métricas a acompanhar
9. O que testar primeiro
10. Quando ajustar a oferta

Regras:
- Não prometer resultado garantido.
- Mostrar transformação real.
- Reforçar prova e clareza.`,
  },
  {
    id: "validar",
    title: "Validar ideia",
    when: "Use para descobrir se existe interesse real.",
    result: "Sinais claros de interesse ou de ajuste.",
    command: `Crie uma campanha simples para validar se minha ideia tem interesse real.

Ideia:
[descreva]

Público:
[quem]

Problema:
[qual dor]

Entregue:
1. Mensagem curta para teste
2. 3 versões diferentes
3. Onde publicar
4. Como medir interesse
5. Perguntas para conversar com interessados
6. O que considera validado
7. O que considera precisa mudar

Regras:
- Foco em aprender, não vender.
- Mensagens curtas e diretas.`,
  },
  {
    id: "lancar24",
    title: "Lançar em 24 horas",
    when: "Use quando quer divulgar rápido.",
    result: "Primeira leva de pessoas vendo o app hoje.",
    command: `Crie um plano de lançamento de 24 horas para meu app.

App:
[descreva]

Público:
[quem]

Canais disponíveis:
[WhatsApp, Instagram, comunidades, e-mail, outro]

Entregue:
1. Cronograma hora a hora
2. Mensagem de abertura
3. Texto para WhatsApp
4. Texto para Instagram
5. Roteiro de stories
6. CTA
7. Como reaproveitar conteúdo
8. Métrica principal
9. O que fazer se ninguém reagir

Regras:
- Realista.
- Foco em pessoas reais.
- Sem prometer milagre.`,
  },
  {
    id: "whatsapp",
    title: "Campanha de WhatsApp",
    when: "Use para chamar pessoas diretamente.",
    result: "Conversas iniciadas com possíveis usuários.",
    command: `Crie uma campanha de WhatsApp para divulgar meu app.

App:
[descreva]

Público:
[quem]

Quem já está na minha lista:
[clientes, amigos, contatos do trabalho, ninguém ainda]

Entregue:
1. Mensagem de abertura
2. 5 variações
3. Mensagem para grupo
4. Mensagem 1 a 1
5. Resposta para "não tenho interesse"
6. Resposta para "depois eu vejo"
7. CTA claro
8. Como pedir indicação
9. Métrica simples
10. Quando parar de mandar

Regras:
- Mensagem humana, sem parecer spam.
- Foco em ajudar antes de vender.`,
  },
  {
    id: "instagram",
    title: "Campanha para Instagram",
    when: "Use para posts, reels e stories.",
    result: "Conteúdo pronto para 1 semana.",
    command: `Crie uma campanha para Instagram para divulgar meu app.

App:
[descreva]

Público:
[quem]

Dor:
[qual]

Benefício:
[qual]

Entregue:
1. 7 ideias de post
2. 5 roteiros de reels
3. 5 sequências de stories
4. 10 legendas
5. 5 ganchos iniciais
6. 5 CTAs
7. Hashtags relevantes
8. Quando postar
9. Métrica principal
10. O que testar primeiro

Regras:
- Frases curtas.
- Sem prometer milagre.
- Mostrar dor e solução.`,
  },
  {
    id: "pagainicial",
    title: "Campanha paga inicial",
    when: "Use para testar com orçamento pequeno.",
    result: "Primeiros dados reais de clique e custo.",
    command: `Crie uma campanha paga inicial para testar meu app com orçamento pequeno.

App:
[descreva]

Público:
[quem]

Orçamento total:
[ex: R$50, R$100, R$200]

Canal:
[Meta Ads, Google Ads, TikTok Ads]

Entregue:
1. Estrutura da campanha
2. Segmentação inicial
3. 3 públicos para testar
4. 5 criativos para testar
5. 10 textos curtos
6. 5 headlines
7. Métrica principal
8. Quando pausar um anúncio
9. Quando subir orçamento
10. O que NÃO fazer no início

Regras:
- Começar pequeno.
- Não escalar sem sinal real.
- Não prometer resultado garantido.
- Foco em aprender com pouco dinheiro.`,
  },
];

function BlocoCampanhasProntas() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-lg">Campanhas prontas</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha o objetivo e copie o comando correspondente.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {PRONTAS.map((p) => {
          const isOpen = open === p.id;
          return (
            <GlassCard key={p.id} className="p-4 space-y-3">
              <div>
                <h4 className="font-semibold">{p.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  <strong className="text-foreground/80">Quando usar:</strong> {p.when}
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground/80">Resultado esperado:</strong> {p.result}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                  {isOpen ? "Ocultar comando" : "Ver comando"}
                </button>
                <CopyBtn text={p.command} label="Copiar comando" />
              </div>
              {isOpen && (
                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground">
                    Copie este comando e cole no Lovable.
                  </p>
                  <CommandBox text={p.command} />
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

function BlocoCriativos() {
  const [f, setF] = useState({
    name: "",
    audience: "",
    pain: "",
    benefit: "",
    format: "Reels",
    tone: "Direto",
  });
  const [out, setOut] = useState("");

  const generate = () => {
    const text = `Crie criativos para divulgar meu app.

App:
${f.name || "[nome]"}

Público:
${f.audience || "[público]"}

Dor:
${f.pain || "[dor]"}

Benefício:
${f.benefit || "[benefício]"}

Formato:
${f.format}

Tom:
${f.tone}

Entregue:
1. 10 ideias de criativos
2. 10 ganchos iniciais
3. 10 textos curtos
4. 5 roteiros de vídeo
5. 5 legendas
6. 5 CTAs
7. 3 variações para teste A/B
8. Sugestão visual para cada criativo
9. Qual criativo testar primeiro
10. Como medir se funcionou

Regras:
- Frases curtas.
- Foco na dor.
- Mostrar benefício rápido.
- Não prometer resultado impossível.
- Criar variações simples para teste.`;
    setOut(text);
  };

  const angulos = [
    { t: "Dor", ex: "Você ainda organiza seus pedidos pelo WhatsApp?" },
    { t: "Benefício", ex: "Organize seus pedidos em uma tela simples." },
    { t: "Antes e depois", ex: "Antes: pedidos perdidos. Depois: tudo organizado." },
    { t: "Comparação", ex: "WhatsApp sozinho vs app organizado." },
    { t: "Prova ou exemplo", ex: "Veja como um pequeno restaurante pode organizar pedidos." },
    { t: "Tutorial", ex: "Como criar seu primeiro agendamento em 30 segundos." },
    { t: "Urgência leve", ex: "Pare de perder clientes por desorganização." },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-lg">Criativos e mensagens</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Criativos são imagens, vídeos, posts, anúncios e mensagens que fazem alguém prestar atenção no seu app.
        </p>
      </div>
      <GlassCard className="p-5">
        <h4 className="font-semibold text-sm mb-3">Ângulos para inspirar</h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {angulos.map((a) => (
            <div
              key={a.t}
              className="rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <p className="text-xs font-semibold text-accent">{a.t}</p>
              <p className="text-xs text-muted-foreground mt-1">"{a.ex}"</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h4 className="font-semibold text-sm mb-3">Gerador de criativo</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nome do app" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <Field label="Público" value={f.audience} onChange={(v) => setF({ ...f, audience: v })} />
          <Field label="Dor" value={f.pain} onChange={(v) => setF({ ...f, pain: v })} />
          <Field label="Benefício" value={f.benefit} onChange={(v) => setF({ ...f, benefit: v })} />
          <FieldSelect
            label="Formato"
            value={f.format}
            onChange={(v) => setF({ ...f, format: v })}
            options={["Imagem", "Reels", "Story", "Vídeo curto", "Anúncio", "Carrossel", "WhatsApp"]}
          />
          <FieldSelect
            label="Tom"
            value={f.tone}
            onChange={(v) => setF({ ...f, tone: v })}
            options={["Direto", "Educativo", "Emocional", "Comparativo", "Urgente", "Simples"]}
          />
        </div>
        <button onClick={generate} className="btn-primary mt-4 text-sm">
          <Sparkles size={14} /> Gerar comando de criativo
        </button>
      </GlassCard>

      {out && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Copie este comando e cole no Lovable.
          </p>
          <CommandBox text={out} />
          <CopyBtn text={out} label="Copiar comando gerado" />
        </div>
      )}
    </div>
  );
}

function BlocoPlano7Dias() {
  const dias = [
    { d: "Dia 1", t: "Arrumar promessa", a: "Melhorar headline, CTA e explicação do app." },
    { d: "Dia 2", t: "Chamar 10 pessoas", a: "Enviar mensagem direta para pessoas do público." },
    { d: "Dia 3", t: "Postar dor", a: "Publicar conteúdo mostrando o problema." },
    { d: "Dia 4", t: "Postar solução", a: "Mostrar como o app resolve." },
    { d: "Dia 5", t: "Gravar vídeo curto", a: "Explicar o app em até 30 segundos." },
    { d: "Dia 6", t: "Coletar feedback", a: "Perguntar o que ficou confuso." },
    { d: "Dia 7", t: "Melhorar e repetir", a: "Ajustar mensagem e testar de novo." },
  ];

  const command = `Crie um plano de campanha de 7 dias para divulgar meu app.

App:
[descreva]

Público:
[quem quero alcançar]

Objetivo:
[validar, vender, conseguir leads ou usuários]

Canal principal:
[Instagram, WhatsApp, TikTok, Google, comunidades ou outro]

Entregue:
1. Ação do dia 1
2. Ação do dia 2
3. Ação do dia 3
4. Ação do dia 4
5. Ação do dia 5
6. Ação do dia 6
7. Ação do dia 7
8. Texto pronto para cada dia
9. CTA de cada dia
10. Métrica de cada dia
11. O que fazer se ninguém responder
12. O que fazer se tiver interesse

Regras:
- Ser prático.
- Nada genérico.
- Foco em usuários reais.
- Começar pequeno.`;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-lg">Plano de ação de 7 dias</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Use este plano para tirar o app do silêncio e colocar na frente das primeiras pessoas.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dias.map((d) => (
          <GlassCard key={d.d} className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-accent">{d.d}</p>
            <h4 className="font-semibold mt-1">{d.t}</h4>
            <p className="text-xs text-muted-foreground mt-1">{d.a}</p>
          </GlassCard>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Copie este comando e cole no Lovable.
      </p>
      <CommandBox text={command} />
      <CopyBtn text={command} label="Copiar comando para criar meu plano de 7 dias" />
    </div>
  );
}

function BlocoMetricas() {
  const [m, setM] = useState({
    invest: "",
    clicks: "",
    leads: "",
    sales: "",
    revenue: "",
  });

  const num = (s: string) => {
    const n = parseFloat(s.replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const calc = useMemo(() => {
    const inv = num(m.invest);
    const c = num(m.clicks);
    const l = num(m.leads);
    const s = num(m.sales);
    const r = num(m.revenue);
    return {
      cpc: c > 0 ? inv / c : null,
      clickToLead: c > 0 ? (l / c) * 100 : null,
      leadToSale: l > 0 ? (s / l) * 100 : null,
      cpa: s > 0 ? inv / s : null,
      roas: inv > 0 ? r / inv : null,
      profit: r - inv,
      hasAny: inv + c + l + s + r > 0,
    };
  }, [m]);

  const cards = [
    { t: "Visitantes", d: "Quantas pessoas chegaram na página." },
    { t: "Cliques", d: "Quantas pessoas clicaram no botão principal." },
    { t: "Leads", d: "Quantas pessoas deixaram contato." },
    { t: "Cadastros", d: "Quantas pessoas criaram conta." },
    { t: "Vendas", d: "Quantas pessoas pagaram." },
    { t: "Receita", d: "Total que entrou em dinheiro." },
  ];

  const interp: string[] = [];
  if (calc.cpc !== null && calc.cpc > 5) interp.push("Seu CPC está alto. Teste outro criativo ou outro público.");
  if (calc.clickToLead !== null && calc.clickToLead < 5) interp.push("Poucos cliques viram lead. Melhore promessa e formulário.");
  if (calc.leadToSale !== null && calc.leadToSale < 5) interp.push("Poucos leads viram venda. Revise oferta, preço e prova.");
  if (calc.roas !== null && calc.roas < 1) interp.push("ROAS abaixo de 1: você gastou mais do que recebeu.");
  if (calc.roas !== null && calc.roas >= 2) interp.push("ROAS saudável. Considere testar pequeno aumento de orçamento.");
  if (calc.profit < 0 && num(m.invest) > 0) interp.push("Resultado negativo no momento. Ajuste oferta antes de escalar.");

  const fmtMoney = (v: number | null) =>
    v === null ? "—" : `R$ ${v.toFixed(2).replace(".", ",")}`;
  const fmtPct = (v: number | null) =>
    v === null ? "—" : `${v.toFixed(1)}%`;
  const fmtNum = (v: number | null) =>
    v === null ? "—" : v.toFixed(2);

  const command = `Analise os números da minha campanha e me diga o que melhorar.

App:
[descreva]

Investimento:
${m.invest || "[informe]"}

Cliques:
${m.clicks || "[informe]"}

Leads:
${m.leads || "[informe]"}

Vendas:
${m.sales || "[informe]"}

Receita:
${m.revenue || "[informe]"}

Canal usado:
[informe]

Mensagem usada:
[cole a mensagem]

Criativos usados:
[descreva]

Entregue:
1. Diagnóstico dos números
2. Onde está o maior problema
3. O que melhorar primeiro
4. Nova headline
5. Novo CTA
6. Novo criativo
7. Nova mensagem
8. Próximo teste recomendado
9. Quando pausar
10. Quando escalar

Regras:
- Melhorar uma coisa por vez.
- Explicar de forma simples.
- Não sugerir escalar sem sinal real.`;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-lg">Métricas que importam</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Não acompanhe tudo. Comece olhando poucos números.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c) => (
          <GlassCard key={c.t} className="p-4">
            <h4 className="font-semibold text-sm">{c.t}</h4>
            <p className="text-xs text-muted-foreground mt-1">{c.d}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-5">
        <h4 className="font-semibold text-sm mb-3">Calculadora simples</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Field label="Investimento (R$)" value={m.invest} onChange={(v) => setM({ ...m, invest: v })} placeholder="Ex: 100" />
          <Field label="Cliques" value={m.clicks} onChange={(v) => setM({ ...m, clicks: v })} placeholder="Ex: 250" />
          <Field label="Leads" value={m.leads} onChange={(v) => setM({ ...m, leads: v })} placeholder="Ex: 30" />
          <Field label="Vendas" value={m.sales} onChange={(v) => setM({ ...m, sales: v })} placeholder="Ex: 3" />
          <Field label="Receita (R$)" value={m.revenue} onChange={(v) => setM({ ...m, revenue: v })} placeholder="Ex: 450" />
        </div>

        {!calc.hasAny ? (
          <p className="mt-4 text-xs text-muted-foreground italic">
            Preencha os campos acima para ver seus indicadores.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-sm">
              <Metric label="CPC (custo por clique)" value={fmtMoney(calc.cpc)} />
              <Metric label="Clique → Lead" value={fmtPct(calc.clickToLead)} />
              <Metric label="Lead → Venda" value={fmtPct(calc.leadToSale)} />
              <Metric label="CPA (custo por venda)" value={fmtMoney(calc.cpa)} />
              <Metric label="ROAS" value={fmtNum(calc.roas)} />
              <Metric
                label={calc.profit >= 0 ? "Lucro" : "Prejuízo"}
                value={fmtMoney(Math.abs(calc.profit))}
                positive={calc.profit >= 0}
                negative={calc.profit < 0 && num(m.invest) > 0}
              />
            </div>
            {interp.length > 0 && (
              <ul className="mt-4 space-y-1 text-xs">
                {interp.map((i) => (
                  <li key={i} className="text-amber-300/90">• {i}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </GlassCard>

      <p className="text-xs text-muted-foreground">
        Copie este comando e cole no Lovable.
      </p>
      <CommandBox text={command} />
      <CopyBtn text={command} label="Copiar comando para analisar meus números" full />
    </div>
  );
}

function Metric({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  const color = positive
    ? "text-emerald-300"
    : negative
      ? "text-red-300"
      : "text-foreground";
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-semibold ${color}`}>{value}</p>
    </div>
  );
}

// ===== Bloco Resumo =====

const RESUMO_KEY = "fabrica_apps_campanha_resumo_v1";

type ResumoData = {
  publico: string;
  oferta: string;
  texto: string;
  criativo: string;
  canal: string;
  orcamento: string;
  metrica: string;
  proximoPasso: string;
};

const RESUMO_INITIAL: ResumoData = {
  publico: "",
  oferta: "",
  texto: "",
  criativo: "",
  canal: "",
  orcamento: "",
  metrica: "",
  proximoPasso: "",
};

function useResumo(): [ResumoData, (v: ResumoData | ((p: ResumoData) => ResumoData)) => void] {
  const [data, setData] = useState<ResumoData>(() => {
    try {
      const raw = localStorage.getItem(RESUMO_KEY);
      return raw ? { ...RESUMO_INITIAL, ...JSON.parse(raw) } : RESUMO_INITIAL;
    } catch {
      return RESUMO_INITIAL;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(RESUMO_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);
  return [data, setData];
}

function BlocoResumo() {
  const [d, setD] = useResumo();

  const filled = Object.values(d).filter((v) => v.trim().length > 0).length;
  const total = Object.keys(d).length;

  const exportText = `Campanha pronta

Público-alvo: ${d.publico || "[preencher]"}
Oferta: ${d.oferta || "[preencher]"}
Texto principal do anúncio: ${d.texto || "[preencher]"}
Criativo sugerido: ${d.criativo || "[preencher]"}
Canal recomendado: ${d.canal || "[preencher]"}
Orçamento diário: ${d.orcamento || "[preencher]"}
Métrica principal: ${d.metrica || "[preencher]"}
Próximo passo: ${d.proximoPasso || "[preencher]"}`;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-lg">Campanha pronta</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Reúna aqui as decisões da sua campanha. Tudo fica salvo automaticamente.
        </p>
      </div>

      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
          <span>Preenchimento</span>
          <span>{filled}/{total} ({Math.round((filled / total) * 100)}%)</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${(filled / total) * 100}%` }}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Público-alvo" value={d.publico} onChange={(v) => setD({ ...d, publico: v })} placeholder="Ex: barbeiros autônomos" />
          <Field label="Oferta" value={d.oferta} onChange={(v) => setD({ ...d, oferta: v })} placeholder="Ex: acesso por R$19/mês" />
          <Field label="Texto principal do anúncio" value={d.texto} onChange={(v) => setD({ ...d, texto: v })} placeholder="Headline + CTA" />
          <Field label="Criativo sugerido" value={d.criativo} onChange={(v) => setD({ ...d, criativo: v })} placeholder="Ex: reels de 15s" />
          <Field label="Canal recomendado" value={d.canal} onChange={(v) => setD({ ...d, canal: v })} placeholder="Ex: Instagram" />
          <Field label="Orçamento diário" value={d.orcamento} onChange={(v) => setD({ ...d, orcamento: v })} placeholder="Ex: R$20/dia" />
          <Field label="Métrica principal" value={d.metrica} onChange={(v) => setD({ ...d, metrica: v })} placeholder="Ex: cadastros" />
          <Field label="Próximo passo" value={d.proximoPasso} onChange={(v) => setD({ ...d, proximoPasso: v })} placeholder="Ex: rodar 5 dias e revisar" />
        </div>
      </GlassCard>

      <CommandBox text={exportText} />
      <div className="flex flex-wrap gap-2">
        <CopyBtn text={exportText} label="Copiar campanha pronta" full />
        <button
          onClick={() => {
            if (confirm("Limpar apenas os campos da Campanha pronta? Isso não apaga seu checklist.")) {
              setD(RESUMO_INITIAL);
            }
          }}
          className="px-4 py-2.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-sm"
        >

          Limpar
        </button>
      </div>
    </div>
  );
}


function BlocoMelhorar() {
  const problemas = [
    { p: "Ninguém clicou", c: "Gancho fraco ou público errado.", a: "Teste outra dor ou outro criativo." },
    { p: "Clicaram, mas não cadastraram", c: "Página confusa ou promessa fraca.", a: "Melhore headline e CTA." },
    { p: "Cadastraram, mas não usaram", c: "Onboarding ruim.", a: "Melhore primeira tela." },
    { p: "Usaram, mas não pagaram", c: "Oferta, preço ou valor pouco claro.", a: "Melhore proposta e prova de valor." },
    { p: "Todo mundo achou caro", c: "Valor não foi explicado.", a: "Mostre economia, benefício e transformação." },
  ];

  const command = `Melhore minha campanha com base no problema abaixo.

App:
[descreva]

Problema principal:
[ninguém clicou, clicaram mas não cadastraram, cadastraram mas não usaram, usaram mas não pagaram, acharam caro ou outro]

Canal:
[informe]

Mensagem atual:
[cole aqui]

Página atual:
[descreva ou cole o texto]

Criativo atual:
[descreva]

Números:
[cole os dados]

Entregue:
1. Diagnóstico mais provável
2. O que está impedindo a conversão
3. Nova mensagem
4. Novo criativo
5. Nova headline
6. Novo CTA
7. Mudança na página
8. Novo teste para fazer
9. O que medir
10. Próxima decisão

Regras:
- Não refazer tudo sem necessidade.
- Corrigir o ponto mais provável.
- Priorizar ação rápida.
- Explicar de forma simples.`;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading font-semibold text-lg">Se a campanha não vendeu</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Não significa que o app é ruim. Pode ser problema de público, mensagem, página, criativo ou preço.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {problemas.map((x) => (
          <GlassCard key={x.p} className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" />
              <h4 className="font-semibold text-sm">{x.p}</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground/80">Causa provável:</strong> {x.c}
            </p>
            <p className="text-xs">
              <strong className="text-accent">Ação:</strong> {x.a}
            </p>
          </GlassCard>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Copie este comando e cole no Lovable.
      </p>
      <CommandBox text={command} />
      <CopyBtn text={command} label="Copiar comando para melhorar campanha" />
    </div>
  );
}

// ===== Checklist persistente do módulo =====

const CAMPANHAS_CHECK_ITEMS = [
  "Minha promessa está clara",
  "Escolhi um canal principal",
  "Criei uma campanha orgânica",
  "Criei mensagens de WhatsApp ou direct",
  "Criei pelo menos 3 criativos",
  "Criei plano de 7 dias",
  "Chamei 10 pessoas reais",
  "Medi respostas, cliques, leads ou cadastros",
  "Anotei dúvidas e objeções",
  "Melhorei a campanha antes de escalar",
];

function ChecklistCampanhas({
  checklist,
  setChecklist,
}: {
  checklist: Checklist;
  setChecklist: SetChecklist;
}) {
  const phase = "campanhas";
  const done = CAMPANHAS_CHECK_ITEMS.filter(
    (i) => checklist[`${phase}__${i}`],
  ).length;
  const total = CAMPANHAS_CHECK_ITEMS.length;
  const pct = Math.round((done / total) * 100);

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold">Checklist do módulo</h3>
        <span className="text-xs text-muted-foreground">
          {done}/{total} • {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-2">
        {CAMPANHAS_CHECK_ITEMS.map((item) => {
          const key = `${phase}__${item}`;
          const v = !!checklist[key];
          return (
            <li key={item}>
              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition">
                <button
                  type="button"
                  onClick={() =>
                    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  className="shrink-0"
                  aria-label={v ? "Desmarcar" : "Marcar"}
                >
                  {v ? (
                    <CheckCircle2 size={18} className="text-accent" />
                  ) : (
                    <Circle size={18} className="text-muted-foreground" />
                  )}
                </button>
                <span className={`text-sm ${v ? "line-through text-muted-foreground" : ""}`}>
                  {item}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}

// ===== Componente principal =====

export function CampaignsModule({
  checklist,
  setChecklist,
}: {
  checklist: Checklist;
  setChecklist: SetChecklist;
}) {
  const [tab, setTab] = useState<TabId>("diagnostico");

  return (
    <section>
      <header className="mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <Target size={12} /> Central de Vendas e Aquisição
        </span>
        <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
          Central de Vendas e Aquisição
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Use esta etapa para conseguir os primeiros usuários, testar campanhas,
          criar mensagens e descobrir o que realmente vende seu app.
        </p>
      </header>

      <GlassCard className="p-5 mb-5 border-accent/20 bg-accent/5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm sm:text-base font-semibold">
              Crie uma campanha simples, publique rápido e acompanhe os números certos.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Comece pelo Diagnóstico, gere sua campanha e finalize com a aba{" "}
              <strong className="text-accent">Campanha pronta</strong>.
            </p>
          </div>
          <button
            onClick={() => {
              setTab("diagnostico");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn-primary text-sm whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <Rocket size={14} /> Criar minha campanha agora
          </button>
        </div>
      </GlassCard>


      <div className="flex items-start gap-2 mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
        <AlertTriangle size={16} className="text-amber-300 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-100/90">
          <strong>Regra de ouro:</strong> não escale antes de validar. Primeiro
          teste com pouco tráfego e pessoas reais.
        </p>
      </div>

      {/* Abas: dropdown no mobile, pílulas roláveis no desktop */}
      <div className="sm:hidden mb-5">
        <label className="block">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Etapa atual
          </span>
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as TabId)}
            className="mt-1 w-full px-3 py-3 rounded-lg bg-white/5 border border-accent/30 focus:border-accent/60 outline-none text-sm font-semibold"
          >
            {TABS.map((t) => (
              <option key={t.id} value={t.id} className="bg-background">
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-lg text-xs font-medium border transition ${
                isActive
                  ? "border-accent/60 bg-accent/15 text-accent"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mb-8">
        {tab === "diagnostico" && <BlocoDiagnostico />}
        {tab === "gerador" && <BlocoGerador />}
        {tab === "prontas" && <BlocoCampanhasProntas />}
        {tab === "criativos" && <BlocoCriativos />}
        {tab === "plano" && <BlocoPlano7Dias />}
        {tab === "metricas" && <BlocoMetricas />}
        {tab === "melhorar" && <BlocoMelhorar />}
        {tab === "resumo" && <BlocoResumo />}
      </div>


      <ChecklistCampanhas checklist={checklist} setChecklist={setChecklist} />
    </section>
  );
}
