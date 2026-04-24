// Backfill EDITORIAL TOTAL (17/17) dos 78 arcanos no cms_arcanos.
// Cobertura completa: 8 essenciais + 9 não-essenciais que compõem o contador 17/17 do admin.
// Campos não-essenciais cobertos: aprofundamento, arquetipos, numerologia, astrologia,
// elemento, cabala, jornada, pratica, citacao.
//
// Estratégia:
//   - Maiores: derivar de EDITORIAL_REGISTRY (archetype, deepDive.cabala, voice.intro,
//     reflectionQuestions[].question, initiationLesson) + tabelas canônicas RWS/Golden Dawn.
//   - Menores: derivar de ARCANOS_MENORES (arquetipo, aprofundamento, vozDaCarta, licaoPratica)
//     + tabelas canônicas por naipe/posição.

import { build } from "esbuild";
import { writeFileSync } from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT_MAIORES = "/tmp/_maiores.mjs";
const OUT_MENORES = "/tmp/_menores.mjs";

const common = {
  bundle: true,
  format: "esm",
  platform: "node",
  alias: { "@": path.join(ROOT, "src") },
  loader: { ".jpg": "text", ".png": "text", ".svg": "text", ".webp": "text" },
  logLevel: "error",
};

await build({ ...common, entryPoints: [path.join(ROOT, "src/content/arcanos-maiores/index.ts")], outfile: OUT_MAIORES });
await build({ ...common, entryPoints: [path.join(ROOT, "src/content/arcanos-menores/index.ts")], outfile: OUT_MENORES });

const maioresMod = await import(OUT_MAIORES);
const menoresMod = await import(OUT_MENORES);
const REG_MAIORES = maioresMod.EDITORIAL_REGISTRY;
const ARCANOS_MENORES = menoresMod.ARCANOS_MENORES;

