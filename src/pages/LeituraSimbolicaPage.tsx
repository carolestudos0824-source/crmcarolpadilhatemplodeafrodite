import { LEITURA_SIMBOLICA_LESSONS } from "@/content/lessons/leitura-simbolica";
import GenericModulePage from "./GenericModulePage";

const LeituraSimbolicaPage = () => (
  <GenericModulePage
    moduleTitle="Leitura Simbólica e Método"
    moduleSubtitle="O Olhar que Revela"
    moduleIcon="🔮"
    categoryLabel="Método"
    editorialIntro="Ler o Tarô é ler símbolos. Desenvolva o olhar interpretativo que transforma imagens em narrativas com profundidade e coerência."
    themeAccent="250 28% 48%"
    lessons={LEITURA_SIMBOLICA_LESSONS}
    lessonRoutePrefix="/leitura-simbolica"
    moduleSlug="leitura-simbolica"
  />
);

export default LeituraSimbolicaPage;
