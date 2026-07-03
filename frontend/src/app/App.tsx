import { useState, useRef, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  Home, BookOpen, Settings, StickyNote, Hexagon,
  Flame, Target, FileText, ChevronRight, Clock,
  TrendingUp, CheckCircle2, AlertCircle, Award,
  Calendar, Bell, Search, MoreHorizontal, Plus,
  Upload, Filter, Grid3X3, List, Tag, Trash2,
  Edit3, MoreVertical, CloudUpload, X, Sparkles,
  File, FileImage, FileVideo, Link2, Brain,
  Send, MessageSquare, ChevronDown, BookMarked,
  Lightbulb, CircleDot, Bold, Italic, Underline,
  AlignLeft, ListOrdered, Quote, Save, Type,
  Sun, Moon, Eye, EyeOff, User, Mail, Building,
  Camera, KeyRound, ToggleLeft, ToggleRight, Shield,
  UserPlus, LogOut,
  ArrowLeft, Share2, Paperclip, Pencil,
  Hash, Code2, ChevronLeft,
  ClipboardList, PenLine, Layers, Zap, Rocket,
  RefreshCw, Timer, Gauge, BookOpenCheck,
} from "lucide-react";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
} from "recharts";

// ─────────────────────────────────────────────
// Shared Data
// ─────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: Home, label: "Home" },
  { icon: BookOpen, label: "Study Notebooks" },
  { icon: StickyNote, label: "My Notes" },
  { icon: Settings, label: "Settings" },
];

const CURRENT_USER = {
  name: "Raúl Andrade",
  initials: "RA",
  subtitle: "POO — Semester 4",
};

// ─────────────────────────────────────────────
// Home Data
// ─────────────────────────────────────────────

const STATS = {
  streak: { days: 5, best: 12, activeDays: 5 },
  accuracy: { value: 84, trend: "+4.2%", quizCount: 24 },
  notes: { total: 24, weeklyDelta: "+6" },
};

const SUBJECTS = [
  { id: 1, name: "Object-Oriented\nProgramming", notes: 8, icon: "⬡", progress: 72, bg: "#EFF6FF", border: "#BFDBFE" },
  { id: 2, name: "Databases", notes: 5, icon: "🗄", progress: 58, bg: "#ECFDF5", border: "#A7F3D0" },
  { id: 3, name: "Calculus", notes: 4, icon: "∫", progress: 45, bg: "#FEF3C7", border: "#FDE68A" },
  { id: 4, name: "Data Structures", notes: 4, icon: "⟨⟩", progress: 61, bg: "#F5F3FF", border: "#DDD6FE" },
  { id: 5, name: "Linear Algebra", notes: 2, icon: "Σ", progress: 30, bg: "#FFF1F2", border: "#FECDD3" },
  { id: 6, name: "Discrete Math", notes: 1, icon: "∩", progress: 20, bg: "#F0FDF4", border: "#BBF7D0" },
];

const WEEKLY_GOALS = [
  { label: "Study Sessions", done: 5, goal: 7, color: "#2563EB" },
  { label: "Quizzes Taken", done: 4, goal: 5, color: "#10B981" },
  { label: "Notes Reviewed", done: 12, goal: 15, color: "#8B5CF6" },
];

const QUIZ_RESULTS = [
  { id: 1, subject: "OOP — Inheritance & Polymorphism", score: 94, date: "Today, 2:30 PM", status: "success", badge: "Excellent" },
  { id: 2, subject: "Databases — SQL Joins", score: 87, date: "Yesterday, 6:15 PM", status: "success", badge: "Great" },
  { id: 3, subject: "Calculus — Derivatives", score: 71, date: "Jun 18, 4:00 PM", status: "warning", badge: "Good" },
  { id: 4, subject: "OOP — Design Patterns", score: 91, date: "Jun 17, 11:20 AM", status: "success", badge: "Excellent" },
  { id: 5, subject: "Data Structures — Trees", score: 63, date: "Jun 16, 3:45 PM", status: "warning", badge: "Needs Work" },
];

const WEEKLY_COMPLETION = 71;

const DAILY_NOTES_DATA = [
  { day: "Mon", notes: 3, quizzes: 1 },
  { day: "Tue", notes: 5, quizzes: 2 },
  { day: "Wed", notes: 2, quizzes: 1 },
  { day: "Thu", notes: 7, quizzes: 3 },
  { day: "Fri", notes: 4, quizzes: 2 },
  { day: "Sat", notes: 2, quizzes: 0 },
  { day: "Sun", notes: 1, quizzes: 1 },
];

// ─────────────────────────────────────────────
// Notebooks Data
// ─────────────────────────────────────────────

const SUBJECT_FILTERS = [
  "All Subjects", "OOP", "Databases", "Calculus", "Data Structures", "Linear Algebra", "Discrete Math",
];

type SubjectKey = "OOP" | "Databases" | "Calculus" | "Data Structures" | "Linear Algebra" | "Discrete Math";

const SUBJECT_BADGE: Record<SubjectKey, { bg: string; text: string }> = {
  "OOP": { bg: "#EFF6FF", text: "#1D4ED8" },
  "Databases": { bg: "#ECFDF5", text: "#065F46" },
  "Calculus": { bg: "#FEF3C7", text: "#92400E" },
  "Data Structures": { bg: "#F5F3FF", text: "#5B21B6" },
  "Linear Algebra": { bg: "#FFF1F2", text: "#9F1239" },
  "Discrete Math": { bg: "#F0FDF4", text: "#14532D" },
};

const NOTEBOOKS = [
  {
    id: 1,
    title: "Inheritance & Polymorphism in Java",
    preview: "Polymorphism allows objects of different classes to be treated as objects of a common superclass. The most common use is when a parent class reference is used to refer to a child class object...",
    subject: "OOP" as SubjectKey,
    date: "Jun 20, 2026",
    readTime: "5 min read",
    pinned: true,
  },
  {
    id: 2,
    title: "SQL JOIN Types — INNER, LEFT, RIGHT, FULL",
    preview: "A JOIN clause is used to combine rows from two or more tables, based on a related column. INNER JOIN returns records that have matching values in both tables...",
    subject: "Databases" as SubjectKey,
    date: "Jun 19, 2026",
    readTime: "8 min read",
    pinned: false,
  },
  {
    id: 3,
    title: "Design Patterns — Singleton & Factory",
    preview: "The Singleton pattern ensures a class has only one instance and provides a global point of access to it. Use a private constructor and a static method that returns the single instance...",
    subject: "OOP" as SubjectKey,
    date: "Jun 18, 2026",
    readTime: "6 min read",
    pinned: true,
  },
  {
    id: 4,
    title: "Derivatives — Chain Rule & Product Rule",
    preview: "The chain rule is a formula for computing the derivative of a composition of two or more functions. If h(x) = f(g(x)), then h'(x) = f'(g(x)) · g'(x)...",
    subject: "Calculus" as SubjectKey,
    date: "Jun 17, 2026",
    readTime: "4 min read",
    pinned: false,
  },
  {
    id: 5,
    title: "Binary Search Trees — Insertion & Traversal",
    preview: "A BST is a node-based binary tree data structure where each node has at most two child nodes. The left subtree contains nodes with keys less than the parent node's key...",
    subject: "Data Structures" as SubjectKey,
    date: "Jun 16, 2026",
    readTime: "7 min read",
    pinned: false,
  },
  {
    id: 6,
    title: "Normalization — 1NF, 2NF, 3NF",
    preview: "Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. First Normal Form requires atomic values in each column...",
    subject: "Databases" as SubjectKey,
    date: "Jun 15, 2026",
    readTime: "9 min read",
    pinned: false,
  },
  {
    id: 7,
    title: "Matrix Operations & Determinants",
    preview: "A matrix is a rectangular array of numbers arranged in rows and columns. Matrix multiplication is only defined when the number of columns in the first matrix equals the number of rows in the second...",
    subject: "Linear Algebra" as SubjectKey,
    date: "Jun 14, 2026",
    readTime: "6 min read",
    pinned: false,
  },
  {
    id: 8,
    title: "Graph Theory — BFS & DFS Algorithms",
    preview: "Breadth-first search explores the neighbor nodes first, before moving to the next level. It uses a queue data structure. DFS explores as far as possible along each branch before backtracking...",
    subject: "Discrete Math" as SubjectKey,
    date: "Jun 13, 2026",
    readTime: "5 min read",
    pinned: false,
  },
];

const NOTEBOOKS_STATS = [
  { label: "Total Notes", value: "24", color: "#2563EB", bg: "#EFF6FF" },
  { label: "This Week", value: "6", color: "#10B981", bg: "#ECFDF5" },
  { label: "Pinned", value: "2", color: "#8B5CF6", bg: "#F5F3FF" },
];

// ─────────────────────────────────────────────
// Empty Handlers
// ─────────────────────────────────────────────

const handleSearch = (_q: string) => { };
const handleViewSubject = (_id: number) => { };
const handleViewAllSubjects = () => { };
const handleViewAllQuizzes = () => { };
const handleNotifications = () => { };
const handleCreateNote = () => { };
const handleOpenNote = (_id: number) => { /* wired via onOpenNote prop */ };
const handleDeleteNote = (_id: number) => { };
const handleEditNote = (_id: number) => { };
const handleProcessWithAI = () => { };

// ─────────────────────────────────────────────
// Shared: Sidebar
// ─────────────────────────────────────────────

