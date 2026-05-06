import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAtendimentoStore } from "@/store/use-atendimento-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, UserPlus, ArrowRight, ArrowLeft, Mic, Sparkles, X, Plus, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CartaPosicaoModal } from "@/components/templo/CartaPosicaoModal";

const SITUACOES = [
  "Está sumindo", "Término recente", "Quero reconquistar", "Ele bloqueia e desbloqueia", 
  "Ele tem medo de se envolver", "Relação fria", "Possível traição", "Terceira pessoa", 
  "Amor não assumido", "Quero atrair alguém novo", "Quero saber se devo insistir", "Outro caso"
];

const POSICOES = [
  { id: 1, label: "Pensamentos dela", bloco: "ELA" },
  { id: 2, label: "Sentimentos dela", bloco: "ELA" },
  { id: 3, label: "Desejos dela", bloco: "ELA" },
  { id: 4, label: "Pensamentos dele", bloco: "ELE" },
  { id: 5, label: "Sentimentos dele", bloco: "ELE" },
  { id: 6, label: "Desejos dele", bloco: "ELE" },
  { id: 7, label: "Conselho", bloco: "CENTRO" },
  { id: 8, label: "Obstáculo", bloco: "CENTRO" },
  { id: 9, label: "Tendência 1", bloco: "FUTURO" },
  { id: 10, label: "Tendência 2", bloco: "FUTURO" },
  { id: 11, label: "Tendência 3", bloco: "FUTURO" },
];

