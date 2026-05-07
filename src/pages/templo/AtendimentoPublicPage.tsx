import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { SITUACOES_AMOROSAS, TIPOS_ATENDIMENTO } from '@/types/templo/lead';
import { leadService } from '@/types/templo/leadService';
import { cn } from '@/lib/utils';

export default function AtendimentoPublicPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    instagram: '',
    tipoAtendimento: 'Jogo do Amor',
    situacaoAmorosa: '',
    nomePessoaEnvolvida: '',
    relato: '',
    jaFezConsulta: false,
    canalRetorno: 'Portal' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await leadService.createLead(formData);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Erro ao enviar pré-atendimento:", error);
      alert("Ocorreu um erro ao enviar seu caso. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F4F0EA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-[#C9A35A]/10 text-center space-y-6">
          <div className="w-20 h-20 bg-[#A61E25]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-[#A61E25]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display text-[#111111] italic">Seu caso foi enviado.</h1>
          <p className="text-[#111111]/70 leading-relaxed">
            A Carol irá analisar e retornar pelo contato informado. Aguarde o nosso retorno com carinho.
          </p>
          <div className="pt-4 text-[#C9A35A] font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:text-[#A61E25] transition-colors"
            onClick={() => navigate('/portal')}>
            ACESSAR MEU PORTAL
          </div>
          <div className="pt-4">
            <Heart className="w-6 h-6 text-[#A61E25] mx-auto animate-pulse fill-[#A61E25]/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0EA] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-4 border border-[#C9A35A]/10">
            <img 
              src="https://qtbkvshbmqlszncxlcuc.supabase.co/storage/v1/object/public/dsl-uploads/FKxI2UX5GWafusX2CZ1rulDlY5n1/1fcb5fad-cd93-4055-9587-35b167be7490.png" 
              alt="Carol Padilha" 
              className="w-24 h-auto mx-auto"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-[#111111] italic">Pré-atendimento Carol Padilha</h1>
          <p className="text-[#111111]/60 font-medium uppercase tracking-[0.2em] text-[10px]">
            Conte sua situação para que eu possa direcionar melhor o seu atendimento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-[#C9A35A]/10 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 ml-1">Seu Nome</label>
              <input
                required
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full h-14 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all"
                placeholder="Como prefere ser chamada?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 ml-1">WhatsApp</label>
              <input
                required
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full h-14 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 ml-1">Qual sua situação amorosa atual?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SITUACOES_AMOROSAS.map((sit) => (
                <button
                  key={sit}
                  type="button"
                  onClick={() => setFormData({...formData, situacaoAmorosa: sit})}
                  className={cn(
                    "px-4 py-3 rounded-xl text-xs font-medium border transition-all text-left",
                    formData.situacaoAmorosa === sit
                      ? "bg-[#A61E25] text-white border-[#A61E25] shadow-lg shadow-[#A61E25]/20"
                      : "bg-[#F4F0EA]/30 text-[#111111]/70 border-[#C9A35A]/10 hover:border-[#C9A35A]/30 hover:bg-white"
                  )}
                >
                  {sit}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 ml-1">Relato do seu caso</label>
            <textarea
              required
              rows={5}
              value={formData.relato}
              onChange={(e) => setFormData({...formData, relato: e.target.value})}
              className="w-full bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-[1.5rem] p-6 focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all resize-none"
              placeholder="Conte detalhadamente o que está acontecendo..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.situacaoAmorosa}
            className="w-full h-16 bg-[#111111] hover:bg-[#A61E25] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:hover:bg-[#111111]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Enviar meu caso
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <footer className="mt-12 text-center text-[#111111]/40 text-[10px] font-bold uppercase tracking-widest space-y-2">
          <p>© Templo de Afrodite CRM</p>
          <p className="italic">Conexão • Espiritualidade • Clareza</p>
        </footer>
      </div>
    </div>
  );
}
