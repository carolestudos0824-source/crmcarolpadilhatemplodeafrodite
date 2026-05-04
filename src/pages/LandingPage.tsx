import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import imgLouco from "@/assets/arcano-0-louco.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const colors = {
    vinho: "#4a1528",
    vinhoLight: "#6b1f35",
    azul: "#1a2a4a",
    dourado: "#c9a96e",
    white80: "rgba(255, 255, 255, 0.8)",
  };

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
    <div className="min-h-screen selection:bg-gold/30" style={{ backgroundColor: colors.vinho }}>
      {/* Background Aquarelado */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{ 
            background: `radial-gradient(circle at 20% 30%, ${colors.azul} 0%, transparent 50%), 
                         radial-gradient(circle at 80% 70%, ${colors.vinho} 0%, transparent 50%),
                         radial-gradient(circle at 50% 50%, ${colors.dourado} 0%, transparent 70%)` 
          }}
        />
      </div>

      <div className="relative z-10 font-sans text-white/90">
        
        {/* SEÇÃO 1 — HERO */}
        <section className="min-h-[95vh] flex items-center px-6 pt-12 pb-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Texto Hero */}
            <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-dourado">
                  ✦ Método Arcano Vivo · Base Rider-Waite-Smith
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl leading-[1.1] text-white">
                Aprenda a ler o tarô <span className="text-dourado italic">de verdade.</span><br />
                <span className="text-3xl md:text-5xl opacity-80">Não apenas decorar.</span>
              </h1>

              <p className="text-xl md:text-2xl font-light leading-relaxed max-w-xl mx-auto lg:mx-0 text-white/70">
                78 cartas. 78 lições. Uma jornada progressiva com símbolos, quizzes e prática — do Louco ao Mundo.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {["78 arcanos", "11 módulos", "R$16/mês no plano anual"].map((badge) => (
                  <span key={badge} className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium">
                    [ {badge} ]
                  </span>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  onClick={() => navigate("/auth")}
                  className="group h-16 px-12 text-lg font-heading tracking-widest uppercase rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl"
                  style={{ background: `linear-gradient(135deg, ${colors.vinho}, ${colors.vinhoLight})` }}
                >
                  Começar grátis <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
                <p className="text-sm text-white/40 italic">
                  Primeiro arcano gratuito. Sem cartão de crédito.
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="order-1 lg:order-2 flex justify-center items-center">
              <div className="relative group">
                <div className="absolute -inset-8 bg-dourado/20 rounded-full blur-[100px] animate-pulse" />
                <img
                  src={imgLouco}
                  alt="O Louco — Arcano 0"
                  className="relative w-64 md:w-80 lg:w-[400px] object-contain rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] border-4 border-white/10 transition-transform duration-700 group-hover:rotate-2 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2 — DOR */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-12 md:p-20 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl text-center space-y-8">
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 italic">
                "Você já tentou aprender tarô e ficou perdida em significados soltos, vídeos sem sequência e interpretações que não fazem sentido na hora da leitura?"
              </p>
              <div className="h-px w-24 bg-dourado/50 mx-auto" />
              <h3 className="text-3xl md:text-5xl font-heading text-white">
                Isso acontece porque falta método.<br />
                <span className="text-dourado">Não falta talento.</span>
              </h3>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3 — SOLUÇÃO */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "🃏 UMA CARTA POR VEZ", 
                desc: "Cada arcano tem sua própria lição completa: essência, símbolos, luz, sombra e voz." 
              },
              { 
                title: "📈 PROGRESSO REAL", 
                desc: "XP, streak diário e desbloqueio sequencial. Você sente que está avançando." 
              },
              { 
                title: "🎯 QUIZ QUE FIXA", 
                desc: "Não é decoreba. É compreensão testada com feedback imediato em cada questão." 
              }
            ].map((card, i) => (
              <div key={i} className="p-10 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 text-ink-strong shadow-xl flex flex-col items-center text-center space-y-4 hover:-translate-y-2 transition-transform duration-500">
                <h4 className="font-heading text-2xl font-bold text-vinho">{card.title}</h4>
                <p className="text-lg text-ink-body font-body leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 4 — COMO FUNCIONA */}
        <section className="py-32 px-6 bg-white/5 border-y border-white/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center font-heading text-4xl md:text-6xl text-white mb-20">Como funciona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { n: "①", t: "Comece pelo Louco", d: "Acesse agora e faça o primeiro módulo completo gratuitamente." },
                { n: "②", t: "Avance um arcano por dia", d: "Nossa trilha foi desenhada para uma absorção diária sem sobrecarga." },
                { n: "③", t: "Leia com profundidade", d: "Sinta a segurança de ler qualquer carta sem precisar de um manual." }
              ].map((step, i) => (
                <div key={i} className="space-y-4 text-center">
                  <span className="text-5xl text-dourado block font-heading">{step.n}</span>
                  <h5 className="text-2xl font-heading text-white">{step.t}</h5>
                  <p className="text-white/60 leading-relaxed font-body">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 5 — PREÇO */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="font-heading text-5xl md:text-7xl text-white">JORNADA COMPLETA</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plano Mensal */}
              <div className="p-12 rounded-[40px] bg-white/5 border border-white/10 flex flex-col justify-between items-center space-y-6">
                <h3 className="text-2xl font-heading text-white">Mensal</h3>
                <div className="space-y-1">
                  <p className="text-5xl font-heading text-white">R$29,90</p>
                  <p className="text-white/40">/mês</p>
                </div>
                <Button 
                  onClick={() => navigate("/auth")}
                  variant="outline"
                  className="w-full h-14 rounded-full border-white/20 text-white hover:bg-white/10"
                >
                  Assinar agora
                </Button>
              </div>

              {/* Plano Anual */}
              <div className="p-12 rounded-[40px] bg-white text-ink-strong relative shadow-2xl flex flex-col justify-between items-center space-y-6 overflow-hidden">
                <div className="absolute top-6 right-6 px-3 py-1 bg-vinho text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Melhor Valor
                </div>
                <h3 className="text-2xl font-heading text-vinho">Anual</h3>
                <div className="space-y-1">
                  <p className="text-5xl font-heading text-vinho">R$197</p>
                  <p className="text-ink-muted">/ano</p>
                  <p className="text-sm font-bold text-vinhoLight uppercase tracking-tighter">= R$16,42/mês</p>
                  <p className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded inline-block">Economia de 45%</p>
                </div>
                <Button 
                  onClick={() => navigate("/auth")}
                  className="w-full h-14 rounded-full font-bold shadow-lg shadow-vinho/20"
                  style={{ background: `linear-gradient(135deg, ${colors.vinho}, ${colors.vinhoLight})` }}
                >
                  ASSINAR AGORA →
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-white/60">
              <span className="flex items-center gap-2">✓ Cancele quando quiser</span>
              <span className="flex items-center gap-2">✓ Acesso imediato</span>
              <span className="flex items-center gap-2">✓ Primeiro arcano gratuito</span>
            </div>
          </div>
        </section>

        {/* SEÇÃO 6 — FAQ */}
        <section className="py-32 px-6 max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl text-center text-white mb-12">FAQ</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-8 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-xl font-heading text-white">{item.q}</span>
                  {openFaq === i ? <Minus className="text-dourado" /> : <Plus className="text-dourado" />}
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openFaq === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-8 pt-0 text-white/60 text-lg leading-relaxed font-body">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 7 — CTA FINAL */}
        <section className="py-40 px-6 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="font-heading text-5xl md:text-7xl text-white">
              Sua jornada começa hoje.<br />
              <span className="text-dourado italic">Uma carta por vez.</span>
            </h2>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="group h-20 px-16 text-xl font-heading tracking-[0.2em] uppercase rounded-full font-bold shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${colors.vinho}, ${colors.vinhoLight})` }}
          >
            COMEÇAR PELO LOUCO — É GRÁTIS →
          </Button>
        </section>

        {/* Footer */}
        <footer className="py-20 px-6 border-t border-white/10 text-center space-y-8">
          <div className="font-heading text-2xl tracking-[0.3em] font-bold text-white/50">
            TARÔ 78 CHAVES
          </div>
          <nav className="flex flex-wrap justify-center gap-8 text-sm text-white/40 uppercase tracking-widest">
            <a href="/privacidade" className="hover:text-dourado transition-colors">Privacidade</a>
            <a href="/termos" className="hover:text-dourado transition-colors">Termos</a>
            <a href="/suporte" className="hover:text-dourado transition-colors">Suporte</a>
          </nav>
          <p className="text-xs text-white/20">© 2024 Tarô 78 Chaves. Todos os direitos reservados.</p>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;