import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, ArrowLeft, Clock, Sparkles } from "lucide-react";
import mysticBg from "@/assets/mystic-bg.jpg";

const LEAGUE_NAMES = [
  "Areia", "Prata", "Ouro", "Pérola", "Safira", "Rubi", "Esmeralda", "Ametista", "Obsidiana", "Platina", "Diamante"
];

const MOCK_PLAYERS = [
  { name: "Mística Natural", xp: 1240, current: false },
  { name: "Portal Sagrado", xp: 980, current: false },
  { name: "Você", xp: 340, current: true },
  { name: "Estrela Guia", xp: 310, current: false },
  { name: "Caminho Real", xp: 150, current: false },
];

export default function LigasPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F0E8] relative">
      <div className="fixed inset-0 z-0 opacity-10">
        <img src={mysticBg} className="w-full h-full object-cover" alt="" />
      </div>

      <header className="relative z-10 p-6 flex items-center gap-4">
        <button onClick={() => navigate("/app")} className="p-2 rounded-full bg-white/50 border border-[#C9A96E]/20">
          <ArrowLeft className="w-5 h-5 text-[#6B2737]" />
        </button>
        <h1 className="font-display text-2xl text-[#6B2737]">Liga Semanal</h1>
      </header>

      <main className="relative z-10 max-w-xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#C9A96E]/20 mb-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200">
             <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="font-heading text-lg text-[#6B2737] mb-1">Liga de Areia</h2>
          <div className="flex items-center justify-center gap-2 text-xs text-[#3d2810]/60">
            <Clock className="w-3 h-3" />
            <span>Termina em 3 dias, 14 horas</span>
          </div>
        </div>

        <div className="space-y-2">
          {MOCK_PLAYERS.map((player, idx) => (
            <div 
              key={idx}
              className={`
                flex items-center gap-4 p-4 rounded-2xl border transition-all
                ${player.current ? 'bg-[#6B2737] border-[#6B2737] text-white scale-[1.02]' : 'bg-white/80 border-[#C9A96E]/10 text-[#3d2810]'}
                ${idx < 3 ? 'border-l-4 border-l-amber-400' : ''}
                ${idx > MOCK_PLAYERS.length - 2 ? 'border-l-4 border-l-red-300' : ''}
              `}
            >
              <span className="w-6 font-heading text-sm opacity-60">{idx + 1}</span>
              <div className="w-10 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center border border-[#C9A96E]/20 shrink-0">
                <span className="text-[#6B2737] font-heading text-sm">{player.name[0]}</span>
              </div>
              <span className="flex-1 font-heading text-sm truncate">{player.name}</span>
              <span className="font-heading text-sm">{player.xp} XP</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
