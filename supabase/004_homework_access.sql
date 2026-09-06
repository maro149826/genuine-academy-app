-- Run this after 003_student_access.sql.
-- Homework answer keys are only returned after a submission exists.

create or replace function public.get_student_homework(
  p_student_id uuid,
  p_name text,
  p_phone text
)
returns table (
  id uuid,
  title text,
  total_questions integer,
  answer_key jsonb,
  answers jsonb,
  submitted boolean,
  score integer
)
language sql
security definer
set search_path = public
as $$
  select
    h.id,
    h.title,
    h.total_questions,
    case when s.id is null then null else h.answer_key end,
    coalesce(s.answers, '[]'::jsonb),
    s.id is not null,
    s.score
  from public.homework_student_assignments a
  join public.homework_assignments h on h.id = a.homework_id
  join public.students student on student.id = a.student_id
  left join public.homework_submissions s
    on s.homework_id = h.id and s.student_id = student.id
  where student.id = p_student_id
    and student.name = trim(p_name)
    and student.phone = trim(p_phone)
    and student.status = 'approved';
$$;

create or replace function public.submit_homework(
  p_student_id uuid,
  p_name text,
  p_phone text,
  p_homework_id uuid,
  p_answers jsonb
)
returns table (submitted boolean, score integer, answer_key jsonb)
language plpgsql
security definer
set search_path = public
as $$
declare
  assignment public.homework_assignments%rowtype;
  existing_submission uuid;
  calculated_score integer := 0;
  question_index integer;
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

  select h.* into assignment
  from public.homework_assignments h
  join public.homework_student_assignments a on a.homework_id = h.id
  where h.id = p_homework_id and a.student_id = p_student_id;

  if assignment.id is null then
    raise exception 'homework_not_assigned';
  end if;

  select id into existing_submission
  from public.homework_submissions
  where homework_id = p_homework_id and student_id = p_student_id;

  if existing_submission is not null then
    raise exception 'homework_already_submitted';
  end if;

  if jsonb_typeof(p_answers) <> 'array'
    or jsonb_array_length(p_answers) <> assignment.total_questions then
    raise exception 'invalid_answer_count';
  end if;

  for question_index in 0..assignment.total_questions - 1 loop
    if p_answers->question_index = assignment.answer_key->question_index then
      calculated_score := calculated_score + 1;
    end if;
  end loop;

  insert into public.homework_submissions (homework_id, student_id, answers, score)
  values (p_homework_id, p_student_id, p_answers, calculated_score);

  return query select true, calculated_score, assignment.answer_key;
end;
$$;

revoke all on function public.get_student_homework(uuid, text, text) from public;
revoke all on function public.submit_homework(uuid, text, text, uuid, jsonb) from public;
grant execute on function public.get_student_homework(uuid, text, text) to anon, authenticated;
grant execute on function public.submit_homework(uuid, text, text, uuid, jsonb) to anon, authenticated;
