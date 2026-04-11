import { ARQUITETURA_MENORES_LESSONS } from "@/data/arquitetura-menores";
import GenericModulePage from "./GenericModulePage";

const ArquiteturaMenoresPage = () => (
  <GenericModulePage
    moduleTitle="Arquitetura dos Menores"
    moduleSubtitle="O Mapa dos 56"
    moduleIcon="🗺"
    lessons={ARQUITETURA_MENORES_LESSONS}
    lessonRoutePrefix="/arquitetura-menores"
  />
);

export default ArquiteturaMenoresPage;
