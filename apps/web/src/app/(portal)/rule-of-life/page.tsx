"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckSquare, Clock } from "lucide-react";
interface Rule { id: string; title: string; description: string; frequency: string; completed_today: boolean; }
export default function RuleOfLifePage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchRules(); }, []);
  const fetchRules = async () => { try { const res = await fetch("/api/rule-of-life"); const data = await res.json(); setRules(data.rules || []); } catch (error) { console.error("Failed:", error); } finally { setLoading(false); } };
  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  const completed = rules.filter(r => r.completed_today).length;
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckSquare className="h-5 w-5 text-green-500" /></div>Rule of Life</h1><p className="text-muted-foreground mt-1">Your daily execution system</p></div><Button className="btn-elegant">Add Rule</Button></div>
      <div className="glass-card p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Today</p><p className="text-3xl font-bold">{completed}/{rules.length}</p></div><div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center"><CheckSquare className="h-8 w-8 text-green-500" /></div></div></div>
      <div className="space-y-3">{rules.map((rule) => (<div key={rule.id} className={`glass-card p-4 flex items-center gap-4 ${rule.completed_today ? "border-green-500/30" : ""}`}><div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${rule.completed_today ? "bg-green-500" : "border-2 border-border"}`}>{rule.completed_today && <CheckSquare className="h-4 w-4 text-white" />}</div><div className="flex-1"><p className="font-medium">{rule.title}</p><p className="text-sm text-muted-foreground">{rule.description}</p></div><span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{rule.frequency}</span></div>))}</div>
    </div>
  );
}
