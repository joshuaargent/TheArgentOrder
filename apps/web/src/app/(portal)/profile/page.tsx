"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { User, Mail, Calendar, Edit, Cross, Dumbbell, Handshake, Hammer, GraduationCap, Flame } from "lucide-react";

interface Profile {
  display_name: string;
  email: string;
  created_at: string;
  rank?: string;
  faith_score: number;
  discipline_score: number;
  brotherhood_score: number;
  building_score: number;
  truth_score: number;
}

const PILLAR_CONFIG = [
  { key: "faith_score", name: "Faith", icon: Cross, color: "#a855f7" },
  { key: "discipline_score", name: "Discipline", icon: Dumbbell, color: "#ef4444" },
  { key: "brotherhood_score", name: "Brotherhood", icon: Handshake, color: "#22c55e" },
  { key: "building_score", name: "Building", icon: Hammer, color: "#eab308" },
  { key: "truth_score", name: "Truth", icon: GraduationCap, color: "#06b6d4" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-center"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse"><div className="w-5 h-5 rounded-full bg-primary/50"></div></div></div><p className="text-muted-foreground">Loading your profile...</p></div></div>;
  }

  const totalScore = profile ? Object.entries(profile).reduce((sum, [key, val]) => 
    key.endsWith('_score') && typeof val === 'number' ? sum + val : sum, 0) : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          Profile
        </h1>
        <Button variant="outline" className="border-border/50"><Edit className="h-4 w-4 mr-2" />Edit Profile</Button>
      </div>

      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-4xl font-bold">{profile?.display_name?.[0]?.toUpperCase() || "?"}</span>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{profile?.display_name || "Unknown"}</h2>
            {profile?.rank && <Badge className="mt-2">{profile.rank}</Badge>}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground justify-center md:justify-start">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{profile?.email}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}</span>
            </div>
          </div>
          <div className="md:ml-auto text-center">
            <div className="flex items-center gap-2 bg-orange-500/10 px-4 py-2 rounded-xl">
              <Flame className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-xl font-bold">{totalScore}</p>
                <p className="text-xs text-muted-foreground">Total Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Formation Scores</h3>
        <div className="grid gap-4 md:grid-cols-5">
          {PILLAR_CONFIG.map(({ key, name, icon: Icon, color }) => (
            <div key={key} className="glass-card p-5 text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <p className="font-bold text-xl">{profile?.[key as keyof Profile] as number || 0}</p>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
