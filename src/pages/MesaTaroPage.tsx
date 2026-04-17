import { MESA_TARO_LESSONS } from "@/data/mesa-taro";
import GenericModulePage from "./GenericModulePage";

const MesaTaroPage = () => (
  <GenericModulePage
    moduleTitle="Como Montar uma Mesa"
    moduleSubtitle="O Espaço Sagrado"
    moduleIcon="🕯"
    categoryLabel="Método"
    editorialIntro="O espaço onde se lê o Tarô também fala. Aprenda a criar um ambiente que honre a prática e amplifique a conexão simbólica."
    themeAccent="28 35% 45%"
    lessons={MESA_TARO_LESSONS}
    lessonRoutePrefix="/mesa-taro"
    moduleSlug="mesa-taro"
  />
);

export default MesaTaroPage;
