-- Run this after 004_homework_access.sql.

create or replace function public.admin_create_homework(
  p_title text,
  p_total_questions integer,
  p_answer_key jsonb,
  p_student_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_homework_id uuid;
begin
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  if trim(p_title) = ''
    or p_total_questions < 1
    or p_total_questions > 100
    or jsonb_typeof(p_answer_key) <> 'array'
    or jsonb_array_length(p_answer_key) <> p_total_questions
    or coalesce(array_length(p_student_ids, 1), 0) = 0 then
    raise exception 'invalid_homework_input';
  end if;

  insert into public.homework_assignments (title, total_questions, answer_key)
  values (trim(p_title), p_total_questions, p_answer_key)
  returning id into new_homework_id;

  insert into public.homework_student_assignments (homework_id, student_id)
  select new_homework_id, s.id
  from public.students s
  where s.id = any(p_student_ids)
    and s.status = 'approved'
  on conflict do nothing;

  if not exists (
    select 1 from public.homework_student_assignments
    where homework_id = new_homework_id
  ) then
    delete from public.homework_assignments where id = new_homework_id;
    raise exception 'no_approved_students';
  end if;

  return new_homework_id;
end;
$$;

revoke all on function public.admin_create_homework(text, integer, jsonb, uuid[]) from public;
grant execute on function public.admin_create_homework(text, integer, jsonb, uuid[]) to authenticated;
