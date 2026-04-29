/**
 * ARCANO VIVO — Mapeamento de vídeos verticais 9:16 por arcano.
 *
 * Quando um vídeo existe para o arcano, ele substitui a imagem estática
 * principal da carta na intro da Jornada de Estudo. Se não existir vídeo,
 * a imagem da carta continua sendo exibida normalmente (fallback).
 *
 * Para ativar um vídeo, basta colocar o arquivo em `public/videos/arcanos/`
 * com o nome correspondente abaixo. A presença real do arquivo é verificada
 * em runtime — se o vídeo não carregar, o componente cai automaticamente
 * para a imagem estática da carta.
 */
export const ARCANO_VIDEOS: Record<number, string> = {
  0: "/videos/arcanos/arcano-0-louco.mp4",
  1: "/videos/arcanos/arcano-1-mago.mp4",
  2: "/videos/arcanos/arcano-2-sacerdotisa.mp4",
  3: "/videos/arcanos/arcano-3-imperatriz.mp4",
  4: "/videos/arcanos/arcano-4-imperador.mp4",
  5: "/videos/arcanos/arcano-5-hierofante.mp4",
  6: "/videos/arcanos/arcano-6-enamorados.mp4",
  7: "/videos/arcanos/arcano-7-carro.mp4",
  8: "/videos/arcanos/arcano-8-forca.mp4",
  9: "/videos/arcanos/arcano-9-eremita.mp4",
  10: "/videos/arcanos/arcano-10-roda-da-fortuna.mp4",
  11: "/videos/arcanos/arcano-11-justica.mp4",
  12: "/videos/arcanos/arcano-12-enforcado.mp4",
  13: "/videos/arcanos/arcano-13-morte.mp4",
  14: "/videos/arcanos/arcano-14-temperanca.mp4",
  15: "/videos/arcanos/arcano-15-diabo.mp4",
  16: "/videos/arcanos/arcano-16-torre.mp4",
  17: "/videos/arcanos/arcano-17-estrela.mp4",
  18: "/videos/arcanos/arcano-18-lua.mp4",
  19: "/videos/arcanos/arcano-19-sol.mp4",
  20: "/videos/arcanos/arcano-20-julgamento.mp4",
  21: "/videos/arcanos/arcano-21-mundo.mp4",
};

export function getArcanoVideoSrc(arcanoId: number): string | null {
  return ARCANO_VIDEOS[arcanoId] ?? null;
}
