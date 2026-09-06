-- Genuine Academy initial schema
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  class_id uuid references public.classes(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'revoked')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  report_token text not null unique default encode(gen_random_bytes(24), 'hex')
);

create unique index if not exists students_one_approved_phone_idx
  on public.students (phone) where status = 'approved';

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  attendance_date date not null,
  created_at timestamptz not null default now(),
  unique (student_id, attendance_date)
);

create table if not exists public.vocab_sets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vocab_words (
  id uuid primary key default gen_random_uuid(),
  vocab_set_id uuid not null references public.vocab_sets(id) on delete cascade,
  english text not null,
  meaning text not null,
  day_number smallint not null check (day_number between 1 and 7),
  created_at timestamptz not null default now()
);

create table if not exists public.vocab_assignments (
  vocab_set_id uuid not null references public.vocab_sets(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (vocab_set_id, student_id)
);

create table if not exists public.vocab_progress (
  student_id uuid not null references public.students(id) on delete cascade,
  word_id uuid not null references public.vocab_words(id) on delete cascade,
  memorized boolean not null default false,
  memorized_at timestamptz,
  primary key (student_id, word_id)
);

create table if not exists public.homework_assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  total_questions integer not null check (total_questions between 1 and 100),
  answer_key jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.homework_student_assignments (
  homework_id uuid not null references public.homework_assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (homework_id, student_id)
);

create table if not exists public.homework_submissions (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references public.homework_assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  answers jsonb not null,
  score integer,
  submitted_at timestamptz not null default now(),
  unique (homework_id, student_id)
);

create table if not exists public.vocab_test_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  photo_path text not null,
  status text not null default 'pending' check (status in ('pending', 'graded')),
  score integer,
  total integer,
  submitted_at timestamptz not null default now(),
  graded_at timestamptz
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.classes enable row level security;
alter table public.admins enable row level security;
alter table public.students enable row level security;
alter table public.notices enable row level security;
alter table public.attendance_records enable row level security;
alter table public.vocab_sets enable row level security;
alter table public.vocab_words enable row level security;
alter table public.vocab_assignments enable row level security;
alter table public.vocab_progress enable row level security;
alter table public.homework_assignments enable row level security;
alter table public.homework_student_assignments enable row level security;
alter table public.homework_submissions enable row level security;
alter table public.vocab_test_submissions enable row level security;

create policy "admins manage classes" on public.classes for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins view own row" on public.admins for select to authenticated using (user_id = auth.uid());
create policy "admins manage students" on public.students for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage notices" on public.notices for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage attendance" on public.attendance_records for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage vocab sets" on public.vocab_sets for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage vocab words" on public.vocab_words for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage vocab assignments" on public.vocab_assignments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage vocab progress" on public.vocab_progress for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage homework" on public.homework_assignments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage homework assignments" on public.homework_student_assignments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage homework submissions" on public.homework_submissions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage vocab tests" on public.vocab_test_submissions for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.classes (name) values
  ('초1A'), ('초1B'), ('초2A'), ('초2B'), ('초3A'), ('초3B'),
  ('초4A'), ('초4B'), ('초5A'), ('초5B'), ('초6A'), ('초6B'),
  ('중1A'), ('중1B'), ('중2A'), ('중2B'), ('중3A'), ('중3B'),
  ('고1A'), ('고1B'), ('고2A'), ('고2B'), ('고3A'), ('고3B')
on conflict (name) do nothing;
