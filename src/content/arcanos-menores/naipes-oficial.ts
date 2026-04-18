/**
 * NAIPES OFICIAIS — Definição canônica dos 4 pilares dos Arcanos Menores.
 *
 * Esta é a fonte de verdade para identidade, simbolismo, pedagogia e
 * comportamento visual de cada naipe. Admin, jornada, lições e quizzes
 * devem consumir este arquivo para garantir coerência total.
 */

import type { Naipe } from "./index";

export interface NaipeOficial {
  id: Naipe;
  /** Nome canônico exibido */
  nome: string;
  /** Subtítulo elemental */
  subtitulo: string;
  /** Elemento clássico */
  elemento: "Água" | "Fogo" | "Ar" | "Terra";
  /** Símbolo alquímico do elemento */
  simboloElemento: string;
  /** Ícone curto (emoji) usado em UI */
  icone: string;

  // ─── Identidade simbólica ───
  /** 5 palavras-âncora que definem o naipe */
  palavrasAncora: [string, string, string, string, string];
  /** Frase de abertura poética */
  fraseAbertura: string;

  // ─── Os 6 pilares editoriais ───
  /** Essência: o que o naipe é, em uma frase densa */
  essencia: string;
  /** Atmosfera: a temperatura emocional/sensorial que ele evoca */
  atmosfera: string;
  /** Função na leitura: o que ele responde quando aparece */
  funcaoNaLeitura: string;
  /** Desafios: a sombra estrutural do naipe */
  desafios: string;
  /** Potencial: o que o naipe oferece quando bem integrado */
  potencial: string;
  /** Linguagem editorial: o tom que TODO conteúdo do naipe deve seguir */
  linguagemEditorial: string;

  // ─── Comportamento visual no sistema ───
  visual: {
    /** Cor primária HSL (string) — usada em badges, bordas, acentos */
    primary: string;
    /** Superfície de fundo suave para cards do naipe */
    surface: string;
    /** Borda translúcida do naipe */
    border: string;
    /** Cor de texto contrastada para uso sobre primary */
    onPrimary: string;
    /** Gradiente assinatura do naipe */
    gradient: string;
    /** Sombra/glow temático */
    glow: string;
    /** Estilo de animação sugerido para revelar cartas do naipe */
    motionStyle:
      | "fluido-ondulante"     // Copas — entra como onda
      | "centelha-rapida"      // Paus — entra como faísca
      | "corte-preciso"        // Espadas — entra com corte limpo
      | "assentamento-solido"; // Ouros — entra como peso que pousa
  };
}

