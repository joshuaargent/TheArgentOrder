"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Target, Calendar, Users, Flame } from "lucide-react";

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
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (campaignId: string) => {
    setEnrolling(campaignId);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      });
      
      if (res.ok) {
        // Refresh campaigns or show success
        alert("Successfully enrolled!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to enroll");
      }
    } catch (error) {
      console.error("Failed to enroll:", error);
    } finally {
      setEnrolling(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lent":
        return "✝️";
      case "advent":
        return "🎄";
      case "sprint":
        return "⚡";
      default:
        return "🎯";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="mt-1 text-muted-foreground">
            Join seasonal campaigns and sprint challenges to accelerate your formation
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Campaign Types */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="rounded-full bg-purple-100 p-2">✝️</div>
            <div>
              <p className="text-sm text-muted-foreground">Liturgical</p>
              <p className="font-semibold">Lent & Advent</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="rounded-full bg-blue-100 p-2">⚡</div>
            <div>
              <p className="text-sm text-muted-foreground">Focused</p>
              <p className="font-semibold">Sprints</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="rounded-full bg-green-100 p-2">🔱</div>
            <div>
              <p className="text-sm text-muted-foreground">Ongoing</p>
              <p className="font-semibold">Permanent</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
            <div className="rounded-full bg-orange-100 p-2">🏆</div>
            <div>
              <p className="text-sm text-muted-foreground">Community</p>
              <p className="font-semibold">Group Challenge</p>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{getTypeIcon(campaign.campaign_type)}</div>
                  <Badge variant={getDifficultyColor(campaign.difficulty)}>
                    {campaign.difficulty}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{campaign.title}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Campaign Stats */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{campaign.duration_days} days</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>{campaign.campaign_type}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  {(campaign.start_date || campaign.end_date) && (
                    <div className="text-sm text-muted-foreground">
                      {campaign.start_date && (
                        <span>Starts: {new Date(campaign.start_date).toLocaleDateString()}</span>
                      )}
                      {campaign.start_date && campaign.end_date && " - "}
                      {campaign.end_date && (
                        <span>Ends: {new Date(campaign.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}

                  {/* Action */}
                  <Button
                    className="w-full"
                    onClick={() => handleEnroll(campaign.id)}
                    disabled={enrolling === campaign.id}
                  >
                    {enrolling === campaign.id ? "Enrolling..." : "Join Campaign"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns.length === 0 && (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Active Campaigns</h3>
            <p className="mt-2 text-muted-foreground">
              Check back soon for new campaigns and challenges.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
