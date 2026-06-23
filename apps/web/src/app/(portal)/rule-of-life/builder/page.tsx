"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: {
    name: string;
    slug: string;
    items: { title: string; description: string; frequency: string }[];
  }[];
}

const TEMPLATES: Template[] = [
  {
    id: "universal",
    name: "Universal Rule",
    description: "A balanced approach covering all five pillars of formation",
    icon: "⚔️",
    categories: [
      {
        name: "Faith",
        slug: "faith",
        items: [
          { title: "Morning Prayer", description: "15 minutes of mental prayer", frequency: "daily" },
          { title: "Scripture Reading", description: "Read at least one chapter", frequency: "daily" },
          { title: "Sunday Mass", description: "Attend weekly Mass", frequency: "weekly" },
        ],
      },
      {
        name: "Discipline",
        slug: "discipline",
        items: [
          { title: "Exercise", description: "30 minutes of physical training", frequency: "daily" },
          { title: "Cold Shower", description: "Brief cold exposure", frequency: "daily" },
        ],
      },
      {
        name: "Brotherhood",
        slug: "brotherhood",
        items: [
          { title: "Pod Meeting", description: "Attend weekly pod meeting", frequency: "weekly" },
          { title: "Check-in", description: "Send daily check-in to pod", frequency: "daily" },
        ],
      },
      {
        name: "Building",
        slug: "building",
        items: [
          { title: "Deep Work", description: "2 hours of focused work", frequency: "daily" },
          { title: "Project Time", description: "Work on personal project", frequency: "daily" },
        ],
      },
      {
        name: "Truth",
        slug: "truth",
        items: [
          { title: "Evening Examen", description: "Review the day with God", frequency: "daily" },
          { title: "Weekly Review", description: "Evaluate progress and plan", frequency: "weekly" },
        ],
      },
    ],
  },
  {
    id: "builder",
    name: "Builder Rule",
    description: "For men focused on creating and shipping",
    icon: "🏗️",
    categories: [
      {
        name: "Faith",
        slug: "faith",
        items: [
          { title: "Morning Prayer", description: "10 minutes of prayer", frequency: "daily" },
          { title: "Scripture", description: "Read one chapter", frequency: "daily" },
        ],
      },
      {
        name: "Discipline",
        slug: "discipline",
        items: [
          { title: "Morning Workout", description: "Exercise before work", frequency: "daily" },
          { title: "Sleep by 10pm", description: "Lights out by 10pm", frequency: "daily" },
        ],
      },
      {
        name: "Building",
        slug: "building",
        items: [
          { title: "Deep Work Block", description: "4 hours of uninterrupted work", frequency: "daily" },
          { title: "Ship Something", description: "Make progress on project", frequency: "daily" },
          { title: "Weekly Launch", description: "Release code/content", frequency: "weekly" },
        ],
      },
    ],
  },
  {
    id: "student",
    name: "Student Rule",
    description: "For brothers in formation or education",
    icon: "📚",
    categories: [
      {
        name: "Faith",
        slug: "faith",
        items: [
          { title: "Morning Offering", description: "Offer the day to God", frequency: "daily" },
          { title: "Mass", description: "Attend daily or Sunday Mass", frequency: "weekly" },
        ],
      },
      {
        name: "Discipline",
        slug: "discipline",
        items: [
          { title: "Study Block", description: "3 hours of focused study", frequency: "daily" },
          { title: "Review Notes", description: "Review daily material", frequency: "daily" },
        ],
      },
      {
        name: "Truth",
        slug: "truth",
        items: [
          { title: "Examen", description: "Daily reflection", frequency: "daily" },
          { title: "Weekly Planning", description: "Plan next week", frequency: "weekly" },
        ],
      },
    ],
  },
  {
    id: "father",
    name: "Father Rule",
    description: "For husbands and fathers leading their families",
    icon: "👨‍👧‍👦",
    categories: [
      {
        name: "Faith",
        slug: "faith",
        items: [
          { title: "Family Prayer", description: "Lead prayer with family", frequency: "daily" },
          { title: "Personal Prayer", description: "30 minutes alone with God", frequency: "daily" },
          { title: "Sunday Mass", description: "Lead family to Mass", frequency: "weekly" },
        ],
      },
      {
        name: "Brotherhood",
        slug: "brotherhood",
        items: [
          { title: "Date Night", description: "Quality time with wife", frequency: "weekly" },
          { title: "Kid Time", description: "Focused time with children", frequency: "daily" },
        ],
      },
      {
        name: "Discipline",
        slug: "discipline",
        items: [
          { title: "Physical Fitness", description: "Stay strong to serve", frequency: "daily" },
          { title: "Lead by Example", description: "Model the Rule for family", frequency: "daily" },
        ],
      },
    ],
  },
  {
    id: "custom",
    name: "Build Your Own",
    description: "Start from scratch and customize",
    icon: "✨",
    categories: [],
  },
];

