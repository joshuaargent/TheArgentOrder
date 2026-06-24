"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  CheckSquare, Plus, X, Edit2, Trash2, Check, Target, Calendar,
  Cross, Dumbbell, Handshake, Hammer, GraduationCap,
} from "lucide-react";

interface Rule {
  id: string;
  title: string;
  description: string;
  pillar: 'faith' | 'discipline' | 'brotherhood' | 'building' | 'truth';
  frequency: 'daily' | 'weekly' | 'monthly';
  completed_today: boolean;
  streak: number;
}

interface NewRuleForm {
  title: string;
  description: string;
  pillar: Rule['pillar'];
  frequency: Rule['frequency'];
}

const PILLAR_CONFIG = {
  faith: { icon: Cross, color: '#a855f7', name: 'Faith', bg: 'bg-purple-500/10' },
  discipline: { icon: Dumbbell, color: '#ef4444', name: 'Discipline', bg: 'bg-red-500/10' },
  brotherhood: { icon: Handshake, color: '#22c55e', name: 'Brotherhood', bg: 'bg-green-500/10' },
  building: { icon: Hammer, color: '#eab308', name: 'Building', bg: 'bg-yellow-500/10' },
  truth: { icon: GraduationCap, color: '#06b6d4', name: 'Truth', bg: 'bg-cyan-500/10' },
};

