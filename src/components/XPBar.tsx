export function XPBar({ xp, level }: { xp: number; level: number }) {
  const progress = xp % 100;
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-[10px] font-heading tracking-wider text-[#6B2737]/60 uppercase">
        <span>Nível {level}</span>
        <span>{xp} XP</span>
      </div>
      <div className="h-1.5 w-full bg-[#6B2737]/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#6B2737] to-[#C9A96E] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
