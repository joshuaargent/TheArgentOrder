"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award, Flame } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  display_name: string;
  score: number;
  streak: number;
  avatar_url?: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeaderboard(); }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setEntries(data.leaderboard || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-muted-foreground">Loading leaderboard...</div></div>;
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-1">See how you rank against the brotherhood</p>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div key={entry.rank} className={`glass-card p-4 flex items-center gap-4 stagger-item ${index < 3 ? "border-yellow-500/20" : ""}`} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0">
                {getRankIcon(entry.rank)}
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold">{entry.display_name[0]?.toUpperCase() || "?"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{entry.display_name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-orange-500" />{entry.streak} day streak</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold">{entry.score.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
          <p className="text-muted-foreground">Start earning points to appear on the leaderboard.</p>
        </div>
      )}
    </div>
  );
}