// ─── Tabelas canônicas RWS / Golden Dawn ───
// Maiores: astrologia + elemento + jornada (tradição Golden Dawn / RWS)
const MAIORES_CANON = {
  0:  { astrologia: "Urano (planeta da liberdade e ruptura)", elemento: "Ar (sopro primordial, inocência)", jornada: "Início absoluto — antes do caminho existir, é o salto de fé que abre toda a Jornada do Tolo.", numerologia: "0 — potencial puro, vazio fértil. O número que precede toda manifestação." },
  1:  { astrologia: "Mercúrio (verbo, mediação, comunicação)", elemento: "Ar/Fogo (vontade dirigida)", jornada: "Primeiro despertar — o iniciado descobre que pode agir como canal entre céu e terra.", numerologia: "1 — origem manifestada, vontade que cria. O ponto que abre o universo." },
  2:  { astrologia: "Lua (intuição, mistério, ciclos)", elemento: "Água (espelho silencioso)", jornada: "A pausa intuitiva — depois da ação do Mago, o silêncio que escuta o oculto.", numerologia: "2 — dualidade reveladora, polaridade que gera consciência." },
  3:  { astrologia: "Vênus (amor, fertilidade, beleza)", elemento: "Terra (ventre que gera)", jornada: "A criação concreta — o que foi sonhado pela Sacerdotisa ganha forma fértil.", numerologia: "3 — síntese criativa, o terceiro que nasce da união dos dois." },
  4:  { astrologia: "Áries (estrutura, liderança, poder)", elemento: "Fogo (vontade firme)", jornada: "A ordem é estabelecida — depois da fertilidade, vem a forma estável que sustenta.", numerologia: "4 — estrutura, fundação, os quatro pilares que sustentam o real." },
  5:  { astrologia: "Touro (tradição, transmissão, dogma)", elemento: "Terra (instituição duradoura)", jornada: "O encontro com a tradição — o iniciado recebe os ensinamentos que o precedem.", numerologia: "5 — mediação entre céu e terra, o homem que conecta os mundos." },
  6:  { astrologia: "Gêmeos (escolha, vínculo, dualidade)", elemento: "Ar (decisão consciente)", jornada: "A escolha do coração — o iniciado decide com quem (e a quê) se unirá.", numerologia: "6 — harmonia da união, o equilíbrio entre os opostos que se reconhecem." },
  7:  { astrologia: "Câncer (vontade direcionada, conquista)", elemento: "Água (emoção controlada)", jornada: "A vitória do propósito — o iniciado domina forças opostas e segue adiante.", numerologia: "7 — vitória interior, domínio das polaridades em movimento." },
  8:  { astrologia: "Libra (equilíbrio, justiça, verdade)", elemento: "Ar (discernimento)", jornada: "A medida da alma — antes de avançar, é preciso pesar com verdade o que foi vivido.", numerologia: "8 — equilíbrio cármico, balança que mede causa e consequência." },
  9:  { astrologia: "Virgem (introspecção, sabedoria silenciosa)", elemento: "Terra (recolhimento)", jornada: "O recolhimento do sábio — após a justiça, o iniciado se retira para integrar.", numerologia: "9 — sabedoria que se basta, o solitário que ilumina a si mesmo." },
  10: { astrologia: "Júpiter (ciclos, expansão, destino)", elemento: "Fogo (movimento cósmico)", jornada: "A virada do destino — a roda gira e revela que tudo se move em ciclos.", numerologia: "10 — ciclo completo que recomeça, retorno ao 1 num grau mais alto." },
  11: { astrologia: "Leão (força interior, coragem mansa)", elemento: "Fogo (vitalidade domada)", jornada: "A doma do leão interno — força não é violência: é coragem com ternura.", numerologia: "11 — mestria espiritual, força sutil que amansa o instinto." },
  12: { astrologia: "Netuno (entrega, dissolução, sacrifício)", elemento: "Água (rendição lúcida)", jornada: "A inversão sagrada — o iniciado aceita pendurar-se para enxergar pelo avesso.", numerologia: "12 — pausa iniciática, suspensão fértil antes da transformação." },
  13: { astrologia: "Escorpião (transformação, ciclos profundos)", elemento: "Água (morte e renascimento)", jornada: "A grande passagem — o que precisa morrer morre, para que o novo nasça.", numerologia: "13 — transformação radical, fim que abre passagem para novo ciclo." },
  14: { astrologia: "Sagitário (alquimia, mediação, mistura)", elemento: "Fogo/Água (síntese alquímica)", jornada: "A integração — o iniciado aprende a misturar opostos sem perdê-los.", numerologia: "14 — alquimia das polaridades, equilíbrio em movimento." },
  15: { astrologia: "Capricórnio (matéria, apego, sombra)", elemento: "Terra (densidade material)", jornada: "O encontro com a sombra — o iniciado vê suas correntes e descobre que pode soltá-las.", numerologia: "15 — sombra do 6, união pervertida pelo apego material." },
  16: { astrologia: "Marte (ruptura, choque, libertação)", elemento: "Fogo (raio purificador)", jornada: "A ruptura libertadora — o que era falso desaba para revelar o real.", numerologia: "16 — quebra estrutural, queda da torre que sustentava ilusão." },
  17: { astrologia: "Aquário (esperança, regeneração, futuro)", elemento: "Ar/Água (cura silenciosa)", jornada: "A cura silenciosa — depois do choque, a alma se banha em águas tranquilas.", numerologia: "17 — esperança regeneradora, estrela que guia após a noite." },
  18: { astrologia: "Peixes (inconsciente, sonhos, intuição)", elemento: "Água (profundidade onírica)", jornada: "A travessia noturna — o iniciado caminha por terreno incerto guiado pela intuição.", numerologia: "18 — mistério do inconsciente, profundidade que pede confiança." },
  19: { astrologia: "Sol (consciência plena, vitalidade)", elemento: "Fogo (luz manifestada)", jornada: "O retorno à luz — depois da noite, a consciência clara e a alegria autêntica.", numerologia: "19 — consciência radiante, vitória da luz sobre a confusão." },
  20: { astrologia: "Plutão (despertar coletivo, vocação)", elemento: "Fogo/Ar (chamado interior)", jornada: "O chamado vocacional — o iniciado escuta sua verdade e se levanta para viver.", numerologia: "20 — renascimento, julgamento do que foi e abertura do que virá." },
  21: { astrologia: "Saturno (completude, coroamento, totalidade)", elemento: "Os quatro elementos integrados", jornada: "A integração final — todas as fases vividas se reúnem em dança cósmica.", numerologia: "21 — totalidade, coroamento da Jornada do Tolo." },
};

