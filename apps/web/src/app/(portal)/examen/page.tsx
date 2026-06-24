"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Flame, ArrowRight } from "lucide-react";
const QUESTIONS = [
  { id: "gratitude", text: "What am I grateful for today?" },
  { id: "pray", text: "Did I make time for prayer?" },
  { id: "mass", text: "Did I attend Mass or prepare for it?" },
  { id: "workout", text: "Did I exercise?" },
  { id: "deep_work", text: "Did I do focused deep work?" },
  { id: "brother", text: "Did I connect with a brother?" },
  { id: "project", text: "Did I make progress on my project?" },
  { id: "learn", text: "Did I learn something new?" },
];
export default function ExamenPage() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const toggle = (id: string) => setAnswers(a => ({ ...a, [id]: !a[id] }));
  const score = Object.values(answers).filter(Boolean).length;
  if (submitted) return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-500" /></div>Examen Complete</h1><p className="text-muted-foreground mt-1">Daily Review</p></div>
      <div className="glass-card p-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-6"><Flame className="h-10 w-10 text-green-500" /></div>
        <p className="text-4xl font-bold mb-2">{score}/{QUESTIONS.length}</p>
        <p className="text-muted-foreground">items completed today</p>
        <Button className="mt-6 btn-elegant" onClick={() => { setAnswers({}); setSubmitted(false); }}>Start New Examen</Button>
      </div>
    </div>
  );
  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><Flame className="h-5 w-5 text-green-500" /></div>Daily Examen</h1><p className="text-muted-foreground mt-1">Review your day with gratitude and reflection</p></div>
      <div className="space-y-3">{QUESTIONS.map((q) => (
        <button key={q.id} onClick={() => toggle(q.id)} className={`glass-card p-4 w-full flex items-center gap-4 text-left ${answers[q.id] ? "border-green-500/30" : ""}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${answers[q.id] ? "bg-green-500" : "border-2 border-border"}`}>{answers[q.id] && <CheckCircle className="h-4 w-4 text-white" />}</div>
          <span className="flex-1">{q.text}</span>
        </button>
      ))}</div>
      <Button className="btn-elegant w-full h-12 text-lg" onClick={() => setSubmitted(true)}><ArrowRight className="h-5 w-5 mr-2" />Complete Examen</Button>
    </div>
  );
}
