-- Enable RLS on applications table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Vendors can view their own applications
-- This allows vendors to see the applications they have submitted
CREATE POLICY "Vendors can view their own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = vendor_id);

-- Policy 2: Vendors can insert their own applications
-- This allows vendors to submit new applications
CREATE POLICY "Vendors can insert their own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = vendor_id);

-- Policy 3: Hosts can view applications for their events
-- This allows hosts to see applications submitted to events they created
CREATE POLICY "Hosts can view applications for their events"
ON public.applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = applications.event_id
    AND events.host_id = auth.uid()
  )
);

-- Policy 4: Hosts can update applications for their events
-- This allows hosts to accept/reject applications
CREATE POLICY "Hosts can update applications for their events"
ON public.applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = applications.event_id
    AND events.host_id = auth.uid()
  )
);
