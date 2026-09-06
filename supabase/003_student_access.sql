-- Run this after 001_initial_schema.sql.
-- These security-definer functions are the only anonymous entry points for student access.

create or replace function public.request_student_access(p_name text, p_phone text)
returns table (id uuid, name text, phone text, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_student public.students%rowtype;
begin
  select * into existing_student
  from public.students
  where public.students.name = trim(p_name)
    and public.students.phone = trim(p_phone)
  order by case when public.students.status = 'approved' then 0 else 1 end, created_at desc
  limit 1;

  if existing_student.id is not null then
    return query select existing_student.id, existing_student.name, existing_student.phone, existing_student.status;
    return;
  end if;

  return query
  insert into public.students (name, phone, status)
  values (trim(p_name), trim(p_phone), 'pending')
  returning students.id, students.name, students.phone, students.status;
end;
$$;

create or replace function public.student_login(p_name text, p_phone text)
returns table (id uuid, name text, phone text, status text)
language sql
security definer
set search_path = public
as $$
  select s.id, s.name, s.phone, s.status
  from public.students s
  where s.name = trim(p_name)
    and s.phone = trim(p_phone)
  order by case when s.status = 'approved' then 0 else 1 end, s.created_at desc
  limit 1;
$$;

revoke all on function public.request_student_access(text, text) from public;
revoke all on function public.student_login(text, text) from public;
grant execute on function public.request_student_access(text, text) to anon, authenticated;
grant execute on function public.student_login(text, text) to anon, authenticated;
