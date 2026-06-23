"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  faith: number;
  discipline: number;
  brotherhood: number;
  building: number;
  truth: number;
  overall: number;
}

const PILLAR_COLORS: Record<string, string> = {
  faith: "text-blue-500",
  discipline: "text-red-500",
  brotherhood: "text-purple-500",
  building: "text-green-500",
  truth: "text-yellow-500",
};

const PILLAR_ICONS: Record<string, string> = {
  faith: "✝️",
  discipline: "⚔️",
  brotherhood: "🤝",
  building: "🏗️",
  truth: "📖",
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedPillar, setSelectedPillar] = useState<string>("overall");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedPillar]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url =
        selectedPillar === "overall"
          ? "/api/leaderboard"
          : `/api/leaderboard?pillar=${selectedPillar}`;
      const res = await fetch(url);
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getScore = (entry: LeaderboardEntry) => {
    if (selectedPillar === "overall") {
      return entry.overall;
    }
    return entry[selectedPillar as keyof LeaderboardEntry] as number;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">See how you stack up against your brothers</p>
      </div>

      {/* Pillar Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPillar("overall")}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            selectedPillar === "overall"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          Overall
        </button>
        {Object.keys(PILLAR_ICONS).map((pillar) => (
          <button
            key={pillar}
            onClick={() => setSelectedPillar(pillar)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedPillar === pillar
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {PILLAR_ICONS[pillar]} {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : leaderboard.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No leaderboard data yet.</p>
            <p className="text-sm text-muted-foreground">
              Start forming to appear on the leaderboard!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <Card
              key={entry.user_id}
              className={entry.rank <= 3 ? "border-yellow-500/30" : ""}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 flex justify-center">{getRankIcon(entry.rank)}</div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    {entry.avatar_url ? (
                      <img
                        src={entry.avatar_url}
                        alt={entry.display_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold">
                        {entry.display_name[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <p className="font-semibold">{entry.display_name}</p>
                    {selectedPillar === "overall" && (
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>✝️ {entry.faith}</span>
                        <span>⚔️ {entry.discipline}</span>
                        <span>🤝 {entry.brotherhood}</span>
                        <span>🏗️ {entry.building}</span>
                        <span>📖 {entry.truth}</span>
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${
                        selectedPillar === "overall"
                          ? ""
                          : PILLAR_COLORS[selectedPillar] || ""
                      }`}
                    >
                      {getScore(entry)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPillar === "overall" ? "total" : selectedPillar}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
