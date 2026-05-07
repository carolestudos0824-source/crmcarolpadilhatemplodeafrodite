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
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// CRM Pages (Lazy)
const ClientesListPage = lazy(() => import("./pages/templo/ClientesListPage").then(m => ({ default: m.ClientesListPage })));
const ClienteFormPage = lazy(() => import("./pages/templo/ClienteFormPage").then(m => ({ default: m.ClienteFormPage })));
const NovoAtendimentoPage = lazy(() => import("./pages/templo/NovoAtendimentoPage").then(m => ({ default: m.NovoAtendimentoPage })));
const MagiasPage = lazy(() => import("./pages/templo/MagiasPage").then(m => ({ default: m.MagiasPage })));
const ReportsPage = lazy(() => import("./pages/templo/ReportsPage").then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import("./pages/templo/SettingsPage").then(m => ({ default: m.SettingsPage })));
const ClienteProfilePage = lazy(() => import("./pages/templo/ClienteProfilePage").then(m => ({ default: m.ClienteProfilePage })));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<TemploAuthPage />} />
            
            <Route path="/templo" element={<ProtectedRoute><CrmLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/templo/dashboard" replace />} />
              <Route path="dashboard" element={<TemploDashboard />} />
               <Route path="clientes" element={<ClientesListPage />} />
               <Route path="clientes/novo" element={<ClienteFormPage />} />
               <Route path="clientes/:id" element={<ClienteProfilePage />} />
              <Route path="novo-atendimento" element={<NovoAtendimentoPage />} />
              <Route path="magias" element={<MagiasPage />} />
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
