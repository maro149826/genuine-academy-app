import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return new Response(JSON.stringify({ error: "auth_required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await request.json();
    const submissionId = String(body.submissionId || "");
    const score = Number(body.score);
    const total = Number(body.total);
    const serviceClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: userData } = await serviceClient.auth.getUser(token);
    if (!userData.user) return new Response(JSON.stringify({ error: "invalid_session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: admin } = await serviceClient.from("admins").select("user_id").eq("user_id", userData.user.id).maybeSingle();
    if (!admin) return new Response(JSON.stringify({ error: "admin_required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!submissionId || !Number.isInteger(score) || !Number.isInteger(total) || score < 0 || total < 1 || score > total) {
      return new Response(JSON.stringify({ error: "invalid_grade" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: submission, error: readError } = await serviceClient.from("vocab_test_submissions").select("id, photo_path, status").eq("id", submissionId).single();
    if (readError || !submission) throw readError || new Error("submission_not_found");
    if (submission.status === "graded") return new Response(JSON.stringify({ ok: true, alreadyGraded: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { error: updateError } = await serviceClient.from("vocab_test_submissions").update({ score, total, status: "graded", graded_at: new Date().toISOString() }).eq("id", submission.id);
    if (updateError) throw updateError;

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "grade_failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
