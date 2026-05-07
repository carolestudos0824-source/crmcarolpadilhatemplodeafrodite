import { useState, useRef, ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
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
  PlusCircle,
  Plus,
  X,
  RefreshCw,
  Copy,
  Zap,
  Shield,
  Eye,
  AudioLines,
  Maximize2,
  Minimize2
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
  const [isReadingMode, setIsReadingMode] = useState(false);
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
        toast({ title: "Confirmação Pendente", description: "Confirme as 11 cartas antes de continuar.", variant: "destructive" });
        return;
      }
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const indicatedMagia = useMemo(() => {
    if (!cards[11]?.confirmed) return "Nenhuma magia indicada no momento";
    const c11 = cards[11].name.toLowerCase();
    const c8 = cards[8]?.name.toLowerCase() || "";
    if (selectedSituation.includes("sumindo") || selectedSituation.includes("fria")) return "Adoçamento com Abertura de Diálogo";
    if (c11.includes("estrela") || c11.includes("mundo")) return "Harmonização Amorosa";
    if (c11.includes("diabo") || c11.includes("torre") || c8.includes("diabo")) return "Limpeza Energética Amorosa";
    return "Banho de magnetismo pessoal";
  }, [cards, selectedSituation]);

  const generatedWhatsAppText = useMemo(() => {
    const nome = selectedCliente?.name || "";
    const baseText = nome ? `Olá ${nome}! Finalizei sua leitura no Templo de Afrodite. 🌹\n\n` : `Olá! Finalizei sua leitura no Templo de Afrodite. 🌹\n\n`;
    let cardsConfirmed = "Cartas da sua tiragem:\n";
    tarotPositions.forEach(p => { cardsConfirmed += `- ${p.label}: ${cards[p.id]?.name || "N/A"}\n`; });
    return baseText + cardsConfirmed + `\nDiagnóstico: ${selectedSituation}. Recomendo: ${indicatedMagia}.`;
  }, [selectedCliente, cards, selectedSituation, indicatedMagia]);

  const generatedAudioScript = useMemo(() => {
    const nome = selectedCliente?.name || "consulente";
    return `Olha ${nome}, analisei as energias e o jogo mostra uma transição importante. Na sua mente, ${cards[1]?.name || "a carta"} indica foco, enquanto no coração ${cards[2]?.name || "a carta"} traz sensibilidade. Sobre o futuro, ${indicatedMagia === 'Nenhuma magia indicada no momento' ? 'o momento é de paciência' : 'o caminho está aberto para ' + indicatedMagia}.`;
  }, [selectedCliente, cards, indicatedMagia]);

  const interpretationSections = useMemo(() => {
    return [
      { title: "Diagnóstico Geral", content: `Análise profunda da situação: ${selectedSituation}.` },
      { title: "Pensamentos dela", content: `${cards[1]?.name || "Carta"} reflete seu estado mental atual.` },
      { title: "Sentimentos dela", content: `${cards[2]?.name || "Carta"} mostra o que seu coração carrega.` },
      { title: "Desejos dela", content: `${cards[3]?.name || "Carta"} revela seu desejo mais profundo.` },
      { title: "Pensamentos dele", content: `${cards[4]?.name || "Carta"} mostra a mentalidade dele no momento.` },
      { title: "Sentimentos dele", content: `${cards[5]?.name || "Carta"} revela o que ele sente secretamente.` },
      { title: "Desejos dele", content: `${cards[6]?.name || "Carta"} mostra a direção das vontades dele.` },
      { title: "Conselho espiritual", content: `${cards[7]?.name || "Carta"} é a chave para o seu próximo passo.` },
      { title: "Obstáculo principal", content: `${cards[8]?.name || "Carta"} é o desafio que precisa ser superado.` },
      { title: "Tendência futura", content: `${cards[9]?.name || "Carta"}, ${cards[10]?.name || "Carta"} e ${cards[11]?.name || "Carta"} trazem as revelações dos próximos tempos.` }
    ];
  }, [cards, selectedSituation]);

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
    if (file) {
      setTiragemPhoto(URL.createObjectURL(file));
      setPhotoFile(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!", description: "Conteúdo copiado para a área de transferência." });
  };

  const saveAttendance = () => {
    toast({ title: "Salvo!", description: "Atendimento registrado no histórico." });
    setTimeout(() => navigate("/templo/dashboard"), 1500);
  };

  return (
    <div className={cn("max-w-4xl mx-auto pb-24 animate-fade-in", isReadingMode && "max-w-2xl")}>
      {step < 5 && (
        <header className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => step > 1 ? prevStep() : navigate(-1)} className="rounded-xl border border-[#C9A35A]/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={cn("w-12 h-1.5 rounded-full transition-all", step >= s ? "bg-[#A61E25]" : "bg-[#ECE5DC]")} />
              ))}
            </div>
          </div>
        </header>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold font-display">Identificação da Cliente</h1>
          <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-4">
            {["Mariana Silva", "Beatriz Oliveira", "Julia Santos"].map((name) => (
              <button key={name} onClick={() => { setSelectedCliente({ name }); nextStep(); }} className="w-full flex items-center justify-between p-5 rounded-2xl border border-[#C9A35A]/10 hover:border-[#A61E25] transition-all">
                <span className="font-bold">{name}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {situations.map((sit) => (
            <button key={sit} onClick={() => { setSelectedSituation(sit); nextStep(); }} className="p-6 rounded-2xl border border-[#C9A35A]/10 hover:border-[#A61E25] transition-all text-left font-bold">
              {sit}
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Textarea value={relato} onChange={(e) => setRelato(e.target.value)} className="min-h-[200px] rounded-2xl" placeholder="Relato da cliente..." />
          <Button onClick={nextStep} className="w-full h-14 bg-[#111111] text-white">CONTINUAR</Button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <Button onClick={prefillTestCards} className="w-full bg-[#C9A35A]">PREENCHER TESTE</Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tarotPositions.map(p => (
              <div key={p.id} className="p-4 border rounded-xl">
                <p className="text-xs font-bold uppercase">{p.label}</p>
                <Input placeholder="Nome da carta" value={cards[p.id]?.name || ""} onChange={(e) => handleCardUpdate(p.id, e.target.value, "")} />
              </div>
            ))}
          </div>
          <Button onClick={nextStep} className="w-full h-16 bg-[#A61E25] text-white font-bold">MANIFESTAR LEITURA</Button>
        </div>
      )}

      {step === 5 && (
        <div className={cn("space-y-8", isReadingMode && "fixed inset-0 z-50 bg-[#F2EFE8] p-8 overflow-y-auto")}>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-display">Leitura Manifestada</h1>
            <Button variant="outline" onClick={() => setIsReadingMode(!isReadingMode)}>
              {isReadingMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#C9A35A]/20 shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b pb-4">Cartas confirmadas</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {tarotPositions.map(p => <p key={p.id}><strong>{p.label}:</strong> {cards[p.id]?.name}</p>)}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#C9A35A]/20 shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b pb-4">Interpretação Completa</h2>
            {interpretationSections.map((s, i) => (
              <div key={i}>
                <h3 className="font-bold text-[#A61E25]">{s.title}</h3>
                <p className="text-lg leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111111] text-white p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-[#C9A35A]">Roteiro para áudio</h2>
            <p className="text-lg leading-relaxed">{generatedAudioScript}</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#C9A35A]/20 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">Texto pronto para WhatsApp</h2>
            <p className="text-lg leading-relaxed">{generatedWhatsAppText}</p>
          </div>

          <div className="flex gap-4 pb-20">
            <Button onClick={() => copyToClipboard(generatedAudioScript)} className="flex-1">Copiar Áudio</Button>
            <Button onClick={() => copyToClipboard(generatedWhatsAppText)} className="flex-1">Copiar WhatsApp</Button>
            <Button onClick={saveAttendance} className="flex-1 bg-[#A61E25]">Salvar Ficha</Button>
          </div>
        </div>
      )}
    </div>
  );
}
