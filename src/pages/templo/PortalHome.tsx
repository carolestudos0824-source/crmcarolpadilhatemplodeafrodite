import React from 'react';
import { Link } from "react-router-dom";
import { 
  Send, 
  ClipboardList, 
  MessageSquare, 
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalHome() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="w-24 h-24 bg-white rounded-[2rem] p-4 mx-auto shadow-xl border border-[#C9A35A]/10 flex items-center justify-center animate-bounce-slow">
          <img 
            src="https://qtbkvshbmqlszncxlcuc.supabase.co/storage/v1/object/public/dsl-uploads/FKxI2UX5GWafusX2CZ1rulDlY5n1/1fcb5fad-cd93-4055-9587-35b167be7490.png" 
            alt="Carol Padilha" 
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-display text-[#111111] italic leading-tight">Portal da Cliente Carol Padilha</h1>
          <p className="text-[#111111]/60 font-medium uppercase tracking-[0.2em] text-xs max-w-md mx-auto">
            Envie seu caso com segurança e acompanhe seu atendimento espiritual.
          </p>
        </div>
        <p className="text-[#111111]/70 leading-relaxed max-w-xl mx-auto text-sm md:text-base px-4">
          Bem-vinda ao seu espaço de acolhimento. Aqui você pode enviar sua situação amorosa, acompanhar o andamento do atendimento e receber sua orientação de forma organizada.
        </p>
      </section>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <Link to="/portal/novo-atendimento" className="group">
          <div className="bg-[#A61E25] p-8 rounded-[2.5rem] shadow-xl shadow-[#A61E25]/10 border border-white/10 h-full flex flex-col justify-between transition-all group-hover:scale-[1.02] group-hover:shadow-[#A61E25]/20">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
              <Send className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display italic text-white">Enviar meu caso</h3>
              <p className="text-white/60 text-xs font-medium uppercase tracking-widest leading-relaxed">
                Relate sua situação para uma análise espiritual personalizada.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-[0.2em]">
              INICIAR <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link to="/portal/acompanhar" className="group">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-[#C9A35A]/5 border border-[#C9A35A]/10 h-full flex flex-col justify-between transition-all group-hover:scale-[1.02]">
            <div className="w-12 h-12 bg-[#C9A35A]/10 rounded-2xl flex items-center justify-center text-[#C9A35A] mb-6">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display italic text-[#111111]">Acompanhar atendimento</h3>
              <p className="text-[#111111]/40 text-xs font-medium uppercase tracking-widest leading-relaxed">
                Veja o status do seu caso e acesse suas leituras entregues.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-[#C9A35A] font-bold text-[10px] uppercase tracking-[0.2em]">
              VER STATUS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link to="/portal/mensagens" className="group">
          <div className="bg-[#111111] p-8 rounded-[2.5rem] shadow-xl border border-white/5 h-full flex flex-col justify-between transition-all group-hover:scale-[1.02]">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display italic text-white">Falar com Carol</h3>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest leading-relaxed">
                Troque mensagens internas e tire dúvidas sobre seu caso.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-[0.2em]">
              ABRIR CHAT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Safety Info */}
      <section className="bg-white/50 backdrop-blur-sm border border-[#C9A35A]/10 rounded-[3rem] p-8 md:p-12 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-[#C9A35A]/10 rounded-full flex items-center justify-center shrink-0">
          <ShieldCheck className="w-10 h-10 text-[#C9A35A]" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-lg font-bold text-[#111111] font-display italic">Sua privacidade é nossa prioridade</h4>
          <p className="text-[#111111]/60 text-sm leading-relaxed">
            Todas as informações enviadas por este portal são tratadas com sigilo absoluto e protegidas por criptografia. Somente a Carol Padilha terá acesso ao seu relato.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center space-y-4 pb-12">
        <div className="flex items-center justify-center gap-2 text-[#A61E25]">
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Templo de Afrodite</span>
        </div>
        <p className="text-[9px] text-[#111111]/30 font-bold uppercase tracking-widest">
          © 2026 Carol Padilha • Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
