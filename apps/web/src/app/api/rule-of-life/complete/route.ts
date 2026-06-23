import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/rule-of-life/complete - Mark rule item as complete for today
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { item_id, completed = true } = body;

  if (!item_id) {
    return NextResponse.json({ error: "item_id is required" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // Check if already logged today
  const { data: existingLog } = await supabase
    .from("rule_logs")
    .select("id")
    .eq("user_id", user.id)
    .eq("rule_item_id", item_id)
    .gte("logged_at", today)
    .lt("logged_at", tomorrow)
    .single();

  if (existingLog) {
    if (!completed) {
      // Delete log if uncompleting
      await supabase.from("rule_logs").delete().eq("id", existingLog.id);
    }
    return NextResponse.json({ success: true, message: "Already logged today" });
  }

  // Create log
  const { data: log, error } = await supabase
    .from("rule_logs")
    .insert({
      user_id: user.id,
      rule_item_id: item_id,
      completed,
      logged_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award formation points for completing rule
  await supabase.from("formation_events").insert({
    user_id: user.id,
    pillar: "discipline",
    points: 5,
    reason: "Rule of Life Item Completed",
    metadata: { item_id },
  });

  return NextResponse.json(log, { status: 201 });
}
