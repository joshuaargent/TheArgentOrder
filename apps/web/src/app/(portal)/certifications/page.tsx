"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Award, Check, Lock, Trophy } from "lucide-react";

interface Certification {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  points_required: number;
  earned: boolean;
  earned_at: string | null;
  requirements: any;
}

interface Category {
  name: string;
  slug: string;
  icon: string;
  color: string;
  certifications: Certification[];
}

interface CertificationsData {
  categories: Category[];
  totalEarned: number;
  totalAvailable: number;
}

export default function CertificationsPage() {
  const [data, setData] = useState<CertificationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const res = await fetch("/api/certifications");
      const result = await res.json();
      setData(result);
      if (result.categories?.length) {
        setSelectedCategory(result.categories[0].slug);
      }
    } catch (error) {
      console.error("Failed to fetch certifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRequirementText = (req: any) => {
    if (!req) return "";
    if (req.streak_days) return `${req.streak_days}-day streak`;
    if (req.campaigns_completed) return `Complete ${req.campaigns_completed} campaign(s)`;
    if (req.projects_launched) return `Launch ${req.projects_launched} project(s)`;
    if (req.rank) return `Achieve ${req.rank} rank`;
    if (req.slug) return `Complete ${req.slug} campaign`;
    return "Complete requirements";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading certifications...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Unable to load certifications</div>
      </div>
    );
  }

  const currentCategory = data.categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          Certifications
        </h1>
        <p className="text-muted-foreground mt-1">
          Earn recognized competence through disciplined action
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="py-6 text-center">
            <Trophy className="h-12 w-12 mx-auto text-primary mb-2" />
            <p className="text-4xl font-bold">{data.totalEarned}</p>
            <p className="text-sm text-muted-foreground">Certifications Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-4xl font-bold">{data.totalAvailable - data.totalEarned}</p>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 text-center">
            <div className="h-12 w-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-4xl font-bold">
              {data.totalAvailable > 0
                ? Math.round((data.totalEarned / data.totalAvailable) * 100)
                : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {data.categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              selectedCategory === category.slug
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card hover:bg-accent"
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
            <span className="text-xs opacity-70">
              ({category.certifications.filter((c) => c.earned).length}/{category.certifications.length})
            </span>
          </button>
        ))}
      </div>

      {/* Certifications Grid */}
      {currentCategory && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {currentCategory.certifications.map((cert) => (
            <Card
              key={cert.id}
              className={`relative overflow-hidden transition-all ${
                cert.earned ? "border-green-500/50" : ""
              }`}
              style={{
                borderLeftColor: cert.color,
                borderLeftWidth: "4px",
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${cert.color}20` }}
                    >
                      {cert.earned ? cert.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{cert.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {cert.earned ? "Earned" : `${cert.points_required} points`}
                      </p>
                    </div>
                  </div>
                  {cert.earned && (
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{cert.description}</CardDescription>
                
                {/* Progress bar for unearned */}
                {!cert.earned && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{getRequirementText(cert.requirements)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${cert.requirements?.streak_days ? 33 : cert.requirements?.campaigns_completed ? 50 : 25}%`,
                          backgroundColor: cert.color,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Earned date */}
                {cert.earned && cert.earned_at && (
                  <p className="text-xs text-muted-foreground">
                    Earned on {formatDate(cert.earned_at)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {data.categories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No certifications available yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
