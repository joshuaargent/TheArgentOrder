import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/campaigns/task/complete - Complete a campaign task
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { task_id } = body;

  if (!task_id) {
    return NextResponse.json({ error: "task_id is required" }, { status: 400 });
  }

  // Get task info
  const { data: task } = await supabase
    .from("campaign_tasks")
    .select("*, campaigns(*)")
    .eq("id", task_id)
    .single();

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // Check user is enrolled
  const { data: enrollment } = await supabase
    .from("campaign_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("campaign_id", task.campaign_id)
    .eq("status", "active")
    .single();

  if (!enrollment) {
    return NextResponse.json(
      { error: "Not enrolled in this campaign" },
      { status: 400 }
    );
  }

  // Check if already completed
  const { data: existing } = await supabase
    .from("campaign_progress")
    .select("id")
    .eq("enrollment_id", enrollment.id)
    .eq("task_id", task_id)
    .eq("completed", true)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Task already completed" },
      { status: 400 }
    );
  }

  // Create progress record
  const { data: progress, error } = await supabase
    .from("campaign_progress")
    .insert({
      enrollment_id: enrollment.id,
      task_id: task_id,
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award points
  await supabase.from("formation_events").insert({
    user_id: user.id,
    pillar: "discipline",
    points: task.points,
    reason: `Campaign task: ${task.title}`,
    metadata: { task_id, campaign: task.campaigns?.slug },
  });

  // Update enrollment completion percentage
  const { data: totalTasks } = await supabase
    .from("campaign_tasks")
    .select("id", { count: "exact" })
    .eq("campaign_id", task.campaign_id);

  const { data: completedTasks } = await supabase
    .from("campaign_progress")
    .select("id", { count: "exact" })
    .eq("enrollment_id", enrollment.id)
    .eq("completed", true);

  const percent = totalTasks && totalTasks.length > 0
    ? Math.round((completedTasks?.length || 0) / totalTasks.length * 100)
    : 0;

  await supabase
    .from("campaign_enrollments")
    .update({ completion_percent: percent })
    .eq("id", enrollment.id);

  return NextResponse.json({ progress, points: task.points }, { status: 201 });
}
