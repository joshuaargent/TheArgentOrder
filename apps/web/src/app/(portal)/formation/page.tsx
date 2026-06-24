"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Flame, Clock, BookOpen, Users, Hammer, Cross, Dumbbell, Handshake, GraduationCap } from "lucide-react";

interface FormationScores {
  faith_score: number;
  discipline_score: number;
  brotherhood_score: number;
  building_score: number;
  truth_score: number;
  overall_score: number;
}

interface FormEvent {
  id: string;
  pillar: string;
  points: number;
  reason: string;
  created_at: string;
}

const PILLAR_CONFIG = {
  faith: { icon: Cross, name: "Faith", color: "#a855f7", description: "Prayer, Mass, Scripture, Sacraments" },
  discipline: { icon: Dumbbell, name: "Discipline", color: "#ef4444", description: "Habits, Fitness, Deep Work, Execution" },
  brotherhood: { icon: Handshake, name: "Brotherhood", color: "#22c55e", description: "Community, Pod, Mentorship" },
  building: { icon: Hammer, name: "Building", color: "#eab308", description: "Projects, Creation, Launch" },
  truth: { icon: GraduationCap, name: "Truth", color: "#06b6d4", description: "Learning, Apologetics, Wisdom" },
};

const PILLAR_ACTIONS = {
  faith: { icon: Clock, label: "Pray", points: 10, action: "Prayer session" },
  discipline: { icon: Dumbbell, label: "Workout", points: 10, action: "Workout" },
  building: { icon: Hammer, label: "Build", points: 20, action: "Deep work session" },
  truth: { icon: BookOpen, label: "Study", points: 10, action: "Study/Learning" },
  brotherhood: { icon: Users, label: "Connect", points: 10, action: "Brotherhood activity" },
};

export default function FormationPage() {
  const [scores, setScores] = useState<FormationScores | null>(null);
  const [events, setEvents] = useState<FormEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);

  useEffect(() => { fetchFormationData(); }, []);

  const fetchFormationData = async () => {
    try {
      const res = await fetch("/api/formation");
      const data = await res.json();
      setScores(data.scores);
      setEvents(data.recentEvents || []);
    } catch (error) {
      console.error("Failed to fetch formation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const logFormationEvent = async (pillar: string, points: number, reason: string) => {
    setLogging(true);
    try {
      const res = await fetch("/api/formation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillar, points, reason }),
      });
      if (res.ok) { await fetchFormationData(); }
    } catch (error) {
      console.error("Failed to log event:", error);
    } finally {
      setLogging(false);
    }
  };

  const pillars = ["faith", "discipline", "brotherhood", "building", "truth"];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Flame className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your formation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Flame className="h-5 w-5 text-primary" />
            </div>
            Formation
          </h1>
          <p className="text-muted-foreground mt-1">Track your progress across all five pillars</p>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="relative glass-card p-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/5 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Formation Score</p>
            <div className="flex items-baseline gap-3">
              <p className="text-6xl font-bold">{scores?.overall_score || 0}</p>
              <span className="text-muted-foreground">points</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-orange-500/10 px-5 py-3 rounded-2xl">
            <Flame className="h-7 w-7 text-orange-500" />
            <div>
              <p className="text-xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {pillars.map((pillar) => {
          const config = PILLAR_CONFIG[pillar as keyof typeof PILLAR_CONFIG];
          const action = PILLAR_ACTIONS[pillar as keyof typeof PILLAR_ACTIONS];
          const score = scores?.[`${pillar}_score` as keyof FormationScores] as number || 0;
          const Icon = config.icon;
          const ActionIcon = action.icon;

          return (
            <div key={pillar} className="glass-card p-5 stagger-item">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
                  <Icon className="h-6 w-6" style={{ color: config.color }} />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{score} pts</Badge>
              </div>
              <h3 className="font-bold text-lg mb-1">{config.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{config.description}</p>
              <Button
                size="sm"
                className="w-full btn-elegant"
                onClick={() => logFormationEvent(pillar, action.points, action.action)}
                disabled={logging}
              >
                <ActionIcon className="mr-1.5 h-4 w-4" />
                {action.label}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => {
              const config = PILLAR_CONFIG[event.pillar as keyof typeof PILLAR_CONFIG];
              const Icon = config?.icon || Cross;
              return (
                <div key={event.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
                      <Icon className="h-5 w-5" style={{ color: config.color }} />
                    </div>
                    <div>
                      <p className="font-medium">{event.reason}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="success" className="bg-green-500/10 text-green-500 border-green-500/20">+{event.points}</Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No formation events yet. Start building your score!</p>
          </div>
        )}
      </div>
    </div>
  );
}
