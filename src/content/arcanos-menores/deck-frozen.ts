/**
 * FREEZE OFICIAL — Tabela imutável das 56 cartas menores.
 *
 * Esta é a fonte canônica final, congelada como padrão da plataforma.
 * Nenhuma tela (admin, lição, quiz, módulo, mobile) pode usar nome,
 * slug, naipe, posição ou imagem diferentes daqui.
 *
 * Mudar qualquer linha aqui é uma decisão de produto — não de código —
 * e quebra os testes do deck propositalmente.
 *
 * Versão do freeze: 1.0.1 (2026-04-24)
 *
 * Nota 1.0.1: cardImage agora resolve via import Vite, idêntico ao
 * deck-registry.ts. Antes a URL era construída manualmente apontando
 * para /assets/arcanos-menores/* (caminho público inexistente), o que
 * divergia do runtime real e quebrava os testes de integridade.
 */

import type { Naipe, CartaPosicao } from "./index";

// ─── Menores numerados (mesmos assets usados pelo registry) ───
import menorCopas1 from "@/assets/menor-copas-1.jpg";
import menorCopas2 from "@/assets/menor-copas-2.jpg";
import menorCopas3 from "@/assets/menor-copas-3.jpg";
import menorCopas4 from "@/assets/menor-copas-4.jpg";
import menorCopas5 from "@/assets/menor-copas-5.jpg";
import menorCopas6 from "@/assets/menor-copas-6.jpg";
import menorCopas7 from "@/assets/menor-copas-7.jpg";
import menorCopas8 from "@/assets/menor-copas-8.jpg";
import menorCopas9 from "@/assets/menor-copas-9.jpg";
import menorCopas10 from "@/assets/menor-copas-10.jpg";
import menorPaus1 from "@/assets/menor-paus-1.jpg";
import menorPaus2 from "@/assets/menor-paus-2.jpg";
import menorPaus3 from "@/assets/menor-paus-3.jpg";
import menorPaus4 from "@/assets/menor-paus-4.jpg";
import menorPaus5 from "@/assets/menor-paus-5.jpg";
import menorPaus6 from "@/assets/menor-paus-6.jpg";
import menorPaus7 from "@/assets/menor-paus-7.jpg";
import menorPaus8 from "@/assets/menor-paus-8.jpg";
import menorPaus9 from "@/assets/menor-paus-9.jpg";
import menorPaus10 from "@/assets/menor-paus-10.jpg";
import menorEspadas1 from "@/assets/menor-espadas-1.jpg";
import menorEspadas2 from "@/assets/menor-espadas-2.jpg";
import menorEspadas3 from "@/assets/menor-espadas-3.jpg";
import menorEspadas4 from "@/assets/menor-espadas-4.jpg";
import menorEspadas5 from "@/assets/menor-espadas-5.jpg";
import menorEspadas6 from "@/assets/menor-espadas-6.jpg";
import menorEspadas7 from "@/assets/menor-espadas-7.jpg";
import menorEspadas8 from "@/assets/menor-espadas-8.jpg";
import menorEspadas9 from "@/assets/menor-espadas-9.jpg";
import menorEspadas10 from "@/assets/menor-espadas-10.jpg";
import menorOuros1 from "@/assets/menor-ouros-1.jpg";
import menorOuros2 from "@/assets/menor-ouros-2.jpg";
import menorOuros3 from "@/assets/menor-ouros-3.jpg";
import menorOuros4 from "@/assets/menor-ouros-4.jpg";
import menorOuros5 from "@/assets/menor-ouros-5.jpg";
import menorOuros6 from "@/assets/menor-ouros-6.jpg";
import menorOuros7 from "@/assets/menor-ouros-7.jpg";
import menorOuros8 from "@/assets/menor-ouros-8.jpg";
import menorOuros9 from "@/assets/menor-ouros-9.jpg";
import menorOuros10 from "@/assets/menor-ouros-10.jpg";

