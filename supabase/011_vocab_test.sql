-- Run this after 010_student_vocab.sql.
-- The private bucket stores student test photos.

insert into storage.buckets (id, name, public)
values ('vocab-tests', 'vocab-tests', false)
on conflict (id) do update set public = false;

create or replace function public.submit_vocab_test(
  p_student_id uuid,
  p_name text,
  p_phone text,
  p_photo_path text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  submission_id uuid;
begin
  if not exists (
    select 1 from public.students
    where id = p_student_id
      and name = trim(p_name)
      and phone = trim(p_phone)
      and status = 'approved'
  ) then
    raise exception 'student_not_approved';
  end if;

  if p_photo_path is null or p_photo_path = '' then
    raise exception 'photo_required';
  end if;

  insert into public.vocab_test_submissions (student_id, photo_path)
  values (p_student_id, p_photo_path)
  returning id into submission_id;

  return submission_id;
end;
$$;

create or replace function public.admin_grade_vocab_test(
  p_submission_id uuid,
  p_score integer,
  p_total integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  update public.vocab_test_submissions
  set score = p_score, total = p_total, status = 'graded', graded_at = now()
  where id = p_submission_id;

  return found;
end;
$$;

revoke all on function public.submit_vocab_test(uuid, text, text, text) from public;
revoke all on function public.admin_grade_vocab_test(uuid, integer, integer) from public;
grant execute on function public.submit_vocab_test(uuid, text, text, text) to anon, authenticated;
grant execute on function public.admin_grade_vocab_test(uuid, integer, integer) to authenticated;

-- Storage access is intentionally restricted. The student app currently uses
-- name/phone access rather than Supabase Auth, so upload should be routed
-- through a server/Edge Function before production deployment.
