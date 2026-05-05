import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Star, Trophy, ArrowLeft, ChevronRight, Lock, Crown, User, Check, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useAuth } from "@/hooks/use-auth";
import { useAccess } from "@/hooks/use-access";
import { XPBar } from "@/components/XPBar";
import { StreakCounter } from "@/components/StreakCounter";
import mysticBg from "@/assets/mystic-bg.jpg";
import ornamentDivider from "@/assets/ornament-divider.png";
import { ARCANOS_MAIORES_CATALOG as ARCANOS, MODULES_CATALOG as MODULES } from "@/lib/content";

const SECTIONS = [
  { id: 1, name: "ARCANOS MAIORES", subtitle: "O Caminho do Herói", level: "Nível A1 — 22 cartas", cards: ARCANOS.slice(0, 22) },
  { id: 2, name: "ARCANOS MENORES: PAUS", subtitle: "O Elemento Fogo", level: "Nível A2 — 14 cartas", cards: [{ id: 100, name: "Ás de Paus", numeral: "Ás" }, { id: 101, name: "2 ao 5 de Paus", numeral: "2-5" }] },
];

export default function ModulesPage() {
  const navigate = useNavigate();
  const { progress, loading } = useProgress();
  const { bypassLocks } = useAccess();

  if (loading) return null;

  return (
    <div className="min-h-screen relative bg-[#F5F0E8]">
      <div className="fixed inset-0 z-0 opacity-20">
        <img src={mysticBg} className="w-full h-full object-cover" alt="" />
      </div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#C9A96E]/20 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <StreakCounter streak={progress.streak} />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6B2737]/10 border border-[#6B2737]/20">
              <Star className="w-4 h-4 text-[#6B2737]" fill="currentColor" />
              <span className="text-sm font-heading text-[#6B2737]">{progress.xp}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
              <span className="text-sm">❤️ 3</span>
            </div>
          </div>
          <button onClick={() => navigate("/perfil")} className="w-9 h-9 rounded-full bg-[#F5F0E8] border border-[#C9A96E]/30 flex items-center justify-center">
            <User className="w-5 h-5 text-[#6B2737]" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-6 py-8 pb-32">
        {SECTIONS.map((section) => (
          <div key={section.id} className="mb-12">
            <div className="bg-[#6B2737] rounded-2xl p-6 mb-10 text-center shadow-xl border border-[#C9A96E]/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />
              <h2 className="text-[#C9A96E] font-heading tracking-[0.2em] text-xs mb-1">{section.name}</h2>
              <h3 className="text-white font-display text-xl mb-1">{section.subtitle}</h3>
              <p className="text-white/60 text-[10px] font-heading tracking-widest">{section.level}</p>
            </div>

            <div className="flex flex-col items-center gap-8">
              {section.cards.map((card, idx) => {
                const isMajor = section.id === 1;
                const isCompleted = isMajor && progress.completedLessons.includes(`arcano-${card.id}`);
                const isUnlocked = bypassLocks || (isMajor && (card.id === 0 || progress.completedLessons.includes(`arcano-${(card.id as number) - 1}`)));
                const offset = Math.sin(idx * 0.8) * 40;

                return (
                  <div key={card.id} style={{ transform: `translateX(${offset}px)` }} className="relative group">
                    <button
                      onClick={() => isUnlocked && navigate(isMajor ? `/lesson/${card.id}` : '/app')}
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative z-10
                        ${isUnlocked ? 'scale-100 hover:scale-110 shadow-lg' : 'scale-90 opacity-60 grayscale'}
                        ${isCompleted ? 'bg-[#6B2737] border-4 border-[#C9A96E]' : 'bg-white border-4 border-[#E5E7EB]'}
                      `}
                    >
                      {isCompleted ? (
                        <Crown className="w-8 h-8 text-[#C9A96E]" fill="currentColor" />
                      ) : (
                        <span className={`font-heading text-xl ${isUnlocked ? 'text-[#6B2737]' : 'text-gray-400'}`}>
                          {card.numeral}
                        </span>
                      )}
                      
                      {isUnlocked && !isCompleted && (
                        <div className="absolute -inset-1 rounded-full border-2 border-[#C9A96E] animate-pulse" />
                      )}
                    </button>
                    
                    {!isUnlocked && (
                      <div className="absolute -top-1 -right-1 z-20 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100">
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                       <span className="text-[10px] font-heading text-[#3d2810]/60 uppercase tracking-tighter">
                         {card.name}
                       </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="fixed bottom-24 right-6">
          <button 
            onClick={() => navigate("/ligas")}
            className="w-14 h-14 rounded-2xl bg-white shadow-xl border border-[#C9A96E]/30 flex items-center justify-center group hover:bg-[#6B2737] transition-colors"
          >
            <Trophy className="w-7 h-7 text-[#C9A96E] group-hover:text-white" />
          </button>
        </div>
      </main>
    </div>
  );
}
