-- Create the storage bucket for problem images
insert into storage.buckets (id, name, public)
values ('problems', 'problems', true)
on conflict (id) do nothing;

-- Policy to allow public viewing of images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'problems' );

-- Policy to allow authenticated users to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'problems'
    and auth.role() = 'authenticated'
  );

-- Policy to allow users to update their own images
create policy "Users can update their own images"
  on storage.objects for update
  using (
    bucket_id = 'problems'
    and auth.uid() = owner
  );

-- Policy to allow users to delete their own images
create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'problems'
    and auth.uid() = owner
  );
