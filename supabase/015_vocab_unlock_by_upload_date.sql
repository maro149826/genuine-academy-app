-- Run this after 014_student_vocab_test_result.sql.
-- Vocabulary unlocks begin the day after the set is uploaded.

drop function if exists public.get_student_vocab(uuid, text, text);

create or replace function public.get_student_vocab(
  p_student_id uuid,
  p_name text,
  p_phone text
)
returns table (
  id uuid,
  english text,
  meaning text,
  day_number smallint,
  memorized boolean,
  vocab_set_created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    w.id,
    w.english,
    w.meaning,
    w.day_number,
    coalesce(progress.memorized, false),
    sets.created_at
  from public.vocab_assignments assignment
  join public.vocab_sets sets on sets.id = assignment.vocab_set_id
  join public.vocab_words w on w.vocab_set_id = assignment.vocab_set_id
  join public.students student on student.id = assignment.student_id
  left join public.vocab_progress progress
    on progress.student_id = student.id and progress.word_id = w.id
  where student.id = p_student_id
    and student.name = trim(p_name)
    and student.phone = trim(p_phone)
    and student.status = 'approved'
  order by w.day_number, w.created_at, w.id;
$$;

revoke all on function public.get_student_vocab(uuid, text, text) from public;
grant execute on function public.get_student_vocab(uuid, text, text) to anon, authenticated;
