import { ReactNode } from "react";

interface Props { id?: string; eyebrow?: string; title?: string; subtitle?: string; children: ReactNode; className?: string; }

export const Section = ({ id, eyebrow, title, subtitle, children, className = "" }: Props) => (
  <section id={id} className={`py-16 md:py-24 scroll-mt-28 md:scroll-mt-32 ${className}`}>
    <div className="container">
      {(eyebrow || title || subtitle) && (
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
          {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{eyebrow}</p>}
          {title && <h2 className="text-3xl md:text-5xl font-heading font-bold text-gradient mb-4">{title}</h2>}
          {subtitle && <p className="text-base md:text-lg text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  </section>
);
