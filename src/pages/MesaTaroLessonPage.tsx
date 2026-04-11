import { MESA_TARO_LESSONS } from "@/data/mesa-taro";
import GenericLessonPage from "./GenericLessonPage";

const MesaTaroLessonPage = () => (
  <GenericLessonPage
    lessons={MESA_TARO_LESSONS}
    getLessonByOrder={(order) => MESA_TARO_LESSONS.find(l => l.order === order)}
    moduleRoute="/module/mesa-taro"
    moduleName="Como Montar uma Mesa"
    categoryLabel="Método"
    themeAccent="28 35% 45%"
  />
);

export default MesaTaroLessonPage;
