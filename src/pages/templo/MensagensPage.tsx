import { storage, MessageTemplate } from "@/lib/storage";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, Copy, Edit3, Plus, Search, 
  Tag, Info, User, Sparkles, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const defaultTemplates: Partial<MessageTemplate>[] = [
  { titulo: "Pós-consulta", categoria: "Acompanhamento", texto: "Oi {nomeCliente}. Passando para saber como você ficou depois da leitura e se algo já se movimentou desde o atendimento." },
  { titulo: "Oferta de Magia", categoria: "Vendas", texto: "Pelo que apareceu no jogo, existe energia entre vocês, mas também há bloqueios que precisam ser trabalhados com cuidado. O caminho espiritual mais adequado seria {magiaIndicada}, sem promessa absoluta, mas com foco em abrir movimento, diálogo e harmonização do campo." },
  { titulo: "Cliente Sumida", categoria: "Reativação", texto: "Oi {nomeCliente}. Vi que você ainda não me respondeu. Vou deixar seu caso em aberto por enquanto, mas se quiser continuar o acompanhamento, me chama por aqui." },
  { titulo: "Confirmação de Pagamento", categoria: "Financeiro", texto: "Recebi seu pagamento, {nomeCliente}! Gratidão pela confiança. Já registrei aqui seu atendimento e logo iniciamos o processo." },
];

export function MensagensPage() {
  const customMessages = useMemo(() => storage.getMessages(), []);
  const allMessages = [...defaultTemplates, ...customMessages];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = useMemo(() => {
    return allMessages.filter(m => 
      m.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allMessages, searchTerm]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Modelo copiado!", description: "Pronto para enviar." });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display italic text-[#111111]">Biblioteca de Mensagens</h1>
          <p className="text-[#C9A35A] uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Textos Prontos para WhatsApp</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A35A]" />
          <input 
            type="text" 
            placeholder="Buscar modelo por título ou categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white border border-[#C9A35A]/20 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#A61E25]"
          />
        </div>
      </header>

      <div className="bg-[#ECE5DC] p-6 rounded-2xl border border-[#C9A35A]/10 flex flex-wrap gap-4">
         <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-[#C9A35A]/20">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Variáveis:</span>
            <span className="text-[9px] font-bold text-[#A61E25] uppercase tracking-tighter">{"{nomeCliente}"}</span>
            <span className="text-[9px] font-bold text-[#A61E25] uppercase tracking-tighter">{"{nomePessoa}"}</span>
            <span className="text-[9px] font-bold text-[#A61E25] uppercase tracking-tighter">{"{magiaIndicada}"}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMessages.map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6 flex flex-col hover:border-[#A61E25]/30 transition-all group">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-bold text-[#111111] leading-tight">{m.titulo}</h3>
                  <span className="text-[9px] font-bold uppercase text-[#C9A35A] tracking-widest mt-1 block">{m.categoria}</span>
               </div>
               <div className="w-10 h-10 rounded-xl bg-[#F4F0EA] flex items-center justify-center text-[#111111]/20">
                  <MessageSquare className="w-5 h-5" />
               </div>
            </div>

            <div className="flex-1 bg-[#F4F0EA]/50 p-6 rounded-2xl border border-[#C9A35A]/5 text-sm text-[#111111]/70 leading-relaxed italic">
               “{m.texto}”
            </div>

            <div className="flex items-center gap-2">
               <Button 
                 onClick={() => copyToClipboard(m.texto!)}
                 className="flex-1 bg-[#111111] hover:bg-black text-white h-12 rounded-xl text-xs font-bold gap-2 uppercase tracking-widest"
               >
                  <Copy className="w-4 h-4" /> Copiar Texto
               </Button>
               <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-[#C9A35A]/20 text-[#111111]/40 hover:text-[#A61E25]">
                  <Edit3 className="w-4 h-4" />
               </Button>
            </div>
          </div>
        ))}

        <button className="bg-white/50 p-8 rounded-[2.5rem] border-2 border-dashed border-[#C9A35A]/20 flex flex-col items-center justify-center gap-4 hover:border-[#A61E25]/40 hover:bg-white transition-all group">
           <div className="w-12 h-12 rounded-full bg-[#C9A35A]/10 flex items-center justify-center text-[#C9A35A] group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
           </div>
           <p className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Criar Novo Modelo</p>
        </button>
      </div>
    </div>
  );
}
