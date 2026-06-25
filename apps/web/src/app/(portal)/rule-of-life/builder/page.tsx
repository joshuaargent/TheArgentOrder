"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Cross,
  Dumbbell,
  Handshake,
  Hammer,
  GraduationCap,
  Flame,
  Target,
  Zap,
} from "lucide-react";

const PILLARS = [
  { id: "faith" as const, name: "Faith", icon: Cross, color: "#a855f7", desc: "Prayer, Mass, Scripture", habits: ["Morning Prayer (30 min)", "Daily Scripture Reading", "Weekly Confession", "Nightly Examen"] },
  { id: "discipline" as const, name: "Discipline", icon: Dumbbell, color: "#ef4444", desc: "Fitness, Cold, Sleep", habits: ["Cold Shower", "Workout (45 min)", "Sleep by 10pm", "No Porn/Masturbation"] },
  { id: "brotherhood" as const, name: "Brotherhood", icon: Handshake, color: "#22c55e", desc: "Pods, Accountability", habits: ["Pod Morning Check-in", "Weekly Pod Meeting", "Monthly Brotherhood Event", "Text 3 Brothers Weekly"] },
  { id: "building" as const, name: "Building", icon: Hammer, color: "#eab308", desc: "Projects, Skills", habits: ["2hr Deep Work Daily", "Ship Something Weekly", "Learn New Skill Monthly", "Build in Public"] },
  { id: "truth" as const, name: "Truth", icon: GraduationCap, color: "#06b6d4", desc: "Reading, Thinking", habits: ["Read 30min Daily", "Journal Weekly", "Monthly Review", "Annual Retreat"] },
];

const TEMPLATE_RULES = [
  { pillar: "faith", title: "Morning Prayer", description: "30 minutes of prayer and meditation", frequency: "daily" },
  { pillar: "faith", title: "Scripture Reading", description: "Read 1 chapter of the Bible", frequency: "daily" },
  { pillar: "discipline", title: "Cold Shower", description: "End shower with 2 minutes cold", frequency: "daily" },
  { pillar: "discipline", title: "Workout", description: "45 minutes of exercise", frequency: "daily" },
  { pillar: "brotherhood", title: "Pod Check-in", description: "Send daily accountability message to pod", frequency: "daily" },
  { pillar: "building", title: "Deep Work", description: "2 hours of focused, uninterrupted work", frequency: "daily" },
  { pillar: "truth", title: "Read", description: "30 minutes of reading (non-fiction)", frequency: "daily" },
  { pillar: "truth", title: "Weekly Review", description: "Review the week and plan next week", frequency: "weekly" },
];

