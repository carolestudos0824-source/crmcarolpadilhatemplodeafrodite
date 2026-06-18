import { toast } from "sonner";

export const openConfiguredUrl = (url: string | undefined | null, emptyMessage?: string) => {
  if (!url || !url.trim()) {
    toast.error(emptyMessage || "Link ainda não configurado. Edite o arquivo de configuração.");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};

export const openSupportEmail = (email: string, subject?: string) => {
  if (!email || !email.trim()) {
    toast.error("E-mail de suporte ainda não configurado. Edite o arquivo de configuração.");
    return;
  }
  const qs = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  window.location.href = `mailto:${email}${qs}`;
};
