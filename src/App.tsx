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
const PremiumPage = lazy(() => import("./pages/PremiumPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const FoolsJourneyPage = lazy(() => import("./pages/FoolsJourneyPage.tsx"));
const FundamentosPage = lazy(() => import("./pages/FundamentosPage.tsx"));
const FundamentosLessonPage = lazy(() => import("./pages/FundamentosLessonPage.tsx"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage.tsx"));
const BetaInvitePage = lazy(() => import("./pages/BetaInvitePage.tsx"));
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
        <Route path="/convite" element={<BetaInvitePage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/app" element={<P><ModulesPage /></P>} />
        <Route path="/module/fundamentos" element={<P><FundamentosPage /></P>} />
        <Route path="/fundamentos/:order" element={<P><FundamentosLessonPage /></P>} />
        <Route path="/module/arcanos-maiores" element={<P><Index /></P>} />
        <Route path="/lesson/:id" element={<P><LessonPage /></P>} />
        <Route path="/jornada-do-louco" element={<P><FoolsJourneyPage /></P>} />
        <Route path="/premium" element={<P><PremiumPage /></P>} />
        <Route path="/perfil" element={<P><ProfilePage /></P>} />
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
