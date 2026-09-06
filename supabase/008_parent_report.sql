-- Run this after 007_admin_attendance.sql.

create or replace function public.get_parent_report(p_report_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  student_row record;
begin
  select s.id, s.name, c.name as class_name
  into student_row
  from public.students s
  left join public.classes c on c.id = s.class_id
  where s.report_token = p_report_token;

  if student_row.id is null then
    return null;
  end if;

  return jsonb_build_object(
    'student', jsonb_build_object(
      'name', student_row.name,
      'class_name', coalesce(student_row.class_name, '반 미배정')
    ),
    'attendance_this_month', (
      select count(*)
      from public.attendance_records a
      where a.student_id = student_row.id
        and date_trunc('month', a.attendance_date) = date_trunc('month', current_date)
    ),
    'attendance_dates', (
      select coalesce(jsonb_agg(to_char(a.attendance_date, 'MM/DD') order by a.attendance_date), '[]'::jsonb)
      from public.attendance_records a
      where a.student_id = student_row.id
        and date_trunc('month', a.attendance_date) = date_trunc('month', current_date)
    ),
    'vocab_tests', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'date', to_char(v.submitted_at, 'MM월 DD일'),
        'score', v.score,
        'total', v.total,
        'graded', v.status = 'graded'
      ) order by v.submitted_at desc), '[]'::jsonb)
      from public.vocab_test_submissions v
      where v.student_id = student_row.id
    ),
    'homework', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'title', h.title,
        'date', to_char(sub.submitted_at, 'MM월 DD일'),
        'score', sub.score,
        'total', h.total_questions
      ) order by sub.submitted_at desc), '[]'::jsonb)
      from public.homework_submissions sub
      join public.homework_assignments h on h.id = sub.homework_id
      where sub.student_id = student_row.id
    )
  );
end;
$$;

revoke all on function public.get_parent_report(text) from public;
grant execute on function public.get_parent_report(text) to anon, authenticated;
