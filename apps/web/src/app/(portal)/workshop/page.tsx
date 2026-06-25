"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Hammer, 
  Rocket, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Plus,
  ArrowRight
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  milestones_completed: number;
  total_milestones: number;
  shipped_at: string | null;
}

interface ShipLog {
  id: string;
  content: string;
  created_at: string;
  project_name: string;
}

export default function WorkshopPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [shipLogs, setShipLogs] = useState<ShipLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshopData();
  }, []);

  const fetchWorkshopData = async () => {
    try {
      const [projectsRes, logsRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/ship-logs")
      ]);
      const projectsData = await projectsRes.json();
      const logsData = await logsRes.json();
      setProjects(projectsData.projects || []);
      setShipLogs(logsData.logs || []);
    } catch (error) {
      console.error("Failed to fetch workshop data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Hammer className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-muted-foreground">Entering the workshop...</p>
        </div>
      </div>
    );
  }

  const shippedCount = projects.filter(p => p.status === 'shipped').length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Hammer className="h-5 w-5 text-orange-500" />
            </div>
            WORKSHOP
          </h1>
          <p className="text-muted-foreground mt-1">Ship or be shipped.</p>
        </div>
        <Button className="btn-elegant min-h-[48px]">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Hammer className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{projects.length}</p>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{inProgressCount}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{shippedCount}</p>
            <p className="text-sm text-muted-foreground">Shipped</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{shipLogs.length}</p>
            <p className="text-sm text-muted-foreground">Ship Logs</p>
          </div>
        </div>
      </div>

      {/* Ship Log CTA */}
      <div className="glass-card p-6 bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Weekly Ship Log
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              What did you ship this week? REQUIRED every Sunday.
            </p>
          </div>
          <Button variant="outline" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10 min-h-[44px]">
            Log Your Progress
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Active Projects */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Active Projects
        </h2>
        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="glass-card p-5 hover:border-orange-500/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Hammer className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'shipped' 
                      ? 'bg-green-500/10 text-green-500' 
                      : project.status === 'in_progress'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {project.status === 'shipped' ? '✓ Shipped' : project.status === 'in_progress' ? 'In Progress' : project.status}
                  </span>
                </div>
                <h3 className="font-bold mb-2">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>{project.milestones_completed}/{project.total_milestones} milestones</span>
                  </div>
                  {project.shipped_at && (
                    <span className="text-xs text-green-500">
                      Shipped {new Date(project.shipped_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Button variant="ghost" className="w-full text-sm h-10">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-4">Start building something that outlasts you.</p>
            <Button className="btn-elegant">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>

      {/* Recent Ship Logs */}
      {shipLogs.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Ship Logs
          </h2>
          <div className="space-y-3">
            {shipLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="glass-card p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{log.project_name}</p>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{log.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Build Help CTA */}
      <div className="glass-card p-6 border-primary/20">
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2">Need Help?</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Ask your brothers in the Discord #build-help channel.
          </p>
          <Button variant="outline" className="border-border/50">
            <Hammer className="h-4 w-4 mr-2" />
            Ask the Brotherhood
          </Button>
        </div>
      </div>
    </div>
  );
}
