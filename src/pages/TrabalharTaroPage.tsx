import { TRABALHAR_TARO_LESSONS } from "@/data/trabalhar-taro";
import GenericModulePage from "./GenericModulePage";

const TrabalharTaroPage = () => (
  <GenericModulePage
    moduleTitle="Como Trabalhar com Tarô"
    moduleSubtitle="Do Estudo à Profissão"
    moduleIcon="💼"
    categoryLabel="Profissionalização"
    editorialIntro="Transformar o estudo do Tarô em profissão exige mais do que técnica — exige postura, ética e clareza sobre o que você oferece ao mundo."
    themeAccent="260 25% 42%"
    lessons={TRABALHAR_TARO_LESSONS}
    lessonRoutePrefix="/trabalhar-taro"
    moduleSlug="trabalhar-taro"
  />
);

export default TrabalharTaroPage;