// ─── Cortes (mesmos assets usados pelo registry) ───
import corteCopasPajem from "@/assets/menor-copas-pajem.jpg";
import corteCopasCavaleiro from "@/assets/menor-copas-cavaleiro.jpg";
import corteCopasRainha from "@/assets/menor-copas-rainha.jpg";
import corteCopasRei from "@/assets/menor-copas-rei.jpg";
import cortePausPajem from "@/assets/menor-paus-pajem.jpg";
import cortePausCavaleiro from "@/assets/menor-paus-cavaleiro.jpg";
import cortePausRainha from "@/assets/menor-paus-rainha.jpg";
import cortePausRei from "@/assets/menor-paus-rei.jpg";
import corteEspadasPajem from "@/assets/menor-espadas-pajem.jpg";
import corteEspadasCavaleiro from "@/assets/menor-espadas-cavaleiro.jpg";
import corteEspadasRainha from "@/assets/menor-espadas-rainha.jpg";
import corteEspadasRei from "@/assets/menor-espadas-rei.jpg";
import corteOurosPajem from "@/assets/menor-ouros-pajem.jpg";
import corteOurosCavaleiro from "@/assets/menor-ouros-cavaleiro.jpg";
import corteOurosRainha from "@/assets/menor-ouros-rainha.jpg";
import corteOurosRei from "@/assets/menor-ouros-rei.jpg";

export interface FrozenCard {
  readonly id: string;        // canônico: "{naipe}-{posicao}"
  readonly nome: string;       // exibição em PT-BR
  readonly slug: string;       // URL-safe
  readonly naipe: Naipe;
  readonly posicao: CartaPosicao;
  readonly cardImage: string;  // resolvido via Vite — idêntico ao registry
}

const card = (
  naipe: Naipe,
  posicao: CartaPosicao,
  nome: string,
  slug: string,
  cardImage: string,
): FrozenCard => Object.freeze({
  id: `${naipe}-${posicao}`,
  nome,
  slug,
  naipe,
  posicao,
  cardImage,
});

