// Aplica /tmp/backfill-payload-v2.json no cms_arcanos via SUPABASE_DB_URL.
// Cobre os 17 campos do contador admin (8 essenciais + 9 não-essenciais).

import { readFileSync } from "fs";
import postgres from "postgres";

const PAYLOAD_PATH = "/tmp/backfill-payload-v2.json";
const payload = JSON.parse(readFileSync(PAYLOAD_PATH, "utf8"));

const sql = postgres(process.env.SUPABASE_DB_URL, { max: 1 });

try {
  let updated = 0;
  const missed = [];

  for (const item of payload) {
    const naipeWhere = item.naipe
      ? sql`AND naipe = ${item.naipe}::arcano_naipe`
      : sql`AND naipe IS NULL`;
    const result = await sql`
      UPDATE public.cms_arcanos SET
        name              = COALESCE(${item.name}, name),
        subtitle          = ${item.subtitle},
        numeral           = ${item.numeral},
        essencia          = ${item.essencia},
        simbolos_centrais = ${item.simbolos},
        luz               = ${item.luz},
        sombra            = ${item.sombra},
        amor              = ${item.amor},
        trabalho          = ${item.trabalho},
        espiritualidade   = ${item.espiritualidade},
        voz_do_arcano     = ${item.voz},
        revisao_rapida    = ${item.revisao},
        aprofundamento    = ${item.aprofundamento},
        cabala            = ${item.cabala},
        arquetipos        = ${item.arquetipos},
        numerologia       = ${item.numerologia},
        astrologia        = ${item.astrologia},
        elemento          = ${item.elemento},
        jornada           = ${item.jornada},
        pratica           = ${item.pratica},
        citacao           = ${item.citacao},
        keywords          = ${item.keywords}::text[],
        tags              = ${item.tags}::text[],
        status            = ${item.status}::module_status,
        updated_at        = now()
      WHERE type = ${item.type}::arcano_type
        AND number = ${item.number}
        ${naipeWhere}
    `;
    if (result.count > 0) updated += result.count;
    else missed.push({ type: item.type, naipe: item.naipe, number: item.number, name: item.name });
  }

  console.log(JSON.stringify({ updated, missed_count: missed.length, missing: missed }, null, 2));
} finally {
  await sql.end();
}
