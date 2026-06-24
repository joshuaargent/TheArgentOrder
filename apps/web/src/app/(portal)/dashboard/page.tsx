"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trophy, Flame, Target, Calendar, Sword } from "lucide-react";

interface FormationScores {
  faith_score: number;
  discipline_score: number;
  brotherhood_score: number;
  building_score: number;
  truth_score: number;
  overall_score: number;
}

interface DashboardData {
  formationScores: FormationScores;
  rank: string;
  currentStreak: number;
  activeCampaigns: number;
  achievementsCount: number;
  nextPodMeeting: string | null;
  loading: boolean;
}

const PILLAR_CONFIG = [
  { key: "faith_score", name: "Faith", icon: "✝️" },
  { key: "discipline_score", name: "Discipline", icon: "⚔️" },
  { key: "brotherhood_score", name: "Brotherhood", icon: "🤝" },
  { key: "building_score", name: "Building", icon: "🏗️" },
  { key: "truth_score", name: "Truth", icon: "📖" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    formationScores: {
      faith_score: 0,
      discipline_score: 0,
      brotherhood_score: 0,
      building_score: 0,
      truth_score: 0,
      overall_score: 0,
    },
    rank: "Initiate",
    currentStreak: 0,
    activeCampaigns: 0,
    achievementsCount: 0,
    nextPodMeeting: null,
    loading: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const supabase = createClient();

    try {
      // Fetch user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setData((prev) => ({ ...prev, loading: false }));
        return;
      }

      // Fetch formation scores
      const { data: scores } = await supabase
        .from("formation_scores")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Fetch user's rank
      const { data: userRankData } = await supabase
        .from("user_ranks")
        .select("rank_id, ranks(name)")
        .eq("user_id", user.id)
        .order("assigned_at", { ascending: false })
        .limit(1)
        .single();

      const userRank = userRankData as { rank_id: string; ranks: { name: string } } | null;

      // Fetch active campaigns count
      const { count: campaignsCount } = await supabase
        .from("campaign_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active");

      // Fetch achievements count
      const { count: achievementsCount } = await supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Calculate streak from rule logs
      const { data: ruleLogs } = await supabase
        .from("rule_logs")
        .select("logged_at")
        .eq("user_id", user.id)
        .gte("logged_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("logged_at", { ascending: false });

      // Calculate streak
      let streak = 0;
      if (ruleLogs && ruleLogs.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let checkDate = new Date(today);

        for (const log of ruleLogs) {
          const logDate = new Date(log.logged_at);
          logDate.setHours(0, 0, 0, 0);

          if (logDate.getTime() === checkDate.getTime()) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (logDate.getTime() < checkDate.getTime()) {
            break;
          }
        }
      }

      // Fetch next pod meeting
      const { data: podMembership } = await supabase
        .from("pod_members")
        .select("pod_id, pods(name)")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      let nextMeeting = null;
      if (podMembership) {
        const { data: nextPodMeeting } = await supabase
          .from("pod_meetings")
          .select("scheduled_at")
          .eq("pod_id", podMembership.pod_id)
          .gte("scheduled_at", new Date().toISOString())
          .order("scheduled_at", { ascending: true })
          .limit(1)
          .single();

        if (nextPodMeeting) {
          nextMeeting = new Date(nextPodMeeting.scheduled_at).toLocaleDateString();
        }
      }

      setData({
        formationScores: scores || {
          faith_score: 0,
          discipline_score: 0,
          brotherhood_score: 0,
          building_score: 0,
          truth_score: 0,
          overall_score: 0,
        },
        rank: userRank?.ranks?.name || "Initiate",
        currentStreak: streak,
        activeCampaigns: campaignsCount || 0,
        achievementsCount: achievementsCount || 0,
        nextPodMeeting: nextMeeting,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  if (data.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sword className="h-6 w-6 text-primary" />
            Formation Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your progress across all five pillars
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary border border-primary/20">
          {data.rank}
        </span>
      </div>

      {/* Formation Score Card */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 p-6 border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Overall Formation Score</p>
            <p className="text-5xl font-bold">{data.formationScores.overall_score || 0}</p>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-full">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-semibold">{data.currentStreak} day streak</span>
          </div>
        </div>
        
        {/* Pillar Breakdown */}
        <div className="grid grid-cols-5 gap-4">
          {PILLAR_CONFIG.map((pillar) => (
            <div key={pillar.key} className="text-center">
              <span className="text-3xl">{pillar.icon}</span>
              <p className="text-xs text-muted-foreground mt-2">{pillar.name}</p>
              <p className="font-semibold text-lg">{data.formationScores[pillar.key as keyof FormationScores] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-orange-500/10 p-3">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Formation Streak</p>
              <p className="text-2xl font-bold">{data.currentStreak} days</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Active Campaigns
              </p>
              <p className="text-2xl font-bold">{data.activeCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-500/10 p-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Achievements
              </p>
              <p className="text-2xl font-bold">{data.achievementsCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-500/10 p-3">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Pod Meeting</p>
              <p className="text-2xl font-bold">{data.nextPodMeeting || "None"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Active Campaigns */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Today's Formation</h2>
          <div className="space-y-3">
            <Link
              href="/formation"
              className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-accent hover:border-primary/20"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">✝️</span> Log Prayer
              </span>
              <span className="text-sm text-muted-foreground">+10 pts</span>
            </Link>
            <Link
              href="/formation"
              className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-accent hover:border-primary/20"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">📖</span> Read Scripture
              </span>
              <span className="text-sm text-muted-foreground">+5 pts</span>
            </Link>
            <Link
              href="/examen"
              className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-accent hover:border-primary/20"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl">💭</span> Complete Examen
              </span>
              <span className="text-sm text-muted-foreground">+15 pts</span>
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Active Campaigns</h2>
          {data.activeCampaigns > 0 ? (
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <p className="font-medium">Campaign Progress</p>
                <p className="text-sm text-muted-foreground">
                  {data.activeCampaigns} active campaign{data.activeCampaigns > 1 ? "s" : ""}
                </p>
              </div>
              <Link
                href="/campaigns"
                className="block text-center text-sm text-primary hover:underline"
              >
                View Campaign Details
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <p className="font-medium">No active campaigns</p>
                <p className="text-sm text-muted-foreground">
                  Join a campaign to start your journey
                </p>
              </div>
              <Link
                href="/campaigns"
                className="block text-center text-sm text-primary hover:underline"
              >
                Browse Campaigns
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
