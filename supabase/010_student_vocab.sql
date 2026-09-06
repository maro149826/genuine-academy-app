-- Run this after 009_admin_vocab.sql.

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

create or replace function public.mark_vocab_word(
  p_student_id uuid,
  p_name text,
  p_phone text,
  p_word_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
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

  if not exists (
    select 1
    from public.vocab_assignments a
    join public.vocab_words w on w.vocab_set_id = a.vocab_set_id
    where a.student_id = p_student_id and w.id = p_word_id
  ) then
    raise exception 'word_not_assigned';
  end if;

  insert into public.vocab_progress (student_id, word_id, memorized, memorized_at)
  values (p_student_id, p_word_id, true, now())
  on conflict (student_id, word_id) do update
    set memorized = true, memorized_at = now();

  return true;
end;
$$;

revoke all on function public.get_student_vocab(uuid, text, text) from public;
revoke all on function public.mark_vocab_word(uuid, text, text, uuid) from public;
grant execute on function public.get_student_vocab(uuid, text, text) to anon, authenticated;
grant execute on function public.mark_vocab_word(uuid, text, text, uuid) to anon, authenticated;