/** 56 cartas oficiais, ordem canônica: Copas → Paus → Espadas → Ouros, Ás → Rei. */
export const FROZEN_DECK: readonly FrozenCard[] = Object.freeze([
  // ── COPAS ──────────────────────────────────────────────
  card("copas", 1, "Ás de Copas", "as-de-copas", menorCopas1),
  card("copas", 2, "Dois de Copas", "dois-de-copas", menorCopas2),
  card("copas", 3, "Três de Copas", "tres-de-copas", menorCopas3),
  card("copas", 4, "Quatro de Copas", "quatro-de-copas", menorCopas4),
  card("copas", 5, "Cinco de Copas", "cinco-de-copas", menorCopas5),
  card("copas", 6, "Seis de Copas", "seis-de-copas", menorCopas6),
  card("copas", 7, "Sete de Copas", "sete-de-copas", menorCopas7),
  card("copas", 8, "Oito de Copas", "oito-de-copas", menorCopas8),
  card("copas", 9, "Nove de Copas", "nove-de-copas", menorCopas9),
  card("copas", 10, "Dez de Copas", "dez-de-copas", menorCopas10),
  card("copas", "pajem", "Pajem de Copas", "pajem-de-copas", corteCopasPajem),
  card("copas", "cavaleiro", "Cavaleiro de Copas", "cavaleiro-de-copas", corteCopasCavaleiro),
  card("copas", "rainha", "Rainha de Copas", "rainha-de-copas", corteCopasRainha),
  card("copas", "rei", "Rei de Copas", "rei-de-copas", corteCopasRei),
  // ── PAUS ───────────────────────────────────────────────
  card("paus", 1, "Ás de Paus", "as-de-paus", menorPaus1),
  card("paus", 2, "Dois de Paus", "dois-de-paus", menorPaus2),
  card("paus", 3, "Três de Paus", "tres-de-paus", menorPaus3),
  card("paus", 4, "Quatro de Paus", "quatro-de-paus", menorPaus4),
  card("paus", 5, "Cinco de Paus", "cinco-de-paus", menorPaus5),
  card("paus", 6, "Seis de Paus", "seis-de-paus", menorPaus6),
  card("paus", 7, "Sete de Paus", "sete-de-paus", menorPaus7),
  card("paus", 8, "Oito de Paus", "oito-de-paus", menorPaus8),
  card("paus", 9, "Nove de Paus", "nove-de-paus", menorPaus9),
  card("paus", 10, "Dez de Paus", "dez-de-paus", menorPaus10),
  card("paus", "pajem", "Pajem de Paus", "pajem-de-paus", cortePausPajem),
  card("paus", "cavaleiro", "Cavaleiro de Paus", "cavaleiro-de-paus", cortePausCavaleiro),
  card("paus", "rainha", "Rainha de Paus", "rainha-de-paus", cortePausRainha),
  card("paus", "rei", "Rei de Paus", "rei-de-paus", cortePausRei),
  // ── ESPADAS ────────────────────────────────────────────
  card("espadas", 1, "Ás de Espadas", "as-de-espadas", menorEspadas1),
  card("espadas", 2, "Dois de Espadas", "dois-de-espadas", menorEspadas2),
  card("espadas", 3, "Três de Espadas", "tres-de-espadas", menorEspadas3),
  card("espadas", 4, "Quatro de Espadas", "quatro-de-espadas", menorEspadas4),
  card("espadas", 5, "Cinco de Espadas", "cinco-de-espadas", menorEspadas5),
  card("espadas", 6, "Seis de Espadas", "seis-de-espadas", menorEspadas6),
  card("espadas", 7, "Sete de Espadas", "sete-de-espadas", menorEspadas7),
  card("espadas", 8, "Oito de Espadas", "oito-de-espadas", menorEspadas8),
  card("espadas", 9, "Nove de Espadas", "nove-de-espadas", menorEspadas9),
  card("espadas", 10, "Dez de Espadas", "dez-de-espadas", menorEspadas10),
  card("espadas", "pajem", "Pajem de Espadas", "pajem-de-espadas", corteEspadasPajem),
  card("espadas", "cavaleiro", "Cavaleiro de Espadas", "cavaleiro-de-espadas", corteEspadasCavaleiro),
  card("espadas", "rainha", "Rainha de Espadas", "rainha-de-espadas", corteEspadasRainha),
  card("espadas", "rei", "Rei de Espadas", "rei-de-espadas", corteEspadasRei),
  // ── OUROS ──────────────────────────────────────────────
  card("ouros", 1, "Ás de Ouros", "as-de-ouros", menorOuros1),
  card("ouros", 2, "Dois de Ouros", "dois-de-ouros", menorOuros2),
  card("ouros", 3, "Três de Ouros", "tres-de-ouros", menorOuros3),
  card("ouros", 4, "Quatro de Ouros", "quatro-de-ouros", menorOuros4),
  card("ouros", 5, "Cinco de Ouros", "cinco-de-ouros", menorOuros5),
  card("ouros", 6, "Seis de Ouros", "seis-de-ouros", menorOuros6),
  card("ouros", 7, "Sete de Ouros", "sete-de-ouros", menorOuros7),
  card("ouros", 8, "Oito de Ouros", "oito-de-ouros", menorOuros8),
  card("ouros", 9, "Nove de Ouros", "nove-de-ouros", menorOuros9),
  card("ouros", 10, "Dez de Ouros", "dez-de-ouros", menorOuros10),
  card("ouros", "pajem", "Pajem de Ouros", "pajem-de-ouros", corteOurosPajem),
  card("ouros", "cavaleiro", "Cavaleiro de Ouros", "cavaleiro-de-ouros", corteOurosCavaleiro),
  card("ouros", "rainha", "Rainha de Ouros", "rainha-de-ouros", corteOurosRainha),
  card("ouros", "rei", "Rei de Ouros", "rei-de-ouros", corteOurosRei),
]);

export const FROZEN_BY_ID: ReadonlyMap<string, FrozenCard> = new Map(
  FROZEN_DECK.map(c => [c.id, c]),
);

/** Versão semântica do freeze. Bump ao mudar nomes/slugs/imagens. */
export const FROZEN_DECK_VERSION = "1.0.1" as const;

/** Selo de homologação — true sinaliza acervo congelado para produção. */
export const DECK_MENORES_OFICIAL = true as const;
