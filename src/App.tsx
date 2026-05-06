import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { TemploAuthPage } from "./pages/templo/TemploAuthPage";
import { CrmLayout } from "./components/templo/CrmLayout";
import { TemploDashboard } from "./pages/templo/TemploDashboard";

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-templo-black">
    <div className="text-center space-y-4">
      <div className="w-10 h-10 rounded-full border-2 border-templo-gold border-t-transparent animate-spin mx-auto" />
      <p className="text-[10px] text-templo-gold/60 uppercase tracking-[0.3em] font-medium">Invocando Sistema...</p>
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
              <Route path="novo-atendimento" element={<NovoAtendimentoPage />} />
              <Route path="jogos" element={<div className="p-8 text-center text-templo-gold">Em breve</div>} />
              <Route path="relatorios" element={<div className="p-8 text-center text-templo-gold">Em breve</div>} />
              <Route path="configuracoes" element={<div className="p-8 text-center text-templo-gold">Em breve</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
