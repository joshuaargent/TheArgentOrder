import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/projects - List user's projects
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let query = supabase
    .from("projects")
    .select(`
      *,
      project_milestones (*),
      project_updates (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: projects, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(projects || []);
}

// POST /api/projects - Create new project
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, status, repository_url, website_url } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      title,
      description,
      status: status || "active",
      repository_url,
      website_url,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create formation event
  await supabase.from("formation_events").insert({
    user_id: user.id,
    pillar: "building",
    points: 25,
    reason: "New Project Created",
    metadata: { project_id: project.id, title },
  });

  return NextResponse.json(project, { status: 201 });
}
