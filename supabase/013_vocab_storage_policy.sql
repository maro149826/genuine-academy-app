-- Run this after 012_vocab_photo_cleanup.sql.
-- Allows authenticated admins to create signed URLs for private test photos.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'admins can read vocab test photos'
  ) then
    create policy "admins can read vocab test photos"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'vocab-tests'
      and public.is_admin()
    );
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'admins can delete vocab test photos'
  ) then
    create policy "admins can delete vocab test photos"
    on storage.objects
    for delete
    to authenticated
    using (
      bucket_id = 'vocab-tests'
      and public.is_admin()
    );
  end if;
end;
$$;
