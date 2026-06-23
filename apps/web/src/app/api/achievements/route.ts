import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/achievements - List all achievements and user's progress
export async function GET(_request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("category")
    .order("points");

  // Get user's earned achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id, earned_at, achievements(*)")
    .eq("user_id", user.id);

  const earnedIds = new Set(userAchievements?.map((ua) => ua.achievement_id) || []);

  // Merge achievement data with user progress
  const achievementsWithProgress = achievements?.map((achievement) => {
    const userAchievement = userAchievements?.find(
      (ua) => ua.achievement_id === achievement.id
    );
    return {
      ...achievement,
      earned: earnedIds.has(achievement.id),
      earned_at: userAchievement?.earned_at || null,
    };
  });

  return NextResponse.json({
    achievements: achievementsWithProgress || [],
    total: achievements?.length || 0,
    earned: earnedIds.size,
  });
}