// Cabala (correspondência letras hebraicas Golden Dawn) — para Maiores que não têm em deepDive
const MAIORES_CABALA_FALLBACK = {
  0:  "Aleph (א) — sopro primordial, o caminho entre Keter e Chokmah.",
  1:  "Beth (ב) — a casa, o caminho entre Keter e Binah.",
  2:  "Gimel (ג) — o camelo que atravessa o deserto, caminho entre Keter e Tiferet.",
  3:  "Daleth (ד) — a porta, caminho entre Chokmah e Binah.",
  4:  "Heh (ה) — a janela, caminho entre Chokmah e Tiferet.",
  5:  "Vav (ו) — o gancho que une, caminho entre Chokmah e Chesed.",
  6:  "Zayin (ז) — a espada que discrimina, caminho entre Binah e Tiferet.",
  7:  "Cheth (ח) — o cercado, caminho entre Binah e Geburah.",
  8:  "Teth (ט) — a serpente da força sutil, caminho entre Chesed e Geburah.",
  9:  "Yod (י) — a mão criadora, caminho entre Chesed e Tiferet.",
  10: "Kaph (כ) — a palma que recebe, caminho entre Chesed e Netzach.",
  11: "Lamed (ל) — o aguilhão que ensina, caminho entre Geburah e Tiferet.",
  12: "Mem (מ) — as águas profundas, caminho entre Geburah e Hod.",
  13: "Nun (נ) — o peixe da transformação, caminho entre Tiferet e Netzach.",
  14: "Samekh (ס) — o suporte que sustenta, caminho entre Tiferet e Yesod.",
  15: "Ayin (ע) — o olho que vê o oculto, caminho entre Tiferet e Hod.",
  16: "Peh (פ) — a boca que rompe o silêncio, caminho entre Netzach e Hod.",
  17: "Tzaddi (צ) — o anzol que pesca a esperança, caminho entre Netzach e Yesod.",
  18: "Qoph (ק) — a nuca, parte oculta da consciência, caminho entre Netzach e Malkuth.",
  19: "Resh (ר) — a cabeça iluminada, caminho entre Hod e Yesod.",
  20: "Shin (ש) — o fogo do espírito, caminho entre Hod e Malkuth.",
  21: "Tav (ת) — o selo da completude, caminho entre Yesod e Malkuth.",
};

// Menores: tabelas canônicas por naipe e por posição
const NAIPE_ELEMENTO = {
  copas: "Água (emoção, intuição, vínculo)",
  paus: "Fogo (vontade, ação, criação)",
  espadas: "Ar (mente, palavra, decisão)",
  ouros: "Terra (matéria, corpo, recurso)",
};

const NAIPE_ASTROLOGIA = {
  copas: "Signos de Água (Câncer, Escorpião, Peixes)",
  paus: "Signos de Fogo (Áries, Leão, Sagitário)",
  espadas: "Signos de Ar (Gêmeos, Libra, Aquário)",
  ouros: "Signos de Terra (Touro, Virgem, Capricórnio)",
};

