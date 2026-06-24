"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Briefcase, Target } from "lucide-react";
interface Project { id: string; name: string; description: string; status: string; milestones_completed: number; total_milestones: number; }
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchProjects(); }, []);
  const fetchProjects = async () => { try { const res = await fetch("/api/projects"); const data = await res.json(); setProjects(data.projects || []); } catch (error) { console.error("Failed:", error); } finally { setLoading(false); } };
  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Briefcase className="h-5 w-5 text-orange-500" />
        </div>
        <p className="text-muted-foreground">Loading your projects...</p>
      </div>
    </div>
  );
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center"><Briefcase className="h-5 w-5 text-orange-500" /></div>Projects</h1><p className="text-muted-foreground mt-1">Build things that outlast you</p></div><Button className="btn-elegant"><Plus className="h-4 w-4 mr-2" />New Project</Button></div>
      {projects.length > 0 ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{projects.map((p) => (<div key={p.id} className="glass-card p-6"><div className="flex items-start justify-between mb-4"><div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center"><Briefcase className="h-6 w-6 text-orange-500" /></div><span className="text-sm text-muted-foreground capitalize">{p.status}</span></div><h3 className="font-bold text-lg mb-2">{p.name}</h3><p className="text-sm text-muted-foreground mb-4">{p.description}</p><div className="flex items-center gap-2 text-sm text-muted-foreground"><Target className="h-4 w-4" /><span>{p.milestones_completed}/{p.total_milestones} milestones</span></div></div>))}</div> : <div className="glass-card p-12 text-center"><Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">No Projects Yet</h3><p className="text-muted-foreground mb-4">Start building something that matters.</p><Button className="btn-elegant"><Plus className="h-4 w-4 mr-2" />Create Project</Button></div>}
    </div>
  );
}
