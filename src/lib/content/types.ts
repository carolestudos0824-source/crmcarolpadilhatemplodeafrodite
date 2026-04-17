/**
 * Tipos canônicos da camada de conteúdo.
 *
 * Estes shapes são contrato oficial entre o adapter e a UI.
 * Repositórios (db/legacy) devem normalizar para estes tipos via mappers.
 *
 * Regra de ouro: a UI nunca deve depender da forma do banco nem dos `.ts` legados.
 * Sempre depende destes tipos.
 */

// ─── Primitivos compartilhados ─────────────────────────────────────

export type ContentSource = "db" | "legacy";

export type ContentTier = "free" | "premium";

/** Tradução PT do enum DB module_status */
export type ContentStatus = "vazio" | "parcial" | "rascunho" | "publicado";

export type ContentNaipe = "copas" | "paus" | "espadas" | "ouros";

export type ContentArcanoTipo = "maior" | "menor";

// ─── Quiz ──────────────────────────────────────────────────────────

export interface QuizQuestionContent {
  id: string;
  ordem: number;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao?: string;
}

export interface QuizContent {
  id: string;
  titulo: string;
  status: "rascunho" | "publicado";
  xp: number;
  perguntas: QuizQuestionContent[];
  vinculo: {
    tipo: "modulo" | "licao" | "arcano";
    id: string;
  };
  metadata: {
    source: ContentSource;
  };
}

// ─── Arcano ────────────────────────────────────────────────────────

export interface ArcanoContent {
  id: string;
  tipo: ContentArcanoTipo;
  numero: number | null;
  numeral: string | null;
  naipe: ContentNaipe | null;
  nome: string;
  slug: string;
  subtitulo: string | null;
  tier: ContentTier;
  status: ContentStatus;
  validado: boolean;

  editorial: {
    essencia?: string;
    simbolosCentrais?: string;
    arquetipo?: string;
    luz?: string;
    sombra?: string;
    jornada?: string;
    amor?: string;
    trabalho?: string;
    espiritualidade?: string;
    vozDoArcano?: string;
    aprofundamento?: string;
    cabala?: string;
    revisaoRapida?: string;
    palavrasChave?: string[];
  };

  visual: {
    imageKey: string | null;
    imageUrl: string | null;
    resolvedAssetUrl: string | null;
  };

  quiz: QuizContent | null;

  metadata: {
    source: ContentSource;
    sourceId?: string;
  };
}

// ─── Lição ─────────────────────────────────────────────────────────

export interface LessonContent {
  id: string;
  slug: string;
  titulo: string;
  subtitulo?: string;
  moduloId: string;
  moduloNome: string;
  tier: ContentTier;
  status: ContentStatus;

  editorial: {
    intro?: string;
    conteudoPrincipal?: string;
    aprofundamento?: string;
    exemploPratico?: string;
    exercicio?: string;
    revisaoRapida?: string;
  };

  quiz: QuizContent | null;

  metadata: {
    source: ContentSource;
  };
}

// ─── Módulo ────────────────────────────────────────────────────────

export interface ModuleContent {
  id: string;
  slug: string;
  nome: string;
  categoria?: string;
  descricaoCurta?: string;
  descricaoEditorial?: string;
  icone?: string;
  rotaPrefixo?: string;
  ordem: number;
  tier: ContentTier;
  status: ContentStatus;
  corTema?: string;

  /** Lista resumida das lições do módulo (para tela do módulo). */
  licoes: Array<{
    id: string;
    slug: string;
    titulo: string;
    ordem: number;
  }>;

  metadata: {
    source: ContentSource;
  };
}

// ─── Wrapper de retorno dos hooks ──────────────────────────────────

export interface UseContentResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  /** Origem efetiva do dado retornado. `null` enquanto carrega. */
  sourceUsed: ContentSource | null;
  /** True quando a leitura caiu no legado (telemetria). */
  usedFallback: boolean;
  /** TanStack Query refetch (opcional, exposto para admin). */
  refetch?: () => void;
  /** True quando há refetch silencioso em andamento. */
  isFetching?: boolean;
}
