-- Enable Cascade Deletes for User Deletion
-- When a user is deleted, all their related data should be removed.

-- 1. Hosts
ALTER TABLE public.hosts DROP CONSTRAINT hosts_user_id_fkey;
ALTER TABLE public.hosts 
    ADD CONSTRAINT hosts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 2. Vendors
ALTER TABLE public.vendors DROP CONSTRAINT vendors_user_id_fkey;
ALTER TABLE public.vendors 
    ADD CONSTRAINT vendors_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 3. Events (Host's events)
ALTER TABLE public.events DROP CONSTRAINT events_host_id_fkey;
ALTER TABLE public.events 
    ADD CONSTRAINT events_host_id_fkey 
    FOREIGN KEY (host_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 4. Applications (Vendor's applications)
ALTER TABLE public.applications DROP CONSTRAINT applications_vendor_id_fkey;
ALTER TABLE public.applications 
    ADD CONSTRAINT applications_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 5. Messages (Sender/Receiver)
-- Sender
ALTER TABLE public.messages DROP CONSTRAINT messages_sender_id_fkey;
ALTER TABLE public.messages 
    ADD CONSTRAINT messages_sender_id_fkey 
    FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Receiver
ALTER TABLE public.messages DROP CONSTRAINT messages_receiver_id_fkey;
ALTER TABLE public.messages 
    ADD CONSTRAINT messages_receiver_id_fkey 
    FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Enable Cascade Deletes for Hierarchy (Event -> Apps -> Messages)

-- 6. Applications (When Event is deleted)
ALTER TABLE public.applications DROP CONSTRAINT applications_event_id_fkey;
ALTER TABLE public.applications 
    ADD CONSTRAINT applications_event_id_fkey 
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

-- 7. Messages (When Application is deleted)
ALTER TABLE public.messages DROP CONSTRAINT messages_application_id_fkey;
ALTER TABLE public.messages 
    ADD CONSTRAINT messages_application_id_fkey 
    FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;
