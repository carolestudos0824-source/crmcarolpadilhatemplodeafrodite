import { useState, FormEvent } from "react";
import { Gift, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GENERIC_ERROR = "Código inválido ou indisponível.";
const RATE_LIMIT_ERROR = "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
const TECHNICAL_ERROR = "Não foi possível resgatar agora. Tente novamente em instantes.";

type RedeemResponse = {
  success: boolean;
  days?: number;
  message?: string;
  error?: string;
};

export function GiftCodeRedemption() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.rpc("redeem_gift_code", {
        _code: trimmed,
      });

      if (error) {
        setErrorMessage(TECHNICAL_ERROR);
        return;
      }

      const result = data as unknown as RedeemResponse | null;

      if (result?.success) {
        setSuccessMessage(result.message || "Código resgatado com sucesso.");
        setCode("");
        return;
      }

      const errText = (result?.error || "").toLowerCase();
      if (errText.includes("muitas tentativas") || errText.includes("rate")) {
        setErrorMessage(RATE_LIMIT_ERROR);
      } else {
        setErrorMessage(GENERIC_ERROR);
      }
    } catch {
      setErrorMessage(TECHNICAL_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong p-6 md:p-8 rounded-2xl max-w-xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Gift size={18} className="text-accent" />
        </div>
        <h2 className="text-xl md:text-2xl font-heading font-bold">
          Resgatar código premium
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Digite seu código para ativar ou estender seu acesso premium.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite seu código"
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm tracking-wide disabled:opacity-60"
          aria-label="Código premium"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Validando...
            </>
          ) : (
            <>Resgatar código</>
          )}
        </button>
      </form>

      {successMessage && (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

export default GiftCodeRedemption;
