import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import Precos from "@/pages/Precos";
import Checkout from "@/pages/Checkout";
import Obrigado from "@/pages/Obrigado";
import Login from "@/pages/Login";
import Entrega from "@/pages/Entrega";
import Suporte from "@/pages/Suporte";
import Termos from "@/pages/Termos";
import Privacidade from "@/pages/Privacidade";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
