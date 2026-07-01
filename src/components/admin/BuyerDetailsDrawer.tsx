import { useEffect, useState } from "react";
import { X, Copy, UserCheck, UserX, ExternalLink, Loader2, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { withTimeout } from "@/lib/promiseTimeout";
import type { ConsolidatedBuyer } from "./BuyersPanel";

export const MSG_ACCESS_GRANTED =
  "Seu acesso à Fábrica de Apps com IA foi liberado. Entre com o mesmo e-mail usado na compra e acesse sua área.";
export const MSG_FIRST_LOGIN =
  "Seu pagamento foi confirmado. Para liberar seu acesso, entre uma vez usando o mesmo e-mail informado na compra. Depois disso, me avise para eu finalizar sua liberação.";
export const MSG_NOT_FOUND =
  "Não localizei acesso neste e-mail. Envie o comprovante ou o e-mail usado na compra para eu verificar.";

function fmt(d?: string | null) {
  if (!d) return "Não registrado";
  try {
    return new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "Não registrado";
  }
}

function fmtMoney(amount?: number | null, currency = "BRL") {
  if (amount == null) return "Não registrado";
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(Number(amount));
  } catch {
    return `R$ ${Number(amount).toFixed(2)}`;
  }
}

async function copy(text: string, label = "Copiado.") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error("Não foi possível copiar.");
  }
}

type SupportMsg = { id: string; created_at: string; message: string; status: string };

export function BuyerDetailsDrawer({
  buyer,
  onClose,
  onGrant,
  onRevoke,
  onViewSale,
  acting,
}: {
  buyer: ConsolidatedBuyer | null;
  onClose: () => void;
  onGrant: (b: ConsolidatedBuyer, durationDays?: number | null) => Promise<void> | void;
  onRevoke: (b: ConsolidatedBuyer) => Promise<void> | void;
  onViewSale?: (saleId: string) => void;
  acting?: boolean;
}) {
  const [messages, setMessages] = useState<SupportMsg[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  useEffect(() => {
    if (!buyer?.email) {
      setMessages([]);
      return;
    }
    setLoadingMsgs(true);
    withTimeout<any>(
      supabase
        .from("support_messages")
        .select("id, created_at, message, status")
        .ilike("email", buyer.email)
        .order("created_at", { ascending: false })
        .limit(10),
      8000,
      "mensagens",
    )
      .then(({ data }) => setMessages(((data as SupportMsg[]) ?? [])))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }, [buyer?.email]);

  if (!buyer) return null;

  const canGrant = !!buyer.user_id && (!buyer.has_access || buyer.expiry_status === "expired");
  const canRenew = !!buyer.user_id && buyer.has_access;
  const canRevoke = !!buyer.user_id && !!buyer.has_access;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full max-w-md h-full overflow-y-auto bg-[#0b0f1a] border-l border-white/10 shadow-2xl">
        <header className="sticky top-0 z-10 bg-[#0b0f1a]/95 backdrop-blur border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-semibold text-base">Detalhes do comprador</h2>
            <p className="text-[11px] text-muted-foreground truncate max-w-[260px]">{buyer.email ?? "Sem e-mail"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" aria-label="Fechar">
            <X size={18} />
          </button>
        </header>

        <div className="p-5 space-y-5">
          <Section title="Identificação">
            <Row label="E-mail" value={buyer.email ?? "Não registrado"} />
            <Row label="Nome" value={buyer.buyer_name ?? "Não registrado"} />
            <Row label="Login criado" value={buyer.user_id ? "Sim" : "Não — aguardando primeiro login"} />
          </Section>

          <Section title="Venda vinculada">
            {buyer.sale_id ? (
              <>
                <Row label="Valor pago" value={fmtMoney(buyer.amount, buyer.currency)} />
                <Row label="Status do pagamento" value={buyer.payment_status_label} />
                <Row label="Método" value={buyer.payment_method ?? "Não registrado"} />
                <Row label="Referência" value={buyer.payment_reference ?? "Não registrado"} />
                <Row label="Data da venda" value={fmt(buyer.sale_created_at)} />
                {onViewSale && (
                  <button
                    onClick={() => onViewSale(buyer.sale_id!)}
                    className="mt-2 text-xs text-accent hover:underline inline-flex items-center gap-1"
                  >
                    <ExternalLink size={12} /> Ver venda relacionada
                  </button>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Não registrado</p>
            )}
          </Section>

          <Section title="Acesso">
            <Row label="Status do acesso" value={buyer.access_status_label} />
            <Row label="Validade" value={buyer.expiry_label} />
            <Row label="Origem do acesso" value={buyer.source_label} />
            <Row label="Liberado em" value={fmt(buyer.access_granted_at)} />
            <Row label="Revogado em" value={fmt(buyer.access_revoked_at)} />
          </Section>

          {buyer.admin_notes && (
            <Section title="Observações internas">
              <p className="text-xs text-foreground whitespace-pre-wrap">{buyer.admin_notes}</p>
            </Section>
          )}

          <Section title="Mensagens recebidas deste e-mail">
            {loadingMsgs ? (
              <div className="text-xs text-muted-foreground inline-flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" /> Carregando...
              </div>
            ) : messages.length === 0 ? (
              <p className="text-xs text-muted-foreground">Não registrado</p>
            ) : (
              <ul className="space-y-2">
                {messages.map((m) => (
                  <li key={m.id} className="rounded-lg border border-white/10 bg-white/5 p-2">
                    <div className="text-[10px] text-muted-foreground">{fmt(m.created_at)} · {m.status}</div>
                    <div className="text-xs text-foreground mt-1 line-clamp-3">{m.message}</div>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Ações rápidas">
            <div className="grid grid-cols-2 gap-2">
              <ActionBtn icon={<Mail size={12} />} onClick={() => buyer.email && copy(buyer.email, "E-mail copiado.")}>
                Copiar e-mail
              </ActionBtn>
              <ActionBtn icon={<Copy size={12} />} onClick={() => copy(MSG_ACCESS_GRANTED, "Mensagem copiada.")}>
                Msg acesso liberado
              </ActionBtn>
              <ActionBtn icon={<Copy size={12} />} onClick={() => copy(MSG_FIRST_LOGIN, "Mensagem copiada.")}>
                Msg primeiro login
              </ActionBtn>
              <ActionBtn icon={<Copy size={12} />} onClick={() => copy(MSG_NOT_FOUND, "Mensagem copiada.")}>
                Msg não localizado
              </ActionBtn>
            </div>
          </Section>

          <Section title="Gerenciar acesso">
            {!buyer.user_id && (
              <p className="text-[11px] text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mb-2">
                Peça para a pessoa entrar uma vez usando o mesmo e-mail da compra. Depois tente liberar novamente.
              </p>
            )}
            <div className="flex gap-2 flex-wrap">
              <button
                disabled={!canGrant || acting}
                onClick={() => onGrant(buyer, 365)}
                className="btn-primary text-xs !px-3 !py-2 disabled:opacity-40"
                title="Liberar acesso válido por 365 dias"
              >
                <UserCheck size={14} /> Liberar 1 ano
              </button>
              <button
                disabled={!canGrant || acting}
                onClick={() => onGrant(buyer, null)}
                className="px-3 py-2 rounded-xl border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/10 text-xs inline-flex items-center gap-1.5 disabled:opacity-40"
                title="Liberar acesso sem data de expiração"
              >
                <UserCheck size={14} /> Sem expiração
              </button>
              <button
                disabled={!canRenew || acting}
                onClick={() => onGrant(buyer, 365)}
                className="px-3 py-2 rounded-xl border border-accent/40 text-accent hover:bg-accent/10 text-xs inline-flex items-center gap-1.5 disabled:opacity-40"
                title="Renovar por +365 dias a partir de agora"
              >
                <UserCheck size={14} /> Renovar +1 ano
              </button>
              <button
                disabled={!canRevoke || acting}
                onClick={() => onRevoke(buyer)}
                className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-200 hover:bg-rose-500/10 text-xs inline-flex items-center gap-1.5 disabled:opacity-40"
              >
                <UserX size={14} /> Revogar acesso
              </button>
            </div>
          </Section>

          <button
            onClick={onClose}
            className="w-full mt-2 px-3 py-2 rounded-xl border border-white/15 hover:bg-white/5 text-xs"
          >
            Fechar
          </button>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 inline-flex items-center gap-1.5">
        <ShieldCheck size={11} /> {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground text-right break-words max-w-[60%]">{value}</span>
    </div>
  );
}

function ActionBtn({ icon, children, onClick }: { icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-[11px] inline-flex items-center justify-center gap-1.5"
    >
      {icon} {children}
    </button>
  );
}
