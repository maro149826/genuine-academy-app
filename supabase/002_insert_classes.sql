-- Run this only if 001_initial_schema.sql was already executed.
insert into public.classes (name) values
  ('초1A'), ('초1B'), ('초2A'), ('초2B'), ('초3A'), ('초3B'),
  ('초4A'), ('초4B'), ('초5A'), ('초5B'), ('초6A'), ('초6B'),
  ('중1A'), ('중1B'), ('중2A'), ('중2B'), ('중3A'), ('중3B'),
  ('고1A'), ('고1B'), ('고2A'), ('고2B'), ('고3A'), ('고3B')
on conflict (name) do nothing;
