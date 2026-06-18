import { ReactNode } from "react";

interface Props { children: ReactNode; className?: string; hover?: boolean; id?: string; }
export const GlassCard = ({ children, className = "", hover = true, id }: Props) => (
  <div id={id} className={`glass p-6 ${hover ? "transition-all hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-1" : ""} ${className}`}>
    {children}
  </div>
);
