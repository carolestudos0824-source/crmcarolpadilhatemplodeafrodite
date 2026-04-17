/**
 * CertificateCard — Elegant mystic certificate display.
 * Visual-only; used both inline and in a full-view modal.
 */
import { useRef } from "react";
import type { EarnedCertificateView } from "@/lib/certificates/emission";

export type EarnedCertificate = EarnedCertificateView;

interface Props {
  certificate: EarnedCertificateView;
  compact?: boolean;
  onView?: () => void;
}

const CertificateCard = ({ certificate, compact = false, onView }: Props) => {
  if (compact) {
    return (
      <button
        onClick={onView}
        className="w-full text-left rounded-xl p-5 transition-all duration-300 hover:shadow-lg group"
        style={{
          background: "linear-gradient(135deg, hsl(38 28% 93% / 0.90), hsl(36 33% 95% / 0.85))",
          border: `1.5px solid ${certificate.accentColor}33`,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-2xl"
            style={{
              background: `${certificate.accentColor}15`,
              border: `1.5px solid ${certificate.accentColor}30`,
            }}
          >
            {certificate.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-sm tracking-wide" style={{ color: "hsl(340 42% 22%)" }}>
              {certificate.title}
            </div>
            <div className="font-accent text-xs italic" style={{ color: "hsl(230 20% 15% / 0.50)" }}>
              {certificate.subtitle}
            </div>
            <div className="text-[10px] font-body mt-1" style={{ color: "hsl(230 15% 30% / 0.40)" }}>
              {new Date(certificate.earnedAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <div className="text-xs font-body shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: certificate.accentColor }}>
            Ver →
          </div>
        </div>
      </button>
    );
  }

  return <FullCertificate certificate={certificate} />;
};

/** Full-size certificate for viewing / downloading */
export const FullCertificate = ({ certificate }: { certificate: EarnedCertificateView }) => {
  const ref = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(certificate.earnedAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      ref={ref}
      className="relative w-full max-w-lg mx-auto aspect-[3/4] rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(160deg, hsl(36 33% 97%), hsl(38 30% 94%), hsl(36 28% 91%))",
        boxShadow: "0 20px 60px hsl(230 25% 10% / 0.12), 0 0 0 1px hsl(36 45% 58% / 0.20)",
      }}
    >
      {/* Decorative border */}
      <div className="absolute inset-3 rounded-xl" style={{
        border: "1.5px solid hsl(36 45% 58% / 0.30)",
      }}>
        <div className="absolute inset-2 rounded-lg" style={{
          border: "0.5px solid hsl(36 45% 58% / 0.15)",
        }} />
      </div>

      {/* Corner ornaments */}
      {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} text-lg`} style={{ color: "hsl(36 45% 58% / 0.30)" }}>
          {i < 2 ? "✦" : "✧"}
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-10 py-12 text-center">
        {/* Top accent */}
        <div className="text-[10px] tracking-[0.4em] uppercase font-body mb-2" style={{ color: "hsl(36 45% 58% / 0.60)" }}>
          Arcano Vivo
        </div>
        <div className="text-xs tracking-[0.3em] uppercase font-body mb-6" style={{ color: "hsl(340 42% 28% / 0.50)" }}>
          Certificado de Conclusão
        </div>

        {/* Ornament line */}
        <div className="w-24 h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.40), transparent)" }} />

        {/* Icon */}
        <div className="text-4xl mb-4">{certificate.icon}</div>

        {/* Title */}
        <h2
          className="font-heading text-xl tracking-wide mb-1"
          style={{
            background: "linear-gradient(135deg, hsl(340 42% 20%), hsl(36 35% 28%), hsl(36 42% 42%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {certificate.title}
        </h2>
        <p className="font-accent text-sm italic mb-6" style={{ color: "hsl(230 20% 15% / 0.45)" }}>
          {certificate.subtitle}
        </p>

        {/* Ornament line */}
        <div className="w-16 h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.30), transparent)" }} />

        {/* Student name */}
        <div className="text-[9px] tracking-[0.3em] uppercase font-body mb-1" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
          Conferido a
        </div>
        <div className="font-heading text-lg tracking-wide mb-6" style={{
          color: "hsl(340 42% 22%)",
          borderBottom: "1px solid hsl(36 45% 58% / 0.25)",
          paddingBottom: "4px",
        }}>
          {certificate.studentName || "Estudante"}
        </div>

        {/* Description */}
        <p className="font-body text-xs leading-relaxed max-w-xs mb-6" style={{ color: "hsl(230 15% 30% / 0.50)" }}>
          {certificate.description}
        </p>

        {/* Date */}
        <div className="text-[10px] font-body" style={{ color: "hsl(230 15% 30% / 0.35)" }}>
          {formattedDate}
        </div>

        {/* Bottom ornament */}
        <div className="w-24 h-px mt-6" style={{ background: "linear-gradient(90deg, transparent, hsl(36 45% 58% / 0.30), transparent)" }} />
        <div className="text-xs mt-3" style={{ color: "hsl(36 45% 58% / 0.35)" }}>⟡</div>
      </div>
    </div>
  );
};

export default CertificateCard;
