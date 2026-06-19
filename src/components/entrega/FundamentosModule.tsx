import { BookOpen, Sparkles, Compass, Workflow, ShieldAlert, Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

type Aula = {
  num: number;
  icon: typeof BookOpen;
  title: string;
  subtitle: string;
  paragraphs: string[];
};

const AULAS: Aula[] = [
  {
    num: 1,
    icon: Lightbulb,
    title: "Lovable e Fábrica: a cozinha e a receita",
    subtitle: "O que é cada coisa e por que você precisa das duas.",
    paragraphs: [
      "O Lovable é a ferramenta onde o seu aplicativo nasce. É um site onde você conversa, em português normal, e ele constrói o app para você. Você não precisa saber programar. Você descreve o que quer, ele faz.",
      "A Fábrica de Apps, este programa que você comprou, é o seu mapa. Ela te diz o que pedir ao Lovable, em que ordem, e com quais palavras exatas. Sem o mapa, você ficaria perdida olhando para uma tela em branco sem saber o que falar.",
      "Pensa assim: o Lovable é a cozinha, cheia de equipamento. A Fábrica é a receita, passo a passo, que transforma esse equipamento em um prato pronto. Cozinha sem receita vira bagunça. Receita sem cozinha não sai do papel. Você precisa dos dois, e agora você tem.",
      "Não decore nada. Só entenda: aqui você aprende a usar a cozinha. Nos próximos módulos, você segue a receita.",
    ],
  },
  {
    num: 2,
    icon: Compass,
    title: "Seus primeiros minutos no Lovable",
    subtitle: "Conta criada, projeto aberto, e três palavras para reconhecer.",
    paragraphs: [
      "Vamos abrir o Lovable pela primeira vez. Calma, é mais simples do que parece.",
      "Primeiro, você cria uma conta no site do Lovable, do mesmo jeito que cria conta em qualquer lugar, com seu e-mail. Feito isso, você cria um projeto novo. Um projeto é o seu app. Cada app é um projeto separado.",
      "Quando o projeto abre, você vai ver a tela dividida em duas partes. De um lado, um espaço para você escrever, conversar com o Lovable. É ali que você cola os comandos da Fábrica. Do outro lado, uma prévia, que mostra o seu app tomando forma, ao vivo, conforme você pede as coisas.",
      "Tem três palavras que você vai ver e precisa reconhecer. O chat, ou conversa, é a caixa onde você digita ou cola o que quer, e tudo começa ali. O preview, ou prévia, é a janela que mostra seu app funcionando, e é ali que você vê o resultado aparecer. E publicar é o botão que coloca seu app no ar, disponível para o mundo, que você só clica quando estiver pronta. No começo, você só constrói e olha a prévia.",
      "Não precisa entender mais nada agora. Conta criada, projeto aberto, e você sabe onde conversar e onde olhar. Isso basta para começar.",
    ],
  },
  {
    num: 3,
    icon: Sparkles,
    title: "Como o Lovable pensa, e a regra de ouro",
    subtitle: "Se você guardar só uma coisa deste módulo, guarde esta.",
    paragraphs: [
      "Aqui está a aula mais importante de todas. Se você guardar só uma coisa, guarde esta.",
      "O Lovable constrói conversando. Você pede, ele faz. Mas ele tem um jeito de trabalhar, e quem respeita esse jeito tem resultado. Quem ignora, sofre.",
      "A regra de ouro é: um pedido de cada vez.",
      "A tentação de quem está começando é colar um pedido gigante, como \"cria um app de tarô com login, pagamento, página de venda e dez telas\". O Lovable se perde, mistura tudo, faz metade errado, e você não sabe nem por onde começar a consertar. É como pedir para um cozinheiro fazer dez pratos ao mesmo tempo. Sai tudo queimado.",
      "O jeito certo é pedir uma coisa, esperar ele terminar, olhar a prévia para conferir se ficou bom, e só então pedir a próxima. Devagar e firme. Cada passo confirmado antes do próximo.",
      "É exatamente por isso que a Fábrica te dá os comandos separados, um por vez. Não é frescura. É o jeito que funciona. Quando você seguir a Fábrica, você já está seguindo a regra de ouro sem perceber.",
      "Outra coisa: seja clara. O Lovable é bom, mas não adivinha. Quanto mais específico o pedido, melhor o resultado. Os comandos da Fábrica já vêm prontos e específicos, então no começo é só colar. Com o tempo, você aprende a pedir suas próprias coisas com essa mesma clareza.",
    ],
  },
  {
    num: 4,
    icon: Workflow,
    title: "A dança entre a Fábrica e o Lovable",
    subtitle: "O fluxo do dia a dia em quatro passos que se repetem.",
    paragraphs: [
      "Agora junte tudo. Como, na prática, você usa este programa junto com o Lovable, no dia a dia.",
      "O fluxo é uma dança de quatro passos que se repete. Primeiro, você vem para a Fábrica e pega o comando da vez, pois cada módulo aqui te dá os comandos na ordem certa. Segundo, você copia esse comando e cola no chat do Lovable, naquela caixa de conversa, aperta enviar e espera o Lovable trabalhar, deixando ele terminar sem interromper. Terceiro, você olha a prévia e confere se o que ele fez bate com o que o comando pedia, e na maioria das vezes vai estar certo. Quarto, você volta para a Fábrica e marca aquele comando como feito.",
      "Seu progresso fica salvo na sua conta, então pode marcar com tranquilidade, ele não se perde. E aí você pega o próximo comando, e a dança recomeça.",
      "É só isso. Pega, cola, confere, marca. Pega, cola, confere, marca. Quando você pega o ritmo, vira automático, e o app vai crescendo na sua frente, um pedaço de cada vez.",
    ],
  },
  {
    num: 5,
    icon: ShieldAlert,
    title: "Quando o Lovable erra, e ele vai errar",
    subtitle: "Três regras para não entrar em pânico, e a sua rede de proteção.",
    paragraphs: [
      "Última aula, e talvez a que mais vai te salvar de desistir.",
      "O Lovable erra, e isso é normal. Toda ferramenta que constrói por conta própria, às vezes, entende errado, faz algo torto, ou quebra alguma coisa que estava funcionando. Não é culpa sua. Não é sinal de que você fez algo errado. Faz parte.",
      "A diferença entre quem desiste e quem termina não é não cometer erros. É saber o que fazer quando eles aparecem.",
      "A primeira regra é não entrar em pânico e não sair clicando em tudo. Respira. O erro quase sempre tem conserto.",
      "A segunda regra é que você conserta conversando, do mesmo jeito que constrói. Você diz ao Lovable o que deu errado, por exemplo \"a tela tal parou de funcionar depois da última mudança, por favor conserte\" ou \"isso não ficou como eu pedi, refaça assim\". Ele entende e ajusta.",
      "A terceira regra, a mais importante de segurança, é que o Lovable guarda um histórico de versões do seu projeto. É como um botão de voltar no tempo. Se algo der muito errado, você consegue voltar para uma versão de antes, quando estava funcionando. Procure por essa função de histórico assim que puder, porque ela é a sua rede de proteção. Saber que ela existe já te deixa mais tranquila para experimentar sem medo.",
      "A Fábrica te ajuda aqui também, pois tem um módulo inteiro chamado Erros comuns, com os problemas que mais aparecem e o comando pronto para corrigir cada um. Quando travar, é o primeiro lugar para olhar.",
      "Errar não é o fim. É só mais um passo da construção. Quem entende isso, termina o app.",
    ],
  },
];

export function FundamentosModule() {
  return (
    <section>
      <header className="mb-6">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
          <BookOpen size={12} /> Comece pelo Lovable
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-2">
          Entenda o Lovable antes de construir
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Cinco aulas curtas para você saber onde está pisando. Leia na ordem, sem pressa.
          Depois daqui, é seguir a Fábrica.
        </p>
      </header>

      <div className="space-y-5">
        {AULAS.map((aula) => {
          const Icon = aula.icon;
          return (
            <GlassCard key={aula.num} className="p-5 md:p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-accent/80 mb-1">
                    Aula {aula.num}
                  </div>
                  <h2 className="text-lg md:text-xl font-heading font-bold leading-tight">
                    {aula.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {aula.subtitle}
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-[15px] leading-relaxed text-foreground/90">
                {aula.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
        <strong className="block mb-1">Pronta para começar?</strong>
        Agora siga para o módulo <em>Comece aqui</em> e dê o primeiro passo da jornada.
      </div>
    </section>
  );
}