export default function RuleBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedRules, setSelectedRules] = useState<Set<number>>(new Set([0, 1, 2, 4, 5, 6, 7]));
  const [customRules, setCustomRules] = useState<{ title: string; description: string; pillar: string }[]>([]);
  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const toggleRule = (index: number) => {
    const newSet = new Set(selectedRules);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedRules(newSet);
  };

  const addCustomRule = () => {
    if (!newRuleTitle.trim() || !selectedPillar) return;
    setCustomRules([...customRules, { title: newRuleTitle, description: newRuleDesc, pillar: selectedPillar }]);
    setNewRuleTitle("");
    setNewRuleDesc("");
  };

  const removeCustomRule = (index: number) => {
    setCustomRules(customRules.filter((_, i) => i !== index));
  };

  const saveRules = async () => {
    setSaving(true);
    try {
      const rules = [
        ...Array.from(selectedRules).map(i => TEMPLATE_RULES[i]),
        ...customRules,
      ];
      
      // Call the API to save each rule
      for (const rule of rules) {
        await fetch("/api/rule-of-life", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rule),
        });
      }
      setDone(true);
    } catch (error) {
      console.error("Failed to save rules:", error);
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <Check className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Rule of Life is Ready</h1>
        <p className="text-muted-foreground mb-8">
          You've got {selectedRules.size + customRules.length} rules configured. Start executing.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/rule-of-life")}>
            View My Rules
          </Button>
          <Button onClick={() => router.push("/dashboard")} className="btn-elegant">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-green-500" />
          </div>
          Rule Builder
        </h1>
        <p className="text-muted-foreground mt-2">Build your personal GPS for life</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              s === step ? "bg-primary w-8" : s < step ? "bg-green-500" : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Choose Pillar */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Choose Your Focus</h2>
            <p className="text-muted-foreground">Which pillar do you want to start building first?</p>
          </div>
          <div className="grid md:grid-cols-5 gap-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(pillar.id)}
                  className={`glass-card p-4 text-center transition-all ${
                    selectedPillar === pillar.id
                      ? "border-primary ring-2 ring-primary/50"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${pillar.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: pillar.color }} />
                  </div>
                  <p className="font-bold text-sm">{pillar.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{pillar.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!selectedPillar} className="gap-2">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Select Rules */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Pick Your Rules</h2>
            <p className="text-muted-foreground">Select the habits you want to track. Add custom ones below.</p>
          </div>

          {/* Template Rules */}
          <div className="space-y-2">
            {TEMPLATE_RULES.map((rule, i) => {
              const pillar = PILLARS.find((p) => p.id === rule.pillar);
              const Icon = pillar?.icon || Cross;
              return (
                <button
                  key={i}
                  onClick={() => toggleRule(i)}
                  className={`w-full glass-card p-4 flex items-center gap-4 text-left transition-all ${
                    selectedRules.has(i) ? "border-green-500/50 bg-green-500/5" : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedRules.has(i)
                        ? "bg-green-500 border-green-500"
                        : "border-border"
                    }`}
                  >
                    {selectedRules.has(i) && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${pillar?.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: pillar?.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rule.title}</p>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{rule.frequency}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Rule */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Add Custom Rule
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRuleTitle}
                onChange={(e) => setNewRuleTitle(e.target.value)}
                placeholder="Rule title..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background/50 text-sm"
              />
              <input
                type="text"
                value={newRuleDesc}
                onChange={(e) => setNewRuleDesc(e.target.value)}
                placeholder="Description..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background/50 text-sm"
              />
              <select
                value={selectedPillar || ""}
                onChange={(e) => setSelectedPillar(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background/50 text-sm"
              >
                <option value="">Pillar</option>
                {PILLARS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={addCustomRule}>Add</Button>
            </div>
            {customRules.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customRules.map((r, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-1">
                    {r.title}
                    <button onClick={() => removeCustomRule(i)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={() => setStep(3)} className="gap-2">
              Review <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Save */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Review Your Rule of Life</h2>
            <p className="text-muted-foreground">
              {selectedRules.size + customRules.length} rules selected
            </p>
          </div>

          {/* Summary by Pillar */}
          <div className="grid md:grid-cols-5 gap-3">
            {PILLARS.map((pillar) => {
              const count = [
                ...TEMPLATE_RULES.filter((r, i) => r.pillar === pillar.id && selectedRules.has(i)),
                ...customRules.filter((r) => r.pillar === pillar.id),
              ].length;
              const Icon = pillar.icon;
              return (
                <div key={pillar.id} className="glass-card p-4 text-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: `${pillar.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: pillar.color }} />
                  </div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{pillar.name}</p>
                </div>
              );
            })}
          </div>

          {/* Selected Rules */}
          <div className="space-y-2">
            {[
              ...TEMPLATE_RULES.filter((_, i) => selectedRules.has(i)),
              ...customRules,
            ].map((rule, i) => {
              const pillar = PILLARS.find((p) => p.id === (rule as any).pillar);
              const Icon = pillar?.icon || Cross;
              return (
                <div key={i} className="glass-card p-4 flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${pillar?.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: pillar?.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rule.title}</p>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <Flame className="h-4 w-4 text-orange-400" />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={saveRules} disabled={saving} className="btn-elegant gap-2">
              {saving ? "Saving..." : "Start Executing"} <Check className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
