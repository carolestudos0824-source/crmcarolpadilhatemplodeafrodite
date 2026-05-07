import { useState, useRef, ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  MessageSquare, 
  Mic, 
  Play, 
  Camera, 
  Check, 
  Sparkles,
  Info,
  ChevronRight,
  Heart,
  Save,
  RotateCcw,
  MessageCircle,
  PlusCircle,
  Plus,
  X,
  RefreshCw,
  Copy,
  Clock,
  Zap,
  Shield,
  Trash2,
  Lock,
  Eye,
  AudioLines
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const situations = [
  "Está sumindo", "Término recente", "Quero reconquistar", "Ele bloqueia e desbloqueia",
  "Ele tem medo de se envolver", "Relação fria", "Possível traição", "Terceira pessoa",
  "Amor não assumido", "Quero atrair alguém novo", "Quero saber se devo insistir", "Outro caso"
];

const tarotPositions = [
  { id: 1, section: "VOCÊ", label: "Pensamentos dela" },
  { id: 2, section: "VOCÊ", label: "Sentimentos dela" },
  { id: 3, section: "VOCÊ", label: "Desejos dela" },
  { id: 4, section: "ELE", label: "Pensamentos dele" },
  { id: 5, section: "ELE", label: "Sentimentos dele" },
  { id: 6, section: "ELE", label: "Desejos dele" },
  { id: 7, section: "CENTRO", label: "Conselho" },
  { id: 8, section: "CENTRO", label: "Obstáculo" },
  { id: 9, section: "TENDÊNCIA FUTURA", label: "Tendência futura carta 1" },
  { id: 10, section: "TENDÊNCIA FUTURA", label: "Tendência futura carta 2" },
  { id: 11, section: "TENDÊNCIA FUTURA", label: "Tendência futura carta 3" },
];

export function NovoAtendimentoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [selectedSituation, setSelectedSituation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [relato, setRelato] = useState("");
  const [cards, setCards] = useState<Record<number, { name: string, obs: string, confirmed: boolean }>>({});
  const [tiragemPhoto, setTiragemPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const nextStep = () => {
    if (step === 4) {
      const allConfirmed = tarotPositions.every(p => cards[p.id]?.confirmed);
      if (!allConfirmed) {
        toast({
          title: "Confirmação Pendente",
          description: "Por favor, confirme as 11 cartas antes de manifestar a leitura.",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const prefillTestCards = () => {
    const testCards: Record<number, { name: string, obs: string, confirmed: boolean }> = {
      1: { name: "O Imperador", obs: "", confirmed: true },
      2: { name: "A Morte", obs: "", confirmed: true },
      3: { name: "A Justiça", obs: "", confirmed: true },
      4: { name: "A Imperatriz", obs: "", confirmed: true },
      5: { name: "A Temperança", obs: "", confirmed: true },
      6: { name: "A Torre", obs: "", confirmed: true },
      7: { name: "O Mundo", obs: "", confirmed: true },
      8: { name: "O Carro", obs: "", confirmed: true },
      9: { name: "A Força", obs: "", confirmed: true },
      10: { name: "A Diabo", obs: "", confirmed: true },
      11: { name: "A Estrela", obs: "", confirmed: true },
    };
    setCards(testCards);
    toast({
      title: "Sugestão Carregada",
      description: "Cartas sugeridas para a imagem de teste. Por favor, confira manualmente.",
    });
  };

  const handleCardUpdate = (id: number, name: string, obs: string) => {
    setCards(prev => ({
      ...prev,
      [id]: { name, obs, confirmed: true }
    }));
  };

  const isCardConfirmed = (id: number) => !!cards[id]?.confirmed;

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simular transcrição após 3 segundos
      setTimeout(() => {
        setIsRecording(false);
        setRelato("A consulente relata que o parceiro está afastado há duas semanas. Eles tiveram uma discussão boba por causa de redes sociais e desde então ele visualiza as mensagens mas não responde. Ela sente que ele está perdendo o interesse ou talvez falando com outra pessoa.");
      }, 3000);
    }
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Envie uma imagem válida da tiragem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito pesado",
        description: "A imagem precisa ter até 10MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setTiragemPhoto(event.target?.result as string);
      setPhotoFile(file);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setTiragemPhoto(null);
    setPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-fade-in">
      {/* Progress Header */}
      <header className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => step > 1 ? prevStep() : navigate(-1)} className="rounded-xl border border-[#C9A35A]/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "w-12 h-1.5 rounded-full transition-all duration-500",
                  step >= s ? "bg-[#A61E25]" : "bg-[#ECE5DC]"
                )}
              />
            ))}
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C9A35A]">Passo {step} de 5</p>
          <h1 className="text-2xl font-bold text-[#111111] font-display">
            {step === 1 && "Identificação da Cliente"}
            {step === 2 && "Qual a situação?"}
            {step === 3 && "Relato do Caso"}
            {step === 4 && "Jogo do Amor"}
            {step === 5 && "Leitura Manifestada"}
          </h1>
        </div>
      </header>

      {/* Step 1: Cliente */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-up">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Selecione a Cliente</label>
              <div className="relative">
                <Input placeholder="Buscar por nome..." className="h-16 pl-12 rounded-2xl bg-[#F4F0EA]/50 border-[#C9A35A]/20" />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A35A]" />
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]/40 ml-1">Clientes Recentes</p>
              {["Mariana Silva", "Beatriz Oliveira", "Julia Santos"].map((name) => (
                <button 
                  key={name}
                  onClick={() => {
                    setSelectedCliente({ name });
                    nextStep();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-5 rounded-2xl border transition-all group",
                    selectedCliente?.name === name ? "border-[#A61E25] bg-[#A61E25]/5" : "border-[#C9A35A]/10 hover:border-[#A61E25] hover:bg-[#A61E25]/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EBE5DB] flex items-center justify-center font-bold text-[#111111] italic text-sm border border-[#C9A35A]/20">{name[0]}</div>
                    <span className="font-bold text-[#111111]">{name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#111111]/20 group-hover:text-[#A61E25]" />
                </button>
              ))}
            </div>
            
            <Button variant="outline" className="w-full h-16 rounded-2xl border-dashed border-[#C9A35A]/40 text-[#C9A35A] font-bold gap-2">
              <PlusCircle className="w-5 h-5" />
              CADASTRAR NOVA CLIENTE
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Situação */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
          {situations.map((sit) => (
            <button
              key={sit}
              onClick={() => {
                setSelectedSituation(sit);
                nextStep();
              }}
              className={cn(
                "p-6 rounded-2xl border transition-all text-left group",
                selectedSituation === sit ? "bg-[#A61E25]/5 border-[#A61E25] shadow-md" : "bg-white border-[#C9A35A]/10 hover:border-[#A61E25] hover:shadow-lg"
              )}
            >
              <span className={cn(
                "font-bold transition-colors",
                selectedSituation === sit ? "text-[#A61E25]" : "text-[#111111] group-hover:text-[#A61E25]"
              )}>{sit}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Relato */}
      {step === 3 && (
        <div className="space-y-8 animate-fade-up">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Transcrição do Relato</label>
              <div className="flex gap-2">
                <Button 
                  onClick={toggleRecording}
                  className={cn(
                    "h-12 rounded-xl font-bold gap-2 px-6 transition-all",
                    isRecording ? "bg-red-500 animate-pulse text-white" : "bg-[#A61E25] text-white"
                  )}
                >
                  <Mic className="w-5 h-5" />
                  {isRecording ? "GRAVANDO..." : "GRAVAR RELATO"}
                </Button>
              </div>
            </div>
            
            <Textarea 
              value={relato}
              onChange={(e) => setRelato(e.target.value)}
              placeholder="Escreva aqui o que a cliente contou ou use o microfone para transcrever..."
              className="min-h-[200px] rounded-2xl bg-[#F4F0EA]/30 border-[#C9A35A]/20 focus:ring-[#A61E25] text-lg p-6"
            />
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setRelato("")} className="h-14 rounded-xl border-[#C9A35A]/30 text-[#C9A35A] font-bold gap-2">
                <RotateCcw className="w-4 h-4" />
                LIMPAR
              </Button>
              <Button onClick={nextStep} disabled={!relato} className="flex-1 h-14 rounded-xl bg-[#111111] text-white font-bold gap-2">
                CONTINUAR PARA TIRAGEM
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Jogo do Amor (Tarot Spread) */}
      {step === 4 && (
        <div className="space-y-10 animate-fade-up">
          {/* Foto Upload Area */}
          <div className="bg-[#111111] p-6 sm:p-8 rounded-[2.5rem] text-center space-y-4 shadow-xl border border-[#C9A35A]/30 transition-all">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              capture="environment"
              className="hidden" 
            />
            
            {!tiragemPhoto ? (
              <>
                <Camera className="w-10 h-10 text-[#C9A35A] mx-auto" />
                <h3 className="text-white font-bold text-lg">Reconhecer via Foto</h3>
                <p className="text-[#F4F0EA]/60 text-sm max-w-xs mx-auto">Tire uma foto da tiragem física para preencher automaticamente (experimental).</p>
                <Button 
                  onClick={triggerPhotoUpload}
                  className="bg-[#C9A35A] hover:bg-[#C9A35A]/90 text-[#111111] font-bold rounded-xl h-12 px-8"
                >
                  ENVIAR FOTO
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="relative inline-block group">
                  <img 
                    src={tiragemPhoto} 
                    alt="Foto da Tiragem" 
                    className="w-full max-w-sm rounded-2xl border-2 border-[#C9A35A] shadow-lg mx-auto"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      onClick={removePhoto}
                      size="icon"
                      className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[#C9A35A] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    {photoFile?.name}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={triggerPhotoUpload}
                      className="border-[#C9A35A]/40 text-[#C9A35A] hover:bg-[#C9A35A]/10 h-12 rounded-xl px-6 gap-2 w-full sm:w-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                      TROCAR FOTO
                    </Button>
                    <Button 
                      onClick={prefillTestCards}
                      className="bg-[#A61E25] hover:bg-[#A61E25]/90 text-white font-bold h-12 rounded-xl px-6 gap-2 w-full sm:w-auto"
                    >
                      CONTINUAR PARA CONFIRMAÇÃO DAS CARTAS
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-12">
            {["VOCÊ", "ELE", "CENTRO", "TENDÊNCIA FUTURA"].map((section) => (
              <div key={section} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#C9A35A]/20" />
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#C9A35A]">{section}</h2>
                  <div className="h-px flex-1 bg-[#C9A35A]/20" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tarotPositions.filter(p => p.section === section).map((pos) => (
                    <div key={pos.id} className={cn(
                      "bg-white p-6 rounded-3xl border shadow-sm space-y-4 group transition-all",
                      isCardConfirmed(pos.id) ? "border-[#A61E25] ring-1 ring-[#A61E25]/10" : "border-[#C9A35A]/20 hover:border-[#A61E25]"
                    )}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Posição {pos.id}</span>
                        {isCardConfirmed(pos.id) ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#A61E25] uppercase tracking-widest">
                            <Check className="w-3 h-3" />
                            Confirmada
                          </div>
                        ) : (
                          <Info className="w-4 h-4 text-[#C9A35A]/30" />
                        )}
                      </div>
                      <h4 className="font-bold text-[#111111]">{pos.label}</h4>
                      
                      <div 
                        onClick={() => {
                          const name = prompt(`Digite a carta para ${pos.label}:`, cards[pos.id]?.name || "");
                          if (name !== null) handleCardUpdate(pos.id, name, cards[pos.id]?.obs || "");
                        }}
                        className={cn(
                          "aspect-[2/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                          isCardConfirmed(pos.id) 
                            ? "bg-[#A61E25]/5 border-[#A61E25]/30 text-[#111111]" 
                            : "bg-[#F2EFE8] border-[#C9A35A]/20 text-[#C9A35A]/60 hover:bg-[#C9A35A]/5"
                        )}
                      >
                        {isCardConfirmed(pos.id) ? (
                          <div className="text-center p-4">
                            <span className="text-sm font-bold block mb-1 uppercase tracking-tight">{cards[pos.id].name}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#A61E25]">Editar</span>
                          </div>
                        ) : (
                          <>
                            <Plus className="w-8 h-8 opacity-40" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Inserir Carta</span>
                          </>
                        )}
                      </div>
                      
                      <Input 
                        placeholder="Obs. manual..." 
                        value={cards[pos.id]?.obs || ""}
                        onChange={(e) => setCards(prev => ({
                          ...prev,
                          [pos.id]: { ...(prev[pos.id] || { name: "", confirmed: false }), obs: e.target.value }
                        }))}
                        className="h-10 rounded-xl bg-transparent border-[#C9A35A]/10 text-xs" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20 pb-10 flex justify-center">
            <Button onClick={nextStep} className="bg-[#A61E25] hover:bg-[#A61E25]/90 text-white font-bold h-16 px-12 rounded-2xl shadow-2xl gap-2 text-lg active:scale-[0.98] transition-all">
              <Sparkles className="w-5 h-5 text-[#C9A35A]" />
              MANIFESTAR LEITURA
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Resultado */}
      {step === 5 && (
        <div className="space-y-10 animate-fade-up pb-20">
          <div className="bg-[#111111] p-10 rounded-[3rem] text-center space-y-4 border border-[#C9A35A]/40 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
             <Sparkles className="w-12 h-12 text-[#C9A35A] mx-auto animate-pulse" />
             <h2 className="text-3xl font-bold text-white font-display">Leitura Concluída</h2>
             <p className="text-[#C9A35A] font-bold uppercase tracking-[0.2em] text-xs">A energia foi canalizada com sucesso</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <section className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-[#111111] font-display flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#A61E25] fill-[#A61E25]" />
                    Diagnóstico Geral
                  </h3>
                  <p className="text-[#111111]/80 leading-relaxed italic">
                    "A energia atual da relação mostra um bloqueio comunicativo severo. Enquanto você mantém sentimentos nutridos e o desejo de reconciliação (representado pela Rainha de Copas), ele se encontra em um momento de introspecção defensiva (4 de Espadas). O obstáculo principal é o orgulho ferido por ambas as partes."
                  </p>
               </section>

               <section className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold text-[#111111] font-display">Caminhos & Magias</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#A61E25]/5 border border-[#A61E25]/20">
                       <h4 className="font-bold text-[#A61E25] text-sm mb-1 uppercase tracking-wider">Indicação Principal</h4>
                       <p className="text-[#111111] font-bold">Adoçamento com Abertura de Diálogo</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#C9A35A]/5 border border-[#C9A35A]/20">
                       <h4 className="font-bold text-[#C9A35A] text-sm mb-1 uppercase tracking-wider">Apoio Espiritual</h4>
                       <p className="text-[#111111] font-bold">Limpeza Energética de Ambiente</p>
                    </div>
                  </div>
               </section>
            </div>

            <div className="space-y-6">
               <div className="bg-[#ECE5DC] p-6 rounded-[2.5rem] border border-[#C9A35A]/30 shadow-sm space-y-4 sticky top-8">
                  <h3 className="font-bold text-[#111111] text-center uppercase tracking-widest text-sm">Pronto para Enviar</h3>
                  <div className="bg-white p-4 rounded-2xl text-xs font-medium text-[#111111]/70 leading-relaxed border border-white">
                    Olá Mariana! Acabei de fazer sua tiragem no Templo de Afrodite. 🌹<br/><br/>
                    A energia mostra que o Rodrigo está em um momento de silêncio para processar o que sente... [clique para copiar o resto]
                  </div>
                  <Button className="w-full bg-[#111111] text-white font-bold h-12 rounded-xl gap-2">
                    <MessageCircle className="w-4 h-4" />
                    COPIAR WHATSAPP
                  </Button>
                  <Button variant="outline" className="w-full border-[#A61E25] text-[#A61E25] font-bold h-12 rounded-xl gap-2">
                    <Save className="w-4 h-4" />
                    SALVAR FICHA
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NovoAtendimentoPage;