export const NAIPES_OFICIAIS: Record<Naipe, NaipeOficial> = {
  // ═══════════════════════════════════════════════════════════════
  // COPAS — Água
  // ═══════════════════════════════════════════════════════════════
  copas: {
    id: "copas",
    nome: "Copas",
    subtitulo: "O Naipe da Água",
    elemento: "Água",
    simboloElemento: "🜄",
    icone: "💧",
    palavrasAncora: ["Emoção", "Vínculo", "Sensibilidade", "Afeto", "Imaginação"],
    fraseAbertura: "Onde há água, há sentimento. Onde há sentimento, há vida.",

    essencia:
      "Copas é a vida interior em movimento — tudo que se sente, se sonha, se vincula e se imagina. É o naipe do coração receptivo, do cálice que se enche pelo que toca.",
    atmosfera:
      "Suave, fluida, úmida, íntima. Carrega a temperatura morna do banho, a luz baixa do entardecer, o som distante da água. Convida ao recolhimento e à entrega.",
    funcaoNaLeitura:
      "Copas responde à pergunta 'o que se sente?'. Revela a textura emocional da situação, o estado dos vínculos e a verdade do coração — mesmo quando a mente tenta disfarçar.",
    desafios:
      "Idealização, dependência afetiva, sentimentalismo, fuga da realidade pela fantasia, dificuldade de pôr limites, dissolução de si no outro.",
    potencial:
      "Empatia profunda, intuição confiável, capacidade de amar sem se perder, criatividade artística, cura emocional, conexão espiritual pelo sentimento.",
    linguagemEditorial:
      "Tom poético, sensorial, íntimo. Frases que respiram, imagens líquidas, vocabulário do coração e dos sonhos. Evitar dureza analítica — o leitor precisa sentir antes de entender.",

    visual: {
      primary: "200 60% 45%",
      surface: "200 40% 95%",
      border: "200 50% 70% / 0.35",
      onPrimary: "200 40% 98%",
      gradient: "linear-gradient(135deg, hsl(200 60% 45%), hsl(220 55% 55%))",
      glow: "0 0 40px hsl(200 60% 45% / 0.35)",
      motionStyle: "fluido-ondulante",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // PAUS — Fogo
  // ═══════════════════════════════════════════════════════════════
  paus: {
    id: "paus",
    nome: "Paus",
    subtitulo: "O Naipe do Fogo",
    elemento: "Fogo",
    simboloElemento: "🜂",
    icone: "🔥",
    palavrasAncora: ["Ação", "Impulso", "Desejo", "Expansão", "Energia criadora"],
    fraseAbertura: "Onde há fogo, há vontade. Onde há vontade, há criação.",

    essencia:
      "Paus é a centelha que se torna chama — o impulso vital que move o ser para fora de si para criar, conquistar e transformar. É o naipe da vontade encarnada.",
    atmosfera:
      "Quente, viva, pulsante, expansiva. Cheira a madeira queimando, brilha como fagulha. Carrega urgência, entusiasmo e a inquietação de quem precisa fazer.",
    funcaoNaLeitura:
      "Paus responde à pergunta 'o que se faz?'. Revela onde a energia está fluindo, qual desejo está pedindo ação e que projeto pede coragem para começar ou continuar.",
    desafios:
      "Impulsividade, agressividade, esgotamento, ego inflado, ação sem direção, queima rápida que não sustenta. O fogo sem disciplina destrói a própria mão que o segura.",
    potencial:
      "Coragem criativa, liderança inspiradora, persistência apaixonada, capacidade de iniciar ciclos, transformação corajosa de visão em realidade.",
    linguagemEditorial:
      "Tom direto, vibrante, encorajador. Verbos no imperativo, frases curtas que chamam à ação. Energia, paixão e clareza de propósito — sem rodeios, sem amenização.",

    visual: {
      primary: "15 70% 50%",
      surface: "15 50% 96%",
      border: "15 60% 65% / 0.35",
      onPrimary: "15 40% 98%",
      gradient: "linear-gradient(135deg, hsl(15 70% 50%), hsl(35 80% 55%))",
      glow: "0 0 40px hsl(15 70% 50% / 0.4)",
      motionStyle: "centelha-rapida",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // ESPADAS — Ar
  // ═══════════════════════════════════════════════════════════════
  espadas: {
    id: "espadas",
    nome: "Espadas",
    subtitulo: "O Naipe do Ar",
    elemento: "Ar",
    simboloElemento: "🜁",
    icone: "⚔️",
    palavrasAncora: ["Mente", "Conflito", "Decisão", "Lucidez", "Corte"],
    fraseAbertura: "Onde há clareza, há corte. Onde há corte, há verdade.",

    essencia:
      "Espadas é a lâmina da consciência — a mente que distingue, decide e diz a verdade, mesmo quando dói. É o naipe do pensamento que liberta ao cortar a ilusão.",
    atmosfera:
      "Fria, alta, cortante, lúcida. Tem o silêncio do ar rarefeito de montanha, a luz dura do meio-dia, o brilho metálico da lâmina. Convida ao discernimento, não ao conforto.",
    funcaoNaLeitura:
      "Espadas responde à pergunta 'o que se pensa?'. Revela a verdade que se evita, a decisão que se adia, o conflito que pede nome e a clareza que precisa ser conquistada.",
    desafios:
      "Ansiedade, ruminação, autocrítica destrutiva, paralisia por análise, palavras que ferem, frieza emocional, mente que vira inimiga de si mesma.",
    potencial:
      "Discernimento afiado, comunicação honesta, justiça lúcida, capacidade de cortar o que não serve, coragem intelectual, verdade que liberta.",
    linguagemEditorial:
      "Tom preciso, direto, articulado. Frases bem construídas, vocabulário exato, sem ornamento desnecessário. A clareza é a estética. Honestidade acima de gentileza performática.",

    visual: {
      primary: "210 40% 50%",
      surface: "210 25% 95%",
      border: "210 35% 65% / 0.35",
      onPrimary: "210 30% 98%",
      gradient: "linear-gradient(135deg, hsl(210 40% 50%), hsl(230 35% 60%))",
      glow: "0 0 40px hsl(210 40% 50% / 0.3)",
      motionStyle: "corte-preciso",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // OUROS — Terra
  // ═══════════════════════════════════════════════════════════════
  ouros: {
    id: "ouros",
    nome: "Ouros",
    subtitulo: "O Naipe da Terra",
    elemento: "Terra",
    simboloElemento: "🜃",
    icone: "💎",
    palavrasAncora: ["Matéria", "Corpo", "Trabalho", "Segurança", "Concretização"],
    fraseAbertura: "Onde há raiz, há sustento. Onde há sustento, há florescer.",

    essencia:
      "Ouros é o sagrado encarnado na matéria — o corpo, a casa, o ofício, a moeda, a colheita. É o naipe que ensina que espírito sem chão é vapor, e chão bem cuidado é altar.",
    atmosfera:
      "Densa, quente como sol em pedra, fértil. Cheira a terra molhada, a pão assado, a madeira trabalhada. Carrega a paciência do que cresce devagar e a solidez do que dura.",
    funcaoNaLeitura:
      "Ouros responde à pergunta 'o que se constrói?'. Revela o estado das bases concretas — corpo, dinheiro, trabalho, casa — e mostra onde investir esforço e cuidado material.",
    desafios:
      "Apego material, ganância, rigidez, estagnação, identidade colada ao ter, negligência com o corpo, medo crônico de escassez, lentidão que vira inércia.",
    potencial:
      "Prosperidade sustentável, maestria no ofício, saúde encarnada, generosidade abundante, espiritualidade aterrada, legado construído com paciência.",
    linguagemEditorial:
      "Tom calmo, concreto, paciente. Vocabulário do tangível — peso, textura, raiz, fruto, ferramenta. Frases que pousam, sem pressa. Sabedoria sem misticismo etéreo.",

    visual: {
      primary: "45 65% 45%",
      surface: "45 45% 96%",
      border: "45 55% 60% / 0.35",
      onPrimary: "45 40% 15%",
      gradient: "linear-gradient(135deg, hsl(45 65% 45%), hsl(30 60% 50%))",
      glow: "0 0 40px hsl(45 65% 45% / 0.35)",
      motionStyle: "assentamento-solido",
    },
  },
};

// ─── API canônica ───

/** Retorna a definição oficial de um naipe */
export function getNaipeOficial(naipe: Naipe): NaipeOficial {
  return NAIPES_OFICIAIS[naipe];
}

/** Retorna todos os naipes na ordem canônica: Copas → Paus → Espadas → Ouros */
export function getAllNaipesOficiais(): NaipeOficial[] {
  return ["copas", "paus", "espadas", "ouros"].map((n) => NAIPES_OFICIAIS[n as Naipe]);
}

/** Helper para usar a cor primária do naipe em estilos inline (`hsl(var)`) */
export function naipeHsl(naipe: Naipe, token: keyof NaipeOficial["visual"] = "primary"): string {
  const v = NAIPES_OFICIAIS[naipe].visual[token];
  return typeof v === "string" && !v.startsWith("linear-") && !v.startsWith("0 ")
    ? `hsl(${v})`
    : v;
}
