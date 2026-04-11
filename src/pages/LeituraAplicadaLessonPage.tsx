import { LEITURA_APLICADA_LESSONS } from "@/data/leitura-aplicada";
import GenericLessonPage from "./GenericLessonPage";

const LeituraAplicadaLessonPage = () => (
  <GenericLessonPage
    lessons={LEITURA_APLICADA_LESSONS}
    getLessonByOrder={(order) => LEITURA_APLICADA_LESSONS.find(l => l.order === order)}
    moduleRoute="/module/leitura-aplicada"
    moduleName="Leitura Aplicada"
  />
);

export default LeituraAplicadaLessonPage;
