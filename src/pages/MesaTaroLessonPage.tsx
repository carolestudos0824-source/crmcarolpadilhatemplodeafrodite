import { MESA_TARO_LESSONS } from "@/content/lessons/mesa-taro";
import GenericLessonPage from "./GenericLessonPage";

const MesaTaroLessonPage = () => (
  <GenericLessonPage
    lessons={MESA_TARO_LESSONS}
    getLessonByOrder={(order) => MESA_TARO_LESSONS.find(l => l.order === order)}
    moduleRoute="/module/mesa-taro"
    moduleName="Como Montar uma Mesa"
    moduleId="mesa-taro"
    categoryLabel="Método"
    themeAccent="28 35% 45%"
    moduleSlug="mesa-taro"
  />
);

export default MesaTaroLessonPage;
