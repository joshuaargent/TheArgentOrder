"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Check, Circle, Flame, Clock, Plus } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  prayer: "✝️",
  health: "💪",
  work: "⚔️",
  learning: "📚",
  brotherhood: "🤝",
  rest: "😴",
};

export default function RuleOfLifePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    fetchRuleOfLife();
  }, []);

  const fetchRuleOfLife = async () => {
    try {
      const res = await fetch("/api/rule-of-life");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch rule of life:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (itemId: string) => {
    setCompleting(itemId);
    try {
      const res = await fetch("/api/rule-of-life/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });
      if (res.ok) {
        await fetchRuleOfLife();
      }
    } catch (error) {
      console.error("Failed to complete item:", error);
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Calculate today's completion
  const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  const completedItems = categories.reduce(
    (sum, cat) => sum + (cat.items?.filter((item: any) => item.completed_today)?.length || 0),
    0
  );
  const completionPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rule of Life</h1>
          <p className="text-muted-foreground">Your daily structure for formation</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-5 w-5" />
            <span>{completionPercent}% complete</span>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Progress
          </CardTitle>
          <CardDescription>
            {completedItems} of {totalItems} items completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary rounded-full h-3 transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rule Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{CATEGORY_ICONS[category.slug] || "📋"}</span>
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleComplete(item.id)}
                        disabled={completing === item.id}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.completed_today
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground"
                        }`}
                      >
                        {item.completed_today ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4 opacity-0" />
                        )}
                      </button>
                      <div>
                        <p className={item.completed_today ? "line-through opacity-50" : ""}>
                          {item.title}
                        </p>
                        {item.frequency && (
                          <p className="text-xs text-muted-foreground">{item.frequency}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {(!category.items || category.items.length === 0) && (
                  <p className="text-sm text-muted-foreground">No items in this category</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You don't have a Rule of Life yet.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your Rule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
