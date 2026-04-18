// Sincroniza os 16 arquivos canônicos src/content/arcanos-maiores/*.ts -> cms_arcanos
// Estratégia: bundle com esbuild para resolver imports/aliases, depois mapeia campos e gera SQL.

import { build } from "esbuild";
import { writeFileSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const ROOT = process.cwd();
const ENTRY = path.join(ROOT, "src/content/arcanos-maiores/index.ts");
const OUT = "/tmp/arcanos-bundle.mjs";

await build({
  entryPoints: [ENTRY],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: OUT,
  alias: { "@": path.join(ROOT, "src") },
  loader: { ".jpg": "text", ".png": "text", ".svg": "text", ".webp": "text" },
  logLevel: "error",
});

const mod = await import(OUT);
const REG = mod.EDITORIAL_REGISTRY;

const TARGETS = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];

function esc(s) {
  if (s == null) return "NULL";
  return "'" + String(s).replace(/'/g, "''") + "'";
}
function arr(a) {
  if (!a || a.length === 0) return "ARRAY[]::text[]";
  return "ARRAY[" + a.map(x => esc(x)).join(",") + "]::text[]";
}

const report = [];
const sqlParts = [];

for (const n of TARGETS) {
  const a = REG[n];
  if (!a) { report.push({ n, ok: false, reason: "missing" }); continue; }

  const essencia = a.essence;
  const simbolos = a.symbols.map(s => `${s.name}: ${s.meaning}`).join("\n\n");
  const luz = a.light;
  const sombra = a.shadow;
  const amor = `Na luz: ${a.love.light}\n\nNa sombra: ${a.love.shadow}`;
  const trabalho = `Na luz: ${a.work.light}\n\nNa sombra: ${a.work.shadow}`;
  const espiritualidade = `Na luz: ${a.spirituality.light}\n\nNa sombra: ${a.spirituality.shadow}`;
  const voz = a.voice.fullText;
  const revisao = a.quickReview.map(q => `${q.keyword}: ${q.meaning}`).join("\n");
  const aprofundamento = a.deepDive?.text || null;
  const cabala = a.deepDive?.cabala || null;
  const keywords = a.keywords || [];

  // Régua: 10 essenciais (essencia, simbolos, luz, sombra, amor, trabalho, espiritualidade, voz, revisao, keywords>=3)
  const filled =
    (essencia ? 1 : 0) + (simbolos ? 1 : 0) + (luz ? 1 : 0) + (sombra ? 1 : 0) +
    (amor ? 1 : 0) + (trabalho ? 1 : 0) + (espiritualidade ? 1 : 0) +
    (voz ? 1 : 0) + (revisao ? 1 : 0) + (keywords.length >= 3 ? 1 : 0);

  const meetsBar = filled >= 6; // régua mínima da função do DB
  const fullBar = filled >= 10; // régua editorial completa

  report.push({ n, name: a.name, filled, meetsBar, fullBar });

  const setStatus = fullBar ? "'published'::module_status, validated = true" : "'draft'::module_status, validated = false";

  sqlParts.push(`
UPDATE public.cms_arcanos SET
  essencia = ${esc(essencia)},
  simbolos_centrais = ${esc(simbolos)},
  luz = ${esc(luz)},
  sombra = ${esc(sombra)},
  amor = ${esc(amor)},
  trabalho = ${esc(trabalho)},
  espiritualidade = ${esc(espiritualidade)},
  voz_do_arcano = ${esc(voz)},
  revisao_rapida = ${esc(revisao)},
  aprofundamento = ${esc(aprofundamento)},
  cabala = ${esc(cabala)},
  keywords = ${arr(keywords)},
  status = ${setStatus},
  updated_at = now()
WHERE type = 'maior' AND number = ${n};`);
}

// Audit log
const summary = report.map(r => `#${r.n} ${r.name}: ${r.filled}/10 ${r.fullBar ? "PUBLICADO" : "rascunho"}`).join(" | ");
sqlParts.push(`
INSERT INTO public.admin_audit_log (admin_id, admin_email, action, target_type, target_label, details)
SELECT
  (SELECT user_id FROM public.user_roles WHERE role = 'admin' ORDER BY id LIMIT 1),
  'system@editorial-sync',
  'arcano.bulk_sync_canonical',
  'arcano',
  'Sincronização canônica dos 16 Maiores premium',
  ${esc(JSON.stringify({ scope: "arcanos-maiores #6-21", report }))}::jsonb
WHERE (SELECT user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1) IS NOT NULL;`);

const sql = sqlParts.join("\n");
writeFileSync("/tmp/sync-arcanos.sql", sql);

console.log("=== REPORT ===");
console.table(report);
console.log("SQL written to /tmp/sync-arcanos.sql");
