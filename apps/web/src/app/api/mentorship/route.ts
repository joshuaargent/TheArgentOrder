import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/mentorship - Get current mentorship relationship
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has a mentor
  const { data: mentorship } = await supabase
    .from("mentorships")
    .select(`
      *,
      mentor:profiles!mentorships_mentor_id_fkey(id, display_name, avatar_url, email),
      mentee:profiles!mentorships_mentee_id_fkey(id, display_name, avatar_url, email)
    `)
    .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`)
    .is("ended_at", null)
    .single();

  return NextResponse.json({ mentorship });
}

// POST /api/mentorship - Request mentorship
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { mentor_id, mentee_id } = body;

  // Determine who is requesting
  const newMentorId = mentee_id || user.id;
  const newMenteeId = mentor_id || user.id;

  // Check if mentorship already exists
  const { data: existing } = await supabase
    .from("mentorships")
    .select("id")
    .is("ended_at", null)
    .or(`and(mentor_id.eq.${newMentorId},mentee_id.eq.${newMenteeId}),and(mentor_id.eq.${newMenteeId},mentee_id.eq.${newMentorId})`)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Mentorship already exists" },
      { status: 400 }
    );
  }

  // Create mentorship
  const { data: mentorship, error } = await supabase
    .from("mentorships")
    .insert({
      mentor_id: newMentorId,
      mentee_id: newMenteeId,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Award formation points
  await supabase.from("formation_events").insert({
    user_id: user.id,
    pillar: "brotherhood",
    points: 25,
    reason: "Started mentorship",
    metadata: { mentorship_id: mentorship.id },
  });

  return NextResponse.json(mentorship, { status: 201 });
}
