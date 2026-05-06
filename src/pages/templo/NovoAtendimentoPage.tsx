import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAtendimentoStore } from "@/store/use-atendimento-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, UserPlus, ArrowRight, ArrowLeft, Mic, Sparkles, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SITUACOES = [
  "Está sumindo", "Término recente", "Quero reconquistar", "Ele bloqueia e desbloqueia", 
  "Ele tem medo de se envolver", "Relação fria", "Possível traição", "Terceira pessoa", 
  "Amor não assumido", "Quero atrair alguém novo", "Quero saber se devo insistir", "Outro caso"
];

export function NovoAtendimentoPage() {
  const navigate = useNavigate();
  const store = useAtendimentoStore();
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [isRecording, setIsRecording] = useState(false);

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
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSimulateRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      store.setRelato("Transcrição simulada: A cliente relata que o parceiro está afastado há 3 dias após uma discussão sobre compromisso. Ela sente que ele tem medo de se envolver profundamente.");
      toast({ title: "Áudio Transcrito", description: "Revise o texto abaixo." });
    }, 3000);
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
           step === 3 ? "O que as águas dizem?" : "Tiragem Templo de Afrodite"}
        </h1>
      </header>

      {/* STEP 1: SELECT CLIENT */}
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
            <button 
              onClick={() => navigate("/templo/clientes/novo")}
              className="flex items-center justify-center gap-2 p-5 rounded-2xl border border-dashed border-templo-gold/30 text-templo-gold/60 hover:bg-templo-gold/5 transition-all font-bold uppercase text-xs tracking-widest"
            >
              <UserPlus className="w-4 h-4" />
              CADASTRAR NOVA ALMA
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SITUACAO */}
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

      {/* STEP 3: RELATO */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-templo-black/40 border border-templo-gold/10 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] uppercase tracking-widest text-templo-gold/70 font-bold">Relato do Caso</label>
              <button 
                onClick={handleSimulateRecording}
                disabled={isRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isRecording 
                    ? "bg-templo-red text-white animate-pulse" 
                    : "bg-templo-gold/10 text-templo-gold hover:bg-templo-gold/20"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                {isRecording ? "GRAVANDO..." : "GRAVAR RELATO"}
              </button>
            </div>
            <Textarea 
              value={store.relato}
              onChange={e => store.setRelato(e.target.value)}
              className="bg-transparent border-none p-0 focus-visible:ring-0 min-h-[300px] text-lg leading-relaxed placeholder:text-templo-ivory/10"
              placeholder="Digite aqui o que a cliente contou ou use o microfone..."
            />
          </div>
          <p className="text-[10px] text-templo-ivory/30 text-center uppercase tracking-widest">
            Transcrição de áudio inteligente disponível na Fase 2
          </p>
        </div>
      )}

      {/* STEP 4: TIRAGEM */}
      {step === 4 && (
        <div className="p-20 text-center text-templo-gold font-display italic opacity-50">
          Implementando Tiragem Visual (Passo 5C)...
          <Button onClick={() => setStep(step + 1)}>Pular para Debug</Button>
        </div>
      )}

      {/* NAVIGATION */}
      <footer className="flex items-center justify-between pt-8 border-t border-templo-gold/10">
        <Button 
          variant="ghost" 
          onClick={step === 1 ? () => navigate(-1) : prevStep}
          className="text-templo-ivory/40 hover:text-templo-gold gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          VOLTAR
        </Button>

        <Button 
          onClick={nextStep}
          className="bg-templo-red hover:bg-templo-red/90 text-templo-ivory px-8 h-14 rounded-xl font-bold gap-3 shadow-xl"
        >
          {step === 4 ? "GERAR LEITURA" : "CONTINUAR"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </footer>
    </div>
  );
}
