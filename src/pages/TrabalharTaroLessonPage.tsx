import { TRABALHAR_TARO_LESSONS } from "@/data/trabalhar-taro";
import GenericLessonPage from "./GenericLessonPage";

const TrabalharTaroLessonPage = () => (
  <GenericLessonPage
    lessons={TRABALHAR_TARO_LESSONS}
    getLessonByOrder={(order) => TRABALHAR_TARO_LESSONS.find(l => l.order === order)}
    moduleRoute="/module/trabalhar-taro"
    moduleName="Como Trabalhar com Tarô"
  />
);

export default TrabalharTaroLessonPage;
