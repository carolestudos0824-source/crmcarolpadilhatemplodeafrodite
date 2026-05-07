import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Heart, User, Instagram, Phone, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export function ClienteFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    instagram: "",
    dataNascimento: "",
    cidade: "",
    origem: "",
    nomePessoaEnvolvida: "",
    dataNascimentoPessoa: "",
    statusRelacao: "",
    situacaoPrincipal: "",
    observacoesPrivadas: "",
    statusComercial: "Nova cliente",
    temperatura: "Morna" as any,
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      storage.saveClient(formData);
      toast({
        title: "Sucesso!",
        description: "Cliente salva com sucesso.",
      });
      setTimeout(() => {
        setLoading(false);
        navigate("/templo/clientes");
      }, 500);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a cliente.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <header className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="rounded-xl border border-[#C9A35A]/20 text-[#111111]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#111111] font-display">Nova Cliente</h1>
          <p className="text-[#111111]/60 font-medium">Cadastre os dados essenciais para o atendimento.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sessão: Dados da Cliente */}
        <div className="bg-white p-8 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0EA] pb-4 mb-6">
            <User className="w-5 h-5 text-[#C9A35A]" />
            <h2 className="text-lg font-bold text-[#111111] font-display uppercase tracking-widest">Informações da Cliente</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Nome Completo</label>
              <Input 
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Mariana Silva" 
                className="bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A35A]" />
                <Input 
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000" 
                  className="pl-12 bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Instagram (opcional)</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A35A]" />
                <Input 
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@usuario" 
                  className="pl-12 bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Data de Nascimento</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A35A]" />
                <Input 
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  className="pl-12 bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Cidade</label>
              <Input 
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Ex: São Paulo - SP" 
                className="bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Como chegou?</label>
              <Select value={formData.origem} onValueChange={(val) => handleSelectChange('origem', val)}>
                <SelectTrigger className="bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {["Instagram", "TikTok", "YouTube", "Indicação", "Site", "Outro"].map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sessão: Relacionamento */}
        <div className="bg-white p-8 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0EA] pb-4 mb-6">
            <Heart className="w-5 h-5 text-[#A61E25]" />
            <h2 className="text-lg font-bold text-[#111111] font-display uppercase tracking-widest">A Pessoa Envolvida</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Nome dele(a)</label>
              <Input 
                name="nomePessoaEnvolvida"
                value={formData.nomePessoaEnvolvida}
                onChange={handleChange}
                placeholder="Ex: Rodrigo" 
                className="bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Status da Relação</label>
              <Select value={formData.statusRelacao} onValueChange={(val) => handleSelectChange('statusRelacao', val)}>
                <SelectTrigger className="bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Ex", "Ficante", "Namoro", "Casamento", "Relação indefinida", 
                    "Bloqueados", "Afastados", "Terceira pessoa", "Paixão nova", 
                    "Término recente", "Relação fria", "Contato instável"
                  ].map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Situação Principal</label>
            <Input 
              name="situacaoPrincipal"
              value={formData.situacaoPrincipal}
              onChange={handleChange}
              placeholder="Ex: Ele sumiu após a última briga" 
              className="bg-white border-[#C9A35A]/20 h-14 rounded-2xl focus:ring-[#A61E25]"
            />
          </div>
        </div>

        {/* Sessão: Observações */}
        <div className="bg-white p-8 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0EA] pb-4 mb-6">
            <Info className="w-5 h-5 text-[#C9A35A]" />
            <h2 className="text-lg font-bold text-[#111111] font-display uppercase tracking-widest">Notas Internas</h2>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Observações Privadas</label>
            <Textarea 
              name="observacoesPrivadas"
              value={formData.observacoesPrivadas}
              onChange={handleChange}
              placeholder="Dê detalhes sobre o perfil emocional ou histórico..." 
              className="bg-white border-[#C9A35A]/20 rounded-2xl min-h-[120px] focus:ring-[#A61E25]"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex-1 h-16 rounded-2xl border border-[#C9A35A]/20 font-bold"
          >
            CANCELAR
          </Button>
          <Button 
            type="submit"
            disabled={loading}
            className="flex-[2] bg-[#A61E25] hover:bg-[#A61E25]/90 text-white font-bold h-16 rounded-2xl shadow-xl shadow-[#A61E25]/20 gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? "SALVANDO..." : "SALVAR CLIENTE"}
          </Button>
        </div>
      </form>
    </div>
  );
}