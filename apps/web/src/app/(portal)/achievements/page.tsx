"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Lock, CheckCircle } from "lucide-react";

interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  earned: boolean;
  earned_at: string | null;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  faith: { label: "Faith", color: "bg-blue-500" },
  discipline: { label: "Discipline", color: "bg-red-500" },
  brotherhood: { label: "Brotherhood", color: "bg-purple-500" },
  building: { label: "Building", color: "bg-green-500" },
  truth: { label: "Truth", color: "bg-yellow-500" },
  special: { label: "Special", color: "bg-amber-500" },
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      setAchievements(data.achievements || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = filter
    ? achievements.filter((a) => a.category === filter)
    : achievements;

  const earnedCount = achievements.filter((a) => a.earned).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          {earnedCount} of {achievements.length} achievements earned
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            !filter ? "bg-primary text-primary-foreground" : "bg-secondary"
          }`}
        >
          All
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === key ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={achievement.earned ? "border-green-500/50" : "opacity-75"}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      achievement.earned
                        ? "bg-primary/20"
                        : "bg-muted"
                    }`}
                  >
                    {achievement.earned ? achievement.icon : <Lock className="h-5 w-5" />}
                  </div>
                  <div>
                    <CardTitle className="text-base">{achievement.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {CATEGORY_LABELS[achievement.category]?.label || achievement.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {achievement.earned ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : null}
                  <span className={achievement.earned ? "text-green-500" : "text-muted-foreground"}>
                    {achievement.points} pts
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{achievement.description}</CardDescription>
              {achievement.earned && achievement.earned_at && (
                <p className="text-xs text-muted-foreground mt-2">
                  Earned {new Date(achievement.earned_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No achievements in this category yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
