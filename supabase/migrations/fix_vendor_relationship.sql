-- 1. Ensure vendors.user_id is unique so it can be referenced by a Foreign Key
-- We wrap this in a DO block or just attempt it. 
-- Since we can't fully script conditional logic easily without plpgsql DO blocks in some environments,
-- we'll assume standard Postgres behavior. If it fails because it exists, that is fine (it means it is already unique).
-- But to be cleaner, we just add the Unique constraint if not PK.

-- Attempt to add UNIQUE constraint to user_id if it's not already there.
-- Note: If user_id is already the PK, this is redundant but harmless (it will error if constraint name exists).
-- We will use a DO block to be safe.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'vendors_user_id_key'
    ) THEN
        ALTER TABLE public.vendors ADD CONSTRAINT vendors_user_id_key UNIQUE (user_id);
    END IF;
END $$;


-- 2. Drop the existing Foreign Key that points to public.users
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_vendor_id_fkey;


-- 3. Add the new Foreign Key pointing to public.vendors(user_id)
-- This enables PostgREST to see the relationship: applications -> vendors
ALTER TABLE public.applications 
    ADD CONSTRAINT applications_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES public.vendors(user_id) ON DELETE CASCADE;
