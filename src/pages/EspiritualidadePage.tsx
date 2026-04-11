import { ESPIRITUALIDADE_LESSONS } from "@/data/espiritualidade";
import GenericModulePage from "./GenericModulePage";

const EspiritualidadePage = () => (
  <GenericModulePage
    moduleTitle="Tarô e Espiritualidade"
    moduleSubtitle="O Sagrado na Prática"
    moduleIcon="🕯"
    lessons={ESPIRITUALIDADE_LESSONS}
    lessonRoutePrefix="/espiritualidade"
  />
);

export default EspiritualidadePage;
