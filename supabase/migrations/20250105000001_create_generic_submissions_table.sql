-- Drop the old demo_requests table if it exists
DROP TABLE IF EXISTS public.demo_requests CASCADE;

-- Create generic cta_submissions table for all form submissions
CREATE TABLE IF NOT EXISTS public.cta_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Submission metadata
  submission_type TEXT NOT NULL, -- 'demo', 'consultation', 'case_study', 'contact', 'newsletter', etc.
  context TEXT, -- What led to submission (e.g., "Interest from: Transform Campaign Data Into Revenue")
  source_page TEXT, -- Which page/section the form was on

  -- Common fields (all optional to support different form types)
  name TEXT,
  email TEXT,
  company TEXT,
  role TEXT,
  phone TEXT,
  job_title TEXT,
  company_size TEXT,
  industry TEXT,

  -- Flexible message/notes field
  message TEXT,
  additional_notes TEXT,

  -- Custom fields stored as JSONB for maximum flexibility
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled', 'spam')),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  scheduled_date TIMESTAMPTZ,

  -- Admin notes
  admin_notes TEXT,
  assigned_to TEXT,

  -- UTM and tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cta_submissions_email ON public.cta_submissions(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cta_submissions_type ON public.cta_submissions(submission_type);
CREATE INDEX IF NOT EXISTS idx_cta_submissions_status ON public.cta_submissions(status);
CREATE INDEX IF NOT EXISTS idx_cta_submissions_created_at ON public.cta_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cta_submissions_type_status ON public.cta_submissions(submission_type, status);

-- GIN index for custom_fields JSONB column for flexible queries
CREATE INDEX IF NOT EXISTS idx_cta_submissions_custom_fields ON public.cta_submissions USING GIN (custom_fields);

-- Enable Row Level Security
ALTER TABLE public.cta_submissions ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts from anonymous users (for form submissions)
CREATE POLICY "Allow public inserts" ON public.cta_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy to allow authenticated users to read all submissions
CREATE POLICY "Allow authenticated reads" ON public.cta_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow authenticated users to update submissions
CREATE POLICY "Allow authenticated updates" ON public.cta_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_cta_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cta_submissions_updated_at
  BEFORE UPDATE ON public.cta_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_cta_submissions_updated_at();

-- Add helpful comments
COMMENT ON TABLE public.cta_submissions IS 'Generic table for all CTA form submissions (demo requests, consultations, contact forms, etc.)';
COMMENT ON COLUMN public.cta_submissions.submission_type IS 'Type of submission: demo, consultation, case_study, contact, newsletter, etc.';
COMMENT ON COLUMN public.cta_submissions.custom_fields IS 'Flexible JSONB field for form-specific data that does not fit standard columns';
COMMENT ON COLUMN public.cta_submissions.context IS 'Context about what led to the submission (e.g., which section, what content)';

-- Create view for demo requests specifically (for backward compatibility)
CREATE OR REPLACE VIEW public.demo_requests AS
SELECT
  id,
  name,
  email,
  company,
  role,
  phone,
  message,
  context,
  status,
  created_at,
  updated_at,
  contacted_at,
  scheduled_date,
  admin_notes
FROM public.cta_submissions
WHERE submission_type = 'demo';

-- Create view for contact requests
CREATE OR REPLACE VIEW public.contact_requests AS
SELECT
  id,
  name,
  email,
  company,
  message,
  context,
  status,
  created_at,
  updated_at
FROM public.cta_submissions
WHERE submission_type = 'contact';
