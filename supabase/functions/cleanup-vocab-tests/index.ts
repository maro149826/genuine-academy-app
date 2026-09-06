import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (request) => {
  const expectedSecret = Deno.env.get("CRON_SECRET");
  if (!expectedSecret || request.headers.get("x-cron-secret") !== expectedSecret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: submissions, error } = await supabase
    .from("vocab_test_submissions")
    .select("id, photo_path")
    .eq("status", "graded")
    .is("photo_deleted_at", null)
    .lte("graded_at", cutoff)
    .limit(100);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  let deleted = 0;
  for (const submission of submissions || []) {
    const { error: removeError } = await supabase.storage.from("vocab-tests").remove([submission.photo_path]);
    if (removeError) continue;
    await supabase.from("vocab_test_submissions").update({
      photo_deleted_at: new Date().toISOString(),
      photo_path: `deleted/${submission.id}`,
    }).eq("id", submission.id);
    deleted += 1;
  }

  return new Response(JSON.stringify({ deleted }));
});
