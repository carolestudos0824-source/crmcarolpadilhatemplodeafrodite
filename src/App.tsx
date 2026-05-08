import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { TemploAuthPage } from "./pages/templo/TemploAuthPage";
import { CrmLayout } from "./components/templo/CrmLayout";
import { TemploDashboard } from "./pages/templo/TemploDashboard";

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F2EFE8]">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 rounded-full border-2 border-[#C9A35A] border-t-transparent animate-spin mx-auto" />
      <p className="text-[10px] text-[#111111]/40 uppercase tracking-[0.3em] font-bold">Conectando ao Templo...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/" replace state={{ from: window.location.pathname }} />;
  return <>{children}</>;
};

// CRM Pages (Lazy)
const ClientesListPage = lazy(() => import("./pages/templo/ClientesListPage").then(m => ({ default: m.ClientesListPage })));
const ClienteFormPage = lazy(() => import("./pages/templo/ClienteFormPage").then(m => ({ default: m.ClienteFormPage })));
const NovoAtendimentoPage = lazy(() => import("./pages/templo/NovoAtendimentoPage").then(m => ({ default: m.NovoAtendimentoPage })));
const MagiasPage = lazy(() => import("./pages/templo/MagiasPage").then(m => ({ default: m.MagiasPage })));
const PipelinePage = lazy(() => import("./pages/templo/PipelinePage").then(m => ({ default: m.PipelinePage })));
const FollowUpsPage = lazy(() => import("./pages/templo/FollowUpsPage").then(m => ({ default: m.FollowUpsPage })));
const FinanceiroPage = lazy(() => import("./pages/templo/FinanceiroPage").then(m => ({ default: m.FinanceiroPage })));
const MensagensPage = lazy(() => import("./pages/templo/MensagensPage").then(m => ({ default: m.MensagensPage })));
const ReportsPage = lazy(() => import("./pages/templo/ReportsPage").then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import("./pages/templo/SettingsPage").then(m => ({ default: m.SettingsPage })));
const ClienteProfilePage = lazy(() => import("./pages/templo/ClienteProfilePage").then(m => ({ default: m.ClienteProfilePage })));
const AtendimentoPublicPage = lazy(() => import("./pages/templo/AtendimentoPublicPage"));
const InboxPage = lazy(() => import("./pages/templo/InboxPage").then(m => ({ default: m.InboxPage })));

// Portal Pages
const PortalLayout = lazy(() => import("./pages/templo/PortalLayout").then(m => ({ default: m.PortalLayout })));
const PortalHome = lazy(() => import("./pages/templo/PortalHome"));
const PortalNovoAtendimento = lazy(() => import("./pages/templo/PortalNovoAtendimento"));
const PortalAcompanhar = lazy(() => import("./pages/templo/PortalAcompanhar"));
const PortalMensagens = lazy(() => import("./pages/templo/PortalMensagens"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<TemploAuthPage />} />
            <Route path="/atendimento" element={<AtendimentoPublicPage />} />
            
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalHome />} />
              <Route path="novo-atendimento" element={<PortalNovoAtendimento />} />
              <Route path="acompanhar" element={<PortalAcompanhar />} />
              <Route path="mensagens" element={<PortalMensagens />} />
            </Route>

            <Route path="/templo" element={<ProtectedRoute><CrmLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/templo/dashboard" replace />} />
              <Route path="dashboard" element={<TemploDashboard />} />
              <Route path="clientes" element={<ClientesListPage />} />
              <Route path="caixa-entrada" element={<InboxPage />} />
              <Route path="clientes/novo" element={<ClienteFormPage />} />
              <Route path="clientes/:id" element={<ClienteProfilePage />} />
              <Route path="novo-atendimento" element={<NovoAtendimentoPage />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="follow-ups" element={<FollowUpsPage />} />
              <Route path="magias" element={<MagiasPage />} />
              <Route path="financeiro" element={<FinanceiroPage />} />
              <Route path="mensagens" element={<MensagensPage />} />
              <Route path="relatorios" element={<ReportsPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
