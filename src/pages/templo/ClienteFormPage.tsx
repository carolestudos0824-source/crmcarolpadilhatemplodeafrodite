import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

export function ClienteFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    instagram: "",
    data_nascimento: "",
    cidade: "",
    nome_envolvido: "",
    data_nascimento_envolvido: "",
    status_relacao: "Ex",
    situacao_principal: "",
    observacoes_privadas: "",
    status_comercial: "Nova cliente"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("clientes").insert({
      ...formData,
      user_id: user.id,
      data_nascimento: formData.data_nascimento || null,
      data_nascimento_envolvido: formData.data_nascimento_envolvido || null,
    });

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      setLoading(false);
    } else {
      toast({ title: "Cliente Registrada", description: "A alma foi vinculada ao seu templo." });
      navigate("/templo/clientes");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up pb-20">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-templo-gold hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-display text-3xl font-bold text-templo-gold uppercase tracking-tighter">
            Nova Cliente
          </h1>
          <p className="text-templo-ivory/40 text-sm">Registre os detalhes da consulente.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-templo-black/40 border border-templo-gold/10 p-8 rounded-2xl">
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-templo-gold/60 border-b border-templo-gold/10 pb-2">Identidade</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Nome Completo</label>
            <Input 
              required
              value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              className="bg-templo-black/50 border-templo-gold/20 h-12 rounded-xl"
              placeholder="Ex: Maria das Dores"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">WhatsApp</label>
              <Input 
                required
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                className="bg-templo-black/50 border-templo-gold/20 h-12 rounded-xl"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Instagram</label>
              <Input 
                value={formData.instagram}
                onChange={e => setFormData({...formData, instagram: e.target.value})}
                className="bg-templo-black/50 border-templo-gold/20 h-12 rounded-xl"
                placeholder="@perfil"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Nascimento</label>
              <Input 
                type="date"
                value={formData.data_nascimento}
                onChange={e => setFormData({...formData, data_nascimento: e.target.value})}
                className="bg-templo-black/50 border-templo-gold/20 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Cidade</label>
              <Input 
                value={formData.cidade}
                onChange={e => setFormData({...formData, cidade: e.target.value})}
                className="bg-templo-black/50 border-templo-gold/20 h-12 rounded-xl"
                placeholder="São Paulo, SP"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-templo-gold/60 border-b border-templo-gold/10 pb-2">A Pessoa Envolvida</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Nome do Envolvido</label>
            <Input 
              required
              value={formData.nome_envolvido}
              onChange={e => setFormData({...formData, nome_envolvido: e.target.value})}
              className="bg-templo-black/50 border-templo-gold/20 h-12 rounded-xl"
              placeholder="Ex: João da Silva"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Status da Relação</label>
            <select 
              value={formData.status_relacao}
              onChange={e => setFormData({...formData, status_relacao: e.target.value})}
              className="w-full bg-templo-black/50 border border-templo-gold/20 text-templo-ivory rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-templo-gold/30 outline-none"
            >
              {["Ex", "Ficante", "Namoro", "Casamento", "Relação indefinida", "Bloqueados", "Afastados", "Terceira pessoa", "Paixão nova", "Término recente", "Relação fria", "Contato instável"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Data Nasc. Envolvido</label>
            <Input 
              type="date"
              value={formData.data_nascimento_envolvido}
              onChange={e => setFormData({...formData, data_nascimento_envolvido: e.target.value})}
              className="bg-templo-black/50 border-templo-gold/20 h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-templo-gold/60 border-b border-templo-gold/10 pb-2">Situação & Notas</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Situação Principal</label>
            <Textarea 
              value={formData.situacao_principal}
              onChange={e => setFormData({...formData, situacao_principal: e.target.value})}
              className="bg-templo-black/50 border-templo-gold/20 min-h-[100px] rounded-xl"
              placeholder="Descreva o caso amoroso de forma geral..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Observações Privadas</label>
            <Textarea 
              value={formData.observacoes_privadas}
              onChange={e => setFormData({...formData, observacoes_privadas: e.target.value})}
              className="bg-templo-black/50 border-templo-gold/20 min-h-[100px] rounded-xl border-dashed"
              placeholder="Anotações internas que só você verá..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-templo-gold hover:bg-templo-gold/90 text-templo-black font-bold px-10 h-14 rounded-xl gap-2 shadow-lg"
            >
              <Save className="w-5 h-5" />
              {loading ? "Registrando..." : "SALVAR CLIENTE"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
