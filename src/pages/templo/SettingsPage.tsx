import { User, Phone, Globe, Shield, CreditCard, Palette, Save, Download, Upload, Trash2, Instagram, Mail, FileText, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { storage, Settings } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(storage.getSettings());

  const handleSave = () => {
    storage.saveSettings(settings);
    toast({
      title: "Sucesso!",
      description: "Ajustes salvos com sucesso.",
    });
  };

  const handleExport = () => {
    const backup = storage.exportBackup();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `templo-afrodite-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast({ title: "Backup exportado!", description: "Arquivo salvo com sucesso." });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          storage.importBackup(json, 'merge');
          toast({ title: "Backup importado!", description: "Dados mesclados com sucesso." });
          window.location.reload();
        } catch (err) {
          toast({ title: "Erro na importação", description: "Arquivo inválido.", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

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
              <Input 
                value={settings.nomeProfissional} 
                onChange={(e) => handleChange('nomeProfissional', e.target.value)}
                className="h-14 rounded-2xl border-[#C9A35A]/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">WhatsApp Oficial</label>
              <Input 
                value={settings.whatsapp} 
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="h-14 rounded-2xl border-[#C9A35A]/20" 
              />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Instagram</label>
               <Input 
                 value={settings.instagram || ''} 
                 onChange={(e) => handleChange('instagram' as any, e.target.value)}
                 className="h-14 rounded-2xl border-[#C9A35A]/20" 
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">E-mail</label>
               <Input 
                 value={settings.email || ''} 
                 onChange={(e) => handleChange('email' as any, e.target.value)}
                 className="h-14 rounded-2xl border-[#C9A35A]/20" 
               />
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
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Consulta (30 min)</label>
              <Input 
                value={settings.valorConsulta} 
                onChange={(e) => handleChange('valorConsulta', e.target.value)}
                className="h-14 rounded-2xl border-[#C9A35A]/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#111111]/70 ml-1">Magia Base (Adoçamento)</label>
              <Input 
                value={settings.valorMagia} 
                onChange={(e) => handleChange('valorMagia', e.target.value)}
                className="h-14 rounded-2xl border-[#C9A35A]/20" 
              />
            </div>
          </div>
        </div>

        {/* Backup */}
        <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#C9A35A]/30 shadow-xl space-y-6">
           <div className="flex items-center gap-3 border-b border-white/10 pb-4">
             <Shield className="w-5 h-5 text-[#C9A35A]" />
             <h2 className="text-lg font-bold text-white font-display uppercase tracking-widest">Backup & Segurança</h2>
           </div>
           
           <p className="text-white/40 text-xs italic leading-relaxed">Este sistema salva dados localmente neste navegador. Para evitar perda de informações, exporte backups regularmente.</p>
           
           <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExport} className="flex-1 bg-[#C9A35A] text-[#111111] font-bold h-14 rounded-2xl gap-2">
                 <Download className="w-4 h-4" /> EXPORTAR BACKUP
              </Button>
              <div className="flex-1 relative">
                 <input type="file" onChange={handleImport} accept=".json" className="absolute inset-0 opacity-0 cursor-pointer z-10" title="Importar Backup" />
                 <Button variant="outline" className="w-full h-14 rounded-2xl border-white/20 text-white gap-2 pointer-events-none">
                    <Upload className="w-4 h-4" /> IMPORTAR BACKUP
                 </Button>
              </div>
           </div>

           <Button variant="ghost" className="w-full text-red-600 hover:bg-red-600/10 h-12 rounded-xl gap-2 uppercase text-[10px] tracking-widest font-bold">
              <Trash2 className="w-4 h-4" /> LIMPAR TODOS OS DADOS
           </Button>
        </div>

        <Button 
          onClick={handleSave}
          className="w-full bg-[#A61E25] text-white font-bold h-16 rounded-2xl shadow-xl shadow-[#A61E25]/20 gap-2"
        >
          <Save className="w-5 h-5" />
          SALVAR CONFIGURAÇÕES
        </Button>
      </div>
    </div>
  );
}