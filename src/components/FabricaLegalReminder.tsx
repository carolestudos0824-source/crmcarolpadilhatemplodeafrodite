import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";

type Props = {
  text: string;
  className?: string;
};

/**
 * Aviso curto que aparece dentro de módulos da área logada para lembrar que:
 * - o módulo trata do app da pessoa,
 * - a Fábrica de Apps com IA também tem os SEUS próprios documentos oficiais.
 *
 * Não substitui os documentos oficiais nem coleta nada.
 */
export function FabricaLegalReminder({ text, className }: Props) {
  return (
    <GlassCard
      className={`p-4 mb-4 border-sky-400/30 bg-sky-400/5 ${className ?? ""}`}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck size={16} className="text-sky-300 shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
          {text}{" "}
          <Link to="/termos-de-uso" className="text-accent hover:underline">
            Termos
          </Link>{" "}
          ·{" "}
          <Link to="/politica-de-privacidade" className="text-accent hover:underline">
            Privacidade
          </Link>{" "}
          ·{" "}
          <Link to="/legal" className="text-muted-foreground hover:text-foreground">
            Central legal
          </Link>
        </p>
      </div>
    </GlassCard>
  );
}
