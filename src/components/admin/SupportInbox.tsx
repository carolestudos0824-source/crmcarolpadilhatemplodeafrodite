import { useEffect, useState } from "react";
import { Copy, Check, Loader2, Inbox as InboxIcon, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { withTimeout } from "@/lib/promiseTimeout";

type SupportMessage = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  status: string;
};

export function SupportInbox() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await withTimeout<any>(supabase
      .from("support_messages")
      .select("id, created_at, name, email, message, status")
      .order("created_at", { ascending: false }), 10000, "mensagens recebidas")
      .catch((e) => ({ data: null, error: e }));
    if (error) {
      setError(error.message);
      setMessages([]);
    } else {
      setMessages((data as SupportMessage[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const copyEmail = async (id: string, email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1500);
    } catch {
      toast.error("Não foi possível copiar o e-mail.");
    }
  };

  const toggleStatus = async (msg: SupportMessage) => {
    const next = msg.status === "resolvido" ? "novo" : "resolvido";
    setUpdatingId(msg.id);
    const { error } = await supabase
      .from("support_messages")
      .update({ status: next })
      .eq("id", msg.id);
    setUpdatingId(null);
    if (error) {
      toast.error("Falha ao atualizar status.", { description: error.message });
      return;
    }
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: next } : m)));
  };

  if (loading) {
    return (
      <div className="glass-strong p-8 text-center text-muted-foreground text-sm inline-flex items-center justify-center gap-2 w-full">
        <Loader2 size={16} className="animate-spin" /> Carregando mensagens recebidas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-strong p-6 text-sm">
        <p className="text-red-300 mb-3">Erro ao carregar: {error}</p>
        <button type="button" onClick={() => void load()} className="btn-ghost border border-white/15 inline-flex items-center gap-2">
          <RefreshCw size={14} /> Tentar novamente
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="glass-strong p-10 text-center">
        <InboxIcon className="mx-auto mb-3 text-muted-foreground" size={28} />
        <h3 className="font-heading font-semibold mb-1">Nenhuma mensagem recebida ainda</h3>
        <p className="text-sm text-muted-foreground">
          Quando alguém enviar uma mensagem pelo formulário em /suporte, ela aparece aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {messages.length} mensagem{messages.length === 1 ? "" : "s"} · ordenadas da mais recente para a mais antiga
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/15 hover:bg-white/5"
        >
          <RefreshCw size={12} /> Atualizar
        </button>
      </div>

      {messages.map((m) => {
        const isResolved = m.status === "resolvido";
        return (
          <div key={m.id} className="glass-strong p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-heading font-semibold text-sm">{m.name}</div>
                <div className="text-xs text-muted-foreground break-all">{m.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border ${
                    isResolved
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                  }`}
                >
                  {m.status}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(m.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-white/5 border border-white/10 rounded-lg p-3">
              {m.message}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyEmail(m.id, m.email)}
                className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5"
              >
                {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                {copiedId === m.id ? "E-mail copiado" : "Copiar e-mail"}
              </button>
              <button
                type="button"
                onClick={() => void toggleStatus(m)}
                disabled={updatingId === m.id}
                className={`text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                  isResolved
                    ? "border-white/15 hover:bg-white/5"
                    : "border-emerald-500/40 text-emerald-100 hover:bg-emerald-500/10"
                } disabled:opacity-60`}
              >
                {updatingId === m.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : isResolved ? (
                  "Marcar como novo"
                ) : (
                  "Marcar como resolvido"
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
