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
          <Route path="/jornada-do-louco" element={<FoolsJourneyPage />} />
          <Route path="/biblioteca" element={<SymbolLibraryPage />} />
          <Route path="/revisao" element={<ReviewPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
