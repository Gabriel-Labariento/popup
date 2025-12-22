ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "Users can view own record" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own record" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Hosts
  CREATE POLICY "Public profiles are viewable by authenticated users" ON public.hosts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own host profile" ON public.hosts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own host profile" ON public.hosts
  FOR UPDATE USING (auth.uid() = user_id);

-- vendors
CREATE POLICY "Vendor profiles are viewable by authenticated users" ON public.vendors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own vendor profile" ON public.vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vendor profile" ON public.vendors
  FOR UPDATE USING (auth.uid() = user_id);

-- applications
-- View: Vendor of the app OR Host of the event
CREATE POLICY "Vendors and Hosts can view applications" ON public.applications
  FOR SELECT USING (
    auth.uid() = vendor_id OR 
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = applications.event_id 
      AND events.host_id = auth.uid()
    )
  );

-- Insert: Only the vendor can create an application
CREATE POLICY "Vendors can apply to events" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = vendor_id);

-- Update: Both parties can update (restricted by logic in your app for specific fields)
CREATE POLICY "Vendors and Hosts can update applications" ON public.applications
  FOR UPDATE USING (
    auth.uid() = vendor_id OR 
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = applications.event_id 
      AND events.host_id = auth.uid()
    )
  );

-- messages
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);