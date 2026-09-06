-- Run this after 013_vocab_storage_policy.sql.
-- Allows a student to view only their own latest vocabulary test result.

create or replace function public.get_student_vocab_test_result(
  p_student_id uuid,
  p_name text,
  p_phone text
)
returns table (
  id uuid,
  status text,
  score integer,
  total integer,
  submitted_at timestamptz,
  graded_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    v.id,
    v.status,
    v.score,
    v.total,
    v.submitted_at,
    v.graded_at
  from public.vocab_test_submissions v
  join public.students s on s.id = v.student_id
  where v.student_id = p_student_id
    and s.name = trim(p_name)
    and s.phone = trim(p_phone)
    and s.status = 'approved'
  order by v.submitted_at desc
  limit 1;
$$;

revoke all on function public.get_student_vocab_test_result(uuid, text, text) from public;
grant execute on function public.get_student_vocab_test_result(uuid, text, text) to anon, authenticated;