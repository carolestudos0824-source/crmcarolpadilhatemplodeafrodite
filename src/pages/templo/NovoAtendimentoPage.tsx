import { useState, useRef, ChangeEvent, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, User, Mic, Play, Camera, Check, Sparkles, Info, ChevronRight,
  Heart, Save, RotateCcw, MessageCircle, PlusCircle, Plus, X, RefreshCw, Copy, 
  Clock, Zap, Shield, Trash2, Lock, Eye, AudioLines, BookOpen, Settings2, AlertTriangle, Star, Compass,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { storage } from "@/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const TAROT_DECK = {
  "Arcanos Maiores": [
    "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador", "O Hierofante",
    "Os Enamorados", "O Carro", "A Força", "O Eremita", "A Roda da Fortuna", "A Justiça",
    "O Enforcado", "A Morte", "A Temperança", "O Diabo", "A Torre", "A Estrela", "A Lua",
    "O Sol", "O Julgamento", "O Mundo"
  ],
  "Copas": [
    "Ás de Copas", "Dois de Copas", "Três de Copas", "Quatro de Copas", "Cinco de Copas",
    "Seis de Copas", "Sete de Copas", "Oito de Copas", "Nove de Copas", "Dez de Copas",
    "Pajem de Copas", "Cavaleiro de Copas", "Rainha de Copas", "Rei de Copas"
  ],
  "Paus": [
    "Ás de Paus", "Dois de Paus", "Três de Paus", "Quatro de Paus", "Cinco de Paus",
    "Seis de Paus", "Sete de Paus", "Oito de Paus", "Nove de Paus", "Dez de Paus",
    "Pajem de Paus", "Cavaleiro de Paus", "Rainha de Paus", "Rei de Paus"
  ],
  "Espadas": [
    "Ás de Espadas", "Dois de Espadas", "Três de Espadas", "Quatro de Espadas", "Cinco de Espadas",
    "Seis de Espadas", "Sete de Espadas", "Oito de Espadas", "Nove de Espadas", "Dez de Espadas",
    "Pajem de Espadas", "Cavaleiro de Espadas", "Rainha de Espadas", "Rei de Espadas"
  ],
  "Ouros": [
    "Ás de Ouros", "Dois de Ouros", "Três de Ouros", "Quatro de Ouros", "Cinco de Ouros",
    "Seis de Ouros", "Sete de Ouros", "Oito de Ouros", "Nove de Ouros", "Dez de Ouros",
    "Pajem de Ouros", "Cavaleiro de Ouros", "Rainha de Ouros", "Rei de Ouros"
  ]
};

