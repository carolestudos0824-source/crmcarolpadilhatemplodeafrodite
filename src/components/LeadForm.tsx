import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { saveLead } from "@/lib/leads";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  whatsapp: z.string().trim().min(8, "WhatsApp obrigatório").max(30),
  interest: z.string().min(1, "Selecione um interesse"),
  app_idea: z.string().max(500).optional(),
});

const interests = ["Fábrica de Apps com IA", "Blueprint personalizado", "Serviço premium"];

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition";

export const LeadForm = () => {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", interest: "", app_idea: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((er) => { errs[er.path[0] as string] = er.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await saveLead(parsed.data as { name: string; email: string; whatsapp: string; interest: string; app_idea?: string });
      toast.success("Recebido. Agora você está na lista para criar seu app com IA.");
      setForm({ name: "", email: "", whatsapp: "", interest: "", app_idea: "" });
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally { setLoading(false); }
  };

  const upd = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={onSubmit} className="glass-strong p-6 md:p-8 space-y-4 max-w-2xl mx-auto">
      <div>
        <input className={inputCls} placeholder="Seu nome" value={form.name} onChange={(e) => upd("name", e.target.value)} maxLength={100} />
        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <input className={inputCls} type="email" placeholder="E-mail" value={form.email} onChange={(e) => upd("email", e.target.value)} maxLength={255} />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <input className={inputCls} placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => upd("whatsapp", e.target.value)} maxLength={30} />
          {errors.whatsapp && <p className="text-destructive text-xs mt-1">{errors.whatsapp}</p>}
        </div>
      </div>
      <div>
        <select className={inputCls} value={form.interest} onChange={(e) => upd("interest", e.target.value)}>
          <option value="">Selecione o interesse</option>
          {interests.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        {errors.interest && <p className="text-destructive text-xs mt-1">{errors.interest}</p>}
      </div>
      <textarea className={`${inputCls} min-h-[100px] resize-y`} placeholder="Qual ideia de app você quer criar? (opcional)" value={form.app_idea} onChange={(e) => upd("app_idea", e.target.value)} maxLength={500} />
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> : "Quero criar meu app com IA"}
      </button>
    </form>
  );
};
