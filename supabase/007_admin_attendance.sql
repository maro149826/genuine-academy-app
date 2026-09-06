-- Run this after 006_notice_access.sql.

create or replace function public.admin_check_attendance(p_student_id uuid, p_attendance_date date)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  insert into public.attendance_records (student_id, attendance_date)
  values (p_student_id, p_attendance_date)
  on conflict (student_id, attendance_date) do nothing;

  return true;
end;
$$;

revoke all on function public.admin_check_attendance(uuid, date) from public;
grant execute on function public.admin_check_attendance(uuid, date) to authenticated;
