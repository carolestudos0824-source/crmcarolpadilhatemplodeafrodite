import { toast } from "sonner";

export const openConfiguredUrl = (url: string | undefined | null) => {
  if (!url || !url.trim()) {
    toast.error("Link ainda não configurado. Edite o arquivo de configuração.");
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};
