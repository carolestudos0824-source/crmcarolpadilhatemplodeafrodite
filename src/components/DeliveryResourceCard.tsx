import { ReactNode } from "react";

export const DeliveryResourceCard = ({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action: ReactNode }) => (
  <div className="glass-strong p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-accent/20 flex items-center justify-center text-accent">
        {icon}
      </div>
      <h3 className="font-heading font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-muted-foreground flex-1">{description}</p>
    {action}
  </div>
);
