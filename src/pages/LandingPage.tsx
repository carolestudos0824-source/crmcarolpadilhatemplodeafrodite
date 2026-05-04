import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Minus, BookOpen, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Hero assets
import imgLouco from "@/assets/arcano-0-louco.jpg";

// Trail preview assets
import img0 from "@/assets/arcano-0-louco.jpg";
import img1 from "@/assets/arcano-1-mago.jpg";
import img2 from "@/assets/arcano-2-sacerdotisa.jpg";
import img3 from "@/assets/arcano-3-imperatriz.jpg";
import img4 from "@/assets/arcano-4-imperador.jpg";
import img5 from "@/assets/arcano-5-hierofante.jpg";
import img6 from "@/assets/arcano-6-enamorados.jpg";
import img7 from "@/assets/arcano-7-carro.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const colors = {
    vinho: "#4a1528",
    creme: "#FFFDF7",
    loucoAmarelo: "#F5C842",
    loucoAzul: "#4A7CB5",
    loucoBranco: "#FFF8DC",
    maiores: "#F5C842",
    copas: "#4A90D9",
    paus: "#E87B35",
    espadas: "#7B9BB5",
    ouros: "#6B9E5E",
  };

  const trailCards = [
    { img: img0, name: "O Louco", color: colors.maiores },
    { img: img1, name: "O Mago", color: colors.maiores },
    { img: img2, name: "A Sacerdotisa", color: colors.maiores },
    { img: img3, name: "A Imperatriz", color: colors.maiores },
    { img: img4, name: "O Imperador", color: colors.maiores },
    { img: img5, name: "O Hierofante", color: colors.maiores },
    { img: img6, name: "Os Enamorados", color: colors.maiores },
    { img: img7, name: "O Carro", color: colors.maiores },
  ];

  const faq = [
    {
      q: "Para quem é esse app?",
      a: "Para quem quer aprender tarô com método, não decoreba. Se você busca profundidade simbólica e uma estrutura clara de aprendizado, o Tarô 78 Chaves foi feito para você.",
    },
    {
      q: "Preciso saber algo sobre tarô para começar?",
      a: "Não. O app começa do zero com o Ás de cada naipe e os Arcanos Maiores em ordem cronológica e simbólica.",
    },
    {
      q: "Funciona no celular?",
      a: "Sim. É um web app (PWA) otimizado para funcionar em qualquer dispositivo, permitindo que você estude onde estiver.",
    },
    {
      q: "Como cancelo?",
      a: "Pelo seu perfil dentro do app, quando quiser. Sem letras miúdas ou burocracia.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body text-[#3d2810] selection:bg-[#F5C842]/30">
      
      {/* SEÇÃO 1 — HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5C842] via-[#FFF8DC] to-[#FFFDF7] pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Coluna Esquerda */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="bg-[#4A7CB5] text-white rounded-full px-4 py-1 text-sm font-bold inline-flex items-center gap-2 shadow-sm">
              ✦ GRÁTIS PARA COMEÇAR
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-[#1a0f0a] leading-tight">
              Aprenda tarô<br/>
              <span className="text-[#4A7CB5] italic">de forma progressiva</span><br/>
              e viva.
            </h1>

            <p className="text-xl md:text-2xl text-[#3d2810] leading-relaxed max-w-xl">
              Uma lição por dia. 78 cartas.<br/>
              XP, streaks e quizzes que fixam de verdade.
            </p>

            <div className="flex flex-wrap gap-4 text-sm font-bold text-[#3d2810]/70">
              <span className="flex items-center gap-1">🔥 Streak diário</span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1">⭐ XP</span>
              <span className="opacity-30">|</span>
              <span className="flex items-center gap-1">🏆 Certificado</span>
            </div>

            <div className="pt-4 space-y-4">
              <button 
                onClick={() => navigate("/auth")}
                className="bg-[#4A1528] text-white text-lg font-bold px-10 py-4 rounded-full shadow-lg hover:scale-105 transition-all active:scale-95 w-full sm:w-auto"
              >
                COMEÇAR GRÁTIS →
              </button>
              <p className="text-sm text-[#3d2810]/60">Primeiro arcano gratuito · Sem cartão de crédito</p>
            </div>
          </div>

          {/* Coluna Direita — Card Gamificado */}
          <div className="flex justify-center lg:justify-end animate-in fade-in slide-in-from-right duration-1000">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full border border-white/50 backdrop-blur-sm">
              {/* Carta do Louco */}
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                <img 
                  src={imgLouco} 
                  alt="O Louco" 
                  className="w-40 md:w-48 mx-auto rounded-xl shadow-md transform group-hover:rotate-2 transition-transform" 
                />
              </div>
              
              {/* Info da lição */}
              <div className="text-center">
                <span className="text-[10px] font-bold text-[#4A7CB5] tracking-[0.2em] uppercase">Lição 1 · Arcanos Maiores</span>
                <h3 className="font-display text-3xl font-bold text-[#1a0f0a] mt-1">O Louco</h3>
                <p className="text-sm text-gray-500 mb-4">O início de toda jornada</p>
              </div>
              
              {/* Barra de progresso */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <span>Progresso</span>
                  <span>35%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-[#F5C842] h-full rounded-full w-[35%] transition-all duration-1000 ease-out" />
                </div>
              </div>
              
              {/* Badges */}
              <div className="flex justify-center gap-3">
                <div className="bg-orange-50 border border-orange-100 rounded-2xl px-3 py-2 text-center min-w-[70px]">
                  <div className="text-xl mb-1">🔥</div>
                  <div className="text-[10px] font-bold text-orange-600 uppercase">3 dias</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-3 py-2 text-center min-w-[70px]">
                  <div className="text-xl mb-1">⭐</div>
                  <div className="text-[10px] font-bold text-yellow-600 uppercase">+10 XP</div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-2xl px-3 py-2 text-center min-w-[70px]">
                  <div className="text-xl mb-1">✓</div>
                  <div className="text-[10px] font-bold text-green-600 uppercase">Foco</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — TRILHA DE ARCANOS */}
      <section className="py-24 overflow-hidden border-y border-[#3d2810]/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="font-display text-3xl font-bold text-center">Explore a Trilha do Conhecimento</h2>
        </div>
        
        <div className="relative flex items-center">
          {/* Linha conectora de fundo */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0" />
          
          <div className="flex gap-12 px-12 pb-8 overflow-x-auto scrollbar-hide snap-x relative z-10">
            <TooltipProvider>
              {trailCards.map((card, i) => (
                <div key={i} className="flex-shrink-0 snap-center group">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="w-20 h-20 rounded-full border-4 shadow-lg overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2 cursor-pointer"
                        style={{ borderColor: card.color }}
                      >
                        <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1a0f0a] text-white border-none font-bold">
                      {card.name}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
              {/* Placeholder para outros naipes */}
              {[colors.copas, colors.paus, colors.espadas, colors.ouros].map((color, i) => (
                <div key={i} className="flex-shrink-0 snap-center">
                   <div 
                    className="w-20 h-20 rounded-full border-4 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center opacity-50"
                    style={{ borderColor: color }}
                  >
                    <span className="text-2xl">?</span>
                  </div>
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — COMO FUNCIONA */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              bg: "#FFF8DC",
              icon: "🃏",
              title: "UMA CARTA POR VEZ", 
              desc: "Cada arcano tem lição própria: essência, símbolos, luz, sombra, quiz." 
            },
            { 
              bg: "#EBF4FF",
              icon: "📈",
              title: "PROGRESSO REAL E VIVO", 
              desc: "XP, streak diário, desbloqueio sequencial. Você sente que está evoluindo." 
            },
            { 
              bg: "#EDFAF1",
              icon: "🎯",
              title: "QUIZ QUE REALMENTE FIXA", 
              desc: "Não é decoreba. É compreensão testada com feedback imediato." 
            }
          ].map((card, i) => (
            <div 
              key={i} 
              className="p-10 rounded-[32px] border border-black/5 shadow-sm space-y-6 hover:shadow-xl transition-all duration-500"
              style={{ backgroundColor: card.bg }}
            >
              <div className="text-4xl">{card.icon}</div>
              <h4 className="font-display text-2xl font-bold leading-tight text-[#1a0f0a]">{card.title}</h4>
              <p className="text-lg text-[#3d2810]/70 font-body leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 4 — PREÇO */}
      <section className="py-32 px-6 bg-white border-y border-[#3d2810]/5">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a0f0a]">Acesso Completo</h2>
            <p className="text-xl text-[#3d2810]/60">Escolha o plano que melhor se adapta ao seu ritmo.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Plano Mensal */}
            <div className="p-10 rounded-[32px] bg-gray-50 border border-gray-100 flex flex-col items-center space-y-8 transition-transform hover:scale-[1.02]">
              <h3 className="text-xl font-bold text-gray-500 uppercase tracking-widest">Mensal</h3>
              <div className="text-center">
                <span className="text-5xl font-display font-bold text-[#1a0f0a]">R$29,90</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                className="w-full h-14 rounded-full border-gray-300 text-[#1a0f0a] font-bold hover:bg-white"
              >
                Assinar mensal
              </Button>
            </div>

            {/* Plano Anual */}
            <div className="p-10 rounded-[32px] bg-white border-2 border-[#4A1528] relative shadow-2xl flex flex-col items-center space-y-8 transform md:scale-110 transition-transform">
              <div className="absolute -top-4 px-4 py-1.5 bg-[#4A1528] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg">
                ✦ MELHOR VALOR
              </div>
              <h3 className="text-xl font-bold text-[#4A1528] uppercase tracking-widest">Anual</h3>
              <div className="text-center">
                <span className="text-6xl font-display font-bold text-[#1a0f0a]">R$197</span>
                <span className="text-gray-400">/ano</span>
                <div className="mt-2 text-[#4A1528] font-bold text-sm">
                  = R$16,42/mês · Economia de 45%
                </div>
              </div>
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full h-14 rounded-full font-bold bg-[#4A1528] hover:bg-[#6b1f35] text-white shadow-lg"
              >
                ASSINAR ANUAL →
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-400">
            <span>✓ Cancele quando quiser</span>
            <span>✓ Acesso imediato</span>
            <span>✓ Primeiro arcano gratuito</span>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — FAQ */}
      <section className="py-32 px-6 bg-[#FFF8EE]">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="font-display text-4xl text-center font-bold text-[#1a0f0a]">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white border border-black/5 overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-bold text-[#1a0f0a]">{item.q}</span>
                  <div className="w-8 h-8 rounded-full bg-[#4A1528]/5 flex items-center justify-center text-[#4A1528]">
                    {openFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openFaq === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-6 pt-0 text-[#3d2810]/70 text-lg leading-relaxed border-t border-gray-50 mt-2">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO — INSTALE O APP */}
      <section className="py-20 bg-[#FFF8EE]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#4A1528] text-white rounded-full px-4 py-2 text-sm font-bold mb-6">
            📱 DISPONÍVEL NO SEU CELULAR
          </div>

          <h2 className="font-display text-4xl font-bold text-[#1a0f0a] mb-4">
            Instale no seu celular.<br/>
            <span className="text-[#4A1528] italic">Sem passar pela loja de apps.</span>
          </h2>

          <p className="text-lg text-[#3d2810]/70 max-w-xl mx-auto mb-12">
            O Tarô 78 Chaves funciona como um app nativo no seu iPhone ou Android — 
            sem precisar baixar nada da App Store ou Google Play.
          </p>

          {/* Cards de instrução — iPhone e Android lado a lado */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            
            {/* iPhone */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-left">
              <div className="text-3xl mb-3">🍎</div>
              <h3 className="font-display text-xl font-bold text-[#1a0f0a] mb-4">iPhone (Safari)</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-[#4A1528] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span className="text-sm text-gray-600">Abra o site no <strong>Safari</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-[#4A1528] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span className="text-sm text-gray-600">Toque no ícone de <strong>compartilhar</strong> (quadrado com seta)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-[#4A1528] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span className="text-sm text-gray-600">Selecione <strong>"Adicionar à Tela de Início"</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-[#4A1528] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                  <span className="text-sm text-gray-600">Toque em <strong>Adicionar</strong> — pronto! ✓</span>
                </li>
              </ol>
            </div>

            {/* Android */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-left">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-display text-xl font-bold text-[#1a0f0a] mb-4">Android (Chrome)</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-[#4A1528] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <span className="text-sm text-gray-600">Abra o site no <strong>Chrome</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-[#4A1528] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <span className="text-sm text-gray-600">Toque nos <strong>3 pontos</strong> no canto superior direito</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-[#4A1528] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <span className="text-sm text-gray-600">Selecione <strong>"Adicionar à tela inicial"</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-[#4A1528] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                  <span className="text-sm text-gray-600">Confirme — o app aparece na sua tela! ✓</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Benefícios */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "✓ Funciona sem internet (offline)",
              "✓ Ícone na tela inicial",
              "✓ Tela cheia sem barra do navegador",
              "✓ Notificações de streak",
            ].map((item) => (
              <span key={item} className="bg-white border border-[#c9a96e]/30 rounded-full px-4 py-2 text-sm text-[#3d2810] font-medium shadow-sm">
                {item}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* SEÇÃO 6 — CTA FINAL */}
      <section className="py-40 px-6 text-center bg-gradient-to-t from-[#F5C842]/20 to-[#FFFDF7]">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="font-display text-5xl md:text-7xl font-bold text-[#1a0f0a] leading-tight">
            Sua jornada começa hoje.<br />
            <span className="text-[#4A7CB5] italic">Uma carta por vez.</span>
          </h2>
          <Button
            onClick={() => navigate("/auth")}
            className="group h-20 px-16 text-xl font-bold bg-[#4A1528] hover:bg-[#6b1f35] text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95"
          >
            COMEÇAR PELO LOUCO — É GRÁTIS →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-black/5 text-center space-y-10">
        <div className="font-display text-2xl tracking-[0.4em] font-bold text-[#1a0f0a]">
          TARÔ 78 CHAVES
        </div>
        <nav className="flex flex-wrap justify-center gap-8 text-sm font-bold text-[#3d2810]/40 uppercase tracking-widest">
          <a href="/privacidade" className="hover:text-[#4A1528] transition-colors">Privacidade</a>
          <a href="/termos" className="hover:text-[#4A1528] transition-colors">Termos</a>
          <a href="/suporte" className="hover:text-[#4A1528] transition-colors">Suporte</a>
        </nav>
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#3d2810]/30 tracking-widest">© 2026 TARÔ 78 CHAVES</p>
          <p className="text-[10px] text-[#3d2810]/20 uppercase font-bold">Feito para buscadores da verdade</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;