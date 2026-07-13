import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/examen - Get today's examen or recent ones
export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "7");

  const { data: entries, error } = await supabase
    .from("examen_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get today's entry if exists
  const today = new Date().toISOString().split("T")[0];
  const todayEntry = entries?.find((e) => e.date === today);

  return NextResponse.json({
    today: todayEntry || null,
    recent: entries || [],
  });
}

// POST /api/examen - Complete daily examen
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { went_well, failed, saw_god, improve_tomorrow, gratitude, prayer_focus } = body;

  const today = new Date().toISOString().split("T")[0];

  // Check if already submitted today
  const { data: existing } = await supabase
    .from("examen_entries")
    .select("id")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  if (existing) {
    // Update existing entry
    const { data: entry, error } = await supabase
      .from("examen_entries")
      .update({
        went_well,
        failed,
        saw_god,
        improve_tomorrow,
        gratitude,
        prayer_focus,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entry, created: false });
  }

  // Create new entry
  const { data: entry, error } = await supabase
    .from("examen_entries")
    .insert({
      user_id: user.id,
      date: today,
      went_well,
      failed,
      saw_god,
      improve_tomorrow,
      gratitude,
      prayer_focus,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create formation event for completing examen
  await supabase.from("formation_events").insert({
    user_id: user.id,
    pillar: "faith",
    points: 15,
    reason: "Daily Examen",
    source: "web",
    metadata: { type: "examen" },
  });

  return NextResponse.json({ entry, created: true }, { status: 201 });
}