export function NovoAtendimentoPage() {
  const navigate = useNavigate();
  const store = useAtendimentoStore();
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPosicao, setSelectedPosicao] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: clientes } = useQuery({
    queryKey: ["clientes-atendimento", search],
    queryFn: async () => {
      let query = supabase.from("clientes").select("id, nome, whatsapp, nome_envolvido");
      if (search) query = query.ilike("nome", `%${search}%`);
      const { data, error } = await query.limit(5);
      if (error) throw error;
      return data;
    },
    enabled: step === 1
  });

  const selectedCliente = clientes?.find(c => c.id === store.clienteId);

  const nextStep = () => {
    if (step === 1 && !store.clienteId) return toast({ title: "Selecione uma cliente" });
    if (step === 2 && !store.situacao) return toast({ title: "Selecione a situação" });
    if (step === 3 && !store.relato) return toast({ title: "O relato é necessário" });
    if (step === 4 && Object.keys(store.cartas).length < 11) return toast({ title: "Preencha todas as 11 cartas" });
    
    if (step === 4) {
      handleGenerateReading();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleGenerateReading = async () => {
    setGenerating(true);
    setStep(5);
    
    // Simulate API call for now (Fase 1)
    setTimeout(() => {
      store.setLeituraGerada(`### Diagnóstico Geral
A relação atravessa um momento de purificação. A presença d'O Louco nos pensamentos dela indica uma vontade de recomeçar, enquanto o Diabo nos desejos dele mostra um apego ainda muito forte ao passado...

### Conselho Espiritual
O momento pede silêncio e observação. Não tente forçar o diálogo agora.`);
      
      store.setTextoWhatsApp(`Olá! Aqui está o resumo da sua leitura:
      
A tendência para os próximos dias é de uma abertura gradual para o diálogo, mas você precisará exercitar a paciência.

Conselho: O momento pede silêncio e observação.`);
      
      setGenerating(false);
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(store.textoWhatsApp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copiado!" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up pb-20">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-templo-gold/40 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span>Passo {step} de 5</span>
          <div className="flex-1 h-px bg-templo-gold/10"></div>
        </div>
        <h1 className="font-display text-3xl font-bold text-templo-gold uppercase tracking-tighter">
          {step === 1 ? "Quem busca orientação?" : 
           step === 2 ? "Qual o cenário atual?" : 
           step === 3 ? "O que as águas dizem?" : 
           step === 4 ? "Tiragem Templo de Afrodite" : "Leitura Manifestada"}
        </h1>
      </header>

      {step === 1 && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-templo-gold/40" />
            <Input 
              placeholder="Buscar cliente por nome..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-12 h-14 bg-templo-black/40 border-templo-gold/20 rounded-2xl text-lg"
            />
          </div>

          <div className="grid gap-3">
            {clientes?.map(c => (
              <button
                key={c.id}
                onClick={() => store.setClienteId(c.id)}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  store.clienteId === c.id 
                    ? "bg-templo-red/10 border-templo-gold text-templo-gold shadow-[0_0_20px_rgba(215,189,121,0.1)]" 
                    : "bg-templo-black/20 border-white/5 text-templo-ivory/60 hover:border-white/20"
                }`}
              >
                <div className="text-left">
                  <p className="font-bold">{c.nome}</p>
                  <p className="text-xs opacity-50">Envolvido: {c.nome_envolvido || "Não informado"}</p>
                </div>
                {store.clienteId === c.id && <Sparkles className="w-5 h-5 animate-pulse" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SITUACOES.map(s => (
            <button
              key={s}
              onClick={() => store.setSituacao(s)}
              className={`p-5 rounded-2xl border text-sm font-medium transition-all text-left ${
                store.situacao === s
                  ? "bg-templo-red/20 border-templo-red text-templo-ivory shadow-[0_0_20px_rgba(184,13,45,0.2)]"
                  : "bg-templo-black/20 border-white/5 text-templo-ivory/50 hover:border-white/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-templo-black/40 border border-templo-gold/10 p-6 rounded-2xl min-h-[400px]">
            <Textarea 
              value={store.relato}
              onChange={e => store.setRelato(e.target.value)}
              className="bg-transparent border-none p-0 focus-visible:ring-0 min-h-[300px] text-lg leading-relaxed"
              placeholder="Descreva o caso..."
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-12">
          {/* ELA & ELE */}
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-templo-gold/60">Lado Dela</h3>
              <div className="grid gap-4">
                {POSICOES.filter(p => p.bloco === "ELA").map(p => (
                  <CardPosicaoButton key={p.id} label={p.label} dados={store.cartas[p.id]} onClick={() => setSelectedPosicao(p.id)} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-templo-gold/60">Lado Dele</h3>
              <div className="grid gap-4">
                {POSICOES.filter(p => p.bloco === "ELE").map(p => (
                  <CardPosicaoButton key={p.id} label={p.label} dados={store.cartas[p.id]} onClick={() => setSelectedPosicao(p.id)} />
                ))}
              </div>
            </div>
          </div>

          {/* CENTRO */}
          <div className="space-y-4">
            <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-templo-gold/60">O Coração da Questão</h3>
            <div className="flex justify-center gap-6">
              {POSICOES.filter(p => p.bloco === "CENTRO").map(p => (
                <div key={p.id} className="w-40">
                  <CardPosicaoButton label={p.label} dados={store.cartas[p.id]} onClick={() => setSelectedPosicao(p.id)} />
                </div>
              ))}
            </div>
          </div>

          {/* FUTURO */}
          <div className="space-y-4">
            <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-templo-gold/60">Tendências Futuras</h3>
            <div className="grid grid-cols-3 gap-4">
              {POSICOES.filter(p => p.bloco === "FUTURO").map(p => (
                <CardPosicaoButton key={p.id} label={p.label} dados={store.cartas[p.id]} onClick={() => setSelectedPosicao(p.id)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-8 animate-fade-up">
          {generating ? (
            <div className="py-20 text-center space-y-6">
              <div className="w-16 h-16 border-2 border-templo-red border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-display text-2xl text-templo-gold italic animate-pulse">Sintonizando planos espirituais...</p>
            </div>
          ) : (
            <>
              <div className="bg-templo-black/40 border border-templo-gold/10 p-8 rounded-2xl prose prose-invert max-w-none prose-headings:text-templo-gold prose-headings:font-display">
                <div dangerouslySetInnerHTML={{ __html: store.leituraGerada.replace(/\n/g, '<br/>') }}></div>
              </div>
              
              <div className="bg-templo-red/10 border border-templo-red/20 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-templo-red">Rascunho WhatsApp</h4>
                  <Button variant="ghost" onClick={handleCopy} className="text-templo-red hover:bg-templo-red/10 gap-2">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    COPIAR
                  </Button>
                </div>
                <div className="bg-templo-black/40 p-4 rounded-xl text-sm border border-white/5 whitespace-pre-wrap">
                  {store.textoWhatsApp}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <footer className="flex items-center justify-between pt-8 border-t border-templo-gold/10">
        <Button variant="ghost" onClick={prevStep} disabled={generating || step === 1} className="text-templo-ivory/40">VOLTAR</Button>
        <Button onClick={nextStep} disabled={generating} className="bg-templo-red hover:bg-templo-red/90 h-14 rounded-xl font-bold px-10 gap-3">
          {step === 4 ? "GERAR LEITURA" : step === 5 ? "SALVAR NO HISTÓRICO" : "CONTINUAR"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </footer>

      {selectedPosicao && (
        <CartaPosicaoModal 
          isOpen={!!selectedPosicao}
          onClose={() => setSelectedPosicao(null)}
          posicaoNome={POSICOES.find(p => p.id === selectedPosicao)?.label || ""}
          onConfirm={(dados) => {
            store.setCarta(selectedPosicao, dados);
            setSelectedPosicao(null);
          }}
          initialData={store.cartas[selectedPosicao]}
        />
      )}
    </div>
  );
}

function CardPosicaoButton({ label, dados, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full aspect-[2/3] rounded-xl border-2 flex flex-col items-center justify-center p-4 transition-all group ${
        dados 
          ? "bg-[#1a0000] border-templo-red shadow-[0_0_20px_rgba(184,13,45,0.1)]" 
          : "bg-templo-black/40 border-dashed border-templo-gold/30 hover:bg-templo-gold/5"
      }`}
    >
      {dados ? (
        <>
          <span className="text-[8px] uppercase tracking-widest text-templo-red/60 mb-auto">{label}</span>
          <div className="text-center flex-1 flex flex-col justify-center">
            <p className="font-display text-xs font-bold text-templo-gold">{dados.carta}</p>
            {dados.orientacao === "Invertida" && <span className="text-[7px] uppercase font-bold text-templo-purple">Invertida</span>}
          </div>
          <Sparkles className="w-3 h-3 text-templo-gold/40 mt-auto" />
        </>
      ) : (
        <>
          <div className="w-8 h-8 rounded-full border border-templo-gold/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 text-templo-gold/40" />
          </div>
          <span className="text-[8px] uppercase tracking-widest text-templo-ivory/30 font-bold text-center leading-tight">{label}</span>
        </>
      )}
    </button>
  );
}
