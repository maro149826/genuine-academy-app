import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const form = await request.formData();
    const studentId = String(form.get("studentId") || "");
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const file = form.get("file");

    if (!studentId || !name || !phone || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: "invalid_request" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("id", studentId)
      .eq("name", name)
      .eq("phone", phone)
      .eq("status", "approved")
      .maybeSingle();

    if (studentError || !student) {
      return new Response(JSON.stringify({ error: "student_not_approved" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "invalid_image" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const path = `${student.id}/${crypto.randomUUID()}.${file.type.split("/")[1] || "jpg"}`;
    const { error: uploadError } = await supabase.storage.from("vocab-tests").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;

    const { data: submission, error: submissionError } = await supabase
      .from("vocab_test_submissions")
      .insert({ student_id: student.id, photo_path: path })
      .select("id")
      .single();
    if (submissionError) throw submissionError;

    return new Response(JSON.stringify({ id: submission.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "upload_failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