const NAIPE_CABALA_SEPHIRA = {
  copas: { 1: "Keter em Briah (mundo emocional)", 2: "Chokmah", 3: "Binah", 4: "Chesed", 5: "Geburah", 6: "Tiferet", 7: "Netzach", 8: "Hod", 9: "Yesod", 10: "Malkuth" },
  paus:  { 1: "Keter em Atziluth (mundo arquetípico)", 2: "Chokmah", 3: "Binah", 4: "Chesed", 5: "Geburah", 6: "Tiferet", 7: "Netzach", 8: "Hod", 9: "Yesod", 10: "Malkuth" },
  espadas: { 1: "Keter em Yetzirah (mundo formativo)", 2: "Chokmah", 3: "Binah", 4: "Chesed", 5: "Geburah", 6: "Tiferet", 7: "Netzach", 8: "Hod", 9: "Yesod", 10: "Malkuth" },
  ouros: { 1: "Keter em Assiah (mundo material)", 2: "Chokmah", 3: "Binah", 4: "Chesed", 5: "Geburah", 6: "Tiferet", 7: "Netzach", 8: "Hod", 9: "Yesod", 10: "Malkuth" },
};

const CORTE_CABALA = {
  pajem: "Princesas — Malkuth dentro de cada naipe (manifestação terrena)",
  cavaleiro: "Príncipes — Tiferet em movimento (a ação que atravessa o mundo)",
  rainha: "Rainhas — Binah refletida no naipe (compreensão receptiva)",
  rei: "Reis — Chokmah no naipe (vontade que governa)",
};

const CORTE_ASTROLOGIA_BY_NAIPE = {
  copas: { pajem: "Aspecto aquoso terrestre", cavaleiro: "Aquário–Peixes", rainha: "Gêmeos–Câncer", rei: "Libra–Escorpião" },
  paus:  { pajem: "Aspecto ígneo terrestre", cavaleiro: "Escorpião–Sagitário", rainha: "Peixes–Áries", rei: "Câncer–Leão" },
  espadas: { pajem: "Aspecto aéreo terrestre", cavaleiro: "Touro–Gêmeos", rainha: "Virgem–Libra", rei: "Capricórnio–Aquário" },
  ouros: { pajem: "Aspecto terrestre puro", cavaleiro: "Leão–Virgem", rainha: "Sagitário–Capricórnio", rei: "Áries–Touro" },
};

const NUMEROLOGIA_BY_POSITION = {
  1: "Ás — semente, potencial puro do naipe.",
  2: "Polaridade, escolha, primeira relação.",
  3: "Síntese criativa, o terceiro que nasce da união.",
  4: "Estrutura, estabilidade, fundação.",
  5: "Crise, ruptura, desafio que ensina.",
  6: "Harmonia restaurada, fluxo recuperado.",
  7: "Reflexão, escolha sutil, prova interior.",
  8: "Maestria em movimento, domínio em ação.",
  9: "Plenitude solitária, integração interior.",
  10: "Conclusão de ciclo, transbordamento, abertura para o novo.",
};

const JORNADA_BY_POSITION = {
  1: "Início do ciclo do naipe — a faísca original.",
  2: "Primeira interação — o eu encontra o outro.",
  3: "Manifestação criativa — o sonho ganha forma.",
  4: "Consolidação — o que foi criado pede estrutura.",
  5: "Crise reveladora — algo precisa quebrar para crescer.",
  6: "Reencontro com o equilíbrio — a generosidade volta.",
  7: "Provação interior — o caminho se torna escolha consciente.",
  8: "Domínio prático — o aprendizado vira maestria.",
  9: "Realização interna — a satisfação que não depende do externo.",
  10: "Coroamento e abertura — o ciclo se cumpre e prepara o novo.",
};

const JORNADA_BY_CORTE = {
  pajem: "Aprendiz do naipe — recebe a mensagem, ainda exploratória.",
  cavaleiro: "Mensageiro em movimento — leva a energia do naipe ao mundo.",
  rainha: "Maturidade interior — incorpora o naipe a partir do ser.",
  rei: "Domínio externo — exerce o naipe a partir da autoridade.",
};

const ARCANO_NUMERAL_CORTE = {
  pajem: "Pajem",
  cavaleiro: "Cavaleiro",
  rainha: "Rainha",
  rei: "Rei",
};

// ─── helpers ───
const trim = (s) => (typeof s === "string" ? s.trim() : s);

function essentialCount({ essencia, simbolos, luz, sombra, amor, trabalho, espiritualidade, voz, revisao, keywords }) {
  return (
    (essencia ? 1 : 0) + (simbolos ? 1 : 0) + (luz ? 1 : 0) + (sombra ? 1 : 0) +
    (amor ? 1 : 0) + (trabalho ? 1 : 0) + (espiritualidade ? 1 : 0) +
    (voz ? 1 : 0) + (revisao ? 1 : 0) + ((keywords?.length ?? 0) >= 3 ? 1 : 0)
  );
}

// ─── Mapeadores ───
function mapMaior(a) {
  const canon = MAIORES_CANON[a.number] || {};
  const essencia = a.essence;
  const simbolos = a.symbols?.map((s) => `${s.name}: ${s.meaning}`).join("\n\n") || null;
  const luz = a.light;
  const sombra = a.shadow;
  const amor = a.love ? `Na luz: ${a.love.light}\n\nNa sombra: ${a.love.shadow}` : null;
  const trabalho = a.work ? `Na luz: ${a.work.light}\n\nNa sombra: ${a.work.shadow}` : null;
  const espiritualidade = a.spirituality
    ? `Na luz: ${a.spirituality.light}\n\nNa sombra: ${a.spirituality.shadow}`
    : null;
  const voz = a.voice?.fullText || null;
  const revisao = a.quickReview?.map((q) => `${q.keyword}: ${q.meaning}`).join("\n") || null;

  // Aprofundamento: combina text + symbolism + history (cabala vai à coluna própria)
  const dd = a.deepDive || {};
  const aprofundamentoParts = [dd.text, dd.symbolism, dd.history].filter(Boolean);
  const aprofundamento = aprofundamentoParts.length ? aprofundamentoParts.join("\n\n") : null;

  // Cabala: prefere a do deepDive; senão fallback canônico
  const cabala = dd.cabala || MAIORES_CABALA_FALLBACK[a.number] || null;

  // Arquétipos: do campo archetype; senão deriva do nome
  const arquetipos = a.archetype || `${a.name} — arquétipo central da Jornada do Tolo, posição ${a.number}.`;

  // Numerologia, astrologia, elemento, jornada: tabela canônica
  const numerologia = canon.numerologia || `${a.number} — número central deste arcano.`;
  const astrologia = canon.astrologia || "Correspondência astrológica tradicional Golden Dawn.";
  const elemento = canon.elemento || "Elemento simbólico associado ao arcano.";
  const jornada = canon.jornada || `Etapa ${a.number} da Jornada do Tolo.`;

  // Prática: deriva da lição iniciática + 1ª pergunta de reflexão
  const practiceParts = [];
  if (a.initiationLesson) practiceParts.push(`Lição-prática: ${a.initiationLesson}`);
  if (a.reflectionQuestions?.[0]?.question) practiceParts.push(`Pergunta para journaling: ${a.reflectionQuestions[0].question}`);
  const pratica = practiceParts.length ? practiceParts.join("\n\n") : null;

  // Citação: deriva da voz (intro) ou primeira linha do fullText
  const citacao = a.voice?.intro || (a.voice?.fullText ? a.voice.fullText.split("\n")[0] : null);

  const keywords = a.keywords || [];

  return {
    type: "maior",
    naipe: null,
    number: a.number,
    name: a.name,
    subtitle: a.subtitle || null,
    numeral: a.numeral || null,
    essencia, simbolos, luz, sombra, amor, trabalho, espiritualidade,
    voz, revisao, aprofundamento, cabala, arquetipos, numerologia, astrologia, elemento, jornada,
    pratica, citacao,
    keywords,
    tags: a.tags || [],
  };
}