export default function RuleOfLifePage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [filter, setFilter] = useState<Rule['pillar'] | 'all'>('all');
  const [form, setForm] = useState<NewRuleForm>({
    title: '',
    description: '',
    pillar: 'faith',
    frequency: 'daily',
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch("/api/rule-of-life");
      const data = await res.json();
      setRules(data.rules || getDefaultRules());
    } catch (error) {
      console.error("Failed to fetch rules:", error);
      setRules(getDefaultRules());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultRules = (): Rule[] => [
    { id: '1', title: 'Morning Prayer', description: '30 minutes of prayer and meditation', pillar: 'faith', frequency: 'daily', completed_today: false, streak: 12 },
    { id: '2', title: 'Scripture Reading', description: 'Read 1 chapter of the Bible', pillar: 'faith', frequency: 'daily', completed_today: false, streak: 8 },
    { id: '3', title: 'Cold Shower', description: 'End shower with 2 minutes cold', pillar: 'discipline', frequency: 'daily', completed_today: false, streak: 21 },
    { id: '4', title: 'Workout', description: '45 minutes of exercise', pillar: 'discipline', frequency: 'daily', completed_today: false, streak: 15 },
    { id: '5', title: 'Pod Check-in', description: 'Send daily accountability message to pod', pillar: 'brotherhood', frequency: 'daily', completed_today: false, streak: 5 },
    { id: '6', title: 'Deep Work', description: '2 hours of focused, uninterrupted work', pillar: 'building', frequency: 'daily', completed_today: false, streak: 3 },
    { id: '7', title: 'Read', description: '30 minutes of reading (non-fiction)', pillar: 'truth', frequency: 'daily', completed_today: false, streak: 7 },
    { id: '8', title: 'Weekly Review', description: 'Review the week and plan next week', pillar: 'truth', frequency: 'weekly', completed_today: false, streak: 2 },
  ];

  const toggleRule = async (rule: Rule) => {
    const newCompleted = !rule.completed_today;
    const newStreak = newCompleted ? rule.streak + 1 : Math.max(0, rule.streak - 1);
    
    setRules(rules.map(r => 
      r.id === rule.id 
        ? { ...r, completed_today: newCompleted, streak: newStreak }
        : r
    ));

    try {
      await fetch(`/api/rule-of-life/${rule.id}/toggle`, { method: 'POST' });
    } catch (error) {
      console.error("Failed to toggle rule:", error);
    }
  };

  const saveRule = async () => {
    if (!form.title.trim()) return;

    if (editingRule) {
      setRules(rules.map(r => 
        r.id === editingRule.id ? { ...r, ...form } : r
      ));
    } else {
      const newRule: Rule = {
        id: Date.now().toString(),
        ...form,
        completed_today: false,
        streak: 0,
      };
      setRules([...rules, newRule]);
    }

    setShowModal(false);
    setEditingRule(null);
    setForm({ title: '', description: '', pillar: 'faith', frequency: 'daily' });
  };

  const deleteRule = async (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const filteredRules = filter === 'all' 
    ? rules 
    : rules.filter(r => r.pillar === filter);

  const completedToday = rules.filter(r => r.completed_today).length;
  const completionPercent = rules.length > 0 
    ? Math.round((completedToday / rules.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading your Rule of Life...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-green-500" />
            </div>
            Rule of Life
          </h1>
          <p className="text-muted-foreground mt-1">Your personal operating system for daily execution</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="btn-elegant gap-2">
          <Plus className="h-4 w-4" />
          Add Rule
        </Button>
      </div>

      {/* Progress Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Today's Progress</p>
            <p className="text-3xl font-bold">{completedToday}/{rules.length} rules</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-border"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${completionPercent * 2.26} 226`}
                className="text-green-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{completionPercent}%</span>
            </div>
          </div>
        </div>
        
        {/* Pillar Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card/50 text-muted-foreground hover:text-foreground'}`}
          >
            All
          </button>
          {Object.entries(PILLAR_CONFIG).map(([key, config]) => {
            const count = rules.filter(r => r.pillar === key).length;
            const completed = rules.filter(r => r.pillar === key && r.completed_today).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key as Rule['pillar'])}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${filter === key ? 'bg-primary text-primary-foreground' : 'bg-card/50 text-muted-foreground hover:text-foreground'}`}
              >
                <config.icon className="h-3 w-3" style={{ color: filter === key ? undefined : config.color }} />
                {config.name} ({completed}/{count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {filteredRules.map((rule) => {
          const pillarConfig = PILLAR_CONFIG[rule.pillar];
          return (
            <div 
              key={rule.id} 
              className={`glass-card p-4 flex items-center gap-4 group transition-all ${rule.completed_today ? 'border-green-500/30' : ''}`}
            >
              {/* Completion Toggle */}
              <button
                onClick={() => toggleRule(rule)}
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  rule.completed_today 
                    ? 'bg-green-500 text-white' 
                    : 'border-2 border-border hover:border-green-500'
                }`}
              >
                {rule.completed_today && <Check className="h-5 w-5" />}
              </button>

              {/* Pillar Icon */}
              <div className={`w-10 h-10 rounded-xl ${pillarConfig.bg} flex items-center justify-center flex-shrink-0`}>
                <pillarConfig.icon className="h-5 w-5" style={{ color: pillarConfig.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${rule.completed_today ? 'line-through text-muted-foreground' : ''}`}>
                  {rule.title}
                </p>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4">
                {/* Frequency */}
                <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {rule.frequency}
                </div>
                
                {/* Streak */}
                <div className="hidden sm:flex items-center gap-1 text-xs">
                  <span className={rule.streak > 0 ? 'text-orange-400' : 'text-muted-foreground'}>
                    🔥
                  </span>
                  <span className={rule.streak > 0 ? 'text-orange-400' : 'text-muted-foreground'}>
                    {rule.streak}
                  </span>
                </div>

                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingRule(rule);
                      setForm({
                        title: rule.title,
                        description: rule.description,
                        pillar: rule.pillar,
                        frequency: rule.frequency,
                      });
                      setShowModal(true);
                    }}
                    className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRules.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Rules Yet</h3>
          <p className="text-muted-foreground mb-4">Start building your Rule of Life by adding your first habit.</p>
          <Button onClick={() => setShowModal(true)} className="btn-elegant gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Rule
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingRule ? 'Edit Rule' : 'Add New Rule'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-card/50 text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Morning Prayer"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this habit entail?"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Pillar */}
              <div>
                <label className="block text-sm font-medium mb-2">Pillar</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(PILLAR_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setForm({ ...form, pillar: key as Rule['pillar'] })}
                      className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                        form.pillar === key 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <config.icon className="h-5 w-5" style={{ color: config.color }} />
                      <span className="text-xs">{config.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium mb-2">Frequency</label>
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setForm({ ...form, frequency: freq })}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm capitalize transition-all ${
                        form.frequency === freq 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveRule} className="btn-elegant flex-1">
                {editingRule ? 'Save Changes' : 'Add Rule'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