function Sidebar({ activeNav, onNavChange }: { activeNav: string; onNavChange: (l: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-card border-r border-border h-full overflow-y-auto">
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1" aria-label="Main navigation">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
          Main Menu
        </p>
        {NAV_ITEMS.map(({ icon: Icon, label }) => {
          const isActive = activeNav === label;
          return (
            <button
              key={label}
              onClick={() => onNavChange(label)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full text-left ${isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
            </button>
          );
        })}
      </nav>

      {/* User card + dropdown */}
      <div className="mx-3 mb-4 relative">

        {/* Dropdown popover */}
        {menuOpen && (
          <>
            {/* Invisible backdrop to close on outside click */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            {/* Floating card */}
            <div
              className="absolute bottom-full mb-2 left-0 right-0 z-20 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
              role="menu"
              aria-label="Profile actions"
            >
              {/* Row 1 — Add account */}
              <button
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <UserPlus className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                Add another account
              </button>

              {/* Divider */}
              <div className="mx-4 h-px bg-border" />

              {/* Row 2 — Log out */}
              <button
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                </div>
                Log out
              </button>
            </div>
          </>
        )}

        {/* Profile trigger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${menuOpen
            ? "bg-muted border-primary/30 shadow-sm"
            : "bg-muted border-border hover:border-primary/20 hover:shadow-sm"
            }`}
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">{CURRENT_USER.initials}</span>
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold text-foreground truncate">{CURRENT_USER.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{CURRENT_USER.subtitle}</p>
          </div>
          <MoreHorizontal className={`w-4 h-4 shrink-0 ml-auto transition-colors ${menuOpen ? "text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// Home Screen
// ─────────────────────────────────────────────

function StreakCard({ data }: { data: { days: number; best: number; activeDays: number } }) {
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

function AccuracyCard({ data }: { data: { value: number; trend: string; quizCount: number } }) {
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

function NotesCountCard({ data }: { data: { total: number; weeklyDelta: string } }) {
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

function WeeklyActivityChart({ weeklyActivity }: { weeklyActivity: { day: string; notes: number; quizzes: number }[] }) {
  const data = weeklyActivity.length ? weeklyActivity : DAILY_NOTES_DATA;
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

function HomeMain({ dashboard }: { dashboard: any }) {
  const stats = dashboard || {};
  const subjects = stats.subjects || SUBJECTS;
  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-8">
      <section aria-label="Welcome header">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Welcome back, Raúl 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Friday, June 20, 2026 — You have {stats.totalSessionsStarted || 0} sessions started this week.</p>
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

function HomePanel({
  dashboard,
  goals = [],
  onSaveGoal,
  onDeleteGoal,
  onDeleteQuiz,
  onSaveQuiz,
  notes = [],
}: {
  dashboard: any;
  goals?: any[];
  onSaveGoal: (goal: any, id?: string) => Promise<boolean>;
  onDeleteGoal: (id: string) => Promise<boolean>;
  onDeleteQuiz: (id: string) => Promise<boolean>;
  onSaveQuiz: (quiz: any) => Promise<boolean>;
  notes?: any[];
}) {
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

// ─────────────────────────────────────────────
// My Notebooks Screen
// ─────────────────────────────────────────────

function NoteCard({ note, onOpen, onEdit, onDelete, onTogglePin }: { note: any; onOpen?: () => void; onEdit?: () => void; onDelete?: () => void; onTogglePin?: () => void }) {
  const subject = note.subject || "General";
  const badge = (SUBJECT_BADGE as any)[subject] || { bg: "#F3F4F6", text: "#111827" };
  const title = note.title || note.titulo || "Untitled";
  const preview = note.preview || note.contenido || "";

  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : note.date || "Just now";

  const wordCount = (note.contenido || "").trim().split(/\s+/).filter(Boolean).length;
  const calculatedReadTime = note.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return (
    <article className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col gap-3 cursor-pointer relative">
      {/* Pin button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin?.();
        }}
        className={`absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors ${
          note.pinned
            ? "text-primary opacity-100"
            : "text-muted-foreground opacity-0 group-hover:opacity-100"
        }`}
        title={note.pinned ? "Unpin Note" : "Pin Note"}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={note.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="17" x2="12" y2="22"></line>
          <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.5A2 2 0 0 1 15 9.26V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4.26a2 2 0 0 1-.78 1.24l-2.78 3.5a2 2 0 0 0-.44 1.24z"></path>
        </svg>
      </button>

      {/* Subject badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: badge.bg, color: badge.text }}
        >
          <Tag className="w-2.5 h-2.5" />
          {subject}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-muted transition"
          aria-label="More options"
        >
          <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Title */}
      <button
        onClick={() => { onOpen?.(); }}
        className="text-left font-bold"
      >
        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
      </button>

      {/* Preview */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {preview}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3 shrink-0" />
          <time>{note.date}</time>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3 shrink-0" />
          {note.readTime}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit?.()}
            className="p-1 rounded-lg hover:bg-muted transition"
            aria-label="Edit note"
          >
            <Edit3 className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={() => onDelete?.()}
            className="p-1 rounded-lg hover:bg-red-50 transition"
            aria-label="Delete note"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// Import File Modal
// ─────────────────────────────────────────────

type UploadedFile = {
  id: number;
  name: string;
  size: string;
  type: "pdf" | "image" | "video" | "doc";
  progress: number;
  done: boolean;
};

const FILE_ICON: Record<UploadedFile["type"], React.ReactNode> = {
  pdf: <FileText className="w-4 h-4 text-red-500" />,
  image: <FileImage className="w-4 h-4 text-purple-500" />,
  video: <FileVideo className="w-4 h-4 text-blue-500" />,
  doc: <File className="w-4 h-4 text-primary" />,
};

const MOCK_FILES: UploadedFile[] = [
  { id: 1, name: "Sistemas_Distribuidos.pdf", size: "2.4 MB", type: "pdf", progress: 65, done: false },
  { id: 2, name: "OOP_Class_Diagram.png", size: "840 KB", type: "image", progress: 100, done: true },
  { id: 3, name: "Lecture_Notes_Databases.docx", size: "1.1 MB", type: "doc", progress: 30, done: false },
];

function ImportModal({ onClose }: { onClose: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(MOCK_FILES);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // TODO: process e.dataTransfer.files
  };
  const handleBrowse = () => inputRef.current?.click();

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Import study files"
    >
      {/* Modal box */}
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CloudUpload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Import Study Files</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">PDF, DOCX, PNG, MP4 — max 50 MB each</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowse}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 px-6 cursor-pointer transition-all duration-200 ${isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/50 hover:bg-muted/50 bg-background"
              }`}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.png,.jpg,.mp4"
              className="sr-only"
              onChange={() => {/* TODO: handle file input */ }}
            />
            {/* Cloud icon */}
            <div className={`p-4 rounded-2xl transition-colors ${isDragging ? "bg-primary/15" : "bg-muted"}`}>
              <CloudUpload className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">
                {isDragging ? "Drop your files here" : "Drag & Drop your study files here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or{" "}
                <span className="text-primary font-semibold underline underline-offset-2">browse from your device</span>
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {["PDF", "DOCX", "PNG", "MP4"].map((ext) => (
                <span key={ext} className="text-[10px] font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                  {ext}
                </span>
              ))}
            </div>
          </div>

          {/* Upload list */}
          {files.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Uploading ({files.length} files)
              </p>
              <ul className="space-y-2">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
                    {/* File icon */}
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      {FILE_ICON[f.type]}
                    </div>
                    {/* Info + bar */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">{f.name}</p>
                        <span className={`text-[10px] font-bold shrink-0 ml-2 ${f.done ? "text-accent" : "text-muted-foreground"}`}>
                          {f.done ? "Done ✓" : `${f.progress}%`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${f.done ? "bg-accent" : "bg-primary"}`}
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {f.size} · {f.done ? "Upload complete" : `Uploading...`}
                      </p>
                    </div>
                    {/* Remove */}
                    <button
                      onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                      className="p-1.5 rounded-lg hover:bg-muted transition shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
          <p className="text-[10px] text-muted-foreground">
            {files.filter((f) => f.done).length} of {files.length} files ready
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessWithAI}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Process with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotebooksMain({ filter, setFilter, viewMode, setViewMode, onImport, onCreateNote, onStudy, onOpenNote, notes, loading, onSave, onDelete }: {
  filter: string;
  setFilter: (f: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
  onImport: () => void;
  onCreateNote: () => void;
  onStudy: () => void;
  onOpenNote?: (id: string) => void;
  notes: any[];
  loading: boolean;
  onSave: (note: any, id?: string) => Promise<boolean>;
  onDelete: (id?: string) => Promise<boolean>;
}) {
  type NotaType = { id?: string; titulo?: string; contenido?: string; title?: string; preview?: string; subject?: string; pinned?: boolean; date?: string; readTime?: string };

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NotaType>({ titulo: "", contenido: "", subject: "OOP", pinned: false });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = filter === "All Subjects"
    ? notes
    : notes.filter(n => n.subject === filter || (filter === "OOP" && n.subject === "Object-Oriented\nProgramming"));

  async function handleSave() {
    try {
      const success = await onSave(form, editingId || undefined);
      if (success) {
        setForm({ titulo: '', contenido: '', subject: 'OOP', pinned: false });
        setEditingId(null);
        setShowForm(false);
      }
    } catch (e) { console.error(e); }
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    await onDelete(id);
  }

  function startEdit(n: NotaType) {
    setEditingId(n.id || null);
    setForm({ titulo: n.titulo, contenido: n.contenido, subject: n.subject || "OOP", pinned: n.pinned || false });
    setShowForm(true);
  }

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-6">
      {/* Page header */}
      <section aria-label="Notebooks header" className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">My Notebooks</p>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Study Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {notes.length} notes across {SUBJECTS.length} subjects
          </p>
        </div>
        <button
          onClick={onStudy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 shrink-0"
          style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "#fff" }}
        >
          <Sparkles className="w-4 h-4" />
          Study Now
        </button>
      </section>

      {/* Search + filter row */}
      <section aria-label="Search and filter" className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search notes by title or content..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-card rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition shadow-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8 pr-8 py-2.5 text-sm bg-card rounded-xl border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition shadow-sm appearance-none cursor-pointer font-medium"
          >
            {SUBJECT_FILTERS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1 border border-border">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            aria-label="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Action bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Blank Note
        </button>
        <button
          onClick={onImport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-semibold hover:bg-muted active:scale-[0.98] transition-all shadow-sm"
        >
          <Upload className="w-4 h-4 text-muted-foreground" />
          Import File
        </button>
        <span className="ml-auto text-xs text-muted-foreground">
          Showing <strong className="text-foreground">{filtered.length}</strong> notes
        </span>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <input
            type="text"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
          />
          <select
            value={form.subject || "OOP"}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
          >
            {SUBJECT_FILTERS.filter(f => f !== "All Subjects").map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <textarea
            placeholder="Contenido"
            value={form.contenido}
            onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground h-28"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={form.pinned || false}
                onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
                className="w-4 h-4 text-primary rounded border-border focus:ring-primary/30 cursor-pointer"
              />
              <span className="text-xs font-semibold text-foreground">Pin Note to Top</span>
            </label>
            <div className="flex items-center gap-2">
              <button onClick={() => handleSave()} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold">Save</button>
              <button onClick={() => { setShowForm(false); setForm({ titulo: '', contenido: '', subject: 'OOP', pinned: false }); setEditingId(null); }} className="px-4 py-2 rounded-xl bg-card border text-xs font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Note cards grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onOpen={() => onOpenNote?.(note.id || "")}
              onEdit={() => startEdit(note)}
              onDelete={() => handleDelete(note.id)}
              onTogglePin={() => onSave({ ...note, pinned: !note.pinned }, note.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((note) => {
            const title = note.title || note.titulo || 'Untitled';
            const preview = note.preview || note.contenido || '';
            const subject = note.subject || "General";
            const badge = (SUBJECT_BADGE as any)[subject] || { bg: "#F3F4F6", text: "#111827" };
            const formattedDate = note.createdAt
              ? new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
              : note.date || "Just now";
            const wordCount = (note.contenido || "").trim().split(/\s+/).filter(Boolean).length;
            const calculatedReadTime = note.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
            return (
              <article
                key={note.id}
                className="group bg-card border border-border rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all flex items-center gap-5 cursor-pointer"
                onClick={() => onOpenNote?.(note.id || "")}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                      {subject}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{preview}</p>
                </div>
                <div className="shrink-0 flex items-center gap-4 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formattedDate}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{calculatedReadTime}</div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSave({ ...note, pinned: !note.pinned }, note.id);
                      }}
                      className={`p-1.5 rounded-lg hover:bg-muted transition ${note.pinned ? "text-primary animate-pulse" : "text-muted-foreground"}`}
                      title={note.pinned ? "Unpin Note" : "Pin Note"}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={note.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="17" x2="12" y2="22"></line>
                        <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.5A2 2 0 0 1 15 9.26V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4.26a2 2 0 0 1-.78 1.24l-2.78 3.5a2 2 0 0 0-.44 1.24z"></path>
                      </svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); startEdit(note); }} className="p-1.5 rounded-lg hover:bg-muted transition"><Edit3 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }} className="p-1.5 rounded-lg hover:bg-red-50 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function NotebooksPanel({ notes = [], onOpenNote }: { notes?: any[]; onOpenNote?: (id: string) => void }) {
  const displayNotes = notes;

  const totalNotes = displayNotes.length;
  const thisWeekNotes = displayNotes.filter((n) => {
    if (n.createdAt) {
      const diffTime = Math.abs(new Date().getTime() - new Date(n.createdAt).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    return false;
  }).length;

  const pinnedNotes = displayNotes.filter((n) => n.pinned || n.destacado);

  return (
    <aside aria-label="Notebooks panel" className="w-72 shrink-0 border-l border-border bg-card flex flex-col h-full overflow-y-auto">
      {/* Quick stats */}
      <section aria-label="Note stats" className="px-5 py-5 border-b border-border space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Overview</h3>
        {[
          { label: "Total Notes", value: totalNotes, color: "#2563EB", bg: "#EFF6FF" },
          { label: "This Week", value: thisWeekNotes, color: "#10B981", bg: "#ECFDF5" },
          { label: "Pinned", value: pinnedNotes.length, color: "#8B5CF6", bg: "#F5F3FF" },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: s.bg }}>
            <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
            <span className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </section>

      {/* Notes by subject */}
      <section aria-label="Notes by subject" className="px-5 py-5 border-b border-border flex-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">By Subject</h3>
        <ul className="space-y-2">
          {SUBJECTS.map((s) => {
            const count = displayNotes.filter((n) => {
              const sub = n.subject || "General";
              return sub === s.name.replace("\n", " ").split(" ")[0] || s.name.includes(sub) || sub === s.name.replace("\n", " ");
            }).length;
            return (
              <li key={s.id}>
                <button className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition group">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    {s.icon}
                  </div>
                  <span className="flex-1 text-left text-xs font-medium text-foreground truncate leading-tight">
                    {s.name.replace("\n", " ")}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full group-hover:bg-border">
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Pinned notes */}
      <section aria-label="Pinned notes" className="px-5 py-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Pinned</h3>
        <ul className="space-y-2">
          {pinnedNotes.map((n) => {
            const subject = n.subject || "OOP";
            const badge = (SUBJECT_BADGE as any)[subject] || { bg: "#F3F4F6", text: "#111827" };
            return (
              <li key={n.id}>
                <button
                  onClick={() => onOpenNote?.(n.id)}
                  className="w-full text-left p-3 rounded-xl border border-border hover:bg-muted/50 transition group"
                >
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                    {subject}
                  </span>
                  <p className="text-xs font-semibold text-foreground mt-1.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {n.title || n.titulo || "Untitled"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : n.date || "Just now"}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}

// ─────────────────────────────────────────────
// Study Notebooks Data
// ─────────────────────────────────────────────

const LINKED_NOTES = [
  {
    id: 1,
    title: "Inheritance & Polymorphism in Java",
    preview: "Polymorphism allows objects of different classes to be treated as objects of a common superclass. Method overriding enables runtime polymorphism through dynamic dispatch.",
    tags: ["OOP", "Java", "Core"],
    date: "Jun 20, 2026",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Design Patterns — Singleton & Factory",
    preview: "The Singleton pattern ensures a class has only one instance. The Factory pattern delegates object creation to subclasses, promoting loose coupling and extensibility.",
    tags: ["OOP", "Patterns"],
    date: "Jun 18, 2026",
    readTime: "6 min",
  },
  {
    id: 3,
    title: "SOLID Principles — Complete Guide",
    preview: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Five principles that make software designs more maintainable.",
    tags: ["OOP", "Architecture"],
    date: "Jun 17, 2026",
    readTime: "8 min",
  },
  {
    id: 4,
    title: "Encapsulation & Abstraction",
    preview: "Encapsulation hides the internal state of an object and requires all interaction to be performed through an object's methods. Abstraction simplifies complex reality.",
    tags: ["OOP", "Core"],
    date: "Jun 15, 2026",
    readTime: "4 min",
  },
  {
    id: 5,
    title: "UML Class Diagrams — Notation",
    preview: "Class diagrams show the static structure of a system. They represent classes, attributes, operations, and the relationships between objects using standardized notation.",
    tags: ["OOP", "UML", "Diagrams"],
    date: "Jun 14, 2026",
    readTime: "7 min",
  },
  {
    id: 6,
    title: "Interfaces vs Abstract Classes",
    preview: "Interfaces define a contract without implementation. Abstract classes can have both abstract and concrete methods. Java 8+ allows default methods in interfaces.",
    tags: ["OOP", "Java"],
    date: "Jun 13, 2026",
    readTime: "5 min",
  },
];

const AI_SUMMARY_POINTS = [
  { id: 1, text: "OOP is built on four pillars: Encapsulation, Abstraction, Inheritance, and Polymorphism — each addressing a different dimension of code organization." },
  { id: 2, text: "Inheritance enables code reuse by allowing a child class to acquire properties and behaviors of a parent class, forming an IS-A relationship." },
  { id: 3, text: "Polymorphism (runtime & compile-time) allows one interface to be used for a general class of actions, resolved at runtime via dynamic dispatch." },
  { id: 4, text: "SOLID principles ensure that class designs remain maintainable and scalable, reducing the cost of changes in large codebases." },
  { id: 5, text: "Design patterns (Singleton, Factory, Observer) are reusable solutions to commonly occurring problems in software design." },
  { id: 6, text: "UML class diagrams model relationships (association, aggregation, composition, dependency) between classes using standardized notation." },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which OOP principle states that a class should have only one reason to change?",
    options: [
      { label: "A", text: "Open/Closed Principle" },
      { label: "B", text: "Single Responsibility Principle" },
      { label: "C", text: "Liskov Substitution Principle" },
    ],
    correct: "B",
  },
  {
    id: 2,
    question: "What type of polymorphism is achieved through method overriding in Java?",
    options: [
      { label: "A", text: "Compile-time polymorphism" },
      { label: "B", text: "Parametric polymorphism" },
      { label: "C", text: "Runtime polymorphism" },
    ],
    correct: "C",
  },
  {
    id: 3,
    question: "Which design pattern ensures a class has only one instance globally?",
    options: [
      { label: "A", text: "Singleton Pattern" },
      { label: "B", text: "Factory Pattern" },
      { label: "C", text: "Observer Pattern" },
    ],
    correct: "A",
  },
];

const handleStudyMode = () => { /* wired via prop in App */ };
const handleSendMessage = (_msg: string) => { };
const handleConfirmLink = (_ids: number[]) => { };

// ─────────────────────────────────────────────
// Link Notes Modal Data
// ─────────────────────────────────────────────

const LINKABLE_NOTES = [
  {
    id: 10,
    title: "Clase 1: Introducción a Clases y Objetos",
    preview: "Una clase es una plantilla para crear objetos. Define atributos y métodos que los objetos del mismo tipo compartirán. Un objeto es una instancia de una clase.",
    tag: "OOP",
    tagStyle: { bg: "#EFF6FF", text: "#1D4ED8" },
  },
  {
    id: 11,
    title: "Apuntes: Polimorfismo en Java",
    preview: "El polimorfismo permite que una referencia de tipo padre apunte a un objeto de tipo hijo. Se logra mediante la sobreescritura de métodos (method overriding).",
    tag: "Java",
    tagStyle: { bg: "#ECFDF5", text: "#065F46" },
  },
  {
    id: 12,
    title: "Resumen: Principio de Responsabilidad Única",
    preview: "El SRP establece que una clase debe tener una sola razón para cambiar. Esto mejora la cohesión y facilita el mantenimiento y las pruebas unitarias del sistema.",
    tag: "SOLID",
    tagStyle: { bg: "#F5F3FF", text: "#5B21B6" },
  },
  {
    id: 13,
    title: "Laboratorio: Implementación del Patrón Observer",
    preview: "El patrón Observer define una dependencia uno-a-muchos entre objetos. Cuando un objeto cambia de estado, todos sus dependientes son notificados automáticamente.",
    tag: "Patterns",
    tagStyle: { bg: "#FEF3C7", text: "#92400E" },
  },
  {
    id: 14,
    title: "Clase 5: Herencia Múltiple e Interfaces",
    preview: "Java no soporta herencia múltiple de clases, pero sí de interfaces. Una clase puede implementar múltiples interfaces, lo que permite flexibilidad de diseño sin ambigüedad.",
    tag: "OOP",
    tagStyle: { bg: "#EFF6FF", text: "#1D4ED8" },
  },
  {
    id: 15,
    title: "Ejercicios Resueltos: Abstracción y Encapsulamiento",
    preview: "La abstracción oculta detalles de implementación. El encapsulamiento protege el estado interno usando modificadores de acceso: private, protected y public.",
    tag: "Core",
    tagStyle: { bg: "#F0FDF4", text: "#14532D" },
  },
];

// ─────────────────────────────────────────────
// Link Notes Modal
// ─────────────────────────────────────────────

function LinkNotesModal({
  activeCuaderno,
  notes = [],
  onSaveCuaderno,
  onClose,
}: {
  activeCuaderno: any;
  notes: any[];
  onSaveCuaderno: (cuaderno: any, id?: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  // Start with a set of currently linked notes
  const [selected, setSelected] = useState<Set<string>>(new Set(activeCuaderno.noteIds || []));

  // Filter notes that are available to be linked
  // E.g., we show all notes in the database (or optionally we can filter by the notebook's subject, but let's show all notes in the database so they can link whatever notes they want! It's much more flexible. But let's highlight or sort by subject matching to make it look premium).
  const filtered = search
    ? notes.filter(
        (n) =>
          (n.title || n.titulo || "").toLowerCase().includes(search.toLowerCase()) ||
          (n.subject || "").toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleLink = async () => {
    const updatedNoteIds = Array.from(selected);
    const success = await onSaveCuaderno({ ...activeCuaderno, noteIds: updatedNoteIds }, activeCuaderno.id);
    if (success) {
      toast.success("Notes linked successfully!");
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Link notes to notebook"
    >
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-lg mx-4 flex flex-col overflow-hidden" style={{ maxHeight: "85vh" }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Link Notes to Notebook</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {selected.size} note{selected.size !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Search ── */}
        <div className="px-6 py-3 border-b border-border shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search notes by title or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              autoFocus
            />
          </div>
        </div>

        {/* ── Note list ── */}
        <ul className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {filtered.length === 0 && (
            <li className="py-10 text-center text-sm text-muted-foreground">
              No notes match your search.
            </li>
          )}
          {filtered.map((note) => {
            const isSelected = selected.has(note.id);
            const badge = SUBJECT_BADGE[note.subject as SubjectKey] || { bg: "#F3F4F6", text: "#111827" };
            return (
              <li key={note.id}>
                <button
                  onClick={() => toggle(note.id)}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-150 ${isSelected
                    ? "bg-primary/5 border-primary/30 shadow-sm"
                    : "bg-background border-border hover:bg-muted/60 hover:border-border"
                    }`}
                >
                  {/* Checkbox */}
                  <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-primary border-primary" : "border-border bg-card"
                    }`}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-xs font-bold leading-snug transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {note.title || note.titulo || "Untitled"}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {note.preview || note.contenido || ""}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {note.subject || "General"}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <p className="text-[10px] text-muted-foreground">
            {filtered.length} note{filtered.length !== 1 ? "s" : ""} available
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              Cancel
            </button>
            <button
              onClick={handleLink}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Link2 className="w-4 h-4" />
              Save Link Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Study Notebooks — Middle Column
// ─────────────────────────────────────────────

function LinkedNoteCard({ note, onOpen, onUnlink }: { note: any; onOpen?: () => void; onUnlink?: () => void }) {
  const title = note.title || note.titulo || "Untitled";
  const preview = note.preview || note.contenido || "";
  const tags = note.tags || (note.subject ? [note.subject] : ["OOP"]);

  const formattedDate = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : note.date || "Just now";

  const wordCount = (note.contenido || "").trim().split(/\s+/).filter(Boolean).length;
  const calculatedReadTime = note.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return (
    <article
      className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col gap-3 cursor-pointer relative"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors flex-1">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          {onUnlink && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnlink();
              }}
              className="p-1 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition opacity-0 group-hover:opacity-100"
              title="Unlink note"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <BookMarked className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {preview}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        {tags.map((tag: string) => (
          <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3 shrink-0" />
          <time>{formattedDate}</time>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3 shrink-0" />
          {calculatedReadTime}
        </div>
      </div>
    </article>
  );
}

function StudyNotebooksMain({
  notes = [],
  cuadernos = [],
  selectedCuadernoId,
  setSelectedCuadernoId,
  onSaveCuaderno,
  onDeleteCuaderno,
  onStudy,
  onOpenNote,
}: {
  notes?: any[];
  cuadernos?: any[];
  selectedCuadernoId: string | null;
  setSelectedCuadernoId: (id: string | null) => void;
  onSaveCuaderno: (cuaderno: any, id?: string) => Promise<boolean>;
  onDeleteCuaderno: (id: string) => Promise<boolean>;
  onStudy?: () => void;
  onOpenNote?: (id: string) => void;
}) {
  const [noteSearch, setNoteSearch] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [cuadernoForm, setCuadernoForm] = useState({ titulo: "", descripcion: "", materia: "OOP" });

  const activeCuaderno = cuadernos.find((c) => c.id === selectedCuadernoId);

  // If no notebook is active, display the list/grid of all notebooks
  if (!activeCuaderno) {
    const handleCreateSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!cuadernoForm.titulo.trim()) {
        toast.error("Please enter a title");
        return;
      }
      const success = await onSaveCuaderno(cuadernoForm);
      if (success) {
        toast.success("Study Notebook created successfully!");
        setCuadernoForm({ titulo: "", descripcion: "", materia: "OOP" });
        setShowCreateForm(false);
      }
    };

    return (
      <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-6">
        <section aria-label="Notebooks header" className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Study Notebooks</p>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">My Study Notebooks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {cuadernos.length} notebooks registered in database
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "#fff" }}
          >
            <Plus className="w-4 h-4" />
            Create Notebook
          </button>
        </section>

        {showCreateForm && (
          <form onSubmit={handleCreateSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm max-w-xl transition-all duration-150 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-sm font-bold text-foreground">New Study Notebook</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Programación Orientada a Objetos"
                  value={cuadernoForm.titulo}
                  onChange={(e) => setCuadernoForm((f) => ({ ...f, titulo: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Subject / Materia</label>
                  <select
                    value={cuadernoForm.materia}
                    onChange={(e) => setCuadernoForm((f) => ({ ...f, materia: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {SUBJECT_FILTERS.filter((f) => f !== "All Subjects").map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Description</label>
                <textarea
                  placeholder="What is this study notebook about?"
                  value={cuadernoForm.descripcion}
                  onChange={(e) => setCuadernoForm((f) => ({ ...f, descripcion: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow hover:bg-primary/95 transition">Create</button>
              <button type="button" onClick={() => { setShowCreateForm(false); setCuadernoForm({ titulo: "", descripcion: "", materia: "OOP" }); }} className="px-5 py-2 rounded-xl bg-card border text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition">Cancel</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cuadernos.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-card border border-dashed border-border rounded-2xl space-y-3">
              <BookOpen className="w-10 h-10 text-muted-foreground/60 mx-auto" />
              <p className="text-sm font-semibold text-muted-foreground">No study notebooks registered in database</p>
              <p className="text-xs text-muted-foreground/80">Create your first study notebook to get started!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
              >
                Create First Notebook
              </button>
            </div>
          ) : (
            cuadernos.map((c) => {
              const badge = SUBJECT_BADGE[c.materia as SubjectKey] || { bg: "#F3F4F6", text: "#111827" };
              const noteCount = c.noteIds?.length || 0;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCuadernoId(c.id)}
                  className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[160px] relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                        {c.materia}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this study notebook?")) {
                            onDeleteCuaderno(c.id);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title="Delete Notebook"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-base font-extrabold text-foreground leading-snug group-hover:text-primary transition-colors">{c.titulo}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.descripcion || "No description provided."}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-3 text-[10px] text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-primary" />
                      {noteCount} note{noteCount !== 1 ? "s" : ""} linked
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/75 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    );
  }

  // Active notebook details view
  const linkedNotes = notes.filter((n) => activeCuaderno.noteIds?.includes(n.id));
  const filtered = noteSearch
    ? linkedNotes.filter(
        (n) =>
          (n.title || n.titulo || "").toLowerCase().includes(noteSearch.toLowerCase()) ||
          (n.contenido || n.preview || "").toLowerCase().includes(noteSearch.toLowerCase())
      )
    : linkedNotes;

  const handleUnlink = async (noteId: string) => {
    const updatedNoteIds = activeCuaderno.noteIds.filter((id: string) => id !== noteId);
    await onSaveCuaderno({ ...activeCuaderno, noteIds: updatedNoteIds }, activeCuaderno.id);
    toast.info("Note unlinked from study notebook.");
  };

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-6">
      {/* Header */}
      <section aria-label="Notebook header" className="space-y-2">
        <button
          onClick={() => setSelectedCuadernoId(null)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to all notebooks
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                Study Notebook
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: (SUBJECT_BADGE[activeCuaderno.materia as SubjectKey] || { bg: "#F3F4F6", text: "#111827" }).bg,
                  color: (SUBJECT_BADGE[activeCuaderno.materia as SubjectKey] || { bg: "#F3F4F6", text: "#111827" }).text,
                }}
              >
                {activeCuaderno.materia}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {activeCuaderno.titulo}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {activeCuaderno.descripcion || "No description provided."}
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {linkedNotes.length} linked notes · Created on {new Date(activeCuaderno.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* Study CTA */}
          <button
            onClick={onStudy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "#fff" }}
          >
            <Sparkles className="w-4 h-4" />
            Study Now
          </button>
        </div>
      </section>

      {/* Toolbar */}
      <section aria-label="Workspace toolbar" className="flex items-center gap-3">
        <button
          onClick={() => setShowLinkModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-semibold text-foreground hover:bg-muted shadow-sm active:scale-[0.98] transition-all"
        >
          <Link2 className="w-4 h-4 text-primary" />
          Link Existing Notes
        </button>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search linked notes..."
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-card rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition shadow-sm"
          />
        </div>
        <span className="ml-auto text-xs text-muted-foreground shrink-0 font-medium">
          {filtered.length} of {linkedNotes.length} notes
        </span>
      </section>

      {/* Linked note cards grid */}
      <section aria-label="Linked notes">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-card border border-dashed border-border rounded-2xl space-y-3">
            <BookMarked className="w-10 h-10 text-muted-foreground/60 mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">No notes linked to this study notebook yet</p>
            <p className="text-xs text-muted-foreground/80">Link existing notes to start summarizing and generating smart quizzes!</p>
            <button
              onClick={() => setShowLinkModal(true)}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              Link Notes Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((note) => (
              <LinkedNoteCard
                key={note.id}
                note={note}
                onOpen={() => onOpenNote?.(note.id)}
                onUnlink={() => handleUnlink(note.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Link Notes Modal */}
      {showLinkModal && (
        <LinkNotesModal
          activeCuaderno={activeCuaderno}
          notes={notes}
          onSaveCuaderno={onSaveCuaderno}
          onClose={() => setShowLinkModal(false)}
        />
      )}
    </main>
  );
}

// ─────────────────────────────────────────────
// Study Notebooks — Right AI Panel
// ─────────────────────────────────────────────

function StudyNotebooksPanel({
  onQuizSubmit,
  selectedCuaderno,
  notes = [],
}: {
  onQuizSubmit?: () => void;
  selectedCuaderno?: any;
  notes?: any[];
}) {
  const [activeTab, setActiveTab] = useState<"summary" | "quiz">("summary");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [chatMsg, setChatMsg] = useState("");
  const [quizIdx, setQuizIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // If no notebook is active
  if (!selectedCuaderno) {
    return (
      <aside aria-label="AI Study Panel" className="w-80 shrink-0 border-l border-border bg-card flex flex-col h-full items-center justify-center p-6 text-center space-y-3">
        <Brain className="w-12 h-12 text-primary/40 animate-pulse" />
        <h3 className="text-sm font-bold text-foreground">AI Study Assistant</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Select a study notebook from the dashboard to start summarizing and generating smart quizzes.
        </p>
      </aside>
    );
  }

  const linkedNotes = notes.filter((n) => selectedCuaderno.noteIds?.includes(n.id));

  // Generate dynamic summary points from linked notes
  const dynamicSummaryPoints = linkedNotes.map((note, index) => {
    const title = note.title || note.titulo || "Untitled Note";
    const content = note.contenido || note.preview || "";
    const shortDesc = content.length > 90 ? content.substring(0, 90) + "..." : content;
    return {
      id: note.id || index,
      text: `${title}: ${shortDesc || "No content provided yet."}`
    };
  });

  // Collect key concepts from notes
  const keyConcepts = Array.from(new Set(
    linkedNotes.map(n => n.subject || "General")
  )).filter(Boolean);
  const displayConcepts = keyConcepts.length > 0 ? keyConcepts : [selectedCuaderno.materia || "Study Guide"];

  // Generate dynamic quiz questions based on the linked notes
  const dynamicQuizQuestions = linkedNotes.map((note, i) => {
    const title = note.title || note.titulo || "Untitled Note";
    const content = note.contenido || note.preview || "";
    return {
      id: `q-${note.id || i}`,
      question: `What is the core focus of the linked note "${title}"?`,
      options: [
        { label: "A", text: content.length > 70 ? content.substring(0, 70) + "..." : content || "The main content of the note" },
        { label: "B", text: "An alternative concept with different parameters." },
        { label: "C", text: "A general miscellaneous programming theory." },
        { label: "D", text: "None of the above options." }
      ],
      correct: "A"
    };
  });

  const finalQuizQuestions = dynamicQuizQuestions.length > 0 ? dynamicQuizQuestions : [
    {
      id: "q-default",
      question: "No notes linked yet. Please link some notes to generate custom quiz questions.",
      options: [
        { label: "A", text: "Link notes now to get started." },
        { label: "B", text: "Study with mock data instead." },
      ],
      correct: "A"
    }
  ];

  const currentQ = finalQuizQuestions[quizIdx] || finalQuizQuestions[0];
  const answered = selected[currentQ.id];
  const isCorrect = answered === currentQ.correct;

  const handleAnswer = (label: string) => {
    if (!answered) setSelected((prev) => ({ ...prev, [currentQ.id]: label }));
  };

  const handleNext = () => setQuizIdx((i) => Math.min(i + 1, finalQuizQuestions.length - 1));
  const handlePrev = () => setQuizIdx((i) => Math.max(i - 0, 0));

  const allAnswered = finalQuizQuestions.every(q => selected[q.id]);

  const handleSubmitQuiz = async () => {
    let correctCount = 0;
    finalQuizQuestions.forEach(q => {
      if (selected[q.id] === q.correct) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / finalQuizQuestions.length) * 100);

    setSubmitting(true);
    try {
      const quizResult = {
        subject: `${selectedCuaderno.titulo} — Quiz`,
        score: finalScore,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: finalScore >= 70 ? "success" : "warning",
        badge: finalScore >= 90 ? "Excellent" : finalScore >= 80 ? "Great" : finalScore >= 70 ? "Good" : "Needs Work",
        goalMet: finalScore >= 70
      };

      const res = await fetch('/api/dashboard/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizResult),
      });

      if (!res.ok) throw new Error('Quiz submit failed');

      toast.success(`Quiz submitted! Score: ${finalScore}%`);

      // Reset quiz local state
      setSelected({});
      setQuizIdx(0);

      if (onQuizSubmit) {
        onQuizSubmit();
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to submit quiz results.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = (msg: string) => {
    toast.info(`Ask AI helper: "${msg}" (Feature coming soon!)`);
  };

  return (
    <aside
      aria-label="AI Study Panel"
      className="w-80 shrink-0 border-l border-border bg-card flex flex-col h-full"
    >
      {/* Tabs */}
      <div className="flex shrink-0 border-b border-border">
        {(["summary", "quiz"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold transition-all ${activeTab === tab
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
          >
            {tab === "summary"
              ? <><Brain className="w-3.5 h-3.5" /> AI Summary</>
              : <><CircleDot className="w-3.5 h-3.5" /> Smart Quiz</>
            }
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "summary" ? (
          <section aria-label="AI Summary" className="px-5 py-5 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/15">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <p className="text-[11px] font-semibold text-foreground">
                AI summary of your {linkedNotes.length} linked notes
              </p>
            </div>

            {linkedNotes.length === 0 ? (
              <p className="text-xs text-muted-foreground leading-relaxed italic text-center py-6">
                No notes linked to this study notebook. Link notes to see an automated summary of key topics.
              </p>
            ) : (
              <ul className="space-y-3">
                {dynamicSummaryPoints.map((point) => (
                  <li key={point.id} className="flex gap-3 group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                      {point.text}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* Key concepts chips */}
            <div className="pt-2 border-t border-border">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Key Concepts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {displayConcepts.map((kw) => (
                  <span key={kw} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition cursor-pointer">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Insight card */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <p className="text-[10px] font-bold text-amber-800">Study Tip</p>
              </div>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                Connect the dots between the concepts mentioned in these notes. Active recall through the Smart Quiz tab will help solidify your understanding.
              </p>
            </div>
          </section>
        ) : (
          <section aria-label="Smart Quiz" className="px-5 py-5 space-y-4 animate-in fade-in">
            {/* Progress */}
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Question {quizIdx + 1} of {finalQuizQuestions.length}
              </p>
              <div className="flex gap-1">
                {finalQuizQuestions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-1.5 rounded-full transition-colors ${i === quizIdx ? "bg-primary" : selected[finalQuizQuestions[i].id] ? "bg-accent" : "bg-muted"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Question card */}
            <div className="bg-background border border-border rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-foreground leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt) => {
                const isSelected = answered === opt.label;
                const isRight = opt.label === currentQ.correct;
                let style = "bg-card border-border text-foreground hover:bg-muted hover:border-primary/40";
                if (answered) {
                  if (isRight) style = "bg-emerald-50 border-emerald-300 text-emerald-800";
                  else if (isSelected) style = "bg-red-50 border-red-300 text-red-700";
                  else style = "bg-card border-border text-muted-foreground opacity-60";
                }
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.label)}
                    disabled={!!answered}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all ${style}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${answered && isRight ? "bg-accent text-white border-accent"
                      : answered && isSelected && !isRight ? "bg-red-400 text-white border-red-400"
                        : "bg-muted border-border text-muted-foreground"
                      }`}>
                      {opt.label}
                    </span>
                    {opt.text}
                    {answered && isRight && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-accent" />}
                    {answered && isSelected && !isRight && <X className="w-3.5 h-3.5 ml-auto text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Result feedback */}
            {answered && (
              <div className={`p-3 rounded-xl text-[11px] font-semibold ${isCorrect ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
                {isCorrect ? "✓ Correct! Great work." : `✗ The correct answer is ${currentQ.correct}.`}
              </div>
            )}

            {/* Submit button when all questions are answered */}
            {allAnswered && linkedNotes.length > 0 && (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="w-full mt-2 py-2.5 rounded-xl bg-accent text-white text-xs font-bold shadow-md hover:bg-accent/90 disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Quiz Results"}
              </button>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handlePrev}
                disabled={quizIdx === 0}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:bg-muted disabled:opacity-30 transition"
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                disabled={quizIdx === finalQuizQuestions.length - 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-30 transition"
              >
                Next →
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Chat input */}
      <div className="shrink-0 border-t border-border px-4 py-4">
        <div className="flex items-center gap-2 p-2 pl-3 rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/30 transition">
          <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Ask anything about your notes..."
            value={chatMsg}
            onChange={(e) => setChatMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && chatMsg.trim()) {
                handleSendMessage(chatMsg);
                setChatMsg("");
              }
            }}
            className="flex-1 text-xs text-foreground bg-transparent placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={() => { if (chatMsg.trim()) { handleSendMessage(chatMsg); setChatMsg(""); } }}
            className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition shrink-0"
            aria-label="Send message"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// Create New Note — Middle Panel
// ─────────────────────────────────────────────

const TOOLBAR_GROUPS = [
  [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
  ],
  [
    { icon: AlignLeft, label: "Align left" },
    { icon: List, label: "Bullet list" },
    { icon: ListOrdered, label: "Ordered list" },
    { icon: Quote, label: "Blockquote" },
  ],
  [
    { icon: Type, label: "Heading" },
  ],
];


function CreateNoteMain({ onSave }: { onSave: (note: { titulo: string; contenido: string; subject: string }) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("OOP");
  const [isDragging, setIsDragging] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const charCount = body.length;

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setShowImport(true);
  };

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-background">

      {/* ── Editor top bar ── */}
      <div className="flex items-center justify-between px-8 py-3.5 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Create New Note</p>
          <span className="text-border">·</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="text-xs font-semibold text-muted-foreground bg-muted border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:text-foreground transition appearance-none cursor-pointer"
          >
            {SUBJECT_FILTERS.filter(f => f !== "All Subjects").map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            if (!title.trim()) {
              toast.error("Please enter a title for the note.");
              return;
            }
            onSave({ titulo: title, contenido: body, subject: subject });
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          <Save className="w-4 h-4" />
          Save Note
        </button>
      </div>

      {/* ── Formatting toolbar ── */}
      <div className="flex items-center gap-1 px-8 py-2 bg-card border-b border-border shrink-0">
        {TOOLBAR_GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <div className="w-px h-4 bg-border mx-1.5" />}
            {group.map(({ icon: Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* ── Editor body ── */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">

        {/* Title input */}
        <input
          type="text"
          placeholder="Enter Note Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-extrabold text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 tracking-tight leading-tight"
        />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Content</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Body textarea */}
        <textarea
          placeholder="Start writing or paste your study content here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full min-h-[220px] text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 resize-none leading-7"
        />

        {/* Upload text content box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => setShowImport(true)}
          className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/40 hover:bg-muted/40"
            }`}
        >
          <div className={`p-2.5 rounded-xl transition-colors ${isDragging ? "bg-primary/15" : "bg-muted"}`}>
            <Upload className={`w-5 h-5 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Upload text content</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Drag &amp; drop or click — supports .txt, .pdf, .docx, .md
            </p>
          </div>
          <span className="text-xs font-semibold text-primary shrink-0">Browse</span>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="shrink-0 flex items-center justify-between px-8 py-2.5 border-t border-border bg-card">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span><strong className="text-foreground">{wordCount}</strong> words</span>
          <span><strong className="text-foreground">{charCount}</strong> characters</span>
          {subject.trim() && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-semibold">
              {subject}
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {title.trim() ? "Draft — unsaved" : "Add a title to get started"}
        </span>
      </div>

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </main>
  );
}

// ─────────────────────────────────────────────
// Settings Screen
// ─────────────────────────────────────────────

const SUBJECT_DEFAULTS = [
  "None", "OOP", "Databases", "Calculus", "Data Structures", "Linear Algebra", "Discrete Math",
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex w-10 h-5.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${on ? "bg-primary" : "bg-muted"}`}
      style={{ height: "22px", width: "40px" }}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-[18px]" : "translate-x-0"}`}
      />
    </button>
  );
}

function SettingsMain() {
  const [name, setName] = useState("Raúl Andrade");
  const [email, setEmail] = useState("r.andrade@ufrontera.cl");
  const [institution, setInstitution] = useState("Universidad de La Frontera");
  const [apiKey, setApiKey] = useState("AIzaSy••••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);
  const [emailRemind, setEmailRemind] = useState(true);
  const [defaultSubj, setDefaultSubj] = useState("OOP");

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8">
      {/* Header */}
      <section className="mb-8">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Account</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Settings & Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account info and AI preferences.</p>
      </section>

      <div className="grid grid-cols-5 gap-6 items-start">

        {/* ── Left: Profile Card ── */}
        <section aria-label="User profile" className="col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-foreground">Profile</h2>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-md">
                <span className="text-2xl font-extrabold text-white">RA</span>
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-card border border-border rounded-full shadow hover:bg-muted transition">
                <Camera className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            <button className="text-xs font-semibold text-muted-foreground border border-border rounded-xl px-3 py-1.5 hover:bg-muted transition">
              Update Profile Photo
            </button>
          </div>

          <div className="h-px bg-border" />

          {/* Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                <User className="w-3 h-3" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                <Mail className="w-3 h-3" /> University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                <Building className="w-3 h-3" /> Academic Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all">
            Save Changes
          </button>
        </section>

        {/* ── Right: Config Card ── */}
        <section aria-label="App configurations" className="col-span-3 space-y-4">

          {/* Section A: API Key */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <KeyRound className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">AI API Key Preference</h2>
                <p className="text-[11px] text-muted-foreground">Connect your personal Gemini API key</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 text-sm bg-muted border border-border rounded-xl text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Your key is stored locally and never shared. Get one at{" "}
                <span className="text-primary font-semibold">aistudio.google.com</span>
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-accent/10 dark:border-accent/20">
              <Shield className="w-4 h-4 text-accent shrink-0" />
              <p className="text-[11px] font-semibold text-emerald-800 dark:text-accent">
                API key saved and active — AI features are enabled.
              </p>
            </div>
          </div>

          {/* Section B: Preferences */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-foreground">Preferences</h2>

            {/* Toggle rows */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Email Quiz Reminders</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Receive daily study reminder emails</p>
                </div>
                <Toggle on={emailRemind} onToggle={() => setEmailRemind(!emailRemind)} />
              </div>

              {/* Default subject dropdown */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Default Notes Subject</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Pre-select subject when creating a note</p>
                </div>
                <div className="relative">
                  <select
                    value={defaultSubj}
                    onChange={(e) => setDefaultSubj(e.target.value)}
                    className="pl-3 pr-7 py-2 text-sm bg-muted border border-border rounded-xl text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer font-medium transition"
                  >
                    {SUBJECT_DEFAULTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all">
              Save Preferences
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// Study Hub Data
// ─────────────────────────────────────────────

const STUDY_MODES = [
  {
    id: "quiz",
    title: "Smart Quiz",
    description: "Multiple-choice questions with AI tracking and instant feedback on each answer.",
    icon: ClipboardList,
    gradient: "from-blue-500/15 to-blue-600/5",
    borderActive: "#2563EB",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    accent: "#2563EB",
    tag: "AI-Generated",
  },
  {
    id: "deep",
    title: "Deep Development",
    description: "Open-ended conceptual and coding questions requiring manual written answers.",
    icon: PenLine,
    gradient: "from-violet-500/15 to-violet-600/5",
    borderActive: "#7C3AED",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    accent: "#7C3AED",
    tag: "Critical Thinking",
  },
  {
    id: "flashcard",
    title: "Flashcard Memorize",
    description: "Interactive active recall flashcards. Flip to reveal definitions and concepts.",
    icon: Layers,
    gradient: "from-emerald-500/15 to-emerald-600/5",
    borderActive: "#10B981",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accent: "#10B981",
    tag: "Memory Boost",
  },
  {
    id: "truefalse",
    title: "True / False Blitz",
    description: "Rapid-fire true or false statements generated from your notes to test agility.",
    icon: Zap,
    gradient: "from-amber-500/15 to-amber-600/5",
    borderActive: "#F59E0B",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    accent: "#F59E0B",
    tag: "Speed Round",
  },
];

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const QUESTION_COUNTS = [5, 10, 15, 20];
const TIME_OPTIONS = ["No limit", "5 min", "10 min", "20 min"];

const handleLaunchSession = () => { };

// ─────────────────────────────────────────────
// Study Hub — Right Config Panel
// ─────────────────────────────────────────────

function StudyHubPanel({
  selectedMode,
  difficulty, setDifficulty,
  qCount, setQCount,
  timeLimit, setTimeLimit,
  onLaunch,
}: {
  selectedMode: typeof STUDY_MODES[number] | undefined;
  difficulty: string; setDifficulty: (v: string) => void;
  qCount: number; setQCount: (v: number) => void;
  timeLimit: string; setTimeLimit: (v: string) => void;
  onLaunch: () => void;
}) {
  return (
    <aside
      aria-label="Session configuration"
      className="w-72 shrink-0 border-l border-border bg-card flex flex-col h-full overflow-y-auto"
    >
      <div className="px-5 py-5 border-b border-border">
        <h2 className="text-sm font-bold text-foreground">Session Config</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Customize your study session</p>
      </div>

      <div className="flex-1 px-5 py-5 space-y-6">

        {/* Selected mode preview */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Selected Mode</p>
          {selectedMode ? (
            <div
              className="flex items-center gap-3 p-3 rounded-xl border-2"
              style={{ borderColor: selectedMode.borderActive, background: `${selectedMode.borderActive}10` }}
            >
              <div className={`p-2 rounded-lg ${selectedMode.iconBg}`}>
                <selectedMode.icon className={`w-4 h-4 ${selectedMode.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{selectedMode.title}</p>
                <p className="text-[10px] text-muted-foreground">{selectedMode.tag}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-dashed border-border text-center">
              <p className="text-xs text-muted-foreground">No mode selected yet</p>
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Gauge className="w-3 h-3" /> Difficulty
          </p>
          <div className="flex gap-2">
            {DIFFICULTY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${difficulty === d
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Questions count */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <ClipboardList className="w-3 h-3" /> Questions
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setQCount(n)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${qCount === n
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Time limit */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Timer className="w-3 h-3" /> Time Limit
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTimeLimit(t)}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${timeLimit === t
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <BookOpenCheck className="w-3 h-3" /> Content Scope
          </p>
          <div className="space-y-1.5">
            {["All linked notes", "Pinned notes only", "By topic tag"].map((opt) => (
              <label key={opt} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted cursor-pointer group">
                <div className="w-4 h-4 rounded-full border-2 border-border group-hover:border-primary transition flex items-center justify-center shrink-0">
                  {opt === "All linked notes" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-xs font-medium text-foreground">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Session summary */}
        <div className="p-3 rounded-xl bg-muted border border-border space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Session Preview</p>
          <div className="space-y-1">
            {[
              ["Mode", selectedMode?.title ?? "—"],
              ["Difficulty", difficulty],
              ["Questions", `${qCount} items`],
              ["Time", timeLimit],
              ["Scope", "All linked notes"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-semibold text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Launch button */}
      <div className="px-5 py-4 border-t border-border shrink-0">
        <button
          onClick={onLaunch}
          disabled={!selectedMode}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{ background: selectedMode ? "linear-gradient(135deg, #2563EB, #7C3AED)" : undefined, color: selectedMode ? "#fff" : undefined }}
        >
          <Rocket className="w-4 h-4" />
          Launch Session
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────
// Study Hub — Middle Panel
// ─────────────────────────────────────────────

function StudyHubMain({
  selectedMode, setSelectedMode,
  onLaunch,
}: {
  selectedMode: string;
  setSelectedMode: (id: string) => void;
  onLaunch: () => void;
}) {
  const selected = STUDY_MODES.find((m) => m.id === selectedMode);

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8 space-y-8">

      {/* Header */}
      <section aria-label="Study Hub header">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Study Hub</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Select Your Study Mode</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <BookOpenCheck className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-primary">Active Content:</span>
            <span className="text-xs font-bold text-foreground">Programación Orientada a Objetos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border">
            <FileText className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">6 notes linked</span>
          </div>
        </div>
      </section>

      {/* Mode selection grid */}
      <section aria-label="Study mode options">
        <div className="grid grid-cols-2 gap-4">
          {STUDY_MODES.map((mode) => {
            const isActive = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`group relative text-left p-6 rounded-2xl border-2 bg-gradient-to-br transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${mode.gradient} ${isActive
                  ? "shadow-lg -translate-y-0.5"
                  : "border-border hover:border-opacity-60"
                  }`}
                style={isActive ? { borderColor: mode.borderActive } : {}}
                aria-pressed={isActive}
              >
                {/* Selected indicator */}
                {isActive && (
                  <div
                    className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: mode.borderActive }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Tag */}
                <span
                  className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mb-4"
                  style={{ background: `${mode.accent}20`, color: mode.accent }}
                >
                  {mode.tag}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${mode.iconBg}`}>
                  <mode.icon className={`w-6 h-6 ${mode.iconColor}`} />
                </div>

                {/* Text */}
                <h3
                  className="text-base font-extrabold text-foreground mb-2 tracking-tight"
                  style={isActive ? { color: mode.borderActive } : {}}
                >
                  {mode.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>

                {/* Bottom border accent when active */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${mode.borderActive}, transparent)` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Launch CTA */}
      <section aria-label="Launch session" className="flex flex-col items-center gap-3 py-4">
        <button
          onClick={onLaunch}
          disabled={!selectedMode}
          className="flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          style={{
            background: selected
              ? `linear-gradient(135deg, #2563EB 0%, ${selected.accent === "#2563EB" ? "#7C3AED" : selected.accent} 100%)`
              : "linear-gradient(135deg, #2563EB, #7C3AED)",
            color: "#fff",
          }}
        >
          <Sparkles className="w-5 h-5" />
          Launch AI Study Session
          <Rocket className="w-5 h-5" />
        </button>
        {selected && (
          <p className="text-xs text-muted-foreground">
            Starting <strong className="text-foreground">{selected.title}</strong> · {STUDY_MODES.find(m => m.id === selectedMode)?.tag}
          </p>
        )}
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────
// Note Viewer Data
// ─────────────────────────────────────────────

const VIEWER_NOTE_LIST = [
  { id: 1, title: "Lesson 1: Intro to Classes & Objects", snippet: "A class is a blueprint for creating objects...", active: false },
  { id: 2, title: "Lesson 2: Encapsulation", snippet: "Encapsulation hides internal state using access...", active: false },
  { id: 3, title: "Lesson 3: Inheritance in Java", snippet: "Inheritance allows a child class to acquire...", active: false },
  { id: 4, title: "Lesson 4: Polymorphism and Interfaces", snippet: "Polymorphism enables one interface to be used...", active: true },
  { id: 5, title: "Lesson 5: Abstract Classes", snippet: "Abstract classes cannot be instantiated and may...", active: false },
  { id: 6, title: "Lesson 6: Design Patterns", snippet: "Design patterns are reusable solutions to common...", active: false },
];

const CHAT_MESSAGES = [
  {
    id: 1,
    role: "user" as const,
    text: "What is the difference between method overloading and method overriding?",
    time: "2:31 PM",
  },
  {
    id: 2,
    role: "ai" as const,
    text: "Great question! Here's the key distinction:\n\n**Method Overloading** (compile-time polymorphism) occurs when multiple methods share the same name but differ in parameters — number, type, or order. The compiler resolves which version to call.\n\n**Method Overriding** (runtime polymorphism) occurs when a subclass provides its own implementation of a method already defined in its superclass. The JVM resolves it at runtime via dynamic dispatch.",
    source: "Paragraph 2 — Polymorphism Types",
    time: "2:31 PM",
  },
  {
    id: 3,
    role: "user" as const,
    text: "Can you give me a Java example of overriding?",
    time: "2:33 PM",
  },
  {
    id: 4,
    role: "ai" as const,
    text: "Of course! Here's a minimal example:\n\n```java\nclass Animal {\n  void speak() { System.out.println(\"...\"); }\n}\nclass Dog extends Animal {\n  @Override\n  void speak() { System.out.println(\"Woof!\"); }\n}\n```\n\nWhen you call `speak()` on a `Dog` reference stored as `Animal`, Java uses the `Dog` version at runtime.",
    source: "Lesson 3 — Inheritance",
    time: "2:33 PM",
  },
];

const VIEWER_SUMMARY = [
  "Polymorphism is one of the four pillars of OOP, allowing objects of different types to be accessed through the same interface.",
  "Runtime polymorphism is achieved via method overriding — the JVM resolves the correct method at execution time using dynamic dispatch.",
  "Compile-time polymorphism is achieved via method overloading — resolved by the compiler based on method signatures.",
  "Interfaces define a pure contract with no implementation. A class may implement multiple interfaces, bypassing Java's single-inheritance limit.",
  "The `@Override` annotation is best practice when overriding methods — it lets the compiler catch errors if the signature doesn't match.",
];

const VIEWER_QUIZ = [
  {
    id: 1,
    question: "Which type of polymorphism is resolved at runtime?",
    options: [{ label: "A", text: "Method overloading" }, { label: "B", text: "Method overriding" }, { label: "C", text: "Operator overloading" }],
    correct: "B",
  },
  {
    id: 2,
    question: "Can a Java class implement more than one interface?",
    options: [{ label: "A", text: "No, only one" }, { label: "B", text: "Yes, multiple" }, { label: "C", text: "Only abstract classes" }],
    correct: "B",
  },
];

// ─────────────────────────────────────────────
// Note Viewer Screen
// ─────────────────────────────────────────────

function NoteViewerScreen({ onBack, darkMode, context = "notes", note, onDelete, onSave }: {
  onBack: () => void;
  darkMode: boolean;
  context?: "notes" | "study";
  note: any;
  onDelete?: (id: string) => Promise<boolean>;
  onSave?: (note: any, id?: string) => Promise<boolean>;
}) {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedSubject, setEditedSubject] = useState("OOP");
  const [aiTab, setAiTab] = useState<"chat" | "summary" | "quiz">("chat");
  const [chatMsg, setChatMsg] = useState("");
  const [quizAnswers, setQA] = useState<Record<number, string>>({});
  const [sideCollapsed, setSideCollapsed] = useState(false);

  useEffect(() => {
    if (note) {
      setEditedTitle(note.titulo || note.title || "");
      setEditedContent(note.contenido || note.preview || "");
      setEditedSubject(note.subject || "OOP");
    }
  }, [note]);

  const handleSaveEdit = async () => {
    if (note && note.id) {
      const success = await onSave?.({
        titulo: editedTitle,
        contenido: editedContent,
        subject: editedSubject,
      }, note.id);
      if (success) {
        toast.success("Note updated successfully!");
        setEditMode(false);
      }
    } else {
      setEditMode(false);
    }
  };

  const handleQuizAnswer = (qid: number, label: string) => {
    if (!quizAnswers[qid]) setQA(prev => ({ ...prev, [qid]: label }));
  };

  return (
    <div
      className={`flex h-screen w-full overflow-hidden bg-background${darkMode ? " dark" : ""}`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      {/* ── Left Note List Sidebar ── */}
      <aside
        className={`flex flex-col shrink-0 bg-card border-r border-border h-full transition-all duration-200 ${sideCollapsed ? "w-14" : "w-64"}`}
      >
        {/* Top */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-border shrink-0">
          {!sideCollapsed && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}
          <button
            onClick={() => setSideCollapsed(c => !c)}
            className="p-1.5 rounded-lg hover:bg-muted transition ml-auto"
            aria-label={sideCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 text-muted-foreground transition-transform ${sideCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {!sideCollapsed && (
          <>
            {/* Notebook title */}
            <div className="px-4 py-3 border-b border-border shrink-0">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                {context === "study" ? "Study Notebook" : "Notebook"}
              </p>
              <p className="text-xs font-bold text-foreground leading-snug">Programación Orientada a Objetos</p>
              {context === "study" && (
                <p className="text-[10px] text-muted-foreground mt-0.5">{LINKED_NOTES.length} linked notes</p>
              )}
            </div>

            {/* Note list */}
            <nav className="flex-1 overflow-y-auto py-2" aria-label="Notes in notebook">
              {(context === "study" ? LINKED_NOTES.map((n, i) => ({
                id: n.id, title: n.title, snippet: n.preview, active: i === 3,
              })) : VIEWER_NOTE_LIST).map((note) => (
                <button
                  key={note.id}
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 mx-1 rounded-xl transition-all ${note.active
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted border border-transparent"
                    }`}
                  style={{ width: "calc(100% - 8px)" }}
                >
                  <FileText className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${note.active ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="min-w-0">
                    <p className={`text-[11px] font-semibold leading-snug ${note.active ? "text-primary" : "text-foreground"}`}>
                      {note.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{note.snippet}</p>
                  </div>
                </button>
              ))}
            </nav>

            {/* User profile */}
            <div className="mx-3 mb-3 p-3 rounded-xl bg-muted border border-border shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-white">RA</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-foreground truncate">Raúl Andrade</p>
                  <p className="text-[9px] text-muted-foreground truncate">POO · Semester 4</p>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* ── Center Document Canvas ── */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-background">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-8 py-4 bg-card border-b border-border shrink-0">
          <div className="min-w-0">
            <h1 className="text-base font-extrabold text-foreground tracking-tight truncate">
              {note ? (note.titulo || note.title) : "POO — Lesson 4: Polymorphism and Interfaces"}
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {note && note.createdAt ? `Last saved · ${new Date(note.createdAt).toLocaleString()}` : "Last saved · Jun 20, 2026 at 2:28 PM"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {context === "study" && (
              <button
                onClick={() => { }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-violet-300 dark:border-violet-500/40 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Summary
              </button>
            )}
            <button
              onClick={() => {
                if (editMode) {
                  handleSaveEdit();
                } else {
                  setEditMode(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${editMode
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-muted border-border text-foreground hover:border-primary/40"
                }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              {editMode ? "Save Note" : "Edit Note"}
            </button>
            <button className="p-2 rounded-xl border border-border hover:bg-muted transition text-muted-foreground" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={async () => {
                if (note && note.id) {
                  if (confirm("Are you sure you want to delete this note?")) {
                    const success = await onDelete?.(note.id);
                    if (success) {
                      toast.success("Note deleted successfully!");
                      onBack();
                    }
                  }
                } else {
                  toast.error("Mock notes cannot be deleted.");
                }
              }}
              className="p-2 rounded-xl border border-border hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 hover:text-red-500 transition text-muted-foreground"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-12 py-10">
          <article className="max-w-2xl mx-auto space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            {editMode ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Title</label>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground font-bold"
                    placeholder="Note Title"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Subject</label>
                  <select
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground text-sm"
                  >
                    {SUBJECT_FILTERS.filter(f => f !== "All Subjects").map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Content</label>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full min-h-[300px] text-sm text-foreground bg-card border border-border rounded-xl p-4 outline-none resize-none leading-7"
                    placeholder="Start writing..."
                  />
                </div>
              </div>
            ) : note ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#F3F4F6', color: '#111' }}>
                    {note.subject || "General"}
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight">
                  {note.titulo || note.title}
                </h1>
                <div className="text-sm text-foreground leading-7 whitespace-pre-wrap">
                  {note.contenido || note.preview}
                </div>
              </div>
            ) : (
              <>
                {/* H1 */}
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight">
                  Polymorphism and Interfaces in Java
                </h1>

                {/* Intro paragraph */}
                <p className="text-sm text-foreground leading-7">
                  Polymorphism is one of the four fundamental pillars of Object-Oriented Programming.
                  The word comes from Greek and means <span className="bg-primary/15 text-primary font-semibold px-1 rounded">"many forms"</span>.
                  In Java, polymorphism allows a single interface to represent different underlying data types,
                  enabling code that is both flexible and reusable.
                </p>

                {/* H2 */}
                <div className="flex items-center gap-2 pt-2">
                  <Hash className="w-4 h-4 text-primary shrink-0" />
                  <h2 className="text-base font-bold text-foreground">Types of Polymorphism</h2>
                </div>

                {/* Highlight block */}
                <div className="pl-4 border-l-4 border-primary bg-primary/5 py-3 pr-4 rounded-r-xl">
                  <p className="text-sm text-foreground leading-7">
                    Java supports two types of polymorphism:{" "}
                    <span className="font-bold text-primary">compile-time</span> (method overloading) and{" "}
                    <span className="font-bold text-primary">runtime</span> (method overriding).
                    Understanding the difference is essential for writing maintainable OOP systems.
                  </p>
                </div>

                {/* Bullet list */}
                <ul className="space-y-2.5">
                  {[
                    { term: "Method Overloading", def: "Same method name, different parameter signatures. Resolved at compile time by the Java compiler." },
                    { term: "Method Overriding", def: "Subclass redefines a superclass method. Resolved at runtime via dynamic dispatch (late binding)." },
                    { term: "@Override annotation", def: "Best practice when overriding — the compiler validates that the method signature matches the parent's." },
                  ].map(({ term, def }) => (
                    <li key={term} className="flex items-start gap-3 text-sm text-foreground leading-6">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span><span className="font-bold">{term}</span> — {def}</span>
                    </li>
                  ))}
                </ul>

                {/* H2 */}
                <div className="flex items-center gap-2 pt-2">
                  <Hash className="w-4 h-4 text-primary shrink-0" />
                  <h2 className="text-base font-bold text-foreground">Interface Declaration</h2>
                </div>

                <p className="text-sm text-foreground leading-7">
                  An <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold px-1 rounded">interface</span> in Java defines a contract — a set of method signatures that any implementing class must provide.
                  Unlike abstract classes, interfaces support multiple inheritance, allowing a class to implement several interfaces simultaneously.
                </p>

                {/* Code block */}
                <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono ml-2">Polymorphism.java</span>
                    </div>
                    <Code2 className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <pre className="bg-slate-900 text-slate-100 text-xs leading-6 px-5 py-4 overflow-x-auto font-mono">
                    {`interface Speakable {
    void speak();
    default String greet() {
        return "Hello from " + getClass().getSimpleName();
    }
}

class Dog implements Speakable {
    @Override
    public void speak() {
        System.out.println("Woof!");
    }
}

class Cat implements Speakable {
    @Override
    public void speak() {
        System.out.println("Meow!");
    }
}

// Runtime polymorphism in action:
Speakable animal = new Dog();
animal.speak(); // → "Woof!"`}
                  </pre>
                </div>

                {/* Closing note */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground leading-relaxed">
                    <span className="font-bold text-accent">Study tip:</span> The key distinction to remember for exams — interfaces define <em>what</em> a class does, while abstract classes define <em>what</em> and <em>how</em> (partially). Use interfaces for contracts, abstract classes for shared base behavior.
                  </p>
                </div>
              </>
            )}
          </article>
        </div>
      </main>

      {/* ── Right AI Panel ── */}
      <aside
        aria-label="AI Assistant"
        className="w-80 shrink-0 border-l border-border bg-card flex flex-col h-full"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">MenteColmena AI</span>
          </div>
          {/* 3 tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            {(["chat", "summary", "quiz"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAiTab(tab)}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg capitalize transition-all ${aiTab === tab
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab === "chat" ? "AI Chat" : tab === "summary" ? "Summary" : "Quizzes"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── AI Chat ── */}
          {aiTab === "chat" && (
            <div className="flex flex-col h-full">
              <ul className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
                {CHAT_MESSAGES.map((msg) => (
                  <li key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "ai" && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mr-2 mt-0.5">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[82%] space-y-1.5`}>
                      <div
                        className={`px-3 py-2.5 rounded-2xl text-[11px] leading-relaxed ${msg.role === "user"
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm border border-border"
                          }`}
                      >
                        {msg.text.split("```java")[0].split("\n\n").map((para, i) => (
                          <p key={i} className={i > 0 ? "mt-2" : ""}>
                            {para.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </p>
                        ))}
                        {msg.text.includes("```java") && (
                          <pre className="mt-2 bg-slate-800 text-slate-100 text-[10px] rounded-lg px-3 py-2 overflow-x-auto font-mono leading-5">
                            {msg.text.split("```java")[1].split("```")[0].trim()}
                          </pre>
                        )}
                      </div>
                      {msg.source && (
                        <div className="flex items-center gap-1 ml-1">
                          <FileText className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[9px] font-semibold text-primary">{msg.source}</span>
                        </div>
                      )}
                      <p className="text-[9px] text-muted-foreground ml-1">{msg.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Summary ── */}
          {aiTab === "summary" && (
            <section className="px-5 py-5 space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/15">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <p className="text-[11px] font-semibold text-foreground">AI summary of this note</p>
              </div>
              <ul className="space-y-3">
                {VIEWER_SUMMARY.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300">Exam tip</p>
                </div>
                <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
                  Focus on the difference between overloading vs overriding — this appears frequently in POO exams.
                </p>
              </div>
            </section>
          )}

          {/* ── Quizzes ── */}
          {aiTab === "quiz" && (
            <section className="px-5 py-5 space-y-5">
              {VIEWER_QUIZ.map((q, qi) => {
                const ans = quizAnswers[q.id];
                return (
                  <div key={q.id} className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md shrink-0">Q{qi + 1}</span>
                      <p className="text-xs font-bold text-foreground leading-snug">{q.question}</p>
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt) => {
                        const isSelected = ans === opt.label;
                        const isCorrect = opt.label === q.correct;
                        let cls = "bg-card border-border text-foreground hover:bg-muted hover:border-primary/30";
                        if (ans) {
                          if (isCorrect) cls = "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 text-emerald-800 dark:text-emerald-300";
                          else if (isSelected) cls = "bg-red-50 dark:bg-red-500/10 border-red-300 text-red-700 dark:text-red-400";
                          else cls = "bg-card border-border text-muted-foreground opacity-50";
                        }
                        return (
                          <button
                            key={opt.label}
                            disabled={!!ans}
                            onClick={() => handleQuizAnswer(q.id, opt.label)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-[11px] font-medium text-left transition-all ${cls}`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${ans && isCorrect ? "bg-accent text-white border-accent"
                              : ans && isSelected ? "bg-red-400 text-white border-red-400"
                                : "bg-muted border-border text-muted-foreground"
                              }`}>{opt.label}</span>
                            {opt.text}
                            {ans && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-accent" />}
                            {ans && isSelected && !isCorrect && <X className="w-3.5 h-3.5 ml-auto text-red-400" />}
                          </button>
                        );
                      })}
                    </div>
                    {ans && (
                      <p className={`text-[10px] font-semibold px-3 py-2 rounded-lg ${ans === q.correct ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                        {ans === q.correct ? "✓ Correct!" : `✗ Answer: ${q.correct}`}
                      </p>
                    )}
                    {qi < VIEWER_QUIZ.length - 1 && <div className="h-px bg-border" />}
                  </div>
                );
              })}
            </section>
          )}
        </div>

        {/* Chat input — always visible */}
        <div className="shrink-0 border-t border-border px-4 py-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/30 transition">
            <button className="text-muted-foreground hover:text-foreground transition shrink-0" aria-label="Attach file">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Ask MenteColmena..."
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && chatMsg.trim()) { handleSendMessage(chatMsg); setChatMsg(""); } }}
              className="flex-1 text-xs text-foreground bg-transparent placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={() => { if (chatMsg.trim()) { setAiTab("chat"); handleSendMessage(chatMsg); setChatMsg(""); } }}
              className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition shrink-0"
              aria-label="Send"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState("Login");
  const [nbFilter, setNbFilter] = useState("All Subjects");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showImport, setShowImport] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hubMode, setHubMode] = useState("quiz");
  const [hubDiff, setHubDiff] = useState("Medium");
  const [hubQCount, setHubQCount] = useState(10);
  const [hubTime, setHubTime] = useState("No limit");
  const [noteViewerSource, setNoteViewerSource] = useState<"notes" | "study">("notes");
  const [dashboard, setDashboard] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [cuadernos, setCuadernos] = useState<any[]>([]);
  const [cuadernosLoading, setCuadernosLoading] = useState(false);
  const [selectedCuadernoId, setSelectedCuadernoId] = useState<string | null>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const loadDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Dashboard fetch failed');
      const data = await res.json();
      setDashboard(data);
    } catch (error) {
      console.error('Dashboard load failed', error);
    }
  };

  const loadNotes = async () => {
    try {
      setNotesLoading(true);
      const res = await fetch('/api/notas');
      if (!res.ok) throw new Error('Notes fetch failed');
      const data = await res.json();
      setNotes(data || []);
    } catch (error) {
      console.error('Notes load failed', error);
    } finally {
      setNotesLoading(false);
    }
  };

  const loadCuadernos = async () => {
    try {
      setCuadernosLoading(true);
      const res = await fetch('/api/cuadernos');
      if (!res.ok) throw new Error('Cuadernos fetch failed');
      const data = await res.json();
      setCuadernos(data || []);
    } catch (error) {
      console.error('Cuadernos load failed', error);
    } finally {
      setCuadernosLoading(false);
    }
  };

  const saveCuaderno = async (cuaderno: any, id?: string) => {
    try {
      const endpoint = id ? `/api/cuadernos/${id}` : '/api/cuadernos';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuaderno),
      });
      if (!res.ok) throw new Error('Save cuaderno failed');
      await loadCuadernos();
      return true;
    } catch (error) {
      console.error('Cuaderno save failed', error);
      return false;
    }
  };

  const deleteCuaderno = async (id?: string) => {
    if (!id) return false;
    try {
      const res = await fetch(`/api/cuadernos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete cuaderno failed');
      await loadCuadernos();
      if (selectedCuadernoId === id) {
        setSelectedCuadernoId(null);
      }
      return true;
    } catch (error) {
      console.error('Cuaderno delete failed', error);
      return false;
    }
  };

  const loadGoals = async () => {
    try {
      setGoalsLoading(true);
      const res = await fetch('/api/goals');
      if (!res.ok) throw new Error('Goals fetch failed');
      const data = await res.json();
      setGoals(data || []);
    } catch (error) {
      console.error('Goals load failed', error);
    } finally {
      setGoalsLoading(false);
    }
  };

  const saveGoal = async (goal: any, id?: string) => {
    try {
      const endpoint = id ? `/api/goals/${id}` : '/api/goals';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal),
      });
      if (!res.ok) throw new Error('Save goal failed');
      await loadGoals();
      return true;
    } catch (error) {
      console.error('Goal save failed', error);
      return false;
    }
  };

  const deleteGoal = async (id?: string) => {
    if (!id) return false;
    try {
      const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete goal failed');
      await loadGoals();
      return true;
    } catch (error) {
      console.error('Goal delete failed', error);
      return false;
    }
  };

  const deleteQuiz = async (id?: string) => {
    if (!id) return false;
    try {
      const res = await fetch(`/api/quizzes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete quiz failed');
      await loadDashboard();
      return true;
    } catch (error) {
      console.error('Quiz delete failed', error);
      return false;
    }
  };

  const saveQuiz = async (quiz: any) => {
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz),
      });
      if (!res.ok) throw new Error('Save quiz failed');
      await loadDashboard();
      return true;
    } catch (error) {
      console.error('Quiz save failed', error);
      return false;
    }
  };

  const saveNote = async (note: any, id?: string) => {
    try {
      const endpoint = id ? `/api/notas/${id}` : '/api/notas';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error('Save note failed');
      await loadNotes();
      await loadDashboard();
      return true;
    } catch (error) {
      console.error('Note save failed', error);
      return false;
    }
  };

  const deleteNote = async (id?: string) => {
    if (!id) return false;
    try {
      const res = await fetch(`/api/notas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete note failed');
      await loadNotes();
      await loadDashboard();
      return true;
    } catch (error) {
      console.error('Note delete failed', error);
      return false;
    }
  };

  const openNoteViewer = (id: string, source: 'notes' | 'study') => {
    setSelectedNoteId(id);
    setNoteViewerSource(source);
    setActiveNav('Note Viewer');
  };

  const handleSearch = (q: string) => setSearchQuery(q);

  const handleCreateNote = async (note: any) => {
    const success = await saveNote(note);
    if (success) {
      setActiveNav('My Notes');
    }
  };

  const handleLaunchSession = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch('/api/dashboard/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today }),
      });
      if (!res.ok) throw new Error('Session record failed');
      await loadDashboard();
      setActiveNav('Home');
    } catch (error) {
      console.error('Session launch failed', error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadNotes();
    loadCuadernos();
    loadGoals();
    loadDashboard();
    const interval = setInterval(() => {
      loadNotes();
      loadCuadernos();
      loadGoals();
      loadDashboard();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedNoteId) {
      setSelectedNote(null);
      return;
    }

    const loadNote = async () => {
      try {
        const res = await fetch(`/api/notas/${selectedNoteId}`);
        if (!res.ok) throw new Error('Note fetch failed');
        const data = await res.json();
        setSelectedNote(data);
      } catch (error) {
        console.error('Selected note load failed', error);
        setSelectedNote(null);
      }
    };

    loadNote();
  }, [selectedNoteId]);

  const isLogin = activeNav === "Login";
  const isRegister = activeNav === "Register";
  const isNotebooks = activeNav === "My Notes";
  const isStudy = activeNav === "Study Notebooks";
  const isCreateNote = activeNav === "Create Note";
  const isSettings = activeNav === "Settings";
  const isHub = activeNav === "Study Hub";
  const isNoteViewer = activeNav === "Note Viewer";

  const activeCuadernoForHeader = cuadernos.find((c) => c.id === selectedCuadernoId);
  const rightPanelTitle = isStudy || isCreateNote ? "AI Study Assistant"
    : isNotebooks ? "Notes Overview"
      : isSettings ? "Account Info"
        : "Weekly Progress";
  const rightPanelSub = isStudy
    ? (activeCuadernoForHeader ? `${activeCuadernoForHeader.titulo} — ${(activeCuadernoForHeader.noteIds || []).length} linked notes` : "Select a notebook to start")
    : isCreateNote ? "Analyzing your note..."
      : isNotebooks ? `${notes.length} total notes`
        : isSettings ? "Raúl Andrade · UFRO"
          : "Jun 16 – Jun 20, 2026";

  // ── Login ── full-page override
  if (isLogin) return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 bg-slate-900${darkMode ? " dark" : ""}`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mb-4">
            <Hexagon className="w-6 h-6 text-white fill-white/20 stroke-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">MenteColmena</h1>
          <p className="text-sm text-slate-400 mt-1">Welcome back — sign in to continue</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Sign in to your account</h2>

          <form onSubmit={(e) => { e.preventDefault(); setActiveNav("Home"); }} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">University Email</label>
              <input
                type="email"
                placeholder="you@university.cl"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" onClick={() => { }} className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition">
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-blue-900/40 transition-all duration-150"
            >
              Sign In
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-[11px] text-slate-500 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={() => setActiveNav("Home")}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[12px] text-slate-400 mt-6">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setActiveNav("Register")}
              className="text-blue-400 font-semibold hover:text-blue-300 hover:underline underline-offset-2 transition"
            >
              Register
            </button>
          </p>
        </div>
        <p className="text-center text-[11px] text-slate-600 mt-6">© 2026 MenteColmena · All rights reserved</p>
      </div>
    </div>
  );

  // ── Register ── full-page override
  if (isRegister) return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 py-10 bg-slate-900${darkMode ? " dark" : ""}`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg mb-4">
            <Hexagon className="w-6 h-6 text-white fill-white/20 stroke-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">MenteColmena</h1>
          <p className="text-sm text-slate-400 mt-1">Create your account and start studying smarter</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6">Create a new account</h2>

          <form onSubmit={(e) => { e.preventDefault(); setActiveNav("Home"); }} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                placeholder="Raúl Andrade"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">University Email</label>
              <input
                type="email"
                placeholder="you@university.cl"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              />
              <p className="text-[10px] text-slate-500">Use your institutional email address.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-900 accent-blue-500 cursor-pointer shrink-0" />
              <span className="text-[11px] text-slate-400 leading-relaxed">
                I agree to the{" "}
                <button type="button" onClick={() => { }} className="text-blue-400 font-semibold hover:underline underline-offset-2">Terms of Service</button>
                {" "}and{" "}
                <button type="button" onClick={() => { }} className="text-blue-400 font-semibold hover:underline underline-offset-2">Privacy Policy</button>
              </span>
            </label>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-blue-900/40 transition-all duration-150"
            >
              Create Account
            </button>
          </form>

          <div className="mt-5 space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Password strength</p>
            <div className="flex gap-1">
              {["bg-red-500", "bg-amber-500", "bg-blue-500", "bg-slate-700"].map((c, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full ${c}`} />
              ))}
            </div>
            <p className="text-[10px] text-amber-400">Moderate — add symbols to strengthen</p>
          </div>

          <p className="text-center text-[12px] text-slate-400 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setActiveNav("Login")}
              className="text-blue-400 font-semibold hover:text-blue-300 hover:underline underline-offset-2 transition"
            >
              Log In
            </button>
          </p>
        </div>
        <p className="text-center text-[11px] text-slate-600 mt-6">© 2026 MenteColmena · All rights reserved</p>
      </div>
    </div>
  );

  // Note viewer is a full-page override — no shared header
  if (isNoteViewer) {
    return (
      <NoteViewerScreen
        onBack={() => setActiveNav(noteViewerSource === "study" ? "Study Notebooks" : "My Notes")}
        darkMode={darkMode}
        context={noteViewerSource}
        note={selectedNote}
        onDelete={deleteNote}
        onSave={saveNote}
      />
    );
  }

  return (
    <div
      className={`flex flex-col h-screen w-full overflow-hidden bg-background${darkMode ? " dark" : ""}`}
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      {/* Unified header row */}
      <div className="flex shrink-0 border-b border-border bg-card">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 w-64 shrink-0 border-r border-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
            <Hexagon className="w-5 h-5 text-white fill-white/20 stroke-white" />
          </div>
          <span className="text-[15px] font-extrabold text-foreground tracking-tight">MenteColmena</span>
        </div>

        {/* Center search + user */}
        <div className="flex-1 flex items-center justify-between px-8">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search notes, subjects..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-sm transition"
            >
              <span className={`transition-all ${darkMode ? "opacity-40 scale-90" : "opacity-100"}`}>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              </span>
              <div className={`relative w-8 h-4 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-border"}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${darkMode ? "left-4.5 translate-x-[2px]" : "left-0.5"}`} style={{ left: darkMode ? "17px" : "2px" }} />
              </div>
              <span className={`transition-all ${darkMode ? "opacity-100" : "opacity-40 scale-90"}`}>
                <Moon className="w-3.5 h-3.5 text-primary" />
              </span>
            </button>
            <button aria-label="Notifications" onClick={handleNotifications} className="relative p-2 rounded-lg hover:bg-muted transition">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-white">{CURRENT_USER.initials}</span>
            </div>
          </div>
        </div>

        {/* Right panel title */}
        <div className="w-72 shrink-0 px-5 flex flex-col justify-center border-l border-border">
          <h2 className="text-sm font-bold text-foreground">{rightPanelTitle}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{rightPanelSub}</p>
        </div>
      </div>

      {/* Body columns */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
        {isCreateNote ? <CreateNoteMain onSave={handleCreateNote} /> :
          isHub ? <StudyHubMain selectedMode={hubMode} setSelectedMode={setHubMode} onLaunch={handleLaunchSession} /> :
            isStudy ? (
              <StudyNotebooksMain
                notes={notes}
                cuadernos={cuadernos}
                selectedCuadernoId={selectedCuadernoId}
                setSelectedCuadernoId={setSelectedCuadernoId}
                onSaveCuaderno={saveCuaderno}
                onDeleteCuaderno={deleteCuaderno}
                onStudy={() => setActiveNav("Study Hub")}
                onOpenNote={(id) => openNoteViewer(id, "study")}
              />
            ) :
              isNotebooks ? <NotebooksMain filter={nbFilter} setFilter={setNbFilter} viewMode={viewMode} setViewMode={setViewMode} onImport={() => setShowImport(true)} onCreateNote={() => setActiveNav("Create Note")} onStudy={() => setActiveNav("Study Hub")} onOpenNote={(id) => openNoteViewer(id, "notes")} notes={notes} loading={notesLoading} onSave={saveNote} onDelete={deleteNote} /> :
                isSettings ? <SettingsMain /> :
                  <HomeMain dashboard={dashboard} />}
        {isHub ? <StudyHubPanel selectedMode={STUDY_MODES.find(m => m.id === hubMode)} difficulty={hubDiff} setDifficulty={setHubDiff} qCount={hubQCount} setQCount={setHubQCount} timeLimit={hubTime} setTimeLimit={setHubTime} onLaunch={handleLaunchSession} /> :
          isCreateNote || isStudy ? (
            <StudyNotebooksPanel
              onQuizSubmit={loadDashboard}
              selectedCuaderno={cuadernos.find((c) => c.id === selectedCuadernoId)}
              notes={notes}
            />
          ) :
            isNotebooks ? <NotebooksPanel notes={notes} onOpenNote={(id) => openNoteViewer(id, "notes")} /> :
              isSettings ? null :
                <HomePanel
                  dashboard={dashboard}
                  goals={goals}
                  onSaveGoal={saveGoal}
                  onDeleteGoal={deleteGoal}
                  onDeleteQuiz={deleteQuiz}
                  onSaveQuiz={saveQuiz}
                  notes={notes}
                />}
      </div>

      {/* Import modal — rendered outside columns so it overlays everything */}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
      <Toaster position="top-right" richColors />
    </div>
  );
}
