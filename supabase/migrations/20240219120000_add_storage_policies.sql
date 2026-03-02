-- Create bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

-- Allow public access to view images
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'event-images' );

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'event-images' );

-- Allow users to update their own images
create policy "Users can update own images"
on storage.objects for update
to authenticated
using ( bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Allow users to delete their own images
create policy "Users can delete own images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1] );
