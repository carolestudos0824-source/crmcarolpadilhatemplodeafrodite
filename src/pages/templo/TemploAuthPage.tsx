import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export function TemploAuthPage() {
  const [email, setEmail] = useState("carolestudos0824@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        toast({
          title: "Erro de Acesso",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate("/templo/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F4F0EA] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-y-auto">
      {/* Elementos decorativos sutilmente dourados */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#C9A35A]/30 to-transparent z-50" />
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#C9A35A]/30 to-transparent z-50" />
      
      <div className="w-full max-w-[440px] py-8 sm:py-12 flex flex-col items-center gap-8 sm:gap-10 relative z-10">
        <div className="text-center w-full px-4 space-y-4">
          <img 
            src="https://qtbkvshbmqlszncxlcuc.supabase.co/storage/v1/object/public/dsl-uploads/FKxI2UX5GWafusX2CZ1rulDlY5n1/1fcb5fad-cd93-4055-9587-35b167be7490.png" 
            alt="Carol Padilha - Tarô, Magias de Amor e Direcionamento" 
            className="w-full max-w-[180px] sm:max-w-[240px] md:max-w-[280px] mx-auto transition-all object-contain"
          />
          <p className="text-[#C9A35A] uppercase tracking-[0.3em] text-[10px] sm:text-[11px] font-bold">
            CRM ESPIRITUAL • SISTEMA INTERNO
          </p>
        </div>

        <div className="w-full bg-[#ECE5DC]/60 backdrop-blur-xl border border-[#C9A35A]/20 p-6 sm:p-8 md:p-10 rounded-[2rem] shadow-2xl space-y-6 sm:space-y-8 relative">
          {error && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A61E25] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
              <AlertCircle className="w-3 h-3" />
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#111111]/70 font-bold ml-1">E-mail</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#F4F0EA] border-[#C9A35A]/20 text-[#111111] h-12 sm:h-14 focus-visible:ring-1 focus-visible:ring-[#C9A35A] focus-visible:border-[#C9A35A] focus:ring-1 focus:ring-[#C9A35A] focus:border-[#C9A35A] rounded-2xl text-base sm:text-lg px-4 transition-all"
                placeholder="carolestudos0824@gmail.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#111111]/70 font-bold ml-1">Chave de Acesso</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#F4F0EA] border-[#C9A35A]/20 text-[#111111] h-12 sm:h-14 focus-visible:ring-1 focus-visible:ring-[#C9A35A] focus-visible:border-[#C9A35A] focus:ring-1 focus:ring-[#C9A35A] focus:border-[#C9A35A] rounded-2xl text-base sm:text-lg px-4 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#A61E25] hover:bg-[#A61E25]/90 text-white font-bold h-14 sm:h-16 rounded-2xl shadow-xl shadow-[#A61E25]/20 text-base sm:text-lg transition-all active:scale-[0.98] group mt-2"
            >
              {loading ? "Acessando..." : (
                <span className="flex items-center gap-2">
                  ENTRAR NO SISTEMA
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A35A]" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-[#111111]/40 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium pt-2">
          Privado & Confidencial · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}