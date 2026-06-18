import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { APP_CONFIG } from "@/config/appConfig";
import Home from "@/pages/Home";
import Precos from "@/pages/Precos";
import Checkout from "@/pages/Checkout";
import Obrigado from "@/pages/Obrigado";
import Login from "@/pages/Login";
import Entrega from "@/pages/Entrega";
import Suporte from "@/pages/Suporte";
import Termos from "@/pages/Termos";
import Privacidade from "@/pages/Privacidade";
import Confianca from "@/pages/Confianca";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const ANNOUNCEMENT_ROUTES = ["/", "/precos", "/suporte"];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const showBar = APP_CONFIG.SHOW_ANNOUNCEMENT_BAR && ANNOUNCEMENT_ROUTES.includes(pathname);
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar offsetTop={showBar} />
      <main className={`flex-1 ${showBar ? "pt-[104px] md:pt-[100px]" : "pt-16"}`}>{children}</main>
      <Footer />
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/obrigado" element={<Obrigado />} />
          <Route path="/login" element={<Login />} />
          <Route path="/entrega" element={<Entrega />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="/confianca" element={<Confianca />} />
          <Route path="/trust" element={<Navigate to="/confianca" replace />} />
          <Route path="/templo/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
