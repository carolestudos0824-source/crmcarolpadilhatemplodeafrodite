import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center gap-4 p-5 text-left">
        <span className="font-medium text-foreground">{q}</span>
        <ChevronDown size={18} className={`text-accent shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
};
