import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export function TemploAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de login para a versão estrutural
    setTimeout(() => {
      navigate("/templo/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F4F0EA] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos decorativos sutilmente dourados */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#C9A35A]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#C9A35A]/30 to-transparent" />
      
      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-2">
          <img 
            src="https://qtbkvshbmqlszncxlcuc.supabase.co/storage/v1/object/public/dsl-uploads/FKxI2UX5GWafusX2CZ1rulDlY5n1/1fcb5fad-cd93-4055-9587-35b167be7490.png" 
            alt="Carol Padilha - Tarô, Magias de Amor e Direcionamento" 
            className="w-full max-w-[280px] mx-auto mb-4"
          />
          <p className="text-[#C9A35A] uppercase tracking-[0.2em] text-[10px] font-bold">
            CRM Espiritual · Sistema Interno
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-xl border border-[#C9A35A]/20 p-8 md:p-10 rounded-[2rem] shadow-2xl space-y-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#111111]/70 font-bold ml-1">E-mail</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-[#C9A35A]/20 text-[#111111] h-14 focus:ring-[#A61E25] focus:border-[#A61E25]/50 rounded-2xl text-lg px-4"
                placeholder="carol@exemplo.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#111111]/70 font-bold ml-1">Chave de Acesso</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-[#C9A35A]/20 text-[#111111] h-14 focus:ring-[#A61E25] focus:border-[#A61E25]/50 rounded-2xl text-lg px-4"
                placeholder="••••••••"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#A61E25] hover:bg-[#A61E25]/90 text-white font-bold h-16 rounded-2xl shadow-xl shadow-[#A61E25]/20 text-lg transition-all active:scale-95 group"
            >
              {loading ? "Acessando..." : (
                <span className="flex items-center gap-2">
                  ENTRAR NO SISTEMA
                  <Sparkles className="w-5 h-5 text-[#C9A35A]" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-[#111111]/40 text-xs uppercase tracking-[0.2em] font-medium">
          Privado & Confidencial · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}