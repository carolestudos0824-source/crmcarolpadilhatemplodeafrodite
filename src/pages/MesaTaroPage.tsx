import { MESA_TARO_LESSONS } from "@/data/mesa-taro";
import GenericModulePage from "./GenericModulePage";

const MesaTaroPage = () => (
  <GenericModulePage
    moduleTitle="Como Montar uma Mesa"
    moduleSubtitle="O Espaço Sagrado"
    moduleIcon="🕯"
    lessons={MESA_TARO_LESSONS}
    lessonRoutePrefix="/mesa-taro"
  />
);

export default MesaTaroPage;
