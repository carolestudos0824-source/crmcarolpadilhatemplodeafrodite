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
  AudioLines,
  BookOpen,
  Settings2,
  AlertTriangle,
  Flame,
  Star,
  Compass
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

  const generatedWhatsAppText = useMemo(() => {
    const nome = selectedCliente?.name || "";
    const baseText = nome 
      ? `Olá ${nome}! Acabei de finalizar sua leitura no Templo de Afrodite. 🌹\n\n`
      : `Olá! Finalizei sua leitura no Templo de Afrodite. 🌹\n\n`;
    
    let cardsConfirmed = "Cartas da sua tiragem:\n";
    tarotPositions.forEach(p => {
      cardsConfirmed += `- ${p.label}: ${cards[p.id]?.name || "Não informada"}\n`;
    });

    const diagnosis = `\nA energia atual da relação (situação: ${selectedSituation}) mostra um momento de ${cards[7]?.name || "introspecção"} como conselho principal e ${cards[8]?.name || "desafios"} como obstáculo.`;
    
    const conclusion = `\n\nPara seguirmos com o melhor direcionamento, recomendo ${indicatedMagia}. Ficamos assim por enquanto?`;
    
    return baseText + cardsConfirmed + diagnosis + conclusion;
  }, [selectedCliente, cards, selectedSituation]);

  const indicatedMagia = useMemo(() => {
    // Lógica simples baseada em algumas cartas e situação
    if (!cards[11]?.confirmed) return "Nenhuma magia indicada no momento";
    
    const c11 = cards[11].name.toLowerCase();
    const c8 = cards[8]?.name.toLowerCase() || "";
    
    if (selectedSituation.includes("sumindo") || selectedSituation.includes("fria")) {
      return "Adoçamento com Abertura de Diálogo";
    }
    if (c11.includes("estrela") || c11.includes("mundo")) {
      return "Harmonização Amorosa";
    }
    if (c11.includes("diabo") || c11.includes("torre") || c8.includes("diabo")) {
      return "Limpeza Energética Amorosa";
    }
    if (selectedSituation.includes("bloqueia")) {
      return "Ritual para acalmar brigas";
    }
    
    return "Banho de magnetismo pessoal";
  }, [cards, selectedSituation]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedWhatsAppText);
    toast({
      title: "Copiado!",
      description: "O texto completo para o WhatsApp foi copiado.",
    });
  };

  const saveAttendance = () => {
    const attendanceData = {
      cliente: selectedCliente?.name,
      situacao: selectedSituation,
      relato,
      cards: cards,
      magia: indicatedMagia,
      date: new Date().toISOString()
    };
    // Simular salvamento
    console.log("Saving attendance:", attendanceData);
    toast({
      title: "Atendimento Salvo",
      description: "Atendimento registrado no histórico local com sucesso.",
    });
    setTimeout(() => navigate("/templo/dashboard"), 2000);
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
            {step === 4 && "Confirmação da Tiragem"}
            {step === 5 && "Leitura Manifestada"}
          </h1>
        </div>
      </header>

      {/* Step 1: Cliente */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-up">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Selecione a Cliente</label>
              <div className="relative">
                <Input placeholder="Buscar por nome ou e-mail..." className="h-16 pl-12 rounded-2xl bg-[#F2EFE8]/50 border-[#C9A35A]/20" />
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
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Transcrição do Relato</label>
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
              className="min-h-[200px] rounded-2xl bg-[#F2EFE8]/30 border-[#C9A35A]/20 focus:ring-[#A61E25] text-lg p-6"
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
                <h3 className="text-white font-bold text-lg font-display uppercase tracking-widest italic">Reconhecer via Foto</h3>
                <p className="text-[#F2EFE8]/60 text-[10px] max-w-xs mx-auto uppercase tracking-widest font-bold">Tire uma foto da tiragem física para preencher automaticamente (experimental).</p>
                <Button 
                  onClick={triggerPhotoUpload}
                  className="bg-[#C9A35A] hover:bg-[#C9A35A]/90 text-[#111111] font-bold rounded-xl h-12 px-10 transition-all active:scale-95"
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
                <div className="flex items-center gap-3 px-4">
                  <div className="h-px flex-1 bg-[#C9A35A]/20" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A35A] whitespace-nowrap">{section}</h2>
                  <div className="h-px flex-1 bg-[#C9A35A]/20" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                  {tarotPositions.filter(p => p.section === section).map((pos) => (
                    <div key={pos.id} className={cn(
                      "bg-[#EBE5DB] p-6 rounded-3xl border shadow-sm space-y-4 group transition-all",
                      isCardConfirmed(pos.id) ? "border-[#A61E25] ring-1 ring-[#A61E25]/10" : "border-[#C9A35A]/20 hover:border-[#A61E25]"
                    )}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 italic">Posição {pos.id}</span>
                        {isCardConfirmed(pos.id) ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#A61E25] uppercase tracking-widest">
                            <Check className="w-3 h-3" />
                            Confirmada
                          </div>
                        ) : (
                          <Info className="w-4 h-4 text-[#C9A35A]/30" />
                        )}
                      </div>
                      <h4 className="font-bold text-[#111111] text-sm uppercase tracking-tight">{pos.label}</h4>
                      
                      <div 
                        onClick={() => {
                          const name = prompt(`Digite a carta para ${pos.label}:`, cards[pos.id]?.name || "");
                          if (name !== null) handleCardUpdate(pos.id, name, cards[pos.id]?.obs || "");
                        }}
                        className={cn(
                          "aspect-[2/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                          isCardConfirmed(pos.id) 
                            ? "bg-white border-[#A61E25]/30 text-[#111111] shadow-inner" 
                            : "bg-[#F2EFE8] border-[#C9A35A]/20 text-[#C9A35A]/60 hover:bg-[#C9A35A]/5"
                        )}
                      >
                        {isCardConfirmed(pos.id) ? (
                          <div className="text-center p-4">
                            <span className="text-sm font-bold block mb-1 uppercase tracking-tighter text-[#A61E25] italic">{cards[pos.id].name}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#111111]/40 border-t border-[#A61E25]/10 pt-2 block mt-2">Clique para editar</span>
                          </div>
                        ) : (
                          <>
                            <Plus className="w-8 h-8 opacity-40" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Escolher Carta</span>
                          </>
                        )}
                      </div>
                      
                      <Input 
                        placeholder="Observação da Carol..." 
                        value={cards[pos.id]?.obs || ""}
                        onChange={(e) => setCards(prev => ({
                          ...prev,
                          [pos.id]: { ...(prev[pos.id] || { name: "", confirmed: false }), obs: e.target.value }
                        }))}
                        className="h-10 rounded-xl bg-white/50 border-[#C9A35A]/10 text-xs font-sans placeholder:italic" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20 pb-10 flex justify-center">
            <Button 
              onClick={nextStep} 
              disabled={!tarotPositions.every(p => cards[p.id]?.confirmed)}
              className={cn(
                "font-bold h-16 px-12 rounded-2xl shadow-2xl gap-2 text-lg active:scale-[0.98] transition-all",
                tarotPositions.every(p => cards[p.id]?.confirmed)
                  ? "bg-[#A61E25] hover:bg-[#A61E25]/90 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              )}
            >
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
             <h2 className="text-3xl font-bold text-white font-display uppercase tracking-widest italic">Leitura Manifestada</h2>
             <p className="text-[#C9A35A] font-bold uppercase tracking-[0.2em] text-[10px]">A energia de {selectedCliente?.name} foi canalizada</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               {/* Cartas Confirmadas */}
               <section className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-[#F2EFE8] pb-4">
                    <Eye className="w-5 h-5 text-[#C9A35A]" />
                    <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest">Cartas confirmadas nesta leitura</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {tarotPositions.map(p => (
                      <div key={p.id} className="flex justify-between text-xs border-b border-[#F2EFE8]/50 pb-1 italic">
                        <span className="text-[#111111]/40 font-bold uppercase tracking-tighter">{p.label}:</span>
                        <span className="text-[#111111] font-bold uppercase">{cards[p.id]?.name}</span>
                      </div>
                    ))}
                  </div>
               </section>

               <section className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-[#111111] font-display flex items-center gap-2 mb-4">
                        <Heart className="w-5 h-5 text-[#A61E25] fill-[#A61E25]" />
                        1. Diagnóstico Geral
                      </h3>
                      <p className="text-[#111111]/80 leading-relaxed italic border-l-4 border-[#A61E25]/20 pl-4 py-2">
                        "A energia atual da relação (Situação: {selectedSituation}) mostra um momento de transição profunda. A presença da carta {cards[7]?.name} no conselho indica que é necessário maturidade emocional, enquanto o obstáculo {cards[8]?.name} aponta para desafios imediatos que exigem clareza."
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#111111] uppercase tracking-widest text-[10px] border-b border-[#F2EFE8] pb-2">2. O que ela pensa, sente e deseja</h4>
                        <ul className="text-xs space-y-2 text-[#111111]/70 font-sans">
                          <li><span className="font-bold text-[#111111]">Mente:</span> {cards[1]?.name}</li>
                          <li><span className="font-bold text-[#111111]">Coração:</span> {cards[2]?.name}</li>
                          <li><span className="font-bold text-[#111111]">Desejo:</span> {cards[3]?.name}</li>
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-[#111111] uppercase tracking-widest text-[10px] border-b border-[#F2EFE8] pb-2">3. O que ele pensa, sente e deseja</h4>
                        <ul className="text-xs space-y-2 text-[#111111]/70 font-sans">
                          <li><span className="font-bold text-[#111111]">Mente:</span> {cards[4]?.name}</li>
                          <li><span className="font-bold text-[#111111]">Coração:</span> {cards[5]?.name}</li>
                          <li><span className="font-bold text-[#111111]">Desejo:</span> {cards[6]?.name}</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-[#111111] uppercase tracking-widest text-[10px]">7. Tendência Futura</h4>
                      <div className="flex gap-4">
                        {[9, 10, 11].map(id => (
                          <div key={id} className="flex-1 bg-[#F2EFE8] p-3 rounded-xl text-center">
                            <span className="text-[10px] block font-bold text-[#111111]/40 mb-1">CARTA {id-8}</span>
                            <span className="text-[11px] font-bold text-[#A61E25] uppercase">{cards[id]?.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#F2EFE8]">
                       <h4 className="font-bold text-[#111111] uppercase tracking-widest text-[10px] flex items-center gap-2">
                         <AudioLines className="w-4 h-4 text-[#A61E25]" />
                         12. Roteiro de áudio para Carol
                       </h4>
                       <p className="text-[11px] text-[#111111]/60 leading-relaxed font-sans">
                         Comece acolhendo a cliente pelo nome ({selectedCliente?.name}). Mencione que a tiragem do Templo de Afrodite revelou que a situação de "{selectedSituation}" está sendo influenciada fortemente pelo {cards[8]?.name} no caminho... [falar sobre tendências: {cards[9]?.name}, {cards[10]?.name}, {cards[11]?.name}]
                       </p>
                    </div>
                  </div>
               </section>

               <section className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#A61E25]" />
                    <h3 className="text-xl font-bold text-[#111111] font-display">13. Caminhos & Magias Indicadas</h3>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#A61E25]/5 border border-[#A61E25]/20 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#A61E25] text-xs mb-1 uppercase tracking-widest">Indicação do Templo</h4>
                      <p className="text-[#111111] font-bold text-lg italic">{indicatedMagia}</p>
                    </div>
                    <Shield className="w-8 h-8 text-[#A61E25]/20" />
                  </div>
               </section>

               <section className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-[#C9A35A] font-display flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    14. Observações Privadas (Carol)
                  </h3>
                  <Textarea 
                    placeholder="Anotações para o histórico interno..."
                    className="bg-white/5 border-white/10 text-white text-xs h-32 focus:ring-[#A61E25]"
                  />
               </section>
            </div>

            <div className="space-y-6">
               <div className="bg-[#EBE5DB] p-6 rounded-[2.5rem] border border-[#C9A35A]/30 shadow-sm space-y-6 sticky top-8">
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-[#111111] uppercase tracking-widest text-[10px]">11. Texto pronto para WhatsApp</h3>
                    <p className="text-[9px] text-[#111111]/40 font-bold uppercase tracking-tighter italic">Copia o conteúdo completo automaticamente</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl text-[11px] font-medium text-[#111111]/80 leading-relaxed border border-white max-h-[300px] overflow-y-auto font-sans shadow-inner">
                    {generatedWhatsAppText.split('\n').map((line, i) => (
                      <span key={i}>{line}<br/></span>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button 
                      onClick={copyToClipboard}
                      className="w-full bg-[#111111] hover:bg-black text-white font-bold h-14 rounded-xl gap-2 transition-all active:scale-95"
                    >
                      <Copy className="w-4 h-4 text-[#C9A35A]" />
                      COPIAR WHATSAPP
                    </Button>
                    <Button 
                      onClick={saveAttendance}
                      variant="outline" 
                      className="w-full border-[#A61E25] text-[#A61E25] hover:bg-[#A61E25]/5 font-bold h-14 rounded-xl gap-2 transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      SALVAR FICHA
                    </Button>
                  </div>
                  
                  <button 
                    onClick={() => setStep(4)}
                    className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]/40 hover:text-[#A61E25] transition-colors"
                  >
                    Voltar e corrigir cartas
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NovoAtendimentoPage;
