import { ARQUITETURA_MENORES_LESSONS } from "@/data/arquitetura-menores";
import GenericLessonPage from "./GenericLessonPage";

const ArquiteturaMenoresLessonPage = () => (
  <GenericLessonPage
    lessons={ARQUITETURA_MENORES_LESSONS}
    getLessonByOrder={(order) => ARQUITETURA_MENORES_LESSONS.find(l => l.order === order)}
    moduleRoute="/module/arquitetura-menores"
    moduleName="Arquitetura dos Menores"
    categoryLabel="Arcanos Menores"
    themeAccent="36 38% 48%"
  />
);

export default ArquiteturaMenoresLessonPage;
