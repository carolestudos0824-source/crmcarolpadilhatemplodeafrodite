import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

export function TemploAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Acesso Negado",
        description: "Verifique suas credenciais ritualísticas.",
        variant: "destructive",
      });
      setLoading(false);
    } else {
      navigate("/templo/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-templo-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-templo-gold/40 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-templo-gold/40 to-transparent"></div>
      
      <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-templo-gold/20"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-templo-gold/20"></div>

      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-templo-gold/30 mb-6 bg-templo-black/50 shadow-[0_0_30px_rgba(184,13,45,0.2)]">
            <span className="font-display text-3xl text-templo-gold italic font-bold">CP</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-templo-gold tracking-tighter uppercase italic leading-none mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Templo de Afrodite
          </h1>
          <p className="text-templo-ivory/60 uppercase tracking-[0.3em] text-xs font-medium">
            Sistema Interno — Carol Padilha
          </p>
        </div>

        <div className="bg-templo-black/40 backdrop-blur-xl border border-templo-gold/20 p-8 rounded-2xl shadow-2xl relative">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-templo-gold/50 to-transparent"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold ml-1">E-mail de Acesso</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-templo-black/50 border-templo-gold/20 text-templo-ivory h-12 focus:ring-templo-red focus:border-templo-red/50 rounded-xl"
                placeholder="oraculo@exemplo.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold ml-1">Chave Ritualística</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-templo-black/50 border-templo-gold/20 text-templo-ivory h-12 focus:ring-templo-red focus:border-templo-red/50 rounded-xl"
                placeholder="••••••••"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-templo-red hover:bg-templo-red/90 text-templo-ivory font-bold h-14 rounded-xl shadow-[0_4px_20px_rgba(184,13,45,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              {loading ? "Invocando..." : (
                <span className="flex items-center gap-2">
                  ENTRAR NO TEMPLO
                  <Sparkles className="w-4 h-4 text-templo-gold group-hover:animate-pulse" />
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-templo-ivory/30 text-[10px] uppercase tracking-[0.2em] font-medium">
          Privado & Confidencial · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
