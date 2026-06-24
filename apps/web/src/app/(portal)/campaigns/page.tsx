"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Target, Calendar, ArrowRight, Cross, Zap, Shield } from "lucide-react";
interface Campaign { id: string; slug: string; title: string; description: string; campaign_type: string; difficulty: string; duration_days: number; start_date: string | null; end_date: string | null; active: boolean; }
export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchCampaigns(); }, []);
  const fetchCampaigns = async () => { try { const res = await fetch("/api/campaigns"); const data = await res.json(); setCampaigns(data.campaigns || data || []); } catch (error) { console.error("Failed:", error); } finally { setLoading(false); } };
  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Target className="h-5 w-5 text-red-500" />
        </div>
        <p className="text-muted-foreground">Loading campaigns...</p>
      </div>
    </div>
  );
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><Target className="h-5 w-5 text-red-500" /></div>Campaigns</h1><p className="text-muted-foreground mt-1">Join structured transformation campaigns</p></div>
      <div className="grid gap-4 md:grid-cols-4">
        {[{ icon: Cross, color: "#a855f7", label: "Liturgical", desc: "Lent & Advent" }, { icon: Zap, color: "#06b6d4", label: "Focused", desc: "Sprints" }, { icon: Shield, color: "#22c55e", label: "Ongoing", desc: "Permanent" }, { icon: Target, color: "#eab308", label: "Community", desc: "Group Challenge" }].map((t, idx) => (
          <div key={idx} className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${t.color}15` }}><t.icon className="h-5 w-5" style={{ color: t.color }} /></div>
            <div><p className="text-sm text-muted-foreground">{t.label}</p><p className="font-semibold text-sm">{t.desc}</p></div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Cross className="h-6 w-6 text-primary" /></div>
              <Badge className="capitalize" style={{ backgroundColor: "rgba(161,161,170,0.1)", color: "#a1a1aa" }}>{campaign.difficulty}</Badge>
            </div>
            <h3 className="font-bold text-lg mb-2">{campaign.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><Calendar className="h-4 w-4" />{campaign.duration_days} days</div>
            <Button variant="outline" className="w-full border-border/50" asChild><Link href={`/campaigns/${campaign.slug}`}>View Campaign <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
          </div>
        ))}
      </div>
      {campaigns.length === 0 && <div className="glass-card p-12 text-center"><Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No campaigns available.</p></div>}
    </div>
  );
}
