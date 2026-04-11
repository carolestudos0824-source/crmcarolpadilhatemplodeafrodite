import { ESPIRITUALIDADE_LESSONS } from "@/data/espiritualidade";
import GenericLessonPage from "./GenericLessonPage";

const EspiritualidadeLessonPage = () => (
  <GenericLessonPage
    lessons={ESPIRITUALIDADE_LESSONS}
    getLessonByOrder={(order) => ESPIRITUALIDADE_LESSONS.find(l => l.order === order)}
    moduleRoute="/module/espiritualidade"
    moduleName="Tarô e Espiritualidade"
  />
);

export default EspiritualidadeLessonPage;
