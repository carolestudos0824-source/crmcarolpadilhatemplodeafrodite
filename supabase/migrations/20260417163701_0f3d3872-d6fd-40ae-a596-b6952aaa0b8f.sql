-- Status enum
DO $$ BEGIN
  CREATE TYPE public.feedback_status AS ENUM ('aberto', 'em_andamento', 'resolvido');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- New columns
ALTER TABLE public.beta_feedback
  ADD COLUMN IF NOT EXISTS status public.feedback_status NOT NULL DEFAULT 'aberto',
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by uuid;

CREATE INDEX IF NOT EXISTS idx_beta_feedback_status ON public.beta_feedback(status);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_created_at ON public.beta_feedback(created_at DESC);

-- Staff (admin + moderator) can view all feedback
DROP POLICY IF EXISTS "Staff can view all feedback" ON public.beta_feedback;
CREATE POLICY "Staff can view all feedback"
ON public.beta_feedback
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
);

-- Staff can update status and notes on any feedback
DROP POLICY IF EXISTS "Staff can update feedback" ON public.beta_feedback;
CREATE POLICY "Staff can update feedback"
ON public.beta_feedback
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'moderator'::public.app_role)
);