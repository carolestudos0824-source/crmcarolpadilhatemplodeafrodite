import { LEITURA_APLICADA_LESSONS } from "@/data/leitura-aplicada";
import GenericModulePage from "./GenericModulePage";

const LeituraAplicadaPage = () => (
  <GenericModulePage
    moduleTitle="Leitura Aplicada por Tema"
    moduleSubtitle="O Tarô no Cotidiano"
    moduleIcon="🎯"
    lessons={LEITURA_APLICADA_LESSONS}
    lessonRoutePrefix="/leitura-aplicada"
  />
);

export default LeituraAplicadaPage;
