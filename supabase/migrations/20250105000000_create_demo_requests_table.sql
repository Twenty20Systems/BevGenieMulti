-- Create demo_requests table for storing demo request submissions
-- This table captures leads from the "Schedule Demo" CTA

CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('sales', 'marketing', 'operations', 'executive', 'other')),
  phone TEXT,
  message TEXT,
  context TEXT, -- What led them to request demo (e.g., "Interest from: Transform Campaign Data Into Revenue")
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  scheduled_date TIMESTAMPTZ,
  notes TEXT
);

-- Add index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON public.demo_requests(email);

-- Add index on status for filtering
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON public.demo_requests(status);

-- Add index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON public.demo_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anonymous users (for form submissions)
CREATE POLICY "Allow public inserts" ON public.demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all demo requests
CREATE POLICY "Allow authenticated reads" ON public.demo_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update demo requests
CREATE POLICY "Allow authenticated updates" ON public.demo_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_demo_requests_updated_at
  BEFORE UPDATE ON public.demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE public.demo_requests IS 'Stores demo request submissions from BevGenie application';
