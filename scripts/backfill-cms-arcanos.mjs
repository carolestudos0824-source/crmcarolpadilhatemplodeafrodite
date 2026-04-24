// Backfill canônico dos 78 arcanos no cms_arcanos.
// Fonte de verdade:
//   - Maiores: src/content/arcanos-maiores/index.ts -> EDITORIAL_REGISTRY
//   - Menores: src/content/arcanos-menores/index.ts -> ARCANOS_MENORES
// Estratégia: bundle com esbuild, depois mapeia campos -> SQL UPDATE.

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

// ─── helpers SQL ───
const esc = (s) => (s == null ? "NULL" : "'" + String(s).replace(/'/g, "''") + "'");
const arr = (a) => (!a || a.length === 0 ? "ARRAY[]::text[]" : "ARRAY[" + a.map(esc).join(",") + "]::text[]");

// ─── Régua de completude (10 essenciais) ───
function essentialCount({ essencia, simbolos, luz, sombra, amor, trabalho, espiritualidade, voz, revisao, keywords }) {
  return (
    (essencia ? 1 : 0) + (simbolos ? 1 : 0) + (luz ? 1 : 0) + (sombra ? 1 : 0) +
    (amor ? 1 : 0) + (trabalho ? 1 : 0) + (espiritualidade ? 1 : 0) +
    (voz ? 1 : 0) + (revisao ? 1 : 0) + ((keywords?.length ?? 0) >= 3 ? 1 : 0)
  );
}

// ─── Mapeadores ───
function mapMaior(a) {
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
  const aprofundamento = a.deepDive?.text || null;
  const cabala = a.deepDive?.cabala || null;
  const arquetipos = a.deepDive?.archetype || null;
  const numerologia = a.deepDive?.numerology || null;
  const astrologia = a.deepDive?.astrology || null;
  const elemento = a.deepDive?.element || null;
  const jornada = a.deepDive?.journey || null;
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
    keywords,
    tags: a.tags || [],
  };
}

function mapMenor(c) {
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

  // Keywords derivadas: usa revisaoRapida.palavraChave + arquétipo + naipe
  const naipeKw = { copas: "Emoção", paus: "Ação", espadas: "Mente", ouros: "Matéria" }[c.naipe];
  const keywordsRaw = [r?.palavraChave, c.arquetipo, naipeKw, r?.luz, r?.sombra]
    .filter(Boolean)
    .map((s) => String(s).split(/[,;]/)[0].trim())
    .filter((s) => s.length > 0 && s.length < 40);
  const keywords = Array.from(new Set(keywordsRaw)).slice(0, 5);

  // Posição numérica para a coluna `number`: 1-10 ou 11=pajem, 12=cavaleiro, 13=rainha, 14=rei
  const courtMap = { pajem: 11, cavaleiro: 12, rainha: 13, rei: 14 };
  const number = typeof c.posicao === "number" ? c.posicao : courtMap[c.posicao];

  // Tags úteis
  const tags = [c.naipe, typeof c.posicao === "string" ? "corte" : "numerada"];

  return {
    type: "menor",
    naipe: c.naipe,
    number,
    name: c.nome,
    subtitle: c.subtitulo || null,
    numeral: typeof c.posicao === "number" ? String(c.posicao) : null,
    essencia, simbolos, luz, sombra, amor, trabalho, espiritualidade,
    voz, revisao, aprofundamento, cabala: null, arquetipos,
    numerologia: null, astrologia: null, elemento: null, jornada: null,
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

// ─── Gera SQL ───
const sqlParts = [];
const report = [];

for (const r of records) {
  const filled = essentialCount({
    essencia: r.essencia, simbolos: r.simbolos, luz: r.luz, sombra: r.sombra,
    amor: r.amor, trabalho: r.trabalho, espiritualidade: r.espiritualidade,
    voz: r.voz, revisao: r.revisao, keywords: r.keywords,
  });

  // Status sugerido (o trigger vai aplicar a régua final, mas fixamos aqui também)
  let status = "empty";
  if (filled === 10) status = "published";
  else if (filled >= 6) status = "draft";
  else if (filled >= 1) status = "partial";

  report.push({
    type: r.type, naipe: r.naipe || "-", number: r.number, name: r.name,
    filled, status,
  });

  // Identificador único: type + (naipe se menor) + number
  const naipeWhere = r.naipe ? `AND naipe = '${r.naipe}'::arcano_naipe` : "AND naipe IS NULL";

  sqlParts.push(`
UPDATE public.cms_arcanos SET
  name = ${esc(r.name)},
  subtitle = ${esc(r.subtitle)},
  numeral = ${esc(r.numeral)},
  essencia = ${esc(r.essencia)},
  simbolos_centrais = ${esc(r.simbolos)},
  luz = ${esc(r.luz)},
  sombra = ${esc(r.sombra)},
  amor = ${esc(r.amor)},
  trabalho = ${esc(r.trabalho)},
  espiritualidade = ${esc(r.espiritualidade)},
  voz_do_arcano = ${esc(r.voz)},
  revisao_rapida = ${esc(r.revisao)},
  aprofundamento = ${esc(r.aprofundamento)},
  cabala = ${esc(r.cabala)},
  arquetipos = ${esc(r.arquetipos)},
  numerologia = ${esc(r.numerologia)},
  astrologia = ${esc(r.astrologia)},
  elemento = ${esc(r.elemento)},
  jornada = ${esc(r.jornada)},
  keywords = ${arr(r.keywords)},
  tags = ${arr(r.tags)},
  status = '${status}'::module_status,
  updated_at = now()
WHERE type = '${r.type}'::arcano_type AND number = ${r.number} ${naipeWhere};`);
}

writeFileSync("/tmp/backfill-arcanos.sql", sqlParts.join("\n"));
writeFileSync("/tmp/backfill-arcanos-report.json", JSON.stringify(report, null, 2));

console.log("=== BACKFILL REPORT ===");
console.log(`Total de registros: ${records.length}`);
const byStatus = report.reduce((acc, r) => ((acc[r.status] = (acc[r.status] || 0) + 1), acc), {});
console.log("Por status:", byStatus);
const incompletas = report.filter((r) => r.filled < 10);
console.log(`Incompletas (<10): ${incompletas.length}`);
if (incompletas.length > 0) {
  console.log("Detalhe das incompletas:");
  console.table(incompletas);
}
console.log("SQL: /tmp/backfill-arcanos.sql");
