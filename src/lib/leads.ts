import { supabase } from "@/integrations/supabase/client";

export interface LeadInput {
  name: string;
  email: string;
  whatsapp: string;
  interest: string;
  app_idea?: string;
}

const STORAGE_KEY = "fabrica_apps_leads";

export const saveLead = async (lead: LeadInput): Promise<void> => {
  // Tenta Supabase (tabela `leads` opcional). Se falhar, fallback localStorage.
  try {
    const { error } = await supabase.from("leads" as never).insert(lead as never);
    if (!error) return;
  } catch {
    /* ignore */
  }
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existing.push({ ...lead, created_at: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};
