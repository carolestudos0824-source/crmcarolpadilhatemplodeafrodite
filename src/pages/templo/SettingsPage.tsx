import { User, Phone, Globe, Shield, CreditCard, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-3xl font-bold text-[#111111] font-display">Configurações</h1>
        <p className="text-[#111111]/60 font-medium">Personalize sua experiência no CRM.</p>
      </header>

      <div className="space-y-6">
        {/* Perfil */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0EA] pb-4 mb-6">
            <User className="w-5 h-5 text-[#C9A35A]" />
            <h2 className="text-lg font-bold text-[#111111] font-display uppercase tracking-widest">Perfil Profissional</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Nome de Exibição</label>
              <Input defaultValue="Carol Padilha" className="h-14 rounded-2xl border-[#C9A35A]/20" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">WhatsApp Oficial</label>
              <Input defaultValue="(11) 99999-9999" className="h-14 rounded-2xl border-[#C9A35A]/20" />
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0EA] pb-4 mb-6">
            <CreditCard className="w-5 h-5 text-[#A61E25]" />
            <h2 className="text-lg font-bold text-[#111111] font-display uppercase tracking-widest">Tabela de Valores</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Consulta Base</label>
              <Input defaultValue="R$ 250,00" className="h-14 rounded-2xl border-[#C9A35A]/20" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Magia Base (Adoçamento)</label>
              <Input defaultValue="R$ 450,00" className="h-14 rounded-2xl border-[#C9A35A]/20" />
            </div>
          </div>
        </div>

        {/* Sistema */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#F4F0EA] pb-4 mb-6">
            <Palette className="w-5 h-5 text-[#C9A35A]" />
            <h2 className="text-lg font-bold text-[#111111] font-display uppercase tracking-widest">Identidade do CRM</h2>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F0EA]">
                <span className="text-sm font-bold text-[#111111]">Modo Escuro (Manual)</span>
                <div className="w-12 h-6 bg-[#C9A35A]/20 rounded-full relative">
                   <div className="absolute left-1 top-1 w-4 h-4 bg-[#C9A35A] rounded-full" />
                </div>
             </div>
             <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F0EA]">
                <span className="text-sm font-bold text-[#111111]">Notificações WhatsApp</span>
                <div className="w-12 h-6 bg-[#A61E25] rounded-full relative">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
             </div>
          </div>
        </div>

        <Button className="w-full bg-[#A61E25] text-white font-bold h-16 rounded-2xl shadow-xl shadow-[#A61E25]/20 gap-2">
          <Save className="w-5 h-5" />
          SALVAR ALTERAÇÕES
        </Button>
      </div>
    </div>
  );
}