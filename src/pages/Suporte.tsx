import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/Section";
import { Logo } from "@/components/Logo";
import { APP_CONFIG } from "@/config/appConfig";
import { openSupportEmail } from "@/lib/openLink";
import { supabase } from "@/integrations/supabase/client";

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { name?: string; email?: string; message?: string };

export default function Suporte() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Informe seu nome.";
    else if (name.trim().length > 100) e.name = "Nome muito longo (máx. 100).";
    if (!email.trim()) e.email = "Informe seu e-mail.";
    else if (!EMAIL_RE.test(email.trim())) e.email = "E-mail em formato inválido.";
    else if (email.trim().length > 255) e.email = "E-mail muito longo.";
    if (!message.trim()) e.message = "Escreva sua mensagem.";
    else if (message.trim().length > 2000) e.message = "Mensagem muito longa (máx. 2000).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    setSubmitError(null);
    setSent(false);
    if (!validate()) return;
    setSending(true);
    const { error } = await supabase.from("support_messages").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    setSending(false);
    if (error) {
      setSubmitError(
        `Não foi possível enviar agora. Tente novamente em alguns instantes ou escreva para ${APP_CONFIG.SUPORTE_EMAIL}.`,
      );
      return;
    }
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setSent(true);
  };

  return (
    <Section>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass-strong p-10 text-center">
          <div className="flex justify-center mb-6"><Logo size="lg" asLink={false} /></div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-3">Suporte</h1>
          <p className="text-base text-muted-foreground mb-4">
            Precisa de ajuda para acessar o material? Envie uma mensagem para o suporte por e-mail.
          </p>
          <p className="text-sm text-muted-foreground/90 bg-white/5 border border-white/10 rounded-xl p-4 leading-relaxed mb-8 text-left">
            O suporte é para <strong className="text-foreground">acesso ao material, problemas técnicos e dúvidas de navegação</strong>.
            Dúvidas estratégicas sobre o seu aplicativo podem ser contratadas no <strong className="text-foreground">Blueprint Personalizado</strong>.
          </p>
          <div className="flex justify-center">
            <button className="btn-primary" onClick={() => openSupportEmail(APP_CONFIG.SUPORTE_EMAIL)}>
              <Mail size={16} /> Enviar e-mail para o suporte
            </button>
          </div>
        </div>

        <div className="glass-strong p-6 md:p-8">
          <h2 className="text-xl font-heading font-bold mb-2">Ou envie pelo formulário</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Preencha abaixo e responderemos pelo e-mail informado.
          </p>

          {sent && (
            <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-100 px-4 py-3 text-sm flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>Mensagem enviada. Responderemos pelo e-mail informado.</span>
            </div>
          )}

          {submitError && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-100 px-4 py-3 text-sm">
              {submitError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="sup-name" className="text-xs text-muted-foreground block font-semibold mb-1.5">
                Nome
              </label>
              <input
                id="sup-name"
                type="text"
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                maxLength={100}
                disabled={sending}
              />
              {errors.name && <p className="text-xs text-red-300 mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="sup-email" className="text-xs text-muted-foreground block font-semibold mb-1.5">
                E-mail
              </label>
              <input
                id="sup-email"
                type="email"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                maxLength={255}
                disabled={sending}
              />
              {errors.email && <p className="text-xs text-red-300 mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="sup-msg" className="text-xs text-muted-foreground block font-semibold mb-1.5">
                Mensagem
              </label>
              <textarea
                id="sup-msg"
                className={`${inputCls} min-h-[140px] resize-y`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva sua dúvida ou o que precisa de ajuda."
                maxLength={2000}
                disabled={sending}
              />
              {errors.message && <p className="text-xs text-red-300 mt-1.5">{errors.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={sending}
                className="btn-primary disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Mail size={16} /> Enviar mensagem
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
