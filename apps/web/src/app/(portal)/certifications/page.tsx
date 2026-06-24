"use client";
import { useEffect, useState } from "react";
import { Award, Check, Lock } from "lucide-react";
interface Cert { id: string; name: string; description: string; earned: boolean; earned_at?: string; requirements: string[]; }
export default function CertificationsPage() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchCerts(); }, []);
  const fetchCerts = async () => { try { const res = await fetch("/api/certifications"); const data = await res.json(); setCerts(data.certifications || []); } catch (error) { console.error("Failed:", error); } finally { setLoading(false); } };
  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Award className="h-5 w-5 text-yellow-500" /></div>Certifications</h1><p className="text-muted-foreground mt-1">Earn credentials for advanced milestones</p></div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certs.map((c) => (<div key={c.id} className={`glass-card p-6 ${c.earned ? "border-green-500/30" : ""}`}><div className="flex items-start justify-between mb-4"><div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">{c.earned ? <Award className="h-6 w-6 text-yellow-500" /> : <Lock className="h-6 w-6 text-muted-foreground" />}</div>{c.earned && <span className="text-xs text-green-500 font-medium"><Check className="h-3 w-3 inline" /> Earned</span>}</div><h3 className="font-bold text-lg mb-2">{c.name}</h3><p className="text-sm text-muted-foreground mb-4">{c.description}</p>{c.earned ? <p className="text-xs text-muted-foreground">Earned {c.earned_at ? new Date(c.earned_at).toLocaleDateString() : ""}</p> : <p className="text-xs text-muted-foreground">{c.requirements.length} requirements</p>}</div>))}
      </div>
      {certs.length === 0 && <div className="glass-card p-12 text-center"><Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">No Certifications</h3><p className="text-muted-foreground">Check back later.</p></div>}
    </div>
  );
}
