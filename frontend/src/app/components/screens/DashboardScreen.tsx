import React, { useState } from "react";
import { toast } from "sonner";
import {
  Flame, Target, FileText, Calendar, TrendingUp,
  Edit3, Plus, Trash2, CheckCircle2, AlertCircle, Award, X, Clock
} from "lucide-react";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
} from "recharts";
import { SUBJECTS, DAILY_NOTES_DATA } from "../../constants";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

export function StreakCard({ data }: { data: { days: number; best: number; activeDays: number } }) {
  const { days, best, activeDays } = data;
  return (
    <article aria-label="Study streak" className="col-span-1 bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-5 text-white shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-white/15 rounded-lg"><Flame className="w-5 h-5 text-white" /></div>
        <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">🔥 On fire</span>
      </div>
      <p className="text-4xl font-extrabold leading-none">{days}</p>
      <p className="text-sm font-semibold mt-1 text-white/90">Day Study Streak</p>
      <p className="text-xs text-white/60 mt-3">Best: {best} days — keep going!</p>
      <div className="flex gap-1 mt-3">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i < activeDays ? "bg-white" : "bg-white/25"}`} />
        ))}
      </div>
    </article>
  );
}

export function AccuracyCard({ data }: { data: { value: number; trend: string; quizCount: number } }) {
  const { value, trend, quizCount } = data;
  return (
    <article aria-label="Accuracy rate" className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-accent/10 rounded-lg"><Target className="w-5 h-5 text-accent" /></div>
        <span className="flex items-center gap-1 text-xs font-semibold text-accent">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      </div>
      <p className="text-3xl font-extrabold text-foreground">{value}%</p>
      <p className="text-sm font-semibold text-muted-foreground mt-1">Accuracy Rate</p>
      <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">Avg. across {quizCount} quizzes</p>
    </article>
  );
}

export function NotesCountCard({ data }: { data: { total: number; weeklyDelta: string } }) {
  const { total, weeklyDelta } = data;
  return (
    <article aria-label="Total notes" className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-purple-100 rounded-lg"><FileText className="w-5 h-5 text-purple-600" /></div>
        <span className="flex items-center gap-1 text-xs font-semibold text-purple-600">
          <Calendar className="w-3 h-3" /> This month
        </span>
      </div>
      <p className="text-3xl font-extrabold text-foreground">{total}</p>
      <p className="text-sm font-semibold text-muted-foreground mt-1">Registered Notes</p>
      <p className="text-xs text-muted-foreground mt-1">{weeklyDelta} notes from last week</p>
    </article>
  );
}

export function WeeklyActivityChart({ weeklyActivity }: { weeklyActivity: { day: string; notes: number; quizzes: number }[] }) {
  const data = weeklyActivity && weeklyActivity.length ? weeklyActivity : DAILY_NOTES_DATA;
  const maxVal = Math.max(...data.map((d) => Math.max(d.notes, d.quizzes)));
  const chartH = 120;
  return (
    <section aria-label="Weekly activity" className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-foreground">Weekly Activity</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Notes created &amp; quizzes taken per day</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> Notes
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" /> Quizzes
          </span>
        </div>
      </div>
      <div className="relative" style={{ height: chartH + 24 }}>
        <div className="absolute inset-x-0 top-0" style={{ height: chartH }}>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-border" style={{ top: `${(1 - t) * 100}%` }}>
              <span className="absolute -left-1 -translate-x-full -translate-y-1/2 text-[10px] text-muted-foreground">
                {Math.round(t * maxVal)}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-6 top-0 flex items-end justify-between gap-1" style={{ height: chartH }}>
          {data.map((d) => (
            <div key={d.day} className="flex-1 flex items-end justify-center gap-0.5 group relative">
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-2 py-1 shadow-md text-[10px] text-foreground font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                {d.notes} notes · {d.quizzes} quizzes
              </div>
              <div className="w-full max-w-[14px] rounded-t-[3px] bg-primary" style={{ height: `${(d.notes / Math.max(maxVal, 1)) * chartH}px` }} />
              <div className="w-full max-w-[14px] rounded-t-[3px] bg-accent" style={{ height: `${(d.quizzes / Math.max(maxVal, 1)) * chartH}px` }} />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-6 flex justify-between" style={{ top: chartH + 6 }}>
          {data.map((d) => (
            <div key={d.day} className="flex-1 text-center text-[11px] text-muted-foreground font-medium">{d.day}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HomeMain
// ─────────────────────────────────────────────

export interface HomeMainProps {
  dashboard: any;
  currentUser: any;
  currentTime: Date;
}

export function HomeMain({ dashboard, currentUser, currentTime }: HomeMainProps) {
  const stats = dashboard || {};
  const subjects = stats.subjects || SUBJECTS;

  const firstName = currentUser?.fullName ? currentUser.fullName.split(' ')[0] : "";
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  
  const dateFormatted = currentTime.toLocaleDateString('es-ES', dateOptions);
  const timeFormatted = currentTime.toLocaleTimeString('es-ES', timeOptions);
  const dateCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  // Unused handlers in the original code
  const handleViewAllSubjects = () => { };
  const handleViewSubject = (_id: number) => { };

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-8">
      <section aria-label="Welcome header">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Welcome back, {firstName} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">{dateCapitalized} · {timeFormatted} — You have {stats.totalSessionsStarted || 0} sessions started this week.</p>
      </section>
      <section aria-label="Study statistics" className="grid grid-cols-3 gap-4">
        <StreakCard data={{ days: stats.streakDays || 0, best: stats.bestStreak || 0, activeDays: stats.activeDays || 0 }} />
        <AccuracyCard data={{ value: stats.accuracyValue || 0, trend: stats.accuracyTrend || "+0%", quizCount: stats.quizCount || 0 }} />
        <NotesCountCard data={{ total: stats.totalNotes || 0, weeklyDelta: stats.notesWeeklyDelta ? `+${stats.notesWeeklyDelta}` : "+0" }} />
      </section>
      <WeeklyActivityChart weeklyActivity={stats.weeklyActivity || DAILY_NOTES_DATA} />
      <section aria-label="Study subjects">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Study Subjects</h2>
          <button onClick={handleViewAllSubjects} className="text-xs font-semibold text-primary hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {subjects.map((s: any, index: number) => (
            <article key={index}>
              <button
                onClick={() => handleViewSubject(index)}
                className="w-full text-left p-4 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ background: s.bg || "#f8fafc", borderColor: s.border || "#e2e8f0" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl leading-none">{s.icon || "📘"}</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full">{s.notes} notes</span>
                </div>
                <p className="text-sm font-bold text-slate-800 leading-snug whitespace-pre-line">{s.subject || s.name}</p>
                <div className="mt-3 h-1 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary/80" style={{ width: `${s.progress || 0}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{s.progress || 0}% mastered</p>
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────
// HomePanel
// ─────────────────────────────────────────────

export interface HomePanelProps {
  dashboard: any;
  goals: any[];
  onSaveGoal: (goal: any, id?: string) => Promise<boolean>;
  onDeleteGoal: (id: string) => Promise<boolean>;
  onDeleteQuiz: (id: string) => Promise<boolean>;
  onSaveQuiz: (quiz: any) => Promise<boolean>;
  notes?: any[];
}

export function HomePanel({
  dashboard,
  goals = [],
  onSaveGoal,
  onDeleteGoal,
  onDeleteQuiz,
  onSaveQuiz,
}: HomePanelProps) {
  const stats = dashboard || {};
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalForm, setNewGoalForm] = useState({ label: "", goal: 5, color: "#2563EB", isCustom: true });
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [newQuizForm, setNewQuizForm] = useState({ subject: "General OOP — Quiz", score: 80 });

  // Calculate dynamic progress for each goal
  const calculatedGoals = goals.map((g) => {
    let done = g.manualDone || 0;
    if (!g.isCustom) {
      const labelLower = g.label.toLowerCase();
      if (labelLower.includes("session") || labelLower.includes("sesion") || labelLower.includes("estudio")) {
        done = (stats.weeklyActivity || []).reduce((acc: number, cur: any) => acc + (cur.quizzes || 0), 0);
      } else if (labelLower.includes("quiz") || labelLower.includes("cuestionario") || labelLower.includes("evalua")) {
        done = stats.recentQuizzes?.length || 0;
      } else if (labelLower.includes("note") || labelLower.includes("nota")) {
        done = (stats.weeklyActivity || []).reduce((acc: number, cur: any) => acc + (cur.notes || 0), 0);
      }
    }
    return { ...g, done };
  });

  // Calculate dynamic weekly completion average
  const totalGoalsCount = calculatedGoals.length;
  const weeklyCompletion = totalGoalsCount > 0
    ? Math.round(
        calculatedGoals.reduce((acc, g) => acc + Math.min(100, (g.done / g.goal) * 100), 0) / totalGoalsCount
      )
    : 0;

  const radialData = [{ value: weeklyCompletion, fill: "#2563EB" }];
  const quizResults = (stats.recentQuizzes || []) as any[];

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalForm.label.trim()) {
      toast.error("Please enter a goal label");
      return;
    }
    const success = await onSaveGoal({
      label: newGoalForm.label,
      goal: newGoalForm.goal,
      color: newGoalForm.color,
      isCustom: newGoalForm.isCustom,
      manualDone: 0
    });
    if (success) {
      toast.success("Weekly Goal added successfully!");
      setNewGoalForm({ label: "", goal: 5, color: "#2563EB", isCustom: true });
    }
  };

  const handleUpdateGoalTarget = async (goal: any, newTarget: number) => {
    await onSaveGoal({ ...goal, goal: newTarget }, goal.id);
  };

  const handleIncrementDone = async (goal: any, increment: number) => {
    const newDone = Math.max(0, (goal.manualDone || 0) + increment);
    await onSaveGoal({ ...goal, manualDone: newDone }, goal.id);
  };

  const handleLogQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizForm.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    const score = Math.max(0, Math.min(100, newQuizForm.score));
    const success = await onSaveQuiz({
      subject: newQuizForm.subject,
      score,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: score >= 70 ? "success" : "warning",
      badge: score >= 90 ? "Excellent" : score >= 80 ? "Great" : score >= 70 ? "Good" : "Needs Work",
      goalMet: score >= 70
    });
    if (success) {
      toast.success("Quiz score logged successfully!");
      setShowQuizModal(false);
      setNewQuizForm({ subject: "General OOP — Quiz", score: 80 });
    }
  };

  return (
    <aside aria-label="Activity panel" className="w-72 shrink-0 border-l border-border bg-card flex flex-col h-full overflow-y-auto">
      <section aria-label="Weekly goals" className="px-5 py-5 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Weekly Goals</h3>
          <button
            onClick={() => setShowGoalModal(true)}
            className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" /> Manage
          </button>
        </div>

        <div className="relative h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="68%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: "#F1F5F9" }} dataKey="value" cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-extrabold text-foreground">{weeklyCompletion}%</p>
            <p className="text-[10px] text-muted-foreground font-semibold">Goal Met</p>
          </div>
        </div>

        <ul className="space-y-3 mt-2">
          {calculatedGoals.map((g) => (
            <li key={g.id || g.label} className="flex items-center gap-2.5 group/goal">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-medium text-foreground truncate">{g.label}</span>
                  <span className="text-[11px] font-bold shrink-0" style={{ color: g.color }}>{g.done}/{g.goal}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (g.done / g.goal) * 100)}%`, background: g.color }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Recent quizzes" className="flex-1 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Recent Quizzes</h3>
          <button
            onClick={() => setShowQuizModal(true)}
            className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Log Quiz
          </button>
        </div>
        <ul className="space-y-2.5">
          {quizResults.length === 0 ? (
            <p className="text-[10px] text-muted-foreground leading-relaxed italic text-center py-4">
              No quizzes completed yet. Link notes and take quizzes under the Study tab!
            </p>
          ) : (
            quizResults.map((r) => {
              const ok = r.status === "success";
              return (
                <li key={r.id}>
                  <article className="p-3 rounded-xl border border-border bg-background hover:bg-muted/50 transition">
                     <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-foreground leading-snug line-clamp-2">{r.subject}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Clock className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                          <time className="text-[10px] text-muted-foreground">{r.date}</time>
                        </div>
                      </div>
                      <div className="shrink-0 text-right flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-0.5">
                          <p className="text-base font-extrabold leading-none" style={{ color: ok ? "#10B981" : "#F59E0B" }}>{r.score}</p>
                          <p className="text-[9px] text-muted-foreground">/100</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete quiz result for "${r.subject}"?`)) onDeleteQuiz(r.id);
                          }}
                          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition"
                          title="Delete Quiz Result"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      {ok ? <CheckCircle2 className="w-3 h-3 text-accent shrink-0" /> : <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />}
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={ok ? { background: "#D1FAE5", color: "#065F46" } : { background: "#FEF3C7", color: "#92400E" }}>{r.badge}</span>
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden ml-1">
                        <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: ok ? "#10B981" : "#F59E0B" }} />
                      </div>
                    </div>
                  </article>
                </li>
              );
            })
          )}
        </ul>
      </section>

      <aside aria-label="Tip" className="mx-4 mb-4 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/15 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-primary shrink-0" />
          <p className="text-[11px] font-bold text-foreground">Goal Focus</p>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Your goals are dynamically synced with your database entries. Keep studying to meet your targets!
        </p>
      </aside>

      {/* Goal Management Modal */}
      {showGoalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowGoalModal(false); }}
        >
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Manage Weekly Goals
              </h3>
              <button onClick={() => setShowGoalModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Existing Goals List */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Goals</p>
                {calculatedGoals.map((g) => (
                  <div key={g.id} className="p-3 bg-muted/40 border border-border rounded-xl flex items-center gap-3 justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{g.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{g.isCustom ? "Manual counter" : "Auto-progress"}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Manual Counter adjusters */}
                      {g.isCustom && (
                        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-0.5">
                          <button
                            onClick={() => handleIncrementDone(g, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold hover:bg-muted text-muted-foreground"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-1.5">{g.manualDone || 0}</span>
                          <button
                            onClick={() => handleIncrementDone(g, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold hover:bg-muted text-muted-foreground"
                          >
                            +
                          </button>
                        </div>
                      )}

                      {/* Target value input */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground font-semibold">Target:</span>
                        <input
                          type="number"
                          value={g.goal}
                          min={1}
                          onChange={(e) => handleUpdateGoalTarget(g, parseInt(e.target.value) || 1)}
                          className="w-12 px-1.5 py-1 text-center text-xs font-bold border border-border rounded-lg bg-card focus:outline-none focus:ring-1 focus:ring-primary/40"
                        />
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete goal "${g.label}"?`)) onDeleteGoal(g.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-muted-foreground transition ml-1"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Goal Form */}
              <form onSubmit={handleCreateGoal} className="border-t border-border pt-4 space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Add New Goal</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Goal title (e.g. Code hours)"
                    value={newGoalForm.label}
                    onChange={(e) => setNewGoalForm((f) => ({ ...f, label: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">Target Value</label>
                      <input
                        type="number"
                        min={1}
                        value={newGoalForm.goal}
                        onChange={(e) => setNewGoalForm((f) => ({ ...f, goal: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">Progress Type</label>
                      <select
                        value={newGoalForm.isCustom ? "custom" : "auto"}
                        onChange={(e) => setNewGoalForm((f) => ({ ...f, isCustom: e.target.value === "custom" }))}
                        className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      >
                        <option value="custom">Custom (Manual +/-)</option>
                        <option value="auto">Auto (from Activity)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-semibold text-muted-foreground block mb-0.5">Theme Color</label>
                      <select
                        value={newGoalForm.color}
                        onChange={(e) => setNewGoalForm((f) => ({ ...f, color: e.target.value }))}
                        className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      >
                        <option value="#2563EB">Blue</option>
                        <option value="#10B981">Green</option>
                        <option value="#8B5CF6">Purple</option>
                        <option value="#EF4444">Red</option>
                        <option value="#F59E0B">Amber</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                      >
                        Add Goal
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Log Modal */}
      {showQuizModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowQuizModal(false); }}
        >
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg> Log Quiz Score
              </h3>
              <button onClick={() => setShowQuizModal(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogQuiz} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Subject / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. OOP Polymorphism Quiz"
                  value={newQuizForm.subject}
                  onChange={(e) => setNewQuizForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Score (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newQuizForm.score}
                  onChange={(e) => setNewQuizForm((f) => ({ ...f, score: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 text-xs border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl shadow-sm transition mt-2"
              >
                Log Quiz Score
              </button>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
