import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export const CopyBlock = ({ title, content }: { title: string; content: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copiado");
      setTimeout(() => setCopied(false), 1800);
    } catch { toast.error("Não foi possível copiar"); }
  };
  return (
    <div className="glass-strong p-5 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-heading font-semibold text-foreground">{title}</h4>
        <button onClick={handleCopy} className="shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5 transition">
          {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="text-[15px] md:text-base text-foreground/80 whitespace-pre-wrap font-sans leading-7 md:leading-8">{content}</pre>
    </div>
  );
};
