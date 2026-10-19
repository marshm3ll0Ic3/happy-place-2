CREATE TABLE public.talent_applications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL DEFAULT auth.uid(),
 alias text NOT NULL DEFAULT '',
 niche text NOT NULL DEFAULT 'fitness',
 work_sample_url text NOT NULL DEFAULT '',
 milestone text NOT NULL DEFAULT '',
 constraints text NOT NULL DEFAULT '',
 budget jsonb NOT NULL DEFAULT '{"rent":3600,"utilities":720,"software":480,"connectivity":360,"contingency":840}'::jsonb,
 country text NOT NULL DEFAULT '',
 adult_confirmed boolean NOT NULL DEFAULT false,
 public_consent boolean NOT NULL DEFAULT false,
 evidence_consent boolean NOT NULL DEFAULT false,
 commercial_consent boolean NOT NULL DEFAULT false,
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','under_review','more_information','accepted','declined')),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.talent_applications TO authenticated;
GRANT ALL ON public.talent_applications TO service_role;
ALTER TABLE public.talent_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY application_read_own ON public.talent_applications FOR SELECT TO authenticated USING (user_id=auth.uid());
CREATE POLICY application_insert_own ON public.talent_applications FOR INSERT TO authenticated WITH CHECK (user_id=auth.uid() AND status='draft');
CREATE POLICY application_update_draft ON public.talent_applications FOR UPDATE TO authenticated USING (user_id=auth.uid() AND status IN ('draft','more_information')) WITH CHECK (user_id=auth.uid() AND status IN ('draft','submitted'));
CREATE FUNCTION public.validate_talent_application() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF NEW.status='submitted' AND (NOT NEW.adult_confirmed OR NOT NEW.public_consent OR NOT NEW.evidence_consent OR length(trim(NEW.alias))<2 OR length(trim(NEW.milestone))<10 OR NEW.work_sample_url !~ '^https://' OR length(trim(NEW.country))<2) THEN RAISE EXCEPTION 'Complete eligibility, consent and required application fields'; END IF;
 IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN RAISE EXCEPTION 'Application ownership cannot change'; END IF;
 NEW.updated_at=now(); RETURN NEW;
END $$;
CREATE TRIGGER talent_application_validation BEFORE UPDATE ON public.talent_applications FOR EACH ROW EXECUTE FUNCTION public.validate_talent_application();
COMMENT ON TABLE public.talent_applications IS 'Private resumable talent applications; no identity documents, payments or financial rights.';
COMMENT ON TABLE public.payments IS 'Legacy prototype payment records. New demo flows must not write simulated financial activity here.';
COMMENT ON TABLE public.orders IS 'Legacy prototype saved order intentions; not executed trades. New simulation accounting uses separate records.';