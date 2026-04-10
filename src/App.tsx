import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import BetaBadge from "@/components/BetaBadge";
import BetaFeedback from "@/components/BetaFeedback";
import BottomNav from "@/components/BottomNav";

// Eager: critical path
import LandingPage from "./pages/LandingPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ModulesPage from "./pages/ModulesPage.tsx";

// Lazy: everything else
const Index = lazy(() => import("./pages/Index.tsx"));
const LessonPage = lazy(() => import("./pages/LessonPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const SymbolLibraryPage = lazy(() => import("./pages/SymbolLibraryPage.tsx"));
const PremiumPage = lazy(() => import("./pages/PremiumPage.tsx"));
const ReviewPage = lazy(() => import("./pages/ReviewPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const FoolsJourneyPage = lazy(() => import("./pages/FoolsJourneyPage.tsx"));
const FundamentosPage = lazy(() => import("./pages/FundamentosPage.tsx"));
const FundamentosLessonPage = lazy(() => import("./pages/FundamentosLessonPage.tsx"));
const NaipePage = lazy(() => import("./pages/NaipePage.tsx"));
const NaipeIntroPage = lazy(() => import("./pages/NaipeIntroPage.tsx"));
const NumerologiaPage = lazy(() => import("./pages/NumerologiaPage.tsx"));
const CartasCortePage = lazy(() => import("./pages/CartasCortePage.tsx"));
const CombinacoesPage = lazy(() => import("./pages/CombinacoesPage.tsx"));
const CombinacoesLessonPage = lazy(() => import("./pages/CombinacoesLessonPage.tsx"));
const TiragensPage = lazy(() => import("./pages/TiragensPage.tsx"));
const TiragensLessonPage = lazy(() => import("./pages/TiragensLessonPage.tsx"));
const AmorPage = lazy(() => import("./pages/AmorPage.tsx"));
const AmorLessonPage = lazy(() => import("./pages/AmorLessonPage.tsx"));
const PraticaPage = lazy(() => import("./pages/PraticaPage.tsx"));
const PraticaLessonPage = lazy(() => import("./pages/PraticaLessonPage.tsx"));
const CertificatesPage = lazy(() => import("./pages/CertificatesPage.tsx"));
const TrailsPage = lazy(() => import("./pages/TrailsPage.tsx"));
const DailyChallengesPage = lazy(() => import("./pages/DailyChallengesPage.tsx"));
const StudyRoutinePage = lazy(() => import("./pages/StudyRoutinePage.tsx"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage.tsx"));
const PresentationPage = lazy(() => import("./pages/PresentationPage.tsx"));
const WaitlistPage = lazy(() => import("./pages/WaitlistPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-3">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
      <p className="text-xs text-muted-foreground font-heading tracking-wider">Carregando...</p>
    </div>
  </div>
);

/** Redirects to /auth if not logged in */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

/** Redirects to /app if already logged in */
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (user) return <Navigate to="/app" replace />;
  return <>{children}</>;
};

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const AppRoutes = () => (
  <>
    <BetaBadge />
    <BetaFeedback />
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apresentacao" element={<PresentationPage />} />
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/app" element={<P><ModulesPage /></P>} />
        <Route path="/trilhas" element={<P><TrailsPage /></P>} />
        <Route path="/ritual-diario" element={<P><DailyChallengesPage /></P>} />
        <Route path="/rotina" element={<P><StudyRoutinePage /></P>} />
        <Route path="/module/fundamentos" element={<P><FundamentosPage /></P>} />
        <Route path="/fundamentos/:order" element={<P><FundamentosLessonPage /></P>} />
        <Route path="/module/arcanos-maiores" element={<P><Index /></P>} />
        <Route path="/lesson/:id" element={<P><LessonPage /></P>} />
        <Route path="/module/:naipe" element={<P><NaipePage /></P>} />
        <Route path="/intro/:naipe" element={<P><NaipeIntroPage /></P>} />
        <Route path="/numerologia" element={<P><NumerologiaPage /></P>} />
        <Route path="/cartas-da-corte" element={<P><CartasCortePage /></P>} />
        <Route path="/module/combinacoes" element={<P><CombinacoesPage /></P>} />
        <Route path="/combinacoes/:order" element={<P><CombinacoesLessonPage /></P>} />
        <Route path="/module/tiragens" element={<P><TiragensPage /></P>} />
        <Route path="/tiragens/:order" element={<P><TiragensLessonPage /></P>} />
        <Route path="/module/amor" element={<P><AmorPage /></P>} />
        <Route path="/amor/:order" element={<P><AmorLessonPage /></P>} />
        <Route path="/module/pratica" element={<P><PraticaPage /></P>} />
        <Route path="/pratica/:order" element={<P><PraticaLessonPage /></P>} />
        <Route path="/jornada-do-louco" element={<P><FoolsJourneyPage /></P>} />
        <Route path="/biblioteca" element={<P><SymbolLibraryPage /></P>} />
        <Route path="/revisao" element={<P><ReviewPage /></P>} />
        <Route path="/premium" element={<P><PremiumPage /></P>} />
        <Route path="/perfil" element={<P><ProfilePage /></P>} />
        <Route path="/certificados" element={<P><CertificatesPage /></P>} />
        <Route path="/feedback" element={<P><FeedbackPage /></P>} />
        <Route path="/admin" element={<P><AdminPage /></P>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <BottomNav />
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
