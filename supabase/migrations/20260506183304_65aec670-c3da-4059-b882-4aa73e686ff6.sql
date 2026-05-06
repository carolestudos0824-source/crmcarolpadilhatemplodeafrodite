-- Create clientes table
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    instagram TEXT,
    data_nascimento DATE,
    cidade TEXT,
    nome_envolvido TEXT,
    data_nascimento_envolvido DATE,
    status_relacao TEXT, -- Ex, Ficante, Namoro, Casamento, etc.
    situacao_principal TEXT,
    observacoes_privadas TEXT,
    status_comercial TEXT DEFAULT 'Nova cliente', -- Nova cliente, Consulta feita, Magia indicada, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create atendimentos table
CREATE TABLE IF NOT EXISTS public.atendimentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes ON DELETE CASCADE NOT NULL,
    data TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    situacao TEXT, -- Está sumindo, Término recente, etc.
    relato TEXT,
    cartas JSONB, -- Store tarot positions and cards
    leitura_gerada TEXT,
    texto_whatsapp TEXT,
    magia_indicada TEXT,
    valor_cobrado DECIMAL(10,2),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create magias table (catalog)
CREATE TABLE IF NOT EXISTS public.magias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    objetivo TEXT,
    intensidade TEXT,
    quando_indicar TEXT,
    orientacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magias ENABLE ROW LEVEL SECURITY;

-- Policies for clientes
DO $$ BEGIN
    CREATE POLICY "Users can manage their own clients" ON public.clientes FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Policies for atendimentos
DO $$ BEGIN
    CREATE POLICY "Users can manage their own atendimentos" ON public.atendimentos FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Policies for magias (Readable by all authenticated users)
DO $$ BEGIN
    CREATE POLICY "Authenticated users can view magias" ON public.magias FOR SELECT TO authenticated USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Insert initial magias data
INSERT INTO public.magias (nome, objetivo, intensidade, quando_indicar) VALUES
('Adoçamento amoroso', 'Abrandar o coração e abrir caminhos para o diálogo.', 'Suave', 'Relações frias ou brigas recentes'),
('Harmonização amorosa', 'Equilibrar as energias do casal.', 'Média', 'Conflitos constantes'),
('Limpeza energética amorosa', 'Remover negatividade acumulada no campo do casal.', 'Forte', 'Inveja ou influências externas'),
('Ritual de reconexão', 'Trazer de volta a chama e a intimidade.', 'Forte', 'Afastamento emocional')
ON CONFLICT DO NOTHING;

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DO $$ BEGIN
    CREATE TRIGGER set_updated_at_clientes BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
