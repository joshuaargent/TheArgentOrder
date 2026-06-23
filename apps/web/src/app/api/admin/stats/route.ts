import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/admin/stats - Get admin statistics
export async function GET() {
  const supabase = await createClient();

  // Check if user is admin (for now, skip auth check in this example)
  // In production, add admin role check here

  // Get total members
  const { count: totalMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Get active members (activity in last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: activeMembers } = await supabase
    .from("formation_events")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo);

  // Get unique users with recent activity
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

  // Get certifications stats
  const { count: totalCertifications } = await supabase
    .from("certifications")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  // Get formations this week
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: formationsThisWeek } = await supabase
    .from("formation_events")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo);

  // Get formations by pillar this week
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
    totalCampaigns: totalCampaigns || 0,
    activeCampaigns: activeCampaigns || 0,
    totalCertifications: totalCertifications || 0,
    formationsThisWeek: formationsThisWeek || 0,
    pillarStats,
    recentActivity: recentActivity || [],
  });
}
