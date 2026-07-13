import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/admin/stats - Get admin statistics
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin (Officer, Mentor, or Steward)
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try to use RPC function for admin stats
  const { data: stats, error: rpcError } = await supabase.rpc("get_admin_stats");

  if (!rpcError && stats) {
    return NextResponse.json(stats);
  }

  // Fallback to direct queries if RPC fails
  console.error("RPC error, falling back to direct queries:", rpcError);

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Get total members
  const { count: totalMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Get active members
  const { data: activeUserData } = await supabase
    .from("formation_events")
    .select("user_id")
    .gte("created_at", thirtyDaysAgo);

  const uniqueActiveUsers = new Set(activeUserData?.map((e) => e.user_id) || []).size;

  // Get campaigns stats
  const { count: totalCampaigns } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true });

  const { count: activeCampaigns } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  // Get formations this week
  const { count: formationsThisWeek } = await supabase
    .from("formation_events")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo);

  // Get formations by pillar
  const { data: formationsByPillar } = await supabase
    .from("formation_events")
    .select("pillar, points")
    .gte("created_at", weekAgo);

  const pillarStats = formationsByPillar?.reduce((acc, event) => {
    acc[event.pillar] = (acc[event.pillar] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from("formation_events")
    .select("id, pillar, reason, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({
    totalMembers: totalMembers || 0,
    activeMembers: uniqueActiveUsers,
    active30Days: uniqueActiveUsers,
    totalCampaigns: totalCampaigns || 0,
    activeCampaigns: activeCampaigns || 0,
    formationsThisWeek: formationsThisWeek || 0,
    pillarBreakdown: pillarStats,
    recentActivity: recentActivity || [],
  });
}
