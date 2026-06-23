import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/reviews/weekly - Get weekly reviews
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: reviews, error } = await supabase
    .from("weekly_reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(reviews || []);
}

// POST /api/reviews/weekly - Create weekly review
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { wins, failures, lessons, goals } = body;

  const { data: review, error } = await supabase
    .from("weekly_reviews")
    .insert({
      user_id: user.id,
      wins,
      failures,
      lessons,
      goals,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create formation event for completing review
  await supabase.from("formation_events").insert({
    user_id: user.id,
    pillar: "truth",
    points: 25,
    reason: "Weekly Review Completed",
    metadata: { type: "weekly_review" },
  });

  return NextResponse.json(review, { status: 201 });
}
