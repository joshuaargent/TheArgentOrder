"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Users, Calendar, Plus, Cross, Flame, Shield, MessageCircle } from "lucide-react";

export default function BrotherhoodPage() {
  const [pod, setPod] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBrotherhood(); }, []);
  const fetchBrotherhood = async () => {
    try {
      const res = await fetch("/api/pods");
      const data = await res.json();
      setPod(data.pod);
      setMembers(data.members || []);
      setMeetings(data.meetings || []);
    } catch (error) { console.error("Failed:", error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-center"><Users className="h-10 w-10 text-green-500 mx-auto mb-4 animate-pulse" /><p className="text-muted-foreground">Loading your brotherhood...</p></div></div>;

  if (!pod) return (
    <div className="space-y-8">
      <div><h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><Users className="h-5 w-5 text-green-500" /></div>Pods</h1><p className="text-muted-foreground mt-1">Your accountability unit</p></div>
      <div className="glass-card p-8 md:p-12 text-center">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">You're not in a Pod yet</h3>
        <p className="text-muted-foreground mb-2">No man becomes great alone. Contact your Officer to get assigned to a Pod.</p>
        <p className="text-sm text-green-500/70 mb-6">A Pod of 5 men who hold each other accountable.</p>
        <Button className="btn-elegant min-h-[48px]"><Plus className="h-4 w-4 mr-2" />Request Pod Assignment</Button>
      </div>
      <div className="glass-card p-6 border-primary/20">
        <h3 className="font-bold mb-3 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />What is a Pod?</h3>
        <p className="text-muted-foreground text-sm">A Pod is your accountability unit. 5 men. Weekly meetings. No excuses. Brothers who call you out when you're lying to yourself.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            Pods
          </h1>
          <p className="text-muted-foreground mt-1">Your Pod: <span className="font-medium text-foreground">{pod.name}</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border/50 min-h-[44px]">
            <MessageCircle className="h-4 w-4 mr-2" />
            Discord
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{members.length}</p>
            <p className="text-sm text-muted-foreground">Brothers in Pod</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{meetings.length}</p>
            <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Cross className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Prayer Requests</p>
          </div>
        </div>
      </div>

      {/* Pod Info */}
      <div className="glass-card p-6 border-green-500/20">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          Your Pod Mission
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Isolation weakens men. Brotherhood strengthens men. Your Pod exists to hold you accountable when you won't hold yourself accountable.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500/80 text-xs font-medium">Weekly meetings</span>
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500/80 text-xs font-medium">Call each other up</span>
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500/80 text-xs font-medium">No excuses</span>
        </div>
      </div>

      {/* Members */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-green-500" />
          Your Brothers
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.user_id} className="flex items-center gap-3 p-4 rounded-xl bg-background/50">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="font-bold text-green-500">{m.profiles?.display_name?.[0]?.toUpperCase() || "?"}</span>
              </div>
              <div>
                <p className="font-medium">{m.profiles?.display_name || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">Joined {new Date(m.joined_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pod Actions */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Pod Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-border/50 min-h-[44px]">
            <Cross className="h-4 w-4 mr-2" />
            Send Prayer Request
          </Button>
          <Button variant="outline" className="border-border/50 min-h-[44px]">
            <Flame className="h-4 w-4 mr-2" />
            Share a Win
          </Button>
          <Button variant="outline" className="border-border/50 min-h-[44px]">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>
    </div>
  );
}
