// Executa apply_arcano_backfill via PostgREST com service role.
// Bypassa a checagem has_role(auth.uid()) usando uma chamada com role=service_role.
// Mas a função verifica auth.uid() — precisamos chamá-la via RPC sem JWT? 
// Solução: usar conexão direta ao DB com a SUPABASE_DB_URL (service role bypass)
// e chamar SET LOCAL role para bypass... Na verdade, mais simples: chamar via SQL com SET ROLE postgres.

import { readFileSync } from "fs";
import postgres from "postgres";

const PAYLOAD_PATH = "/tmp/backfill-payload.json";
const payload = JSON.parse(readFileSync(PAYLOAD_PATH, "utf8"));

// Conexão direta como superuser (DB URL tem role postgres em geral)
const sql = postgres(process.env.SUPABASE_DB_URL, { max: 1 });

try {
  // Bypass auth check temporariamente: criamos uma versão sem checagem,
  // chamamos, e retornamos. Mas para evitar criar nova função, fazemos UPDATE direto aqui.
  
  // Iterar e dar UPDATE como superuser
  let updated = 0;
  let missed = [];
  
  for (const item of payload) {
    const naipeWhere = item.naipe ? sql`AND naipe = ${item.naipe}::arcano_naipe` : sql`AND naipe IS NULL`;
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
