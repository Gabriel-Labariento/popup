-- 1. Ensure hosts.user_id is unique so it can be referenced by a Foreign Key
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'hosts_user_id_key'
    ) THEN
        ALTER TABLE public.hosts ADD CONSTRAINT hosts_user_id_key UNIQUE (user_id);
    END IF;
END $$;


-- 2. Drop the existing Foreign Key that points to public.users
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_host_id_fkey;


-- 3. Add the new Foreign Key pointing to public.hosts(user_id)
-- This enables PostgREST to see the relationship: events -> hosts
ALTER TABLE public.events 
    ADD CONSTRAINT events_host_id_fkey 
    FOREIGN KEY (host_id) REFERENCES public.hosts(user_id) ON DELETE CASCADE;
