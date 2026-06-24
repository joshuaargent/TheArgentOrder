"use client";
import { CheckSquare } from "lucide-react";
export default function RuleBuilderPage() {
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckSquare className="h-5 w-5 text-green-500" /></div>Rule Builder</h1><p className="text-muted-foreground mt-1">Build your personal rule of life</p></div>
      <div className="glass-card p-12 text-center"><CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">Coming Soon</h3><p className="text-muted-foreground">The rule builder is under construction.</p></div>
    </div>
  );
}
