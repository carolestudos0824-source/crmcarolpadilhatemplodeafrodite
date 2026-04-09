export interface LessonSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  accent?: "gold" | "wine" | "plum";
}

export const FOOL_VOICE_TEXT = `Eu sou o Louco.
Sou o primeiro passo antes da certeza.
Sou o impulso que nasce antes da garantia.
Em mim existe liberdade, abertura, risco e movimento.
Eu apareço quando a vida pede travessia.
Na minha luz, eu trago coragem, espontaneidade e começo.
Na minha sombra, eu viro imprudência, fuga e instabilidade.
Eu não prometo segurança.
Eu ensino o salto.`;

export const FOOL_LESSON_SECTIONS: LessonSection[] = [
  {
    id: "essencia",
    title: "Essência",
    icon: "✦",
    content:
      "O Louco é o Arcano Zero — o vazio fértil, o potencial puro antes de qualquer manifestação. Ele não é o início; é a coragem de iniciar. É o sopro antes da primeira palavra, o passo antes do caminho existir. Carrega consigo a energia da possibilidade infinita, do momento em que tudo ainda pode ser. Quando o Louco aparece, ele convida a soltar o controle e confiar no desconhecido.",
  },
  {
    id: "simbolos",
    title: "Símbolos Centrais",
    icon: "◎",
    content:
      "A trouxa sobre o ombro representa o karma — experiências que carregamos sem consciência. O cachorro branco pode ser guia instintivo ou advertência. O precipício não é queda: é fé. As montanhas ao fundo são os desafios superados ou os que virão. A rosa branca na mão simboliza pureza e apreciação pela beleza. O sol dourado ao fundo ilumina sem revelar o caminho — é a confiança cósmica.",
  },
  {
    id: "luz",
    title: "Luz",
    icon: "☀",
    accent: "gold",
    content:
      "Na luz, o Louco é coragem para começar, espontaneidade genuína, fé no processo e desapego saudável. É o salto de fé que você dá quando decide mudar de vida, declarar amor sem garantias, recomeçar sem mapa. Quando encontrado na luz, indica prontidão para o novo — sem precisar saber exatamente o destino. Ele é a criança interior que ainda acredita na magia do caminho.",
  },
  {
    id: "sombra",
    title: "Sombra",
    icon: "☾",
    accent: "plum",
    content:
      "Na sombra, o Louco se torna imprudência disfarçada de coragem, fuga travestida de liberdade, irresponsabilidade fingindo espontaneidade. É pular de projeto em projeto sem terminar nenhum, evitar compromissos usando a desculpa da liberdade, ignorar consequências reais. Na sombra, ele pergunta: você está sendo livre ou está fugindo?",
  },
  {
    id: "licao",
    title: "Lição Iniciática",
    icon: "⟡",
    content:
      "A lição do Louco é aprender que a jornada importa mais do que o destino. Ele nos ensina que todo grande mestre já foi aprendiz, que todo caminho começa com um passo incerto, e que a sabedoria não é a ausência de risco, mas a capacidade de caminhar com o risco. O Louco nos convida a abandonar o controle excessivo e permitir que a vida nos surpreenda.",
  },
  {
    id: "amor",
    title: "O Louco no Amor",
    icon: "♡",
    accent: "wine",
    content:
      "No amor, o Louco indica começos emocionantes, paixão espontânea e abertura para o inesperado. Pode representar um novo relacionamento que chega sem aviso, uma fase de redescoberta a dois, ou a coragem de se declarar sem saber a resposta. Na sombra amorosa, avisa sobre idealização excessiva, relações sem profundidade ou medo de compromisso real.",
  },
  {
    id: "trabalho",
    title: "O Louco no Trabalho",
    icon: "◈",
    content:
      "No trabalho, o Louco fala de novos projetos, mudanças de carreira, empreendedorismo e ideias fora da caixa. É a energia de quem decide largar o emprego seguro para seguir um chamado interior. Na sombra profissional, alerta sobre planos sem estrutura, riscos mal calculados ou falta de comprometimento com o processo.",
  },
  {
    id: "espiritualidade",
    title: "O Louco na Espiritualidade",
    icon: "❋",
    content:
      "Na espiritualidade, o Louco é o buscador eterno — aquele que não se prende a dogmas e está sempre aberto a novas formas de conexão com o sagrado. Ele representa o início de uma jornada espiritual, o despertar da curiosidade mística e a disposição para explorar o desconhecido interior. Na Cabala, corresponde à letra Aleph (א), o sopro silencioso entre Keter e Chokmah.",
  },
];
