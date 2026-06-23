"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Target, Calendar, ArrowRight } from "lucide-react";

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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns || data || []);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lent":
        return "✝️";
      case "advent":
        return "🎄";
      case "sprint":
        return "⚡";
      case "foundation":
        return "🏛️";
      case "faith":
        return "🙏";
      case "discipline":
        return "⚔️";
      case "brotherhood":
        return "🤝";
      case "building":
        return "🏗️";
      case "truth":
        return "📖";
      case "vocation":
        return "💍";
      case "leadership":
        return "⭐";
      default:
        return "🎯";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          Campaigns
        </h1>
        <p className="text-muted-foreground mt-1">
          Join structured transformation campaigns to accelerate your formation
        </p>
      </div>

      {/* Campaign Types */}
      <div className="grid gap-4 md:grid-cols-4">
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
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="text-4xl">{getTypeIcon(campaign.campaign_type)}</div>
                <Badge className={getDifficultyColor(campaign.difficulty)}>
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
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/campaigns/${campaign.slug}`}>
                    View Campaign
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Active Campaigns</h3>
            <p className="text-muted-foreground mt-2">
              Check back soon for new campaigns and challenges.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
