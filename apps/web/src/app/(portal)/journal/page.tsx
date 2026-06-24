"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, BookOpen, Calendar, PenLine } from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  visibility: string;
  created_at: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchEntries(); }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch journal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, visibility: "private" }),
      });
      if (res.ok) {
        setTitle(""); setContent(""); setShowForm(false);
        fetchEntries();
      }
    } catch (error) {
      console.error("Failed to create entry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><div className="text-muted-foreground">Loading journal...</div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-purple-500" />
            </div>
            Journal
          </h1>
          <p className="text-muted-foreground mt-1">Reflect, examine, and grow through daily journaling</p>
        </div>
        <Button className="btn-elegant" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {showForm && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <PenLine className="h-5 w-5 text-purple-500" />
            New Journal Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Entry title..." required className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your reflection..." required rows={6} className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            <div className="flex gap-3">
              <Button type="submit" className="btn-elegant" disabled={submitting}>{submitting ? "Saving..." : "Save Entry"}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div key={entry.id} className="glass-card p-6 stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="h-4 w-4" />
                {formatDate(entry.created_at)}
              </div>
              <h3 className="font-bold text-lg mb-2">{entry.title}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Journal Entries Yet</h3>
          <p className="text-muted-foreground mb-4">Start documenting your formation journey and reflections.</p>
          <Button className="btn-elegant" onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" />Write First Entry</Button>
        </div>
      )}
    </div>
  );
}
