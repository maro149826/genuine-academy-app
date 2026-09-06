-- WARNING: This permanently deletes the current academy tables and all rows in them.
-- Run only when you have no real student/content data to keep.

drop function if exists public.is_admin() cascade;

drop table if exists public.vocab_test_submissions cascade;
drop table if exists public.homework_submissions cascade;
drop table if exists public.homework_student_assignments cascade;
drop table if exists public.homework_assignments cascade;
drop table if exists public.vocab_progress cascade;
drop table if exists public.vocab_assignments cascade;
drop table if exists public.vocab_words cascade;
drop table if exists public.vocab_sets cascade;
drop table if exists public.attendance_records cascade;
drop table if exists public.notices cascade;
drop table if exists public.students cascade;
drop table if exists public.admins cascade;
drop table if exists public.classes cascade;
