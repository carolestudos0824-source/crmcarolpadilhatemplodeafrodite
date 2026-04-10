import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import FeedbackPage from "./pages/FeedbackPage.tsx";
import BetaBadge from "@/components/BetaBadge";
import BetaFeedback from "@/components/BetaFeedback";
import ModulesPage from "./pages/ModulesPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
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

/** Redirects to /auth if not logged in */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground font-heading tracking-wider">Carregando...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <>
    <BetaBadge />
    <BetaFeedback />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/app" element={<ProtectedRoute><ModulesPage /></ProtectedRoute>} />
      <Route path="/trilhas" element={<ProtectedRoute><TrailsPage /></ProtectedRoute>} />
      <Route path="/ritual-diario" element={<ProtectedRoute><DailyChallengesPage /></ProtectedRoute>} />
      <Route path="/rotina" element={<ProtectedRoute><StudyRoutinePage /></ProtectedRoute>} />
      <Route path="/module/fundamentos" element={<ProtectedRoute><FundamentosPage /></ProtectedRoute>} />
      <Route path="/fundamentos/:order" element={<ProtectedRoute><FundamentosLessonPage /></ProtectedRoute>} />
      <Route path="/module/arcanos-maiores" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/lesson/:id" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
      <Route path="/module/:naipe" element={<ProtectedRoute><NaipePage /></ProtectedRoute>} />
      <Route path="/intro/:naipe" element={<ProtectedRoute><NaipeIntroPage /></ProtectedRoute>} />
      <Route path="/numerologia" element={<ProtectedRoute><NumerologiaPage /></ProtectedRoute>} />
      <Route path="/cartas-da-corte" element={<ProtectedRoute><CartasCortePage /></ProtectedRoute>} />
      <Route path="/module/combinacoes" element={<ProtectedRoute><CombinacoesPage /></ProtectedRoute>} />
      <Route path="/combinacoes/:order" element={<ProtectedRoute><CombinacoesLessonPage /></ProtectedRoute>} />
      <Route path="/module/tiragens" element={<ProtectedRoute><TiragensPage /></ProtectedRoute>} />
      <Route path="/tiragens/:order" element={<ProtectedRoute><TiragensLessonPage /></ProtectedRoute>} />
      <Route path="/module/amor" element={<ProtectedRoute><AmorPage /></ProtectedRoute>} />
      <Route path="/amor/:order" element={<ProtectedRoute><AmorLessonPage /></ProtectedRoute>} />
      <Route path="/module/pratica" element={<ProtectedRoute><PraticaPage /></ProtectedRoute>} />
      <Route path="/pratica/:order" element={<ProtectedRoute><PraticaLessonPage /></ProtectedRoute>} />
      <Route path="/jornada-do-louco" element={<ProtectedRoute><FoolsJourneyPage /></ProtectedRoute>} />
      <Route path="/biblioteca" element={<ProtectedRoute><SymbolLibraryPage /></ProtectedRoute>} />
      <Route path="/revisao" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
      <Route path="/premium" element={<ProtectedRoute><PremiumPage /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/certificados" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
