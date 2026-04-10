import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ModulesPage from "./pages/ModulesPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Index from "./pages/Index.tsx";
import LessonPage from "./pages/LessonPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import SymbolLibraryPage from "./pages/SymbolLibraryPage.tsx";
import PremiumPage from "./pages/PremiumPage.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import FoolsJourneyPage from "./pages/FoolsJourneyPage.tsx";
import FundamentosPage from "./pages/FundamentosPage.tsx";
import FundamentosLessonPage from "./pages/FundamentosLessonPage.tsx";
import NaipePage from "./pages/NaipePage.tsx";
import NaipeIntroPage from "./pages/NaipeIntroPage.tsx";
import NumerologiaPage from "./pages/NumerologiaPage.tsx";
import CartasCortePage from "./pages/CartasCortePage.tsx";
import CombinacoesPage from "./pages/CombinacoesPage.tsx";
import CombinacoesLessonPage from "./pages/CombinacoesLessonPage.tsx";
import TiragensPage from "./pages/TiragensPage.tsx";
import TiragensLessonPage from "./pages/TiragensLessonPage.tsx";
import AmorPage from "./pages/AmorPage.tsx";
import AmorLessonPage from "./pages/AmorLessonPage.tsx";
import PraticaPage from "./pages/PraticaPage.tsx";
import PraticaLessonPage from "./pages/PraticaLessonPage.tsx";
import CertificatesPage from "./pages/CertificatesPage.tsx";
import TrailsPage from "./pages/TrailsPage.tsx";
import DailyChallengesPage from "./pages/DailyChallengesPage.tsx";
import StudyRoutinePage from "./pages/StudyRoutinePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<ModulesPage />} />
          <Route path="/trilhas" element={<TrailsPage />} />
          <Route path="/ritual-diario" element={<DailyChallengesPage />} />
          <Route path="/rotina" element={<StudyRoutinePage />} />
          <Route path="/module/fundamentos" element={<FundamentosPage />} />
          <Route path="/fundamentos/:order" element={<FundamentosLessonPage />} />
          <Route path="/module/arcanos-maiores" element={<Index />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/module/:naipe" element={<NaipePage />} />
          <Route path="/intro/:naipe" element={<NaipeIntroPage />} />
          <Route path="/numerologia" element={<NumerologiaPage />} />
          <Route path="/cartas-da-corte" element={<CartasCortePage />} />
          <Route path="/module/combinacoes" element={<CombinacoesPage />} />
          <Route path="/combinacoes/:order" element={<CombinacoesLessonPage />} />
          <Route path="/module/tiragens" element={<TiragensPage />} />
          <Route path="/tiragens/:order" element={<TiragensLessonPage />} />
          <Route path="/module/amor" element={<AmorPage />} />
          <Route path="/amor/:order" element={<AmorLessonPage />} />
          <Route path="/module/pratica" element={<PraticaPage />} />
          <Route path="/pratica/:order" element={<PraticaLessonPage />} />
          <Route path="/jornada-do-louco" element={<FoolsJourneyPage />} />
          <Route path="/biblioteca" element={<SymbolLibraryPage />} />
          <Route path="/revisao" element={<ReviewPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/certificados" element={<CertificatesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
