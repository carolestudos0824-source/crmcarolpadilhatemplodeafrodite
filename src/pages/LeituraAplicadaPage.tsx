import { LEITURA_APLICADA_LESSONS } from "@/data/leitura-aplicada";
import GenericModulePage from "./GenericModulePage";

const LeituraAplicadaPage = () => (
  <GenericModulePage
    moduleTitle="Leitura Aplicada por Tema"
    moduleSubtitle="O Tarô no Cotidiano"
    moduleIcon="🎯"
    categoryLabel="Prática Guiada"
    editorialIntro="Cada tema da vida pede uma abordagem diferente. Aprenda a adaptar sua leitura para amor, carreira, saúde, decisões e autoconhecimento."
    themeAccent="180 30% 40%"
    lessons={LEITURA_APLICADA_LESSONS}
    lessonRoutePrefix="/leitura-aplicada"
  />
);

export default LeituraAplicadaPage;
