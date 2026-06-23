"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, CheckCircle } from "lucide-react";

type ReviewType = "weekly" | "monthly" | "quarterly";

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<ReviewType>("weekly");
  const [weeklyReviews, setWeeklyReviews] = useState<any[]>([]);
  const [monthlyReviews, setMonthlyReviews] = useState<any[]>([]);
  const [quarterlyReviews, setQuarterlyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    wins: "",
    failures: "",
    lessons: "",
    goals: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [weeklyRes, monthlyRes, quarterlyRes] = await Promise.all([
        fetch("/api/reviews/weekly"),
        fetch("/api/reviews/monthly"),
        fetch("/api/reviews/quarterly"),
      ]);

      const [weeklyData, monthlyData, quarterlyData] = await Promise.all([
        weeklyRes.json(),
        monthlyRes.json(),
        quarterlyRes.json(),
      ]);

      setWeeklyReviews(weeklyData);
      setMonthlyReviews(monthlyData);
      setQuarterlyReviews(quarterlyData);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = `/api/reviews/${activeTab}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ wins: "", failures: "", lessons: "", goals: "" });
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReviews = () => {
    switch (activeTab) {
      case "weekly":
        return weeklyReviews;
      case "monthly":
        return monthlyReviews;
      case "quarterly":
        return quarterlyReviews;
      default:
        return [];
    }
  };

  const getReviewTitle = (review: any) => {
    if (activeTab === "weekly") {
      return formatDate(review.created_at);
    } else if (activeTab === "monthly") {
      return new Date(review.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      return `Q${review.quarter} ${review.year}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Periodic reflection on your formation</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Calendar className="h-4 w-4 mr-2" />
          New Review
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(["weekly", "monthly", "quarterly"] as ReviewType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* New Review Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">New {activeTab} Review</CardTitle>
            <CardDescription>
              Take time to reflect on your progress honestly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">🏆 Wins</label>
                <textarea
                  value={formData.wins}
                  onChange={(e) => setFormData({ ...formData, wins: e.target.value })}
                  placeholder="What went well this period?"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">📉 Failures</label>
                <textarea
                  value={formData.failures}
                  onChange={(e) => setFormData({ ...formData, failures: e.target.value })}
                  placeholder="What didn't go well? Be honest."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">📚 Lessons</label>
                <textarea
                  value={formData.lessons}
                  onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
                  placeholder="What did you learn?"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">🎯 Goals</label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="What are your goals for next period?"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Review</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {getReviews().length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No {activeTab} reviews yet.
            </p>
            <Button onClick={() => setShowForm(true)}>Complete Your First {activeTab} Review</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {getReviews().map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {getReviewTitle(review)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {review.wins && (
                  <div>
                    <h4 className="font-medium text-green-600 mb-1">🏆 Wins</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{review.wins}</p>
                  </div>
                )}
                {review.failures && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-1">📉 Failures</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{review.failures}</p>
                  </div>
                )}
                {review.lessons && (
                  <div>
                    <h4 className="font-medium text-blue-600 mb-1">📚 Lessons</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{review.lessons}</p>
                  </div>
                )}
                {review.goals && (
                  <div>
                    <h4 className="font-medium text-purple-600 mb-1">🎯 Goals</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{review.goals}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
