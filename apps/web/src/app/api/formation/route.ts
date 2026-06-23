import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get formation scores
  const { data: scores } = await supabase
    .from("formation_scores")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get recent formation events
  const { data: events } = await supabase
    .from("formation_events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    scores: scores || {
      faith_score: 0,
      discipline_score: 0,
      brotherhood_score: 0,
      building_score: 0,
      truth_score: 0,
      overall_score: 0,
    },
    recentEvents: events || [],
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { pillar, points, reason, metadata } = body;

  if (!pillar || !points || !reason) {
    return NextResponse.json(
      { error: "Missing required fields: pillar, points, reason" },
      { status: 400 }
    );
  }

  const validPillars = ["faith", "discipline", "brotherhood", "building", "truth"];
  if (!validPillars.includes(pillar)) {
    return NextResponse.json(
      { error: `Invalid pillar. Must be one of: ${validPillars.join(", ")}` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("formation_events")
    .insert({
      user_id: user.id,
      pillar,
      points,
      reason,
      metadata: metadata || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
