"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { CheckCircle, Flame } from "lucide-react";

export default function ExamenPage() {
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    went_well: "",
    failed: "",
    saw_god: "",
    improve_tomorrow: "",
    gratitude: [] as string[],
    prayer_focus: "",
  });
  const [gratitudeInput, setGratitudeInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExamen();
  }, []);

  const fetchExamen = async () => {
    try {
      const res = await fetch("/api/examen");
      const data = await res.json();
      setTodayEntry(data.today);
      setRecentEntries(data.recent || []);
      if (data.today) {
        setFormData({
          went_well: data.today.went_well || "",
          failed: data.today.failed || "",
          saw_god: data.today.saw_god || "",
          improve_tomorrow: data.today.improve_tomorrow || "",
          gratitude: data.today.gratitude || [],
          prayer_focus: data.today.prayer_focus || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch examen:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/examen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchExamen();
      }
    } catch (error) {
      console.error("Failed to save examen:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const addGratitude = () => {
    if (gratitudeInput.trim()) {
      setFormData({
        ...formData,
        gratitude: [...formData.gratitude, gratitudeInput.trim()],
      });
      setGratitudeInput("");
    }
  };

  const removeGratitude = (index: number) => {
    setFormData({
      ...formData,
      gratitude: formData.gratitude.filter((_, i) => i !== index),
    });
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
      <div>
        <h1 className="text-3xl font-bold">Daily Examen</h1>
        <p className="text-muted-foreground">Prayerful reflection on your day</p>
      </div>

      {todayEntry ? (
        <Card className="border-green-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Completed Today
            </CardTitle>
            <CardDescription>
              You completed your daily examen. Great work!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Daily Examen</CardTitle>
            <CardDescription>
              Take a few minutes to prayerfully review your day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* What went well */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  ✨ What went well today?
                </label>
                <textarea
                  value={formData.went_well}
                  onChange={(e) => setFormData({ ...formData, went_well: e.target.value })}
                  placeholder="Notice God's presence in the good moments..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>

              {/* What didn't go well */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  ⚠️ What didn't go well?
                </label>
                <textarea
                  value={formData.failed}
                  onChange={(e) => setFormData({ ...formData, failed: e.target.value })}
                  placeholder="Where did I fall short? What tempted me?"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>

              {/* Where did you see God? */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  👁️ Where did I see God today?
                </label>
                <textarea
                  value={formData.saw_god}
                  onChange={(e) => setFormData({ ...formData, saw_god: e.target.value })}
                  placeholder="In what moments did I sense God's presence?"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>

              {/* Gratitude */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  🙏 What am I grateful for?
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={gratitudeInput}
                    onChange={(e) => setGratitudeInput(e.target.value)}
                    placeholder="Add a gratitude..."
                    className="flex-1 px-4 py-2 border rounded-md bg-background"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGratitude())}
                  />
                  <Button type="button" variant="outline" onClick={addGratitude}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.gratitude.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary rounded-full text-sm flex items-center gap-1"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeGratitude(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tomorrow */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  🔮 What will I improve tomorrow?
                </label>
                <textarea
                  value={formData.improve_tomorrow}
                  onChange={(e) => setFormData({ ...formData, improve_tomorrow: e.target.value })}
                  placeholder="What concrete step will I take?"
                  rows={2}
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>

              {/* Prayer Focus */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  🙏 Prayer focus for tomorrow
                </label>
                <input
                  type="text"
                  value={formData.prayer_focus}
                  onChange={(e) => setFormData({ ...formData, prayer_focus: e.target.value })}
                  placeholder="What will you pray about tomorrow?"
                  className="w-full px-4 py-2 border rounded-md bg-background"
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Saving..." : "Complete Examen"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Examen</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {recentEntries.slice(0, 6).map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {entry.went_well && (
                    <p className="text-sm">
                      <span className="text-green-600">✓</span> {entry.went_well}
                    </p>
                  )}
                  {entry.saw_god && (
                    <p className="text-sm text-muted-foreground">
                      <span>👁️</span> {entry.saw_god}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