function mapMenor(c) {
  const naipe = c.naipe;
  const isCorte = typeof c.posicao === "string";
  const essencia = c.essencia || null;
  const simbolos = c.simbolosCentrais || null;
  const luz = c.luz || null;
  const sombra = c.sombra || null;
  const amor = c.interpretacaoAmor || null;
  const trabalho = c.interpretacaoTrabalho || null;
  const espiritualidade = c.interpretacaoEspiritualidade || null;
  const voz = c.vozDaCarta || null;
  const aprofundamento = c.aprofundamento || null;
  const arquetipos = c.arquetipo || null;

  // Revisão rápida → texto consolidado
  const r = c.revisaoRapida;
  const revisao = r && (r.palavraChave || r.luz)
    ? [
        r.palavraChave ? `Palavra-chave: ${r.palavraChave}` : null,
        r.luz ? `Luz: ${r.luz}` : null,
        r.sombra ? `Sombra: ${r.sombra}` : null,
        r.licaoCentral ? `Lição central: ${r.licaoCentral}` : null,
        r.aplicacaoPratica ? `Aplicação prática: ${r.aplicacaoPratica}` : null,
        r.fraseFixacao ? `Frase de fixação: ${r.fraseFixacao}` : null,
      ].filter(Boolean).join("\n")
    : null;

  // Keywords
  const naipeKw = { copas: "Emoção", paus: "Ação", espadas: "Mente", ouros: "Matéria" }[naipe];
  const posicaoKw = !isCorte
    ? ({ 1: "Início", 2: "Equilíbrio", 3: "Expansão", 4: "Estrutura", 5: "Crise", 6: "Harmonia", 7: "Reflexão", 8: "Maestria", 9: "Plenitude", 10: "Conclusão" }[c.posicao])
    : ({ pajem: "Aprendiz", cavaleiro: "Movimento", rainha: "Maturidade", rei: "Domínio" }[c.posicao]);
  const tokens = [
    r?.palavraChave,
    naipeKw,
    posicaoKw,
    ...[r?.luz, r?.sombra, c.arquetipo]
      .filter(Boolean)
      .flatMap((s) => String(s).split(/[\s,;:.\-—]+/))
      .filter((w) => w && w.length >= 4 && w.length < 25 && /^[A-Za-zÀ-ÿ]+$/.test(w))
      .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  ].filter(Boolean);
  const keywords = Array.from(new Set(tokens)).slice(0, 5);

  // Posição numérica
  const courtMap = { pajem: 11, cavaleiro: 12, rainha: 13, rei: 14 };
  const number = !isCorte ? c.posicao : courtMap[c.posicao];

  // Elemento, astrologia (tabelas por naipe)
  const elemento = NAIPE_ELEMENTO[naipe] || null;
  const astrologia = isCorte
    ? `Corte de ${naipe} — ${CORTE_ASTROLOGIA_BY_NAIPE[naipe]?.[c.posicao] || "decanato tradicional Golden Dawn"}`
    : NAIPE_ASTROLOGIA[naipe] || null;

  // Cabala (sephira/mundo)
  const cabala = isCorte
    ? CORTE_CABALA[c.posicao] + ` — ${naipe}`
    : `${NAIPE_CABALA_SEPHIRA[naipe]?.[c.posicao] || "sephira correspondente"} — naipe de ${naipe}`;

  // Numerologia
  const numerologia = isCorte
    ? `Carta de corte — ${ARCANO_NUMERAL_CORTE[c.posicao]} (fora da numerologia 1–10): expressa o arquétipo encarnado.`
    : NUMEROLOGIA_BY_POSITION[c.posicao] + ` Aplicada ao naipe de ${naipe}: o número ${c.posicao} aqui se manifesta como ${naipeKw?.toLowerCase()}.`;

  // Jornada
  const jornada = isCorte
    ? JORNADA_BY_CORTE[c.posicao] + ` Aplicado ao naipe de ${naipe}.`
    : JORNADA_BY_POSITION[c.posicao] + ` Etapa ${c.posicao} do percurso de ${naipe}.`;

  // Prática: deriva de licaoPratica + 1ª pergunta
  const practiceParts = [];
  if (c.licaoPratica) practiceParts.push(`Lição-prática: ${c.licaoPratica}`);
  if (c.perguntasReflexao?.[0]) practiceParts.push(`Pergunta para journaling: ${c.perguntasReflexao[0]}`);
  const pratica = practiceParts.length ? practiceParts.join("\n\n") : null;

  // Citação: deriva de vozDaCarta (1ª frase)
  const citacao = c.vozDaCarta ? c.vozDaCarta.split(/(?<=[.!?])\s+/)[0] : null;

  const tags = [naipe, isCorte ? "corte" : "numerada"];

  return {
    type: "menor",
    naipe,
    number,
    name: c.nome,
    subtitle: c.subtitulo || null,
    numeral: !isCorte ? String(c.posicao) : ARCANO_NUMERAL_CORTE[c.posicao],
    essencia, simbolos, luz, sombra, amor, trabalho, espiritualidade,
    voz, revisao, aprofundamento, cabala, arquetipos,
    numerologia, astrologia, elemento, jornada,
    pratica, citacao,
    keywords,
    tags,
  };
}

