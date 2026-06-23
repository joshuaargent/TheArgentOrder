"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trophy, Flame, Target, Calendar } from "lucide-react";

interface DashboardData {
  formationScore: number;
  currentStreak: number;
  activeCampaigns: number;
  rank: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [data, setData] = useState<DashboardData>({
    formationScore: 0,
    currentStreak: 0,
    activeCampaigns: 0,
    rank: "Initiate",
  });

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      // TODO: Fetch actual formation data from database
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please sign in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {data.rank}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Formation Score Card */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Formation Score</p>
              <p className="text-4xl font-bold">{data.formationScore}</p>
            </div>
            <div className="flex gap-8">
              {["Faith", "Discipline", "Brotherhood", "Building", "Truth"].map(
                (pillar) => (
                  <div key={pillar} className="text-center">
                    <p className="text-xs text-muted-foreground">{pillar}</p>
                    <p className="font-semibold">0</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{data.currentStreak} days</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Campaigns
                </p>
                <p className="text-2xl font-bold">{data.activeCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Achievements
                </p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pod Meeting</p>
                <p className="text-2xl font-bold">None</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Today's Formation</h2>
            <div className="space-y-3">
              <Link
                href="/formation/prayer"
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent"
              >
                <span>Log Prayer</span>
                <span className="text-sm text-muted-foreground">+10 pts</span>
              </Link>
              <Link
                href="/formation/scripture"
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent"
              >
                <span>Read Scripture</span>
                <span className="text-sm text-muted-foreground">+5 pts</span>
              </Link>
              <Link
                href="/formation/examen"
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent"
              >
                <span>Complete Examen</span>
                <span className="text-sm text-muted-foreground">+15 pts</span>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Active Campaigns</h2>
            <div className="space-y-3">
              <div className="rounded-md border p-3">
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
          </div>
        </div>
      </main>
    </div>
  );
}
