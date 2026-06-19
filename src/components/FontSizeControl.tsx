import { useEffect, useState, useRef } from "react";
import { Type, Check } from "lucide-react";

const STORAGE_KEY = "fabrica_apps_font_scale_v1";

type Scale = "normal" | "large" | "xlarge";

const SCALE_PX: Record<Scale, string> = {
  normal: "16px",
  large: "17.6px",
  xlarge: "19.2px",
};

const LABELS: Record<Scale, string> = {
  normal: "Fonte normal",
  large: "Fonte grande",
  xlarge: "Fonte muito grande",
};

function applyScale(scale: Scale) {
  document.documentElement.style.fontSize = SCALE_PX[scale];
}

export function getStoredFontScale(): Scale {
  if (typeof window === "undefined") return "normal";
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "large" || v === "xlarge" || v === "normal") return v;
  return "normal";
}

export function initFontScale() {
  applyScale(getStoredFontScale());
}

export function FontSizeControl() {
  const [scale, setScale] = useState<Scale>(() => getStoredFontScale());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyScale(scale);
    try {
      window.localStorage.setItem(STORAGE_KEY, scale);
    } catch {
      /* noop */
    }
  }, [scale]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Tamanho da fonte"
        aria-haspopup="menu"
        aria-expanded={open}
        className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 inline-flex items-center gap-1 text-xs"
      >
        <Type size={12} aria-hidden="true" />
        <span className="font-semibold">Aa</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-background/95 backdrop-blur-md shadow-xl z-50 overflow-hidden"
        >
          {(Object.keys(LABELS) as Scale[]).map((s) => {
            const active = s === scale;
            return (
              <button
                key={s}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setScale(s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-white/5 ${
                  active ? "text-accent" : "text-foreground"
                }`}
              >
                <span>{LABELS[s]}</span>
                {active && <Check size={14} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
