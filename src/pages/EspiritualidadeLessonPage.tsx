import { ESPIRITUALIDADE_LESSONS } from "@/data/espiritualidade";
import GenericLessonPage from "./GenericLessonPage";

const EspiritualidadeLessonPage = () => (
  <GenericLessonPage
    lessons={ESPIRITUALIDADE_LESSONS}
    getLessonByOrder={(order) => ESPIRITUALIDADE_LESSONS.find(l => l.order === order)}
    moduleRoute="/module/espiritualidade"
    moduleName="Tarô e Espiritualidade"
    moduleId="espiritualidade"
    categoryLabel="Espiritualidade"
    themeAccent="280 30% 45%"
  />
);

export default EspiritualidadeLessonPage;
