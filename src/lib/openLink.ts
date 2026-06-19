import { toast } from "sonner";
import { APP_CONFIG } from "@/config/appConfig";

const VALID_URL_RE = /^(https?:\/\/|mailto:|tel:)/i;

export const openConfiguredUrl = (url: string | undefined | null, emptyMessage?: string) => {
  const trimmed = (url ?? "").trim();
  const fallback = emptyMessage || "Checkout ainda não configurado. Entre em contato com o suporte.";
  // Empty, placeholder ("COLE_AQUI_..."), or non-URL string → never abre janela em branco.
  if (!trimmed || !VALID_URL_RE.test(trimmed) || /^COLE_AQUI/i.test(trimmed)) {
    toast.error(fallback);
    return false;
  }
  window.open(trimmed, "_blank", "noopener,noreferrer");
  return true;
};

export const openSupportEmail = (email: string, subject?: string) => {
  if (!email || !email.trim()) {
    toast.error("E-mail de suporte ainda não configurado.");
    return false;
  }
  const subj = subject || APP_CONFIG.SUPPORT_EMAIL_SUBJECT || "Suporte";
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subj)}`;
  return true;
};