const PILLAR_CONFIG = [
  { name: "Faith", slug: "faith", icon: "✝️", color: "#3b82f6" },
  { name: "Discipline", slug: "discipline", icon: "⚔️", color: "#ef4444" },
  { name: "Brotherhood", slug: "brotherhood", icon: "🤝", color: "#8b5cf6" },
  { name: "Building", slug: "building", icon: "🏗️", color: "#10b981" },
  { name: "Truth", slug: "truth", icon: "📖", color: "#f59e0b" },
];

const SAMPLE_ITEMS: Record<string, { title: string; description: string }[]> = {
  faith: [
    { title: "Morning Prayer", description: "15-30 minutes of mental prayer" },
    { title: "Scripture Reading", description: "Read at least one chapter" },
    { title: "Rosary", description: "Pray the Rosary" },
    { title: "Evening Prayers", description: "Night prayer and examen" },
    { title: "Sunday Mass", description: "Attend weekly Mass" },
  ],
  discipline: [
    { title: "Exercise", description: "30+ minutes of physical activity" },
    { title: "Cold Shower", description: "Cold exposure for discipline" },
    { title: "No Social Media", description: "Stay off social media until afternoon" },
    { title: "Wake at 5am", description: "Early rising for peak performance" },
    { title: "Fasting", description: "Practice self-denial" },
  ],
  brotherhood: [
    { title: "Pod Check-in", description: "Send daily message to pod" },
    { title: "Pod Meeting", description: "Attend weekly pod gathering" },
    { title: "Accountability Call", description: "Call a brother for accountability" },
    { title: "Serve Others", description: "Do something for someone else" },
  ],
  building: [
    { title: "Deep Work", description: "2-4 hours of focused work" },
    { title: "Project Time", description: "Work on your main project" },
    { title: "Learning", description: "Read or study something new" },
    { title: "Create", description: "Make something tangible" },
  ],
  truth: [
    { title: "Evening Examen", description: "Review the day with God" },
    { title: "Journal", description: "Write in your journal" },
    { title: "Weekly Review", description: "Evaluate progress and plan" },
    { title: "Honest Assessment", description: "Be brutally honest with yourself" },
  ],
};

