import { TRABALHAR_TARO_LESSONS } from "@/data/trabalhar-taro";
import GenericModulePage from "./GenericModulePage";

const TrabalharTaroPage = () => (
  <GenericModulePage
    moduleTitle="Como Trabalhar com Tarô"
    moduleSubtitle="Do Estudo à Profissão"
    moduleIcon="💼"
    lessons={TRABALHAR_TARO_LESSONS}
    lessonRoutePrefix="/trabalhar-taro"
  />
);

export default TrabalharTaroPage;
