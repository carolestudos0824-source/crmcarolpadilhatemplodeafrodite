import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import Home from "@/pages/Home";
import Precos from "@/pages/Precos";
import Checkout from "@/pages/Checkout";
import Obrigado from "@/pages/Obrigado";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import Entrega from "@/pages/Entrega";
import AdminAccess from "@/pages/AdminAccess";
import Suporte from "@/pages/Suporte";
import Termos from "@/pages/Termos";
import Privacidade from "@/pages/Privacidade";
import Confianca from "@/pages/Confianca";
import Seguranca from "@/pages/Seguranca";
import NotFound from "@/pages/NotFound";

import ScrollToTop from "@/components/ScrollToTop";
import { PromptStudioProvider } from "@/components/entrega/PromptStudioProvider";

const queryClient = new QueryClient();


const CHROMELESS_ROUTES = ["/entrega", "/admin"];
const HIDE_FOOTER_ROUTES = ["/admin/acessos"];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isChromeless = CHROMELESS_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const hideFooter = HIDE_FOOTER_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isChromeless) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full">
        <AnnouncementBar />
        <Navbar />
      </header>
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" theme="dark" richColors />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/precos" element={<Precos />} />
          <Route path="/preco" element={<Navigate to="/precos" replace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/obrigado" element={<Obrigado />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/conecte-se" element={<Navigate to="/login" replace />} />
          <Route path="/Conecte-se" element={<Navigate to="/login" replace />} />
          <Route path="/entrega" element={<Entrega />} />
          <Route path="/painel" element={<Navigate to="/entrega" replace />} />
          <Route path="/dashboard" element={<Navigate to="/entrega" replace />} />
          <Route path="/admin/acessos" element={<AdminAccess />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/confianca" element={<Confianca />} />
          <Route path="/seguranca" element={<Seguranca />} />
          <Route path="/confira" element={<Navigate to="/confianca" replace />} />
          <Route path="/Confira" element={<Navigate to="/confianca" replace />} />
          <Route path="/trust" element={<Navigate to="/confianca" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
