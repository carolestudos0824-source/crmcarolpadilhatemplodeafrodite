import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import { setSession } from "@/lib/auth";

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === APP_CONFIG.DEMO_ACCESS_PASSWORD && email.trim()) {
        setSession(email.trim());
        toast.success("Acesso liberado");
        navigate("/entrega");
      } else {
        toast.error("Dados inválidos. Verifique o acesso informado.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <Section>
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8"><Logo size={48} withText={false} /></div>
        <div className="glass-strong p-8">
          <h1 className="text-2xl font-heading font-bold mb-1">Entrar na sua conta</h1>
          <p className="text-sm text-muted-foreground mb-6">Acesse a área de entrega para consultar seus materiais.</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <input className={inputCls} type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className={inputCls} type="password" placeholder="Senha de acesso" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Entrando…</> : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
