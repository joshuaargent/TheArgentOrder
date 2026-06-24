"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { 
  Calendar, CheckCircle, Clock, Plus,
  Cross, Dumbbell, Handshake, Hammer, GraduationCap,
  Star, TrendingUp, X
} from "lucide-react";

interface Review {
  id: string;
  review_type: 'weekly' | 'monthly' | 'quarterly';
  week_start: string;
  completed: boolean;
  score?: number;
  responses?: {
    pillar: string;
    score: number;
    notes: string;
  }[];
}

const PILLAR_CONFIG = {
  faith: { icon: Cross, color: '#a855f7', name: 'Faith', questions: ['Did you pray daily?', 'Did you attend Mass?', 'Did you read Scripture?'] },
  discipline: { icon: Dumbbell, color: '#ef4444', name: 'Discipline', questions: ['Did you workout?', 'Did you follow your diet?', 'Did you maintain your sleep schedule?'] },
  brotherhood: { icon: Handshake, color: '#22c55e', name: 'Brotherhood', questions: ['Did you check in with your pod?', 'Did you reach out to a brother?', 'Did you attend pod meeting?'] },
  building: { icon: Hammer, color: '#eab308', name: 'Building', questions: ['Did you make progress on your project?', 'Did you ship anything?', 'Did you learn a new skill?'] },
  truth: { icon: GraduationCap, color: '#06b6d4', name: 'Truth', questions: ['Did you read?', 'Did you journal?', 'Did you reflect on your growth?'] },
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const [responses, setResponses] = useState<Record<string, { score: number; notes: string }>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || getDefaultReviews());
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews(getDefaultReviews());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultReviews = (): Review[] => [
    { id: '1', review_type: 'weekly', week_start: getWeekStart(-1) || 'last-week', completed: true, score: 85 },
    { id: '2', review_type: 'weekly', week_start: getWeekStart(0) || 'this-week', completed: false },
    { id: '3', review_type: 'monthly', week_start: getMonthStart(-1) || 'last-month', completed: true, score: 78 },
  ];

  function getWeekStart(weeksAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() - (weeksAgo * 7));
    return date.toISOString().split('T')[0] ?? '';
  }

  function getMonthStart(monthsAgo: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsAgo);
    date.setDate(1);
    return date.toISOString().split('T')[0] ?? '';
  }

  const startReview = (review: Review) => {
    setActiveReview(review);
    const initial: Record<string, { score: number; notes: string }> = {};
    Object.keys(PILLAR_CONFIG).forEach(pillar => {
      initial[pillar] = { score: 5, notes: '' };
    });
    setResponses(initial);
  };

  const submitReview = () => {
    if (!activeReview) return;

    const totalScore = Object.values(responses).reduce((sum, r) => sum + r.score, 0);
    const avgScore = Math.round((totalScore / Object.keys(responses).length) * 20);

    setReviews(reviews.map(r => 
      r.id === activeReview.id 
        ? { ...r, completed: true, score: avgScore }
        : r
    ));
    setActiveReview(null);
  };

  const completed = reviews.filter(r => r.completed).length;
  const pending = reviews.filter(r => !r.completed);
  const avgScore = completed > 0 
    ? Math.round(reviews.filter(r => r.completed).reduce((sum, r) => sum + (r.score || 0), 0) / completed)
    : 0;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-muted-foreground">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  // Review Form Modal
  if (activeReview) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold capitalize">{activeReview.review_type} Review</h2>
            <p className="text-muted-foreground">
              Week of {new Date(activeReview.week_start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <Button variant="ghost" onClick={() => setActiveReview(null)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {Object.entries(PILLAR_CONFIG).map(([pillar, config]) => (
            <div key={pillar} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: `${config.color}15` }}>
                  <config.icon className="h-5 w-5" style={{ color: config.color }} />
                </div>
                <h3 className="text-lg font-bold">{config.name}</h3>
              </div>

              {/* Score */}
              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-2">Score (1-10)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={responses[pillar]?.score || 5}
                    onChange={(e) => setResponses({
                      ...responses,
                      [pillar]: { ...responses[pillar] ?? { score: 5, notes: "" }, score: parseInt(e.target.value) }
                    })}
                    className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-8 text-center font-bold">{responses[pillar]?.score || 5}</span>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3 mb-4">
                {config.questions.map((q, i) => {
                  const score = responses[pillar]?.score ?? 0;
                  const filled = score >= (i + 1) * 2.5;
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        filled ? 'bg-green-500 border-green-500' : 'border-border'
                      }`}>
                        {filled && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-muted-foreground">{q}</span>
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              <textarea
                placeholder="Notes for this pillar..."
                value={responses[pillar]?.notes || ''}
                onChange={(e) => setResponses({
                  ...responses,
                  [pillar]: { ...responses[pillar] ?? { score: 5, notes: "" }, notes: e.target.value }
                })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
              />
            </div>
          ))}

          {/* Summary */}
          <div className="glass-card p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">Total Score</span>
              <span className="text-3xl font-bold text-primary">
                {Math.round(Object.values(responses).reduce((sum, r) => sum + r.score, 0) / Object.keys(responses).length * 10)}%
              </span>
            </div>
            <Button onClick={submitReview} className="w-full btn-elegant h-12">
              <CheckCircle className="h-5 w-5 mr-2" />
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          Reviews
        </h1>
        <p className="text-muted-foreground mt-1">Weekly and monthly formation reviews</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-card p-5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{completed}</p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
        <div className="glass-card p-5">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-3">
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold">{pending.length}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="glass-card p-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{avgScore}%</p>
          <p className="text-sm text-muted-foreground">Avg Score</p>
        </div>
        <div className="glass-card p-5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
            <Star className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">{reviews.length}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
      </div>

      {/* Pending Reviews */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pending Reviews</h2>
          <div className="space-y-3">
            {pending.map((review) => (
              <div key={review.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{review.review_type} Review</p>
                  <p className="text-sm text-muted-foreground">
                    {review.review_type === 'weekly' 
                      ? `Week of ${new Date(review.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : `Month of ${new Date(review.week_start).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                    }
                  </p>
                </div>
                <Button onClick={() => startReview(review)} className="btn-elegant gap-2">
                  <Plus className="h-4 w-4" />
                  Start Review
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Reviews */}
      {completed > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Completed Reviews</h2>
          <div className="space-y-3">
            {reviews.filter(r => r.completed).map((review) => (
              <div key={review.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{review.review_type} Review</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.week_start).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-500">{review.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Reviews Scheduled</h3>
          <p className="text-muted-foreground">Your next review will appear here when it's ready.</p>
        </div>
      )}
    </div>
  );
}
