INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Logos are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'logos');

CREATE POLICY "Only authenticated users can upload logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');