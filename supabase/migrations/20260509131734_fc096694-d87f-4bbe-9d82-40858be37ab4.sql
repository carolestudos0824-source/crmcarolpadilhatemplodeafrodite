-- Adicionar colunas faltantes
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS origem TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS temperatura TEXT;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS ultimo_atendimento TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS proximo_retorno TIMESTAMP WITH TIME ZONE;

-- Garantir que nome e whatsapp são opcionais (já executado, mas bom deixar aqui para consistência)
ALTER TABLE public.clientes ALTER COLUMN nome DROP NOT NULL;
ALTER TABLE public.clientes ALTER COLUMN whatsapp DROP NOT NULL;