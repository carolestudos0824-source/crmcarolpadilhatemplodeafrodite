import { toast } from "sonner";
import { APP_CONFIG } from "@/config/appConfig";

export const openConfiguredUrl = (url: string | undefined | null, emptyMessage?: string) => {
  if (!url || !url.trim()) {
    toast.error(emptyMessage || "Checkout ainda não configurado. Entre em contato com o suporte.");
    return false;
  }
  window.open(url, "_blank", "noopener,noreferrer");
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
