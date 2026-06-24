"use client";

import { useEffect, useState } from "react";
import { 
  Shield, Users, Activity, TrendingUp, 
  CheckCircle, Clock, AlertTriangle, ArrowRight, Plus,
  Cross, Dumbbell, Handshake, Hammer, GraduationCap,
  BarChart3, PieChart
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Stats {
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  formationAvg: number;
}

interface RecentActivity {
  id: string;
  type: 'formation' | 'campaign' | 'pod' | 'achievement';
  user: string;
  action: string;
  timestamp: string;
}

interface PendingAction {
  id: string;
  type: 'application' | 'promotion' | 'moderation';
  title: string;
  description: string;
  timestamp: string;
}

const ACTIVITY_ICONS = {
  formation: { icon: Cross, color: '#a855f7', bg: 'bg-purple-500/10' },
  campaign: { icon: Dumbbell, color: '#ef4444', bg: 'bg-red-500/10' },
  pod: { icon: Handshake, color: '#22c55e', bg: 'bg-green-500/10' },
  achievement: { icon: Hammer, color: '#eab308', bg: 'bg-yellow-500/10' },
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    activeMembers: 0,
    newMembers: 0,
    formationAvg: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'analytics'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Simulated data for demo
    setStats({
      totalMembers: 47,
      activeMembers: 38,
      newMembers: 5,
      formationAvg: 72,
    });

    setRecentActivity([
      { id: '1', type: 'formation', user: 'Michael R.', action: 'Completed morning prayer check-in', timestamp: '5 min ago' },
      { id: '2', type: 'campaign', user: 'Thomas K.', action: 'Shipped project: Argent Dashboard', timestamp: '12 min ago' },
      { id: '3', type: 'pod', user: 'James W.', action: 'Attended pod meeting', timestamp: '1 hour ago' },
      { id: '4', type: 'achievement', user: 'Patrick M.', action: 'Earned: Consistency King (30 days)', timestamp: '2 hours ago' },
      { id: '5', type: 'formation', user: 'Joseph S.', action: 'Completed weekly review', timestamp: '3 hours ago' },
    ]);

    setPendingActions([
      { id: '1', type: 'application', title: 'New Application', description: 'Marcus T. - Software Engineer', timestamp: '2 hours ago' },
      { id: '2', type: 'promotion', title: 'Promotion Request', description: 'David M. → Captain', timestamp: '5 hours ago' },
      { id: '3', type: 'moderation', title: 'Flagged Content', description: 'Post in #general reported', timestamp: '1 day ago' },
    ]);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage The Argent Order</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 rounded-lg bg-card/50 w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'members', label: 'Members', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: PieChart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${
              activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Members</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.totalMembers}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span>+{stats.newMembers} this month</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Members</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{stats.activeMembers}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <span>{Math.round((stats.activeMembers / stats.totalMembers) * 100)}% participation</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Formation Avg</span>
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{stats.formationAvg}%</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span>+5% from last week</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending Actions</span>
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold">{pendingActions.length}</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-yellow-500">
                <AlertTriangle className="h-3 w-3" />
                <span>Requires attention</span>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pending Actions */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Pending Actions</h2>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {pendingActions.map((action) => (
                  <div key={action.id} className="flex items-center gap-4 p-3 rounded-lg bg-card/50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      action.type === 'application' ? 'bg-green-500/10' :
                      action.type === 'promotion' ? 'bg-blue-500/10' : 'bg-red-500/10'
                    }`}>
                      {action.type === 'application' && <Users className="h-5 w-5 text-green-500" />}
                      {action.type === 'promotion' && <TrendingUp className="h-5 w-5 text-blue-500" />}
                      {action.type === 'moderation' && <Shield className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{action.timestamp}</p>
                      <Button variant="ghost" size="sm">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const config = ACTIVITY_ICONS[activity.type];
                  return (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <config.icon className="h-5 w-5" style={{ color: config.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats by Pillar */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Formation by Pillar</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Faith', icon: Cross, color: '#a855f7', avg: 78, trend: '+3%' },
                { name: 'Discipline', icon: Dumbbell, color: '#ef4444', avg: 65, trend: '+8%' },
                { name: 'Brotherhood', icon: Handshake, color: '#22c55e', avg: 82, trend: '+2%' },
                { name: 'Building', icon: Hammer, color: '#eab308', avg: 58, trend: '+12%' },
                { name: 'Truth', icon: GraduationCap, color: '#06b6d4', avg: 71, trend: '+5%' },
              ].map((pillar) => (
                <div key={pillar.name} className="text-center p-4 rounded-xl bg-card/50">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${pillar.color}15` }}
                  >
                    <pillar.icon className="h-6 w-6" style={{ color: pillar.color }} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{pillar.name}</p>
                  <p className="text-2xl font-bold">{pillar.avg}%</p>
                  <p className="text-xs text-green-500">{pillar.trend}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'members' && (
        <div className="glass-card p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Member Management</h3>
          <p className="text-muted-foreground mb-4">View and manage all members, roles, and permissions.</p>
          <Button className="btn-elegant">View Members</Button>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="glass-card p-12 text-center">
          <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
          <p className="text-muted-foreground mb-4">Deep dive into formation metrics, engagement, and growth.</p>
          <Button className="btn-elegant">View Analytics</Button>
        </div>
      )}
    </div>
  );
}
