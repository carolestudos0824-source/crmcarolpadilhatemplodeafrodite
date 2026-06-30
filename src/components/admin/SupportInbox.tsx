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

  const OFFICIAL_EMAIL = "fabricadeappscomia@outlook.com";

  const Overview = (
    <div className="space-y-4">
      <div className="admin-card p-5 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Canal oficial</p>
        <a
          href={`mailto:${OFFICIAL_EMAIL}`}
          className="text-lg md:text-xl font-heading font-bold text-accent hover:underline break-all"
        >
          {OFFICIAL_EMAIL}
        </a>
        <p className="text-sm text-muted-foreground mt-3">
          O suporte oficial da Fábrica de Apps com IA é feito por e-mail.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="admin-card p-5">
          <h3 className="font-heading font-semibold text-sm mb-2">O suporte cobre</h3>
          <ul className="space-y-1 text-xs text-foreground/90 list-disc pl-4">
            <li>Acesso ao programa</li>
            <li>Login</li>
            <li>Liberação de acesso</li>
            <li>Navegação na área de entrega</li>
            <li>Dúvidas sobre uso dos módulos</li>
            <li>Problemas técnicos do próprio programa</li>
            <li>Garantia, compra e acesso</li>
          </ul>
        </div>
        <div className="admin-card p-5">
          <h3 className="font-heading font-semibold text-sm mb-2">O suporte não cobre</h3>
          <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
            <li>Construção do app pelo participante</li>
            <li>Consultoria individual</li>
            <li>Revisão completa ou ilimitada de projetos</li>
            <li>Desenvolvimento sob demanda</li>
            <li>Correção direta em Lovable, Replit, Cursor, Bolt ou ferramentas externas</li>
            <li>Suporte 24h</li>
            <li>Garantia de vendas</li>
            <li>Garantia de app perfeito</li>
            <li>Garantia de segurança 100%</li>
            <li>Suporte oficial de ferramentas externas</li>
          </ul>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Overview}
        <div className="admin-card text-center text-muted-foreground text-sm inline-flex items-center justify-center gap-2 w-full">
          <Loader2 size={16} className="animate-spin" /> Carregando solicitações registradas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        {Overview}
        <div className="admin-card text-sm">
          <p className="text-red-300 mb-3">Erro ao carregar: {error}</p>
          <button type="button" onClick={() => void load()} className="btn-ghost border border-[hsl(var(--admin-border-strong))] inline-flex items-center gap-2">
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="space-y-4">
        {Overview}
        <div className="admin-empty">
          <InboxIcon className="text-muted-foreground/70" size={24} />
          <h3 className="admin-empty-title">Nenhuma solicitação registrada</h3>
          <p className="admin-empty-hint">
            Responda diretamente pelo e-mail oficial: {OFFICIAL_EMAIL}.
          </p>
        </div>
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
          className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[hsl(var(--admin-border-strong))] hover:bg-white/5"
        >
          <RefreshCw size={12} /> Atualizar
        </button>
      </div>

      {messages.map((m) => {
        const isResolved = m.status === "resolvido";
        return (
          <div key={m.id} className="admin-card space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-heading font-semibold text-sm">{m.name}</div>
                <div className="text-xs text-muted-foreground break-all">{m.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={isResolved ? "admin-badge admin-badge-success" : "admin-badge admin-badge-warning"}>
                  {m.status}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(m.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-white/5 border border-[hsl(var(--admin-border-subtle))] rounded-lg p-3">
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
