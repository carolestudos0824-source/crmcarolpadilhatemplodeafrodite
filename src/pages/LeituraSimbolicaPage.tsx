import { LEITURA_SIMBOLICA_LESSONS } from "@/data/leitura-simbolica";
import GenericModulePage from "./GenericModulePage";

const LeituraSimbolicaPage = () => (
  <GenericModulePage
    moduleTitle="Leitura Simbólica e Método"
    moduleSubtitle="O Olhar que Revela"
    moduleIcon="👁"
    lessons={LEITURA_SIMBOLICA_LESSONS}
    lessonRoutePrefix="/leitura-simbolica"
  />
);

export default LeituraSimbolicaPage;
