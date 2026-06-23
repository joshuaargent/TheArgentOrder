import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/reviews/quarterly - Get quarterly reviews
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: reviews, error } = await supabase
    .from("quarterly_reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("year", { ascending: false })
    .order("quarter", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(reviews || []);
}

// POST /api/reviews/quarterly - Create quarterly review
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { 
    quarter, year, wins, failures, lessons, goals,
    identity_reflection, mission_reflection, direction_reflection, purpose_reflection
  } = body;

  const currentQuarter = quarter || Math.ceil((new Date().getMonth() + 1) / 3);
  const currentYear = year || new Date().getFullYear();

  // Get formation scores at time of review
  const { data: scores } = await supabase
    .from("formation_scores")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: review, error } = await supabase
    .from("quarterly_reviews")
    .insert({
      user_id: user.id,
      quarter: currentQuarter,
      year: currentYear,
      wins,
      failures,
      lessons,
      goals,
      identity_reflection,
      mission_reflection,
      direction_reflection,
      purpose_reflection,
      faith_score: scores?.faith_score,
      discipline_score: scores?.discipline_score,
      brotherhood_score: scores?.brotherhood_score,
      building_score: scores?.building_score,
      truth_score: scores?.truth_score,
      overall_score: scores?.overall_score,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create formation event
  await supabase.from("formation_events").insert({
    user_id: user.id,
    pillar: "truth",
    points: 100,
    reason: `Q${currentQuarter} ${currentYear} Review Completed`,
    metadata: { type: "quarterly_review" },
  });

  return NextResponse.json(review, { status: 201 });
}
