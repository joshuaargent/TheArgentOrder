"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Flame, Clock, BookOpen, Users, Hammer } from "lucide-react";

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
  faith: {
    icon: "✝️",
    name: "Faith",
    color: "bg-blue-500",
    description: "Prayer, Mass, Scripture, Sacraments",
  },
  discipline: {
    icon: "⚔️",
    name: "Discipline",
    color: "bg-red-500",
    description: "Habits, Fitness, Deep Work, Execution",
  },
  brotherhood: {
    icon: "🤝",
    name: "Brotherhood",
    color: "bg-purple-500",
    description: "Community, Pod, Mentorship",
  },
  building: {
    icon: "🏗️",
    name: "Building",
    color: "bg-green-500",
    description: "Projects, Creation, Launch",
  },
  truth: {
    icon: "📖",
    name: "Truth",
    color: "bg-yellow-500",
    description: "Learning, Apologetics, Wisdom",
  },
};

export default function FormationPage() {
  const [scores, setScores] = useState<FormationScores | null>(null);
  const [events, setEvents] = useState<FormEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    fetchFormationData();
  }, []);

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

      if (res.ok) {
        await fetchFormationData();
      }
    } catch (error) {
      console.error("Failed to log event:", error);
    } finally {
      setLogging(false);
    }
  };

  const pillars = ["faith", "discipline", "brotherhood", "building", "truth"];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading formation data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold">Formation</h1>
          <p className="mt-1 text-muted-foreground">
            Track your progress across all five pillars of formation
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Overall Score */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-primary/20 to-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Formation Score</p>
              <p className="text-5xl font-bold">{scores?.overall_score || 0}</p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-semibold">0 day streak</span>
            </div>
          </div>
        </div>

        {/* Pillar Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {pillars.map((pillar) => {
            const config = PILLAR_CONFIG[pillar as keyof typeof PILLAR_CONFIG];
            const score = scores?.[`${pillar}_score` as keyof FormationScores] as number || 0;

            return (
              <Card key={pillar}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{config.icon}</span>
                    <Badge variant="secondary">{score} pts</Badge>
                  </div>
                  <CardTitle className="text-lg">{config.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-xs text-muted-foreground">{config.description}</p>
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    {pillar === "faith" && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => logFormationEvent("faith", 10, "Prayer session")}
                        disabled={logging}
                      >
                        <Clock className="mr-1 h-4 w-4" /> Pray
                      </Button>
                    )}
                    {pillar === "discipline" && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => logFormationEvent("discipline", 10, "Workout")}
                        disabled={logging}
                      >
                        <Users className="mr-1 h-4 w-4" /> Workout
                      </Button>
                    )}
                    {pillar === "building" && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => logFormationEvent("building", 20, "Deep work session")}
                        disabled={logging}
                      >
                        <Hammer className="mr-1 h-4 w-4" /> Build
                      </Button>
                    )}
                    {pillar === "truth" && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => logFormationEvent("truth", 10, "Study/Learning")}
                        disabled={logging}
                      >
                        <BookOpen className="mr-1 h-4 w-4" /> Study
                      </Button>
                    )}
                    {pillar === "brotherhood" && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => logFormationEvent("brotherhood", 10, "Brotherhood activity")}
                        disabled={logging}
                      >
                        <Users className="mr-1 h-4 w-4" /> Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {PILLAR_CONFIG[event.pillar as keyof typeof PILLAR_CONFIG]?.icon}
                      </span>
                      <div>
                        <p className="font-medium">{event.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">+{event.points}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No formation events yet. Start building your score!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
