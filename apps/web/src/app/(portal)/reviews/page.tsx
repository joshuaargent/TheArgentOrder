"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar, CheckCircle, Clock } from "lucide-react";
interface Review { id: string; review_type: string; week_start: string; completed: boolean; score?: number; }
export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchReviews(); }, []);
  const fetchReviews = async () => { try { const res = await fetch("/api/reviews"); const data = await res.json(); setReviews(data.reviews || []); } catch (error) { console.error("Failed:", error); } finally { setLoading(false); } };
  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  const completed = reviews.filter(r => r.completed).length;
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-blue-500" /></div>Reviews</h1><p className="text-muted-foreground mt-1">Weekly and monthly formation reviews</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card p-5"><div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3"><CheckCircle className="h-5 w-5 text-green-500" /></div><p className="text-2xl font-bold">{completed}</p><p className="text-sm text-muted-foreground">Completed</p></div>
        <div className="glass-card p-5"><div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-3"><Clock className="h-5 w-5 text-yellow-500" /></div><p className="text-2xl font-bold">{reviews.length - completed}</p><p className="text-sm text-muted-foreground">Pending</p></div>
        <div className="glass-card p-5"><div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3"><Calendar className="h-5 w-5 text-blue-500" /></div><p className="text-2xl font-bold">{reviews.length}</p><p className="text-sm text-muted-foreground">Total</p></div>
      </div>
      {reviews.length > 0 ? reviews.map((r) => (<div key={r.id} className="glass-card p-4 flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center">{r.completed ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-muted-foreground" />}</div><div className="flex-1"><p className="font-medium capitalize">{r.review_type}</p><p className="text-sm text-muted-foreground">{new Date(r.week_start).toLocaleDateString()}</p></div>{r.completed && r.score !== undefined && <span className="font-bold">{r.score}%</span>}{!r.completed && <Button size="sm" variant="outline">Complete</Button>}</div>)) : <div className="glass-card p-12 text-center"><Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">No Reviews</h3><p className="text-muted-foreground">Check back later.</p></div>}
    </div>
  );
}
