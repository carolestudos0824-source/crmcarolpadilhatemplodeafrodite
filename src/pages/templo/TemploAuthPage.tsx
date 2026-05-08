import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function TemploAuthPage() {
  const [email, setEmail] = useState("carolestudos0824@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useAuth();

  useEffect(() => {
    // PARTE 1: RECUPERAÇÃO DE SESSÃO
    // Se já estiver autenticado, redireciona para o Dashboard
    if (!authLoading && user) {
      navigate("/templo/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setError(null);

    // Validação Manual solicitada
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    if (!emailTrimmed) {
      setError("Digite seu e-mail de acesso.");
      return;
    }
    if (!passwordTrimmed) {
      setError("Digite sua chave de acesso.");
      return;
    }
    
    setLoading(true);

    try {
      const { error: signInError } = await signIn(emailTrimmed, passwordTrimmed);

      if (signInError) {
        setError(signInError.message);
        toast({
          title: "Erro de Acesso",
          description: signInError.message,
          variant: "destructive",
        });
      } else {
        navigate("/templo/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Não foi possível entrar agora. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F3EEE8] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-y-auto font-sans">
      {/* Detalhes Decorativos */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#C8A15A]/30 to-transparent z-50" />
      
      <div className="w-full max-w-[440px] py-8 sm:py-12 flex flex-col items-center gap-8 sm:gap-10 relative z-10">
        <div className="text-center w-full px-4 space-y-4">
          <img 
            src="https://qtbkvshbmqlszncxlcuc.supabase.co/storage/v1/object/public/dsl-uploads/FKxI2UX5GWafusX2CZ1rulDlY5n1/1fcb5fad-cd93-4055-9587-35b167be7490.png" 
            alt="Carol Padilha" 
            className="w-full max-w-[180px] sm:max-w-[240px] md:max-w-[280px] mx-auto object-contain drop-shadow-sm"
          />
          <div className="space-y-1">
            <p className="text-[#C8A15A] uppercase tracking-[0.3em] text-[10px] sm:text-[11px] font-bold">
              CRM ESPIRITUAL
            </p>
            <p className="text-[#111111]/40 uppercase tracking-[0.2em] text-[8px] font-bold">
              Acesso Restrito Carol Padilha
            </p>
          </div>
        </div>

        <div className="w-full bg-[#EBE5DB]/80 backdrop-blur-xl border border-[#C8A15A]/20 p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-6 relative">
          <form onSubmit={handleLogin} noValidate className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-[#111111]/70 font-bold ml-1">E-mail</label>
              <Input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className={cn(
                  "bg-[#F3EEE8] border-[#C8A15A]/20 text-[#111111] h-12 sm:h-14 focus-visible:ring-1 focus-visible:ring-[#C8A15A] rounded-2xl text-base px-4 transition-all",
                  (error?.includes("e-mail")) && "border-[#A61E25]/50 focus-visible:ring-[#A61E25]"
                )}
                placeholder="seu-email@gmail.com"
              />
              {(error?.includes("e-mail")) && (
                <p className="text-[10px] text-[#A61E25] font-bold uppercase tracking-tight ml-1 animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] uppercase tracking-widest text-[#111111]/70 font-bold ml-1">Chave de Acesso</label>
              <Input 
                id="password"
                type="password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className={cn(
                  "bg-[#F3EEE8] border-[#C8A15A]/20 text-[#111111] h-12 sm:h-14 focus-visible:ring-1 focus-visible:ring-[#C8A15A] rounded-2xl text-base px-4 transition-all",
                  (error?.includes("chave") || error?.includes("Chave") || error?.includes("senha") || error?.includes("indisponível")) && "border-[#A61E25]/50 focus-visible:ring-[#A61E25]"
                )}
                placeholder="••••••••"
              />
              {(error?.includes("chave") || error?.includes("Chave") || error?.includes("senha") || error?.includes("indisponível")) && (
                <p className="text-[10px] text-[#A61E25] font-bold uppercase tracking-tight ml-1 animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#A61E25] hover:bg-[#A61E25]/90 text-white font-bold h-14 sm:h-16 rounded-2xl shadow-xl shadow-[#A61E25]/20 text-base transition-all active:scale-[0.98] group mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  ENTRAR NO SISTEMA
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#C8A15A] group-hover:scale-110 transition-transform" />
                  </div>
                </>
              )}
            </Button>
          </form>

          {/* Pentagrama decorativo */}
          <div className="absolute -bottom-4 -right-4 opacity-5 rotate-12 pointer-events-none">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="w-8 h-[1px] bg-[#C8A15A]/20" />
          <p className="text-center text-[#111111]/30 text-[9px] uppercase tracking-[0.2em] font-bold">
            Templo de Afrodite · Escritório Digital
          </p>
        </div>
      </div>
    </div>
  );
}
