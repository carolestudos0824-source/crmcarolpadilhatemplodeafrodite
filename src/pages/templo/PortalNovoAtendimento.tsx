import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, CheckCircle2, ArrowRight, MessageSquare, Info } from 'lucide-react';
import { SITUACOES_AMOROSAS, TIPOS_ATENDIMENTO } from '@/types/templo/lead';
import { leadService } from '@/types/templo/leadService';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function PortalNovoAtendimento() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    instagram: '',
    tipoAtendimento: '',
    situacaoAmorosa: '',
    nomePessoaEnvolvida: '',
    relato: '',
    jaFezConsulta: false,
    canalRetorno: 'WhatsApp' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await leadService.createLead(formData);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Erro ao enviar caso:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-8 animate-fade-in text-center py-12">
        <div className="max-w-md mx-auto bg-white rounded-[2.5rem] p-12 shadow-xl border border-[#C9A35A]/10 space-y-8">
          <div className="w-20 h-20 bg-[#A61E25]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-[#A61E25]" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-display text-[#111111] italic">Caso enviado com sucesso!</h1>
            <p className="text-[#111111]/70 leading-relaxed">
              A Carol irá analisar sua situação e atualizar o status do seu atendimento. Você pode acompanhar tudo por aqui.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/portal/acompanhar')}
            className="w-full bg-[#111111] text-white h-14 rounded-2xl font-bold uppercase tracking-widest text-xs"
          >
            ACOMPANHAR AGORA
          </Button>
          <div className="pt-4">
            <Heart className="w-6 h-6 text-[#A61E25] mx-auto animate-pulse fill-[#A61E25]/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-display text-[#111111] italic leading-tight">Envie seu caso</h1>
        <p className="text-[#111111]/60 font-medium uppercase tracking-[0.2em] text-[10px] max-w-sm mx-auto">
          Preencha os detalhes abaixo para que eu possa direcionar seu atendimento.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-[#C9A35A]/10 space-y-10">
        {/* Identificação */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#C9A35A]/10 pb-2">
            <div className="w-2 h-2 rounded-full bg-[#A61E25]" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Sua Identificação</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 ml-1">Nome Completo</label>
              <input
                required
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full h-14 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all"
                placeholder="Como deseja ser chamada?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 ml-1">WhatsApp</label>
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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 ml-1">E-mail (opcional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full h-14 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all"
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 ml-1">Instagram (opcional)</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                className="w-full h-14 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all"
                placeholder="@usuario"
              />
            </div>
          </div>
        </div>

        {/* Atendimento */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#C9A35A]/10 pb-2">
            <div className="w-2 h-2 rounded-full bg-[#C9A35A]" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Sobre o Atendimento</h3>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 ml-1">O que você busca hoje?</label>
            <div className="flex flex-wrap gap-2">
              {TIPOS_ATENDIMENTO.map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setFormData({...formData, tipoAtendimento: tipo})}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                    formData.tipoAtendimento === tipo
                      ? "bg-[#C9A35A] text-white border-[#C9A35A] shadow-md shadow-[#C9A35A]/20"
                      : "bg-[#F4F0EA]/30 text-[#111111]/50 border-[#C9A35A]/10 hover:border-[#C9A35A]/30"
                  )}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 ml-1">Qual sua situação amorosa?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SITUACOES_AMOROSAS.map((sit) => (
                <button
                  key={sit}
                  type="button"
                  onClick={() => setFormData({...formData, situacaoAmorosa: sit})}
                  className={cn(
                    "px-4 py-3 rounded-xl text-xs font-medium border transition-all text-left flex items-center justify-between",
                    formData.situacaoAmorosa === sit
                      ? "bg-[#A61E25] text-white border-[#A61E25] shadow-lg shadow-[#A61E25]/20"
                      : "bg-[#F4F0EA]/30 text-[#111111]/70 border-[#C9A35A]/10 hover:border-[#C9A35A]/30"
                  )}
                >
                  {sit}
                  {formData.situacaoAmorosa === sit && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 ml-1">Nome da pessoa envolvida (opcional)</label>
            <input
              type="text"
              value={formData.nomePessoaEnvolvida}
              onChange={(e) => setFormData({...formData, nomePessoaEnvolvida: e.target.value})}
              className="w-full h-14 bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all"
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/60 ml-1">Relato detalhado do seu caso</label>
            <textarea
              required
              rows={6}
              value={formData.relato}
              onChange={(e) => setFormData({...formData, relato: e.target.value})}
              className="w-full bg-[#F4F0EA]/50 border border-[#C9A35A]/10 rounded-[2rem] p-6 focus:outline-none focus:ring-2 focus:ring-[#C9A35A]/20 transition-all resize-none leading-relaxed"
              placeholder="Abra seu coração... Conte o que está acontecendo."
            />
          </div>
        </div>

        {/* Preferências */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-[#C9A35A]/10 pb-2">
            <div className="w-2 h-2 rounded-full bg-[#111111]" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40">Preferências de Retorno</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
             <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="jaFez"
                  checked={formData.jaFezConsulta}
                  onChange={(e) => setFormData({...formData, jaFezConsulta: e.target.checked})}
                  className="w-5 h-5 rounded border-[#C9A35A]/30 text-[#A61E25] focus:ring-[#A61E25]"
                />
                <label htmlFor="jaFez" className="text-sm font-medium text-[#111111]/70">Já fiz consulta com a Carol antes</label>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 block">Deseja receber retorno por:</label>
                <div className="flex gap-4">
                   {['Portal', 'WhatsApp', 'Ambos'].map((canal) => (
                     <button
                       key={canal}
                       type="button"
                       onClick={() => setFormData({...formData, canalRetorno: canal as any})}
                       className={cn(
                         "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                         formData.canalRetorno === canal
                           ? "bg-[#111111] text-white border-[#111111]"
                           : "bg-white text-[#111111]/40 border-[#C9A35A]/20 hover:border-[#C9A35A]/40"
                       )}
                     >
                       {canal}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.tipoAtendimento || !formData.situacaoAmorosa}
          className="w-full h-18 bg-[#A61E25] hover:bg-[#8B191F] text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-xl shadow-[#A61E25]/20 mt-12 py-6"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Enviar meu caso com segurança
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="bg-[#111111] p-8 rounded-[3rem] text-white flex items-start gap-4 border border-[#C9A35A]/30">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
          <Info className="w-6 h-6 text-[#C9A35A]" />
        </div>
        <div className="space-y-2">
           <p className="text-sm font-bold uppercase tracking-widest text-[#C9A35A]">Próximo Passo</p>
           <p className="text-sm text-white/60 leading-relaxed">
             Após enviar seu caso, ele entrará em nossa fila de análise. Você poderá acompanhar o status em tempo real clicando em <strong>Acompanhar Atendimento</strong> no menu superior.
           </p>
        </div>
      </div>
    </div>
  );
}
