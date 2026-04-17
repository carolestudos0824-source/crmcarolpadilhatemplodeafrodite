import { ESPIRITUALIDADE_LESSONS } from "@/data/espiritualidade";
import GenericModulePage from "./GenericModulePage";

const EspiritualidadePage = () => (
  <GenericModulePage
    moduleTitle="Tarô e Espiritualidade"
    moduleSubtitle="O Sagrado na Prática"
    moduleIcon="🙏"
    categoryLabel="Espiritualidade"
    editorialIntro="O Tarô é também um caminho interior. Explore as dimensões sagradas, meditativas e rituais que conectam a leitura à alma."
    themeAccent="280 30% 45%"
    lessons={ESPIRITUALIDADE_LESSONS}
    lessonRoutePrefix="/espiritualidade"
    moduleSlug="espiritualidade"
  />
);

export default EspiritualidadePage;
