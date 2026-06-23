"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  ArrowLeft,
  Check,
  Circle,
  Clock,
  Target,
  Trophy,
  Users,
} from "lucide-react";

interface CampaignTask {
  id: string;
  title: string;
  description: string;
  task_type: string;
  points: number;
  required: boolean;
  order_num: number;
  completed: boolean;
  completed_at: string | null;
}

interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  campaign_type: string;
  difficulty: string;
  duration_days: number;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
}

interface Enrollment {
  id: string;
  started_at: string;
  completion_percent: number;
  status: string;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tasks, setTasks] = useState<CampaignTask[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [slug]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns?slug=${slug}`);
      const data = await res.json();

      if (data.campaigns?.[0]) {
        setCampaign(data.campaigns[0]);
        setTasks(data.campaigns[0].tasks || []);
        setEnrollment(data.campaigns[0].enrollment || null);
      }
    } catch (error) {
      console.error("Failed to fetch campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch(`/api/campaigns/${slug}/join`, {
        method: "POST",
      });
      if (res.ok) {
        fetchCampaign();
      }
    } catch (error) {
      console.error("Failed to join:", error);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      const res = await fetch(`/api/campaigns/${slug}/leave`, {
        method: "POST",
      });
      if (res.ok) {
        fetchCampaign();
      }
    } catch (error) {
      console.error("Failed to leave:", error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    setCompleting(taskId);
    try {
      const res = await fetch("/api/campaigns/task/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId }),
      });

      if (res.ok) {
        const data = await res.json();
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, completed: true, completed_at: new Date().toISOString() }
              : t
          )
        );
        // Update enrollment progress
        if (data.enrollment) {
          setEnrollment(data.enrollment);
        }
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
    } finally {
      setCompleting(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "daily":
        return "📅";
      case "weekly":
        return "📆";
      case "monthly":
        return "🗓️";
      default:
        return "⭐";
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalPoints = tasks.reduce((sum, t) => sum + (t.completed ? t.points : 0), 0);
  const requiredTasks = tasks.filter((t) => t.required).length;
  const completedRequired = tasks.filter((t) => t.required && t.completed).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading campaign...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">Campaign not found</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <p className="text-muted-foreground mt-1">{campaign.description}</p>
        </div>
        <div className="flex gap-2">
          {enrollment ? (
            <Button variant="outline" onClick={handleLeave}>
              Leave Campaign
            </Button>
          ) : (
            <Button onClick={handleJoin} disabled={joining}>
              {joining ? "Joining..." : "Join Campaign"}
            </Button>
          )}
        </div>
      </div>

      {/* Campaign Info */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{campaign.duration_days}</p>
                <p className="text-xs text-muted-foreground">Days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-500/10 p-2">
                <Badge className={getDifficultyColor(campaign.difficulty)}>
                  {campaign.difficulty}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Difficulty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-500/10 p-2">
                <Trophy className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">Points Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-2">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{campaign.campaign_type}</p>
                <p className="text-xs text-muted-foreground">Type</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      {enrollment && (
        <Card className="bg-gradient-to-r from-primary/10 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Progress</span>
              <span className="text-2xl">{enrollment.completion_percent}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={enrollment.completion_percent} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{completedTasks} of {tasks.length} tasks completed</span>
              <span>{completedRequired} of {requiredTasks} required</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Campaign Tasks</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`transition-all ${
                task.completed ? "border-green-500/30 bg-green-500/5" : ""
              }`}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {/* Completion button/icon */}
                  <button
                    onClick={() => !task.completed && handleCompleteTask(task.id)}
                    disabled={!!task.completed || completing === task.id || !enrollment}
                    className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-muted-foreground hover:border-primary"
                    } ${!enrollment ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {task.completed ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : completing === task.id ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <Circle className="h-4 w-4 opacity-0" />
                    )}
                  </button>

                  {/* Task info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{getTaskTypeIcon(task.task_type)}</span>
                      <h3
                        className={`font-medium ${
                          task.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.required && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        task.completed ? "text-muted-foreground/60" : "text-muted-foreground"
                      }`}
                    >
                      {task.description}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className={`font-semibold ${task.completed ? "text-green-500" : ""}`}>
                      {task.completed ? "+" : ""}{task.points} pts
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.task_type}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tasks defined for this campaign yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Join prompt if not enrolled */}
      {!enrollment && (
        <Card className="bg-muted/50">
          <CardContent className="py-8 text-center">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Start?</h3>
            <p className="text-muted-foreground mb-4">
              Join this campaign to start tracking your progress and earning points.
            </p>
            <Button onClick={handleJoin} disabled={joining} size="lg">
              {joining ? "Joining..." : "Join Campaign"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
