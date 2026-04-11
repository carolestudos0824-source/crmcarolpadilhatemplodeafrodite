import { LEITURA_SIMBOLICA_LESSONS } from "@/data/leitura-simbolica";
import GenericLessonPage from "./GenericLessonPage";

const LeituraSimbolicaLessonPage = () => (
  <GenericLessonPage
    lessons={LEITURA_SIMBOLICA_LESSONS}
    getLessonByOrder={(order) => LEITURA_SIMBOLICA_LESSONS.find(l => l.order === order)}
    moduleRoute="/module/leitura-simbolica"
    moduleName="Leitura Simbólica"
    moduleId="leitura-simbolica"
    categoryLabel="Método"
    themeAccent="250 28% 48%"
  />
);

export default LeituraSimbolicaLessonPage;
