import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ModulesPage from "./pages/ModulesPage.tsx";
import Index from "./pages/Index.tsx";
import LessonPage from "./pages/LessonPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import SymbolLibraryPage from "./pages/SymbolLibraryPage.tsx";
import PremiumPage from "./pages/PremiumPage.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModulesPage />} />
          <Route path="/module/arcanos-maiores" element={<Index />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/biblioteca" element={<SymbolLibraryPage />} />
          <Route path="/revisao" element={<ReviewPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
