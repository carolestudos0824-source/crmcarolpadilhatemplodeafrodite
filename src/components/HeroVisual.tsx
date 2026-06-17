const labels = ["MVP", "Stack", "Banco de Dados", "Design", "Monetização", "Prompt Lovable", "Lançamento"];
const positions = [
  "top-2 left-2",
  "top-6 right-0",
  "top-1/3 -left-4",
  "top-1/2 -right-6",
  "bottom-1/4 left-0",
  "bottom-6 right-4",
  "bottom-2 left-1/3",
];

export const HeroVisual = () => (
  <div className="relative w-full max-w-md mx-auto aspect-square">
    <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--accent)/0.35)_0%,transparent_60%)] blur-2xl" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--gold)/0.2)_0%,transparent_50%)] blur-2xl" />
    <img
      src="/logo-fabrica-apps-ia.png"
      alt="Fábrica de Apps com IA"
      width={512}
      height={512}
      className="relative w-full h-full object-contain animate-float drop-shadow-[0_0_40px_hsl(var(--accent)/0.6)]"
    />
    {labels.map((label, i) => (
      <span
        key={label}
        className={`absolute ${positions[i]} hidden sm:inline-flex glass px-3 py-1.5 text-[11px] font-medium text-foreground/90 animate-fade-up`}
        style={{ animationDelay: `${0.2 + i * 0.1}s` }}
      >
        {label}
      </span>
    ))}
  </div>
);
