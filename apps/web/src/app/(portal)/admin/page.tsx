"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Users,
  Target,
  BarChart3,
  Award,
  Settings,
  Shield,
  RefreshCw,
} from "lucide-react";

interface Stats {
  totalMembers: number;
  activeMembers: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalCertifications: number;
  formationsThisWeek: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage campaigns, members, and system settings
          </p>
        </div>
        <Button variant="outline" onClick={fetchStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeMembers} active this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalCampaigns} total created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCertifications}</div>
              <p className="text-xs text-muted-foreground">Active certifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Formation Activity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.formationsThisWeek}</div>
              <p className="text-xs text-muted-foreground">Events this week</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Target className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>
                View and manage all members in the order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Member list and management features coming soon. Use Supabase dashboard for now.
              </p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Quick Links</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/members" target="_blank">View All Members</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/admin/inactive" target="_blank">Inactive Members</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>
                Create and manage formation campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage campaigns from the campaigns page or via API.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href="/campaigns" target="_blank">Browse Campaigns</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                Formation metrics and member engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Formation by Pillar</p>
                  <p className="text-muted-foreground text-sm">
                    Track prayer, discipline, brotherhood, building, and truth metrics.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Campaign Participation</p>
                  <p className="text-muted-foreground text-sm">
                    Monitor campaign enrollment and completion rates.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Retention Trends</p>
                  <p className="text-muted-foreground text-sm">
                    Track member retention and activity over time.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Certification Progress</p>
                  <p className="text-muted-foreground text-sm">
                    Monitor certification completion rates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-2">Formation Points</p>
                <p className="text-muted-foreground text-sm mb-2">
                  Configure point values for formation activities
                </p>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-2">Rank Thresholds</p>
                <p className="text-muted-foreground text-sm mb-2">
                  Set point requirements for rank progression
                </p>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-2">Campaign Templates</p>
                <p className="text-muted-foreground text-sm mb-2">
                  Manage campaign templates and presets
                </p>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
