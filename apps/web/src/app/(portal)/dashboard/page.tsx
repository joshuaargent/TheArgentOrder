"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trophy, Flame, Target, Calendar, Sword, Cross, Dumbbell, Handshake, Hammer, GraduationCap, BookOpen, ArrowRight, Plus, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
  { key: "faith_score", name: "Faith", icon: Cross, color: "#a855f7", glowClass: "glow-faith" },
  { key: "discipline_score", name: "Discipline", icon: Dumbbell, color: "#ef4444", glowClass: "glow-discipline" },
  { key: "brotherhood_score", name: "Brotherhood", icon: Handshake, color: "#22c55e", glowClass: "glow-brotherhood" },
  { key: "building_score", name: "Building", icon: Hammer, color: "#eab308", glowClass: "glow-building" },
  { key: "truth_score", name: "Truth", icon: GraduationCap, color: "#06b6d4", glowClass: "glow-truth" },
];

const RANK_PROGRESSION = ["Initiate", "Brother", "Veteran", "Captain", "Officer", "Mentor", "Steward"];

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setData((prev) => ({ ...prev, loading: false }));
        return;
      }

      const { data: scores } = await supabase
        .from("formation_scores")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const { data: userRankData } = await supabase
        .from("user_ranks")
        .select("rank_id, ranks(name)")
        .eq("user_id", user.id)
        .order("assigned_at", { ascending: false })
        .limit(1)
        .single();

      const userRank = userRankData as { rank_id: string; ranks: { name: string } } | null;

      const { count: campaignsCount } = await supabase
        .from("campaign_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active");

      const { count: achievementsCount } = await supabase
        .from("user_achievements")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { data: ruleLogs } = await supabase
        .from("rule_logs")
        .select("logged_at")
        .eq("user_id", user.id)
        .gte("logged_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("logged_at", { ascending: false });

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header - Premium */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sword className="h-5 w-5 text-primary" />
            </div>
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Execute your formation. Every day counts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20 flex items-center gap-2">
            <Crown className="h-4 w-4" />
            {data.rank}
          </span>
        </div>
      </div>

      {/* Main Score Card - Hero Style */}
      <div className="relative glass-card p-8 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/5 blur-3xl" />
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Formation Score</p>
              <div className="flex items-baseline gap-3">
                <p className="text-6xl font-bold text-foreground">{data.formationScores.overall_score || 0}</p>
                <span className="text-muted-foreground">points</span>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-2">Earn points through daily execution. Unlock leadership progression.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-orange-500/10 px-5 py-3 rounded-2xl">
                <Flame className="h-7 w-7 text-orange-500" />
                <div>
                  <p className="text-xl font-bold text-foreground">{data.currentStreak}</p>
                  <p className="text-xs text-muted-foreground">day streak</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pillar Breakdown */}
          <div className="grid grid-cols-5 gap-4">
            {PILLAR_CONFIG.map((pillar, index) => (
              <div 
                key={pillar.key} 
                className="text-center p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors stagger-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-transform hover:scale-110 ${pillar.glowClass}`}
                  style={{ backgroundColor: `${pillar.color}15` }}
                >
                  <pillar.icon className="h-6 w-6" style={{ color: pillar.color }} />
                </div>
                <p className="text-xs text-muted-foreground mb-1">{pillar.name}</p>
                <p className="font-bold text-lg text-foreground">
                  {data.formationScores[pillar.key as keyof FormationScores] || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Cross, label: "Log Prayer", href: "/formation", color: "#a855f7", points: "+10" },
            { icon: BookOpen, label: "Read Scripture", href: "/formation", color: "#06b6d4", points: "+5" },
            { icon: Flame, label: "Complete Examen", href: "/examen", color: "#ef4444", points: "+15" },
            { icon: Target, label: "Join Campaign", href: "/campaigns", color: "#22c55e", points: "+25" },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="group glass-card p-5 flex flex-col items-center text-center hover:translate-y-[-2px] transition-all duration-300 cursor-pointer"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <action.icon className="h-6 w-6" style={{ color: action.color }} />
              </div>
              <p className="font-semibold text-foreground text-sm">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.points}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            icon: Flame, 
            label: "Formation Streak", 
            value: `${data.currentStreak} days`, 
            color: "#ef4444",
            description: "Keep the momentum going"
          },
          { 
            icon: Target, 
            label: "Active Campaigns", 
            value: data.activeCampaigns.toString(), 
            color: "#22c55e",
            description: "In progress right now"
          },
          { 
            icon: Trophy, 
            label: "Achievements", 
            value: data.achievementsCount.toString(), 
            color: "#eab308",
            description: "Unlocked badges"
          },
          { 
            icon: Calendar, 
            label: "Next Pod Meeting", 
            value: data.nextPodMeeting || "None", 
            color: "#8b5cf6",
            description: "Stay accountable"
          },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="glass-card p-6 hover:translate-y-[-2px] transition-all duration-300 stagger-item"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Formation Card */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Today's Formation</h2>
            <Link href="/formation" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {[
              { icon: Cross, label: "Log Prayer", sublabel: "Start your day with God", color: "#a855f7", href: "/formation" },
              { icon: BookOpen, label: "Read Scripture", sublabel: "Daily reading plan", color: "#06b6d4", href: "/formation" },
              { icon: Dumbbell, label: "Complete Rule Item", sublabel: "Stay disciplined", color: "#ef4444", href: "/rule-of-life" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-colors group"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.sublabel}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Active Campaigns Card */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Active Campaigns</h2>
            <Link href="/campaigns" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          {data.activeCampaigns > 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].slice(0, Math.min(data.activeCampaigns, 3)).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground">Campaign {i + 1}</p>
                    <span className="text-xs text-muted-foreground">{70 + i * 10}%</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${70 + i * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-foreground mb-2">No active campaigns</p>
              <p className="text-sm text-muted-foreground mb-4">
                Join a campaign to start your journey
              </p>
              <Link href="/campaigns">
                <Button size="sm" className="btn-elegant">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Campaigns
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
