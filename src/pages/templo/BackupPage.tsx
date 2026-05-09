import { useState, useMemo } from "react";
import { 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  Info, 
  Database,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseService } from "@/lib/supabase-service";
import { cn } from "@/lib/utils";

export function BackupPage() {
  const queryClient = useQueryClient();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [importData, setImportData] = useState<any>(null);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");

  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: () => supabaseService.getClients() });
  const { data: appointments = [] } = useQuery({ queryKey: ["appointments"], queryFn: () => supabaseService.getAppointments() });
  const { data: followUps = [] } = useQuery({ queryKey: ["follow-ups"], queryFn: () => supabaseService.getFollowUps() });
  const { data: magias = [] } = useQuery({ queryKey: ["magias"], queryFn: () => supabaseService.getMagias() });
  const { data: financeiro = [] } = useQuery({ queryKey: ["financeiro"], queryFn: () => supabaseService.getFinanceiro() });
  const { data: messages = [] } = useQuery({ queryKey: ["messages"], queryFn: () => supabaseService.getMessages() });

  const lastBackup = localStorage.getItem("carol_crm_last_backup");
  
  const stats = useMemo(() => {
    const jsonString = JSON.stringify({
      clientes: clients,
      atendimentos: appointments,
      followUps,
      magias,
      financeiro,
      messages
    });
    const sizeInKb = (new TextEncoder().encode(jsonString).length / 1024).toFixed(2);

    return {
      totalClients: clients.length,
      totalAppointments: appointments.length,
      totalReadings: appointments.filter(a => a.leituraCompleta).length,
      sizeInKb,
      lastBackupFormatted: lastBackup 
        ? new Date(lastBackup).toLocaleString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        : "Nenhum backup realizado ainda"
    };
  }, [clients, appointments, followUps, magias, financeiro, messages, lastBackup]);

  const handleExport = () => {
    const allData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("carol_crm_") && key !== "carol_crm_authenticated") {
        try {
          allData[key] = JSON.parse(localStorage.getItem(key) || "null");
        } catch (e) {
          allData[key] = localStorage.getItem(key);
        }
      }
    }

    const exportObj = {
      versao: "1.0",
      sistema: "Templo de Afrodite CRM",
      exportadoEm: new Date().toISOString(),
      exportadoPor: "Carol Padilha",
      dados: allData,
      totalRegistros: {
        clientes: clients.length,
        atendimentos: appointments.length,
        followUps: followUps.length,
        magias: magias.length,
        financeiro: financeiro.length
      }
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-').slice(0, 5);
    
    link.href = url;
    link.download = `backup_templo_afrodite_${dateStr}_${timeStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    localStorage.setItem("carol_crm_last_backup", now.toISOString());
    toast({
      title: "Backup exportado com sucesso.",
      description: "Salve o arquivo em local seguro.",
    });
    // Trigger re-render for stats
    queryClient.invalidateQueries({ queryKey: ["backup-stats"] });
  };

  const handleImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const json = JSON.parse(event.target.result);
          if (json.sistema !== "Templo de Afrodite CRM") {
            toast({
              title: "Arquivo inválido",
              description: "Este arquivo não parece ser um backup do Templo de Afrodite CRM.",
              variant: "destructive"
            });
            return;
          }
          setImportData(json);
          setShowImportModal(true);
        } catch (error) {
          toast({
            title: "Erro ao ler arquivo",
            description: "O arquivo selecionado está corrompido ou é inválido.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const confirmImport = () => {
    if (!importData?.dados) return;

    Object.entries(importData.dados).forEach(([key, value]) => {
      if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, String(value));
      }
    });

    toast({
      title: "Backup importado com sucesso.",
      description: "Recarregando o sistema...",
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleClearAll = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("carol_crm_") && key !== "carol_crm_authenticated") {
        localStorage.removeItem(key);
        i--; // Adjust index after removal
      }
    }

    toast({
      title: "Dados apagados.",
      description: "O sistema foi reiniciado.",
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-[#111111] font-serif-elegant">Backup & Segurança dos Dados</h1>
        <p className="text-[#111111]/60 font-medium font-sans-clean">Gerencie e proteja todos os dados do Templo de Afrodite CRM</p>
        <div className="h-px w-full bg-[#C9A35A]/20" />
      </header>

      {/* Status Card */}
      <div className="bg-[#ECE5DC] p-6 rounded-[2rem] border border-[#C9A35A]/10 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-[#C9A35A]" />
          <h2 className="text-xl font-bold text-[#111111] font-display italic">Status do Armazenamento</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]/40">Clientes</p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#111111]/20" />
              <p className="text-xl font-bold text-[#111111]">{stats.totalClients}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]/40">Atendimentos</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#111111]/20" />
              <p className="text-xl font-bold text-[#111111]">{stats.totalAppointments}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]/40">Leituras</p>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#111111]/20" />
              <p className="text-xl font-bold text-[#111111]">{stats.totalReadings}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#111111]/40">Espaço Utilizado</p>
            <p className="text-xl font-bold text-[#111111]">{stats.sizeInKb} KB</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#C9A35A]/10">
          <p className="text-xs font-medium text-[#111111]/60">
            Último backup exportado: <span className="text-[#111111] font-bold">{stats.lastBackupFormatted}</span>
          </p>
        </div>
      </div>

      {/* Main Actions Card */}
      <div className="bg-white p-8 rounded-[2rem] border border-[#C9A35A]/20 shadow-sm space-y-8">
        <h2 className="text-xl font-bold text-[#111111] font-display italic">Exportar e Importar</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleExport}
            className="flex-1 h-14 bg-[#A61E25] hover:bg-[#A61E25]/90 text-white rounded-2xl font-bold gap-3 shadow-lg shadow-[#A61E25]/10"
          >
            <Download className="w-5 h-5" />
            EXPORTAR BACKUP COMPLETO
          </Button>
          <Button 
            onClick={handleImportClick}
            variant="outline"
            className="flex-1 h-14 border-[#C9A35A] text-[#C9A35A] hover:bg-[#C9A35A]/5 rounded-2xl font-bold gap-3"
          >
            <Upload className="w-5 h-5" />
            IMPORTAR BACKUP
          </Button>
        </div>

        <div className="flex items-start gap-3 p-4 bg-[#F4F0EA] rounded-2xl border border-[#C9A35A]/10">
          <Info className="w-5 h-5 text-[#C9A35A] mt-0.5" />
          <p className="text-xs text-[#111111]/60 leading-relaxed">
            O backup exportado contém todos os clientes, atendimentos, leituras e magias registradas no sistema. 
            Salve o arquivo em local seguro como Google Drive ou pen drive.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#ECE5DC] p-8 rounded-[2rem] border border-[#A61E25]/20 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#A61E25]" />
          <h2 className="text-xl font-bold text-[#A61E25] font-display italic">Zona de Perigo</h2>
        </div>

        <p className="text-sm text-[#111111]/70 font-medium">
          As ações abaixo são irreversíveis. Faça backup antes de continuar.
        </p>

        <Button 
          onClick={() => setShowClearModal(true)}
          variant="outline"
          className="h-12 border-[#A61E25] text-[#A61E25] hover:bg-[#A61E25]/5 rounded-xl font-bold gap-3 px-6"
        >
          <Trash2 className="w-4 h-4" />
          Limpar Todos os Dados
        </Button>
      </div>

      {/* Instructions Card */}
      <div className="bg-[#ECE5DC] p-8 rounded-[2rem] border border-[#C9A35A]/10 space-y-6">
        <h2 className="text-xl font-bold text-[#111111] font-display italic">Como usar o backup corretamente</h2>
        
        <ul className="space-y-4">
          {[
            "Exporte o backup regularmente, pelo menos uma vez por semana",
            "Salve o arquivo exportado no Google Drive, Dropbox ou pen drive",
            "Antes de trocar de computador ou limpar o navegador, exporte o backup",
            "Para restaurar, clique em Importar Backup e selecione o arquivo .json",
            "Nunca compartilhe o arquivo de backup com terceiros"
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#111111]/70 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#C9A35A] mt-0.5" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Import Confirmation Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111111]/40 backdrop-blur-sm" onClick={() => setShowImportModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-[#C9A35A]/20 animate-in fade-in zoom-in duration-200">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#A61E25]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-[#A61E25]" />
                </div>
                <h3 className="text-2xl font-bold text-[#111111] font-display italic">Confirmar Importação</h3>
                <p className="text-sm text-[#111111]/60 leading-relaxed">
                  Atenção: importar este backup irá sobrescrever os dados atuais do sistema. 
                  Esta ação não pode ser desfeita. Deseja continuar?
                </p>
              </div>

              {importData && (
                <div className="bg-[#F4F0EA] p-4 rounded-2xl border border-[#C9A35A]/10 space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                    <span>Data do Backup:</span>
                    <span className="text-[#111111]">{new Date(importData.exportadoEm).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                    <span>Clientes:</span>
                    <span className="text-[#111111]">{importData.totalRegistros?.clientes || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#111111]/40">
                    <span>Atendimentos:</span>
                    <span className="text-[#111111]">{importData.totalRegistros?.atendimentos || 0}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={confirmImport}
                  className="h-12 bg-[#A61E25] hover:bg-[#A61E25]/90 text-white rounded-xl font-bold shadow-lg shadow-[#A61E25]/10"
                >
                  Confirmar Importação
                </Button>
                <Button 
                  onClick={() => setShowImportModal(false)}
                  variant="outline"
                  className="h-12 border-[#C9A35A] text-[#C9A35A] hover:bg-[#C9A35A]/5 rounded-xl font-bold"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111111]/40 backdrop-blur-sm" onClick={() => setShowClearModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-[#A61E25]/20 animate-in fade-in zoom-in duration-200">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#A61E25]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-[#A61E25]" />
                </div>
                <h3 className="text-2xl font-bold text-[#A61E25] font-display italic">ATENÇÃO — Ação Irreversível</h3>
                <p className="text-sm text-[#111111]/60 leading-relaxed">
                  Todos os dados do sistema serão apagados permanentemente. 
                  Clientes, atendimentos, leituras e magias serão perdidos. 
                  Faça um backup antes de continuar.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#111111]/40 ml-1">
                  Digite "CONFIRMAR EXCLUSÃO" para apagar:
                </label>
                <input
                  type="text"
                  value={confirmDeleteText}
                  onChange={(e) => setConfirmDeleteText(e.target.value)}
                  placeholder="CONFIRMAR EXCLUSÃO"
                  className="w-full h-12 bg-[#F4F0EA] border border-[#A61E25]/20 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#A61E25]/20 text-center font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleClearAll}
                  disabled={confirmDeleteText !== "CONFIRMAR EXCLUSÃO"}
                  className="h-12 bg-[#A61E25] hover:bg-[#A61E25]/90 text-white rounded-xl font-bold shadow-lg shadow-[#A61E25]/10 disabled:opacity-50"
                >
                  Apagar Tudo
                </Button>
                <Button 
                  onClick={() => {
                    setShowClearModal(false);
                    setConfirmDeleteText("");
                  }}
                  variant="outline"
                  className="h-12 border-[#C9A35A] text-[#C9A35A] hover:bg-[#C9A35A]/5 rounded-xl font-bold"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
