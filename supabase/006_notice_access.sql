-- Run this after 005_admin_homework.sql.

create or replace function public.get_student_notices(
  p_student_id uuid,
  p_name text,
  p_phone text
)
returns table (id uuid, title text, content text, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select n.id, n.title, n.content, n.created_at
  from public.notices n
  where exists (
    select 1 from public.students s
    where s.id = p_student_id
      and s.name = trim(p_name)
      and s.phone = trim(p_phone)
      and s.status = 'approved'
  )
  order by n.created_at desc;
$$;

revoke all on function public.get_student_notices(uuid, text, text) from public;
grant execute on function public.get_student_notices(uuid, text, text) to anon, authenticated;
