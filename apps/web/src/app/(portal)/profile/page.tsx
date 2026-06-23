"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, MapPin, Briefcase, Edit, Save } from "lucide-react";

interface Profile {
  display_name: string;
  bio: string;
  email: string;
  timezone: string;
  country: string;
  vocation: string;
}

interface ProfileData {
  profile: Profile;
  formation: {
    faith: number;
    discipline: number;
    brotherhood: number;
    building: number;
    truth: number;
    overall: number;
  };
  level: number;
  xp: number;
  rank: string;
  stats: {
    achievements: number;
    certifications: number;
    activeCampaigns: number;
  };
  pod: { name: string } | null;
}

const PILLAR_ICONS: Record<string, string> = {
  faith: "✝️",
  discipline: "⚔️",
  brotherhood: "🤝",
  building: "🏗️",
  truth: "📖",
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    timezone: "",
    country: "",
    vocation: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfileData(data);
      setFormData({
        display_name: data.profile?.display_name || "",
        bio: data.profile?.bio || "",
        timezone: data.profile?.timezone || "",
        country: data.profile?.country || "",
        vocation: data.profile?.vocation || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button
          variant={editing ? "default" : "outline"}
          onClick={() => editing ? handleSave() : setEditing(true)}
        >
          {editing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md bg-background"
                  />
                </div>
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Timezone</label>
                    <input
                      type="text"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vocation</label>
                  <select
                    value={formData.vocation}
                    onChange={(e) => setFormData({ ...formData, vocation: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md bg-background"
                  >
                    <option value="">Select...</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="discerning">Discerning</option>
                    <option value="priest">Priest</option>
                    <option value="religious">Religious</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profileData.profile?.display_name || "New Member"}
                    </h3>
                    <p className="text-muted-foreground capitalize">
                      {profileData.rank} • Level {profileData.level}
                    </p>
                  </div>
                </div>
                {profileData.profile?.bio && (
                  <p className="text-muted-foreground">{profileData.profile.bio}</p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.profile?.email}</span>
                  </div>
                  {profileData.profile?.timezone && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.profile.timezone}</span>
                    </div>
                  )}
                  {profileData.profile?.vocation && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{profileData.profile.vocation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formation Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Formation</CardTitle>
            <CardDescription>Your progress across the five pillars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(profileData.formation).map(([pillar, score]) => (
                <div key={pillar}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <span>{PILLAR_ICONS[pillar]}</span>
                      <span className="capitalize">{pillar}</span>
                    </span>
                    <span className="font-medium">{score as number}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${Math.min((score as number) / 10, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{profileData.level}</div>
            <p className="text-muted-foreground text-sm">Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{profileData.xp}</div>
            <p className="text-muted-foreground text-sm">Total XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{profileData.stats.achievements}</div>
            <p className="text-muted-foreground text-sm">Achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{profileData.stats.certifications}</div>
            <p className="text-muted-foreground text-sm">Certifications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