export function NovoAtendimentoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reopenId = searchParams.get("reopen");
  const viewId = searchParams.get("view");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [selectedSituation, setSelectedSituation] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [relato, setRelato] = useState("");
  const [cards, setCards] = useState<Record<number, { name: string, obs: string, confirmed: boolean }>>({});
  const [tiragemPhoto, setTiragemPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const [savedReadingData, setSavedReadingData] = useState<{
    whatsapp?: string;
    audio?: string;
    sections?: any[];
    magia?: string;
  } | null>(null);

  // Load existing appointment if in view or reopen mode
  useEffect(() => {
    const id = viewId || reopenId;
    if (id) {
      const existing = storage.getAppointmentById(id);
      if (existing) {
        setSelectedCliente({ id: existing.clientId, name: existing.nomeCliente });
        setSelectedSituation(existing.situacaoAmorosa);
        setRelato(existing.relatoCaso);
        setCards(existing.cartasConfirmadas);
        setTiragemPhoto(existing.fotoTiragem || null);
        
        if (viewId) {
          setSavedReadingData({
            whatsapp: existing.textoWhatsapp,
            audio: existing.roteiroAudio,
            sections: existing.leituraCompleta ? JSON.parse(existing.leituraCompleta) : null,
            magia: existing.magiasIndicadas
          });
          setStep(5); // Go straight to reading
        } else {
          setStep(4); // Start at cards for reopen
        }
      }
    }
  }, [viewId, reopenId, viewId, reopenId]);
  
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [currentPositionId, setCurrentPositionId] = useState<number | null>(null);
  const [cardSearch, setCardSearch] = useState("");
  
  const clients = useMemo(() => storage.getClients(), []);

  const handleCardClick = (posId: number) => {
    setCurrentPositionId(posId);
    setIsCardModalOpen(true);
  };

  const selectCard = (cardName: string) => {
    if (currentPositionId !== null) {
      handleCardUpdate(currentPositionId, cardName, cards[currentPositionId]?.obs || "");
      setIsCardModalOpen(false);
      setCardSearch("");
    }
  };

  const nextStep = () => {
    if (step === 4) {
      const allConfirmed = tarotPositions.every(p => cards[p.id]?.confirmed);
      if (!allConfirmed) {
        toast({ title: "Confirmação Pendente", description: "Confirme as 11 cartas antes de manifestar a leitura.", variant: "destructive" });
        return;
      }
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const indicatedMagia = useMemo(() => {
    if (viewId && savedReadingData?.magia) return savedReadingData.magia;
    if (!cards[11]?.confirmed) return "Nenhuma magia indicada no momento";
    const c11 = cards[11].name.toLowerCase();
    const c8 = cards[8]?.name.toLowerCase() || "";
    if (selectedSituation.includes("sumindo") || selectedSituation.includes("fria")) return "Adoçamento com Abertura de Diálogo";
    if (c11.includes("estrela") || c11.includes("mundo")) return "Harmonização Amorosa";
    if (c11.includes("diabo") || c11.includes("torre") || c8.includes("diabo")) return "Limpeza Energética Amorosa";
    return "Banho de magnetismo pessoal";
  }, [cards, selectedSituation, viewId, savedReadingData]);

  const generatedWhatsAppText = useMemo(() => {
    if (viewId && savedReadingData?.whatsapp) return savedReadingData.whatsapp;
    const nome = selectedCliente?.name || "";
    const baseText = nome ? `Olá ${nome}! Acabei de finalizar sua leitura no Templo de Afrodite. 🌹\n\n` : `Olá! Finalizei sua leitura. 🌹\n\n`;
    let cardsConfirmed = "Cartas da sua tiragem:\n";
    tarotPositions.forEach(p => { cardsConfirmed += `- ${p.label}: ${cards[p.id]?.name || "N/A"}\n`; });
    return baseText + cardsConfirmed + `\nDiagnóstico: ${selectedSituation}. Recomendo: ${indicatedMagia}.`;
  }, [selectedCliente, cards, selectedSituation, indicatedMagia, viewId, savedReadingData]);

  const generatedAudioScript = useMemo(() => {
    if (viewId && savedReadingData?.audio) return savedReadingData.audio;
    const nome = selectedCliente?.name || "consulente";
    return `Olha ${nome}, analisei as energias e o jogo mostra um momento importante. No seu lado, ${cards[1]?.name} aparece na mente e ${cards[2]?.name} no coração. Sobre o futuro, ${indicatedMagia === 'Nenhuma magia indicada no momento' ? 'o momento é de paciência' : 'o caminho está aberto para ' + indicatedMagia}.`;
  }, [selectedCliente, cards, indicatedMagia, viewId, savedReadingData]);

  const interpretationSections = useMemo(() => {
    if (viewId && savedReadingData?.sections) return savedReadingData.sections;
    return [
      { title: "1. Diagnóstico Geral", content: `A situação de ${selectedSituation} exige foco em ${cards[7]?.name}.` },
      { title: "2. O que ela pensa", content: `${cards[1]?.name}` },
      { title: "3. O que ela sente", content: `${cards[2]?.name}` },
      { title: "4. O que ela deseja", content: `${cards[3]?.name}` },
      { title: "5. O que ele pensa", content: `${cards[4]?.name}` },
      { title: "6. O que ele sente", content: `${cards[5]?.name}` },
      { title: "7. O que ele deseja", content: `${cards[6]?.name}` },
      { title: "8. Contradições", content: `O obstáculo ${cards[8]?.name} desafia os desejos.` },
      { title: "9. Obstáculo principal", content: `${cards[8]?.name}` },
      { title: "10. Conselho espiritual", content: `${cards[7]?.name}` },
      { title: "11. Tendência futura", content: `${cards[9]?.name}, ${cards[10]?.name}, ${cards[11]?.name}` },
      { title: "12. Risco da situação", content: `Falta de clareza nas intenções.` },
      { title: "13. Potencial de reconciliação", content: `Moderado.` },
      { title: "14. Potencial de afastamento", content: `Baixo.` },
      { title: "15. Caminhos espirituais indicados", content: `Equilíbrio e paciência.` },
      { title: "16. Magia indicada", content: indicatedMagia },
      { title: "17. O que pode ser dito", content: `O caminho está se abrindo.` },
      { title: "18. O que não deve ser prometido", content: `Datas exatas.` },
    ];
  }, [cards, selectedSituation, indicatedMagia, viewId, savedReadingData]);

  const handleCardUpdate = (id: number, name: string, obs: string) => {
    setCards(prev => ({ ...prev, [id]: { name, obs, confirmed: true } }));
  };

  const isCardConfirmed = (id: number) => !!cards[id]?.confirmed;

  const prefillTestCards = () => {
    const testCards: any = {};
    tarotPositions.forEach((p, i) => {
      testCards[p.id] = { name: ["O Imperador", "A Morte", "A Justiça", "A Imperatriz", "A Temperança", "A Torre", "O Mundo", "O Carro", "A Força", "O Diabo", "A Estrela"][i], obs: "", confirmed: true };
    });
    setCards(testCards);
  };

  const triggerPhotoUpload = () => fileInputRef.current?.click();
  const removePhoto = () => { setTiragemPhoto(null); setPhotoFile(null); };
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setTiragemPhoto(URL.createObjectURL(file)); setPhotoFile(file); }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Conteúdo copiado." });
  };
  const saveAttendance = (isNew: boolean = true) => {
    if (!selectedCliente) return;

    try {
      const data = {
        clientId: selectedCliente.id,
        nomeCliente: selectedCliente.name,
        situacaoAmorosa: selectedSituation,
        relatoCaso: relato,
        fotoTiragem: tiragemPhoto || undefined,
        cartasConfirmadas: cards as any,
        leituraCompleta: JSON.stringify(interpretationSections),
        roteiroAudio: generatedAudioScript,
        textoWhatsapp: generatedWhatsAppText,
        magiasIndicadas: indicatedMagia,
        statusAtendimento: 'Finalizada'
      };

      if (reopenId && !isNew) {
        storage.updateAppointment(reopenId, data);
        toast({ title: "Atendimento Atualizado!", description: "Histórico da cliente atualizado." });
      } else {
        storage.saveAppointment(data);
        toast({ title: "Novo Atendimento Salvo!", description: "Histórico da cliente atualizado." });
      }

      setTimeout(() => navigate("/templo/dashboard"), 1500);
    } catch (e) {
      console.error(e);
      toast({ title: "Erro ao salvar", description: "Não foi possível persistir o atendimento.", variant: "destructive" });
    }
  };

  return (
    <div className={cn("max-w-4xl mx-auto pb-24 animate-fade-in px-4", isReadingMode && "max-w-5xl")}>
      {!isReadingMode && (
        <header className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
             <Button variant="ghost" size="icon" onClick={() => step > 1 ? prevStep() : navigate(-1)} className="rounded-xl border border-[#C9A35A]/20">
               <ArrowLeft className="w-5 h-5"/>
             </Button>
             <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C9A35A]">Passo {step} de 5</p>
             <div className="w-10" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#111111] font-display">
              {step === 1 && "Identificação da Cliente"}
              {step === 2 && "Qual a situação?"}
              {step === 3 && "Relato do Caso"}
              {step === 4 && "Confirmação da Tiragem"}
              {step === 5 && "Leitura Manifestada"}
            </h1>
          </div>
        </header>
      )}

      {step === 1 && (
        <div className="space-y-6 animate-fade-up">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Selecione a Cliente</label>
              <div className="relative">
                <Input 
                  placeholder="Buscar por nome..." 
                  className="h-16 pl-12 rounded-2xl bg-[#F2EFE8]/50 border-[#C9A35A]/20" 
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A35A]" />
              </div>
            </div>
            <div className="space-y-3">
              {clients.filter(c => c.nome.toLowerCase().includes(cardSearch.toLowerCase())).map((client) => (
                <button key={client.id} onClick={() => { setSelectedCliente({ id: client.id, name: client.nome }); nextStep(); }}
                  className={cn("w-full flex items-center justify-between p-5 rounded-2xl border transition-all group",
                    selectedCliente?.id === client.id ? "border-[#A61E25] bg-[#A61E25]/5" : "border-[#C9A35A]/10 hover:border-[#A61E25] hover:bg-[#A61E25]/5"
                  )}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#EBE5DB] flex items-center justify-center font-bold text-[#111111] italic text-sm border border-[#C9A35A]/20">{client.nome[0]}</div>
                    <span className="font-bold text-[#111111]">{client.nome}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#111111]/20 group-hover:text-[#A61E25]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
          {situations.map((sit) => (
            <button key={sit} onClick={() => { setSelectedSituation(sit); nextStep(); }}
              className={cn("p-6 rounded-2xl border transition-all text-left group",
                selectedSituation === sit ? "bg-[#A61E25]/5 border-[#A61E25] shadow-md" : "bg-white border-[#C9A35A]/10 hover:border-[#A61E25] hover:shadow-lg"
              )}>
              <span className={cn("font-bold transition-colors", selectedSituation === sit ? "text-[#A61E25]" : "text-[#111111] group-hover:text-[#A61E25]")}>{sit}</span>
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-fade-up">
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
            <Textarea value={relato} onChange={(e) => setRelato(e.target.value)} placeholder="Relato da cliente..." className="min-h-[200px] rounded-2xl bg-[#F2EFE8]/30 border-[#C9A35A]/20 p-6" />
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setRelato("")} className="h-14 rounded-xl border-[#C9A35A]/30">LIMPAR</Button>
              <Button onClick={nextStep} disabled={!relato} className="flex-1 h-14 rounded-xl bg-[#111111] text-white font-bold">CONTINUAR PARA TIRAGEM</Button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-10 animate-fade-up">
          <div className="bg-[#111111] p-8 rounded-[2.5rem] text-center space-y-4 shadow-xl border border-[#C9A35A]/30">
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
            {!tiragemPhoto ? (
              <Button onClick={triggerPhotoUpload} className="bg-[#C9A35A] hover:bg-[#C9A35A]/90 text-[#111111] font-bold rounded-xl h-12 px-8">ENVIAR FOTO</Button>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img src={tiragemPhoto} className="max-w-xs rounded-2xl border-2 border-[#C9A35A] mx-auto shadow-2xl" />
                  <Button size="icon" onClick={removePhoto} className="absolute -top-2 -right-2 bg-red-600 rounded-full h-8 w-8 hover:bg-red-700 shadow-lg"><X className="w-4 h-4 text-white"/></Button>
                </div>
                <div className="flex justify-center gap-3">
                  <Button onClick={triggerPhotoUpload} variant="outline" className="text-white border-white/20 h-10 px-4">TROCAR FOTO</Button>
                  <Button onClick={prefillTestCards} className="bg-[#C9A35A] text-[#111111] h-10 px-4">SUGESTÃO IA</Button>
                </div>
              </div>
            )}
          </div>

          {/* Progresso das Cartas */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A35A]">
                {Object.values(cards).filter(c => c.confirmed).length} de 11 cartas confirmadas
              </p>
              <p className="text-[10px] font-bold text-[#111111]/40">
                {Math.round((Object.values(cards).filter(c => c.confirmed).length / 11) * 100)}%
              </p>
            </div>
            <div className="h-1.5 w-full bg-[#EBE5DB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#A61E25] transition-all duration-500" 
                style={{ width: `${(Object.values(cards).filter(c => c.confirmed).length / 11) * 100}%` }}
              />
            </div>
          </div>

          {/* Grid de Cartas Organizado */}
          <div className="space-y-12">
            {["VOCÊ", "ELE", "CENTRO", "TENDÊNCIA FUTURA"].map((section) => (
              <div key={section} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#C9A35A]/20" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A35A] whitespace-nowrap">{section}</h3>
                  <div className="h-px flex-1 bg-[#C9A35A]/20" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tarotPositions.filter(p => p.section === section).map(pos => (
                    <div key={pos.id} className={cn(
                      "bg-white p-6 rounded-[2rem] border shadow-sm space-y-4 transition-all hover:shadow-md",
                      isCardConfirmed(pos.id) ? "border-[#A61E25]/30 ring-1 ring-[#A61E25]/10" : "border-[#C9A35A]/10"
                    )}>
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-bold text-[#111111]/30 uppercase tracking-widest">{pos.label}</span>
                         {isCardConfirmed(pos.id) ? (
                           <span className="text-[9px] font-bold text-[#A61E25] uppercase tracking-widest flex items-center gap-1">
                             <Check className="w-3 h-3" /> Confirmada
                           </span>
                         ) : (
                           <span className="text-[9px] font-bold text-[#111111]/20 uppercase tracking-widest italic">Pendente</span>
                         )}
                      </div>

                      <div onClick={() => handleCardClick(pos.id)}
                        className={cn(
                          "aspect-[2/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
                          isCardConfirmed(pos.id) 
                            ? "bg-[#A61E25]/5 border-[#A61E25]/30" 
                            : "bg-[#F2EFE8] border-[#C9A35A]/20 hover:bg-[#C9A35A]/5"
                        )}
                      >
                        {isCardConfirmed(pos.id) ? (
                          <div className="text-center p-4">
                            <span className="text-sm font-bold text-[#111111] uppercase tracking-tighter block mb-2">{cards[pos.id].name}</span>
                            <div className="flex gap-2 justify-center">
                               <Button variant="ghost" className="h-7 px-2 text-[9px] font-bold uppercase tracking-widest hover:bg-[#A61E25]/10 hover:text-[#A61E25]">ALTERAR</Button>
                               <Button 
                                 variant="ghost" 
                                 onClick={(e) => { e.stopPropagation(); setCards(prev => { const n = {...prev}; delete n[pos.id]; return n; }); }}
                                 className="h-7 px-2 text-[9px] font-bold uppercase tracking-widest hover:bg-red-50 text-red-600/40 hover:text-red-600"
                               >
                                 LIMPAR
                               </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                             <Plus className="w-8 h-8 text-[#C9A35A]/40"/>
                             <span className="text-[10px] font-bold text-[#C9A35A]/60 uppercase tracking-widest">Selecionar</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20 pb-10 flex justify-center">
            <Button 
              onClick={() => nextStep()} 
              disabled={Object.values(cards).filter(c => c.confirmed).length < 11} 
              className={cn(
                "h-16 px-12 rounded-2xl font-bold transition-all shadow-xl",
                Object.values(cards).filter(c => c.confirmed).length === 11
                  ? "bg-[#A61E25] text-white hover:scale-105 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              MANIFESTAR LEITURA
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-12 animate-fade-up pb-20">
          {isReadingMode && (
            <div className="fixed top-0 left-0 w-full bg-[#111111] z-[100] p-4 flex items-center justify-between shadow-2xl border-b border-[#C9A35A]/30">
               <h2 className="text-white font-display text-sm">MODO LEITURA ATIVO: {selectedCliente?.name}</h2>
               <Button onClick={() => setIsReadingMode(false)} className="bg-[#A61E25] text-white text-xs h-10 px-4">SAIR</Button>
            </div>
          )}

          <div className={cn("text-center space-y-2", isReadingMode && "pt-24")}>
            <h2 className="text-3xl font-bold font-display uppercase italic text-[#111111]">Leitura Manifestada</h2>
            <p className="text-[#C9A35A] font-bold uppercase text-[10px]">{selectedCliente?.name} • {selectedSituation}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => setIsReadingMode(!isReadingMode)} className="bg-[#111111] text-white h-14 rounded-2xl px-8">
              <BookOpen className="w-5 h-5 mr-2" /> {isReadingMode ? "DESATIVAR" : "ATIVAR"} MODO LEITURA
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-12">
            <section className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b pb-2">Cartas confirmadas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tarotPositions.map(p => (
                  <div key={p.id} className="text-center p-3 bg-[#F2EFE8] rounded-xl">
                    <span className="text-[9px] block text-[#111111]/40 uppercase font-bold">{p.label}</span>
                    <span className="text-[11px] font-bold text-[#111111] uppercase">{cards[p.id]?.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#A61E25]/5 border-2 border-[#A61E25]/20 p-8 sm:p-12 rounded-[3rem] shadow-xl space-y-8">
              <h3 className="text-2xl font-bold font-display italic text-[#111111]">Roteiro para áudio</h3>
              <p className={cn("text-[#111111] italic font-serif leading-relaxed", isReadingMode ? "text-3xl" : "text-xl")}>
                “{generatedAudioScript}”
              </p>
              <Button onClick={() => copyToClipboard(generatedAudioScript)} className="bg-[#A61E25] text-white"><Copy className="w-4 h-4 mr-2"/> COPIAR ROTEIRO</Button>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {interpretationSections.map((s, i) => (
                <section key={i} className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A35A] mb-4">{s.title}</h4>
                  <p className={cn("text-[#111111]/80 leading-relaxed", isReadingMode ? "text-2xl" : "text-base")}>{s.content}</p>
                </section>
              ))}
            </div>

            <section className="bg-[#111111] p-10 rounded-[3.5rem] border-2 border-[#C9A35A]/30 text-white space-y-6">
              <h3 className="text-2xl font-display uppercase italic text-[#C9A35A]">Caminhos & Magias</h3>
              <p className="text-2xl font-bold italic">{indicatedMagia}</p>
            </section>

            <section className="bg-[#EBE5DB] p-10 rounded-[3.5rem] border border-[#C9A35A]/30 space-y-6">
              <h3 className="text-2xl font-display italic text-[#111111]">Texto para WhatsApp</h3>
              <div className="bg-white p-8 rounded-[2rem] text-lg font-medium text-[#111111]/70 whitespace-pre-wrap">{generatedWhatsAppText}</div>
              <Button onClick={() => copyToClipboard(generatedWhatsAppText)} className="bg-[#111111] text-white w-full h-14 rounded-2xl">COPIAR WHATSAPP</Button>
            </section>

            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              {reopenId ? (
                <>
                  <Button onClick={() => saveAttendance(false)} className="flex-1 bg-[#A61E25] text-white font-bold h-16 rounded-[2rem] text-lg shadow-xl">ATUALIZAR ATENDIMENTO</Button>
                  <Button onClick={() => saveAttendance(true)} variant="outline" className="flex-1 border-[#A61E25] text-[#A61E25] font-bold h-16 rounded-[2rem] text-lg">SALVAR COMO NOVO</Button>
                </>
              ) : (
                <Button onClick={() => saveAttendance(true)} className="flex-1 bg-[#A61E25] text-white font-bold h-16 rounded-[2rem] text-lg shadow-xl">SALVAR FICHA E FINALIZAR</Button>
              )}
              <Button variant="outline" onClick={() => navigate("/templo/dashboard")} className="h-16 rounded-[2rem] px-10">VOLTAR AO DASHBOARD</Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Visual de Seleção de Cartas */}
      <Dialog open={isCardModalOpen} onOpenChange={setIsCardModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90dvh] overflow-y-auto bg-[#F2EFE8] border-[#C9A35A]/30 rounded-[2rem] p-0">
          <DialogHeader className="p-8 pb-4 border-b border-[#C9A35A]/10">
            <DialogTitle className="text-2xl font-display italic text-[#111111]">Selecionar Carta</DialogTitle>
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A35A]" />
              <Input 
                placeholder="Buscar carta pelo nome..." 
                value={cardSearch}
                onChange={(e) => setCardSearch(e.target.value)}
                className="pl-12 bg-white border-[#C9A35A]/20 h-12 rounded-xl focus:ring-[#A61E25]"
              />
            </div>
          </DialogHeader>

          <div className="p-8 pt-4">
            <Tabs defaultValue="Arcanos Maiores" className="w-full">
              <TabsList className="w-full justify-start bg-transparent gap-2 mb-6 h-auto p-0 flex-wrap">
                {Object.keys(TAROT_DECK).map(tab => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className="data-[state=active]:bg-[#A61E25] data-[state=active]:text-white border border-[#C9A35A]/20 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(TAROT_DECK).map(([category, deck]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {deck
                      .filter(card => card.toLowerCase().includes(cardSearch.toLowerCase()))
                      .map(card => (
                        <button
                          key={card}
                          onClick={() => selectCard(card)}
                          className="p-4 rounded-xl bg-white border border-[#C9A35A]/10 hover:border-[#A61E25] hover:bg-[#A61E25]/5 transition-all text-sm font-bold text-[#111111] text-left uppercase tracking-tighter"
                        >
                          {card}
                        </button>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default NovoAtendimentoPage;