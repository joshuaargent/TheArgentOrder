import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/reviews/monthly - Get monthly reviews
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: reviews, error } = await supabase
    .from("monthly_reviews")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(reviews || []);
}

// POST /api/reviews/monthly - Create monthly review
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { content, growth, challenges, adjustments } = body;

  const { data: review, error } = await supabase
    .from("monthly_reviews")
    .insert({
      user_id: user.id,
      content: content || JSON.stringify({ growth, challenges, adjustments }),
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
    points: 50,
    reason: "Monthly Review Completed",
    metadata: { type: "monthly_review" },
  });

  return NextResponse.json(review, { status: 201 });
}