// ─── Coleta tudo ───
const records = [];
for (let n = 0; n <= 21; n++) {
  if (REG_MAIORES[n]) records.push(mapMaior(REG_MAIORES[n]));
}
for (const c of ARCANOS_MENORES) {
  if (c.essencia) records.push(mapMenor(c));
}

// ─── Status pelo essencial ───
const report = [];
const payload = [];
for (const r of records) {
  const filled = essentialCount({
    essencia: r.essencia, simbolos: r.simbolos, luz: r.luz, sombra: r.sombra,
    amor: r.amor, trabalho: r.trabalho, espiritualidade: r.espiritualidade,
    voz: r.voz, revisao: r.revisao, keywords: r.keywords,
  });
  let status = "empty";
  if (filled === 10) status = "published";
  else if (filled >= 6) status = "draft";
  else if (filled >= 1) status = "partial";

  // Conta os 17 do contador admin
  const editorial17 = [
    "essencia","simbolos","luz","sombra","amor","trabalho","espiritualidade","voz",
    "aprofundamento","arquetipos","numerologia","astrologia","elemento","cabala","jornada","pratica","citacao",
  ].filter((k) => typeof r[k] === "string" && r[k].trim().length > 0).length;

  report.push({ type: r.type, naipe: r.naipe || "-", number: r.number, name: r.name, essential: filled, editorial17, status });
  payload.push({ ...r, status });
}

writeFileSync("/tmp/backfill-payload-v2.json", JSON.stringify(payload));
writeFileSync("/tmp/backfill-arcanos-report-v2.json", JSON.stringify(report, null, 2));

console.log("=== BACKFILL v2 — 17/17 ===");
console.log(`Total: ${records.length}`);
const byStatus = report.reduce((acc, r) => ((acc[r.status] = (acc[r.status] || 0) + 1), acc), {});
console.log("Por status:", byStatus);
const ed17 = report.reduce((acc, r) => ((acc[r.editorial17] = (acc[r.editorial17] || 0) + 1), acc), {});
console.log("Por editorial 17/17:", ed17);
const incompletas17 = report.filter((r) => r.editorial17 < 17);
console.log(`Incompletas no contador admin (<17): ${incompletas17.length}`);
if (incompletas17.length > 0) console.table(incompletas17.slice(0, 20));
console.log("Payload: /tmp/backfill-payload-v2.json");
