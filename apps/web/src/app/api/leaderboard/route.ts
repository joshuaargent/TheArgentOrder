import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/leaderboard - Get formation leaderboard
export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const pillar = searchParams.get("pillar"); // faith, discipline, brotherhood, building, truth
  const limit = parseInt(searchParams.get("limit") || "10");

  let query = supabase
    .from("formation_scores")
    .select(`
      user_id,
      faith_score,
      discipline_score,
      brotherhood_score,
      building_score,
      truth_score,
      overall_score,
      profiles(display_name, avatar_url)
    `)
    .order("overall_score", { ascending: false })
    .limit(limit);

  const { data: scores, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add rank
  const leaderboard = scores?.map((score, index) => ({
    rank: index + 1,
    user_id: score.user_id,
    display_name: score.profiles?.display_name || "Unknown",
    avatar_url: score.profiles?.avatar_url,
    ...(pillar
      ? { [pillar]: score[`${pillar}_score`] }
      : {
          faith: score.faith_score,
          discipline: score.discipline_score,
          brotherhood: score.brotherhood_score,
          building: score.building_score,
          truth: score.truth_score,
          overall: score.overall_score,
        }),
  }));

  return NextResponse.json({
    leaderboard: leaderboard || [],
    pillar: pillar || "overall",
  });
}
