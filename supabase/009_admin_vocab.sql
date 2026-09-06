-- Run this after 008_parent_report.sql.

create or replace function public.admin_create_vocab_set(
  p_name text,
  p_words jsonb,
  p_student_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_vocab_set_id uuid;
  word_count integer;
begin
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  word_count := jsonb_array_length(coalesce(p_words, '[]'::jsonb));
  if trim(p_name) = '' or word_count < 1 or word_count > 300 or coalesce(array_length(p_student_ids, 1), 0) = 0 then
    raise exception 'invalid_vocab_input';
  end if;

  insert into public.vocab_sets (name)
  values (trim(p_name))
  returning id into new_vocab_set_id;

  insert into public.vocab_words (vocab_set_id, english, meaning, day_number)
  select
    new_vocab_set_id,
    trim(word->>'en'),
    trim(word->>'kr'),
    ceil(item.ordinality / 7.0)::smallint
  from jsonb_array_elements(p_words) with ordinality as item(word, ordinality)
  where trim(word->>'en') <> '' and trim(word->>'kr') <> '';

  insert into public.vocab_assignments (vocab_set_id, student_id)
  select new_vocab_set_id, s.id
  from public.students s
  where s.id = any(p_student_ids)
    and s.status = 'approved'
  on conflict do nothing;

  if not exists (select 1 from public.vocab_assignments where vocab_set_id = new_vocab_set_id) then
    delete from public.vocab_sets where id = new_vocab_set_id;
    raise exception 'no_approved_students';
  end if;

  return new_vocab_set_id;
end;
$$;

revoke all on function public.admin_create_vocab_set(text, jsonb, uuid[]) from public;
grant execute on function public.admin_create_vocab_set(text, jsonb, uuid[]) to authenticated;