export default function RuleBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [ruleName, setRuleName] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const [customItems, setCustomItems] = useState<Record<string, { title: string; description: string }[]>>({});
  const [saving, setSaving] = useState(false);

  const totalSteps = 3;

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    if (template.id !== "custom") {
      // Pre-select items from template
      const items: Record<string, string[]> = {};
      template.categories.forEach((cat) => {
        items[cat.slug] = cat.items.map((item) => item.title);
      });
      setSelectedItems(items);
    }
  };

  const toggleItem = (pillar: string, title: string) => {
    setSelectedItems((prev) => {
      const current = prev[pillar] || [];
      if (current.includes(title)) {
        return { ...prev, [pillar]: current.filter((t) => t !== title) };
      }
      return { ...prev, [pillar]: [...current, title] };
    });
  };

  const addCustomItem = (pillar: string) => {
    setCustomItems((prev) => ({
      ...prev,
      [pillar]: [...(prev[pillar] || []), { title: "", description: "" }],
    }));
  };

  const updateCustomItem = (pillar: string, index: number, field: "title" | "description", value: string) => {
    setCustomItems((prev) => ({
      ...prev,
      [pillar]: (prev[pillar] || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeCustomItem = (pillar: string, index: number) => {
    setCustomItems((prev) => ({
      ...prev,
      [pillar]: (prev[pillar] || []).filter((_, i) => i !== index),
    }));
  };

  const totalItems = Object.values(selectedItems).flat().length + 
    Object.values(customItems).flat().filter((i) => i.title).length;

  const handleCreate = async () => {
    setSaving(true);
    try {
      // Create the rule
      const ruleRes = await fetch("/api/rule-of-life", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ruleName || selectedTemplate?.name || "My Rule of Life",
        }),
      });

      if (!ruleRes.ok) throw new Error("Failed to create rule");

      // Add items
      for (const [pillar, titles] of Object.entries(selectedItems)) {
        for (const title of titles) {
          await fetch("/api/rule-of-life/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category: pillar,
              title,
              frequency: "daily",
            }),
          });
        }
      }

      // Add custom items
      for (const items of Object.values(customItems)) {
        for (const item of items) {
          if (item.title) {
            await fetch("/api/rule-of-life/items", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                category: "custom",
                title: item.title,
                description: item.description,
                frequency: "daily",
              }),
            });
          }
        }
      }

      router.push("/rule-of-life");
    } catch (error) {
      console.error("Failed to create rule:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Build Your Rule of Life
        </h1>
        <p className="text-muted-foreground mt-1">
          Create a personalized structure for your formation
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {step > s ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < totalSteps && (
              <div className={`w-16 h-1 mx-2 ${step > s ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Template */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Choose a Starting Template</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? "ring-2 ring-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{template.icon}</span>
                    <div>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {template.categories.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {template.categories.map((cat) => (
                        <span
                          key={cat.slug}
                          className="px-2 py-1 bg-muted rounded text-xs"
                        >
                          {cat.items.length} {cat.name.toLowerCase()} items
                        </span>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Customize */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Customize Your Rule</h2>
            <p className="text-muted-foreground">
              Add or remove items from each pillar. {totalItems} items selected.
            </p>
          </div>

          {PILLAR_CONFIG.map((pillar) => (
            <Card key={pillar.slug}>
              <CardHeader style={{ borderLeftColor: pillar.color, borderLeftWidth: "4px" }}>
                <CardTitle className="flex items-center gap-2">
                  <span>{pillar.icon}</span>
                  {pillar.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sample items */}
                {selectedTemplate?.id !== "custom" && SAMPLE_ITEMS[pillar.slug] && (
                  <div>
                    <p className="text-sm font-medium mb-2">Suggested Items</p>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_ITEMS[pillar.slug].map((item) => (
                        <button
                          key={item.title}
                          onClick={() => toggleItem(pillar.slug, item.title)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            (selectedItems[pillar.slug] || []).includes(item.title)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {(selectedItems[pillar.slug] || []).includes(item.title) && (
                            <Check className="h-3 w-3 inline mr-1" />
                          )}
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected items */}
                {(selectedItems[pillar.slug] || []).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Selected ({selectedItems[pillar.slug]?.length})</p>
                    <div className="space-y-2">
                      {(selectedItems[pillar.slug] || []).map((title) => (
                        <div
                          key={title}
                          className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded"
                        >
                          <span>{title}</span>
                          <button
                            onClick={() => toggleItem(pillar.slug, title)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom item input */}
                <div>
                  <button
                    onClick={() => addCustomItem(pillar.slug)}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add custom item
                  </button>
                  {customItems[pillar.slug]?.map((item, index) => (
                    <div key={index} className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={item.title}
                        onChange={(e) => updateCustomItem(pillar.slug, index, "title", e.target.value)}
                        className="flex-1 px-3 py-1 border rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateCustomItem(pillar.slug, index, "description", e.target.value)}
                        className="flex-1 px-3 py-1 border rounded text-sm"
                      />
                      <button
                        onClick={() => removeCustomItem(pillar.slug, index)}
                        className="text-muted-foreground hover:text-destructive px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step 3: Name and Create */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Name Your Rule</h2>
            <p className="text-muted-foreground">
              Give your Rule of Life a name that reflects your commitment
            </p>
          </div>

          <div className="max-w-md">
            <input
              type="text"
              placeholder="My Rule of Life"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full px-4 py-3 text-lg border rounded-lg"
            />
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                {PILLAR_CONFIG.map((pillar) => {
                  const count = (selectedItems[pillar.slug] || []).length + 
                    (customItems[pillar.slug] || []).filter((i) => i.title).length;
                  return (
                    <div key={pillar.slug}>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">{pillar.name}</p>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Total: {totalItems} items across {Object.values(selectedItems).filter((v) => v.length > 0).length} pillars
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {step < totalSteps ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? "Creating..." : "Create My Rule"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
