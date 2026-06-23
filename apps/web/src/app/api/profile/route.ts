import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/profile - Get current user's profile with full data
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Get formation scores
  const { data: scores } = await supabase
    .from("formation_scores")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get user level
  const { data: level } = await supabase
    .from("user_levels")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get current rank
  const { data: userRank } = await supabase
    .from("user_ranks")
    .select("ranks(name, order_index)")
    .eq("user_id", user.id)
    .order("assigned_at", { ascending: false })
    .limit(1)
    .single();

  // Get achievement count
  const { count: achievementCount } = await supabase
    .from("user_achievements")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get certification count
  const { count: certificationCount } = await supabase
    .from("user_certifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get active campaigns count
  const { count: activeCampaigns } = await supabase
    .from("campaign_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  // Get pod membership
  const { data: podMembership } = await supabase
    .from("pod_members")
    .select("pods(name)")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({
    profile,
    formation: {
      faith: scores?.faith_score || 0,
      discipline: scores?.discipline_score || 0,
      brotherhood: scores?.brotherhood_score || 0,
      building: scores?.building_score || 0,
      truth: scores?.truth_score || 0,
      overall: scores?.overall_score || 0,
    },
    level: level?.level || 1,
    xp: level?.total_xp || 0,
    rank: (userRank?.ranks ? (Array.isArray(userRank.ranks) ? userRank.ranks[0] : userRank.ranks) as { name: string } : null)?.name || "Visitor",
    stats: {
      achievements: achievementCount || 0,
      certifications: certificationCount || 0,
      activeCampaigns: activeCampaigns || 0,
    },
    pod: podMembership?.pods || null,
  });
}

// PATCH /api/profile - Update profile
export async function PATCH(_request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await _request.json();
  const { display_name, bio, avatar_url, timezone, country, vocation } = body;

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      display_name,
      bio,
      avatar_url,
      timezone,
      country,
      vocation,
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(profile);
}
