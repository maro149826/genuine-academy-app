-- Run this after 011_vocab_test.sql.
-- Keeps grading metadata while allowing the private photo file to be removed.

alter table public.vocab_test_submissions
  add column if not exists photo_deleted_at timestamptz;
