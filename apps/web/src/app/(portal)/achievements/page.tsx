"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Lock, CheckCircle, Star } from "lucide-react";

interface Achievement {
  id: string; name: string; description: string; icon: string; category: string; points: number; earned: boolean; earned_at: string | null;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  
  const COLORS: Record<string, string> = { faith: "#a855f7", discipline: "#ef4444", brotherhood: "#22c55e", building: "#eab308", truth: "#06b6d4", special: "#f59e0b" };
  const LABELS: Record<string, string> = { faith: "Faith", discipline: "Discipline", brotherhood: "Brotherhood", building: "Building", truth: "Truth", special: "Special" };
  
  useEffect(() => { fetchAchievements(); }, []);
  const fetchAchievements = async () => {
    try { const res = await fetch("/api/achievements"); const data = await res.json(); setAchievements(data.achievements || []); }
    catch (error) { console.error("Failed:", error); } finally { setLoading(false); }
  };
  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-center"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse"><div className="w-5 h-5 rounded-full bg-primary/50"></div></div></div><p className="text-muted-foreground">Loading...</p></div></div>;
  const filtered = filter ? achievements.filter((a) => a.category === filter) : achievements;
  const earnedCount = achievements.filter((a) => a.earned).length;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Trophy className="h-5 w-5 text-yellow-500" /></div>Achievements</h1><p className="text-muted-foreground mt-1">{earnedCount} of {achievements.length} earned</p></div>
        <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl"><Star className="h-5 w-5 text-yellow-500" /><span className="font-bold">{earnedCount * 100}</span><span className="text-muted-foreground text-sm">points</span></div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter(null)} className={`px-4 py-2 rounded-xl text-sm font-medium ${!filter ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}>All</button>
        {Object.keys(COLORS).map((key) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === key ? "text-white" : "bg-card hover:bg-accent"}`} style={filter === key ? { backgroundColor: COLORS[key] } : {}}>{LABELS[key]}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => {
          const color = COLORS[a.category] || COLORS.special;
          const label = LABELS[a.category] || LABELS.special;
          return (
            <div key={a.id} className={`glass-card p-5 ${a.earned ? "" : "opacity-60"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: a.earned ? `${color}15` : "var(--color-muted)" }}>
                    {a.earned ? <span>{a.icon}</span> : <Lock className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div><h3 className="font-bold">{a.name}</h3><Badge className="mt-1 text-xs" style={{ backgroundColor: `${color}15`, color }}>{label}</Badge></div>
                </div>
                <div className="flex items-center gap-1">{a.earned && <CheckCircle className="h-4 w-4 text-green-500" />}<span className={`text-sm font-medium ${a.earned ? "text-green-500" : "text-muted-foreground"}`}>{a.points} pts</span></div>
              </div>
              <p className="text-sm text-muted-foreground">{a.description}</p>
              {a.earned && a.earned_at && <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">Earned {new Date(a.earned_at).toLocaleDateString()}</p>}
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="glass-card p-12 text-center"><Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No achievements.</p></div>}
    </div>
  );
}
