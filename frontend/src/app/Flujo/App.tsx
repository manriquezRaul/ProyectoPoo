import { useState, useRef } from "react";
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
  { icon: Home,       label: "Home" },
  { icon: BookOpen,   label: "Study Notebooks" },
  { icon: StickyNote, label: "My Notes" },
  { icon: Settings,   label: "Settings" },
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
  streak:   { days: 5,  best: 12, activeDays: 5 },
  accuracy: { value: 84, trend: "+4.2%", quizCount: 24 },
  notes:    { total: 24, weeklyDelta: "+6" },
};

const SUBJECTS = [
  { id: 1, name: "Object-Oriented\nProgramming", notes: 8,  icon: "⬡", progress: 72, bg: "#EFF6FF", border: "#BFDBFE" },
  { id: 2, name: "Databases",                    notes: 5,  icon: "🗄", progress: 58, bg: "#ECFDF5", border: "#A7F3D0" },
  { id: 3, name: "Calculus",                      notes: 4,  icon: "∫", progress: 45, bg: "#FEF3C7", border: "#FDE68A" },
  { id: 4, name: "Data Structures",               notes: 4,  icon: "⟨⟩",progress: 61, bg: "#F5F3FF", border: "#DDD6FE" },
  { id: 5, name: "Linear Algebra",                notes: 2,  icon: "Σ", progress: 30, bg: "#FFF1F2", border: "#FECDD3" },
  { id: 6, name: "Discrete Math",                 notes: 1,  icon: "∩", progress: 20, bg: "#F0FDF4", border: "#BBF7D0" },
];

const WEEKLY_GOALS = [
  { label: "Study Sessions", done: 5,  goal: 7,  color: "#2563EB" },
  { label: "Quizzes Taken",  done: 4,  goal: 5,  color: "#10B981" },
  { label: "Notes Reviewed", done: 12, goal: 15, color: "#8B5CF6" },
];

const QUIZ_RESULTS = [
  { id: 1, subject: "OOP — Inheritance & Polymorphism", score: 94, date: "Today, 2:30 PM",     status: "success", badge: "Excellent"  },
  { id: 2, subject: "Databases — SQL Joins",            score: 87, date: "Yesterday, 6:15 PM", status: "success", badge: "Great"      },
  { id: 3, subject: "Calculus — Derivatives",           score: 71, date: "Jun 18, 4:00 PM",    status: "warning", badge: "Good"       },
  { id: 4, subject: "OOP — Design Patterns",            score: 91, date: "Jun 17, 11:20 AM",   status: "success", badge: "Excellent"  },
  { id: 5, subject: "Data Structures — Trees",          score: 63, date: "Jun 16, 3:45 PM",    status: "warning", badge: "Needs Work" },
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
  "OOP":             { bg: "#EFF6FF", text: "#1D4ED8" },
  "Databases":       { bg: "#ECFDF5", text: "#065F46" },
  "Calculus":        { bg: "#FEF3C7", text: "#92400E" },
  "Data Structures": { bg: "#F5F3FF", text: "#5B21B6" },
  "Linear Algebra":  { bg: "#FFF1F2", text: "#9F1239" },
  "Discrete Math":   { bg: "#F0FDF4", text: "#14532D" },
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
  { label: "This Week",   value: "6",  color: "#10B981", bg: "#ECFDF5" },
  { label: "Pinned",      value: "2",  color: "#8B5CF6", bg: "#F5F3FF" },
];

// ─────────────────────────────────────────────
// Empty Handlers
// ─────────────────────────────────────────────

const handleSearch          = (_q: string)  => {};
const handleViewSubject     = (_id: number) => {};
const handleViewAllSubjects = ()            => {};
const handleViewAllQuizzes  = ()            => {};
const handleNotifications   = ()            => {};
const handleCreateNote      = ()            => {};
const handleOpenNote        = (_id: number) => { /* wired via onOpenNote prop */ };
const handleDeleteNote      = (_id: number) => {};
const handleEditNote        = (_id: number) => {};
const handleProcessWithAI   = ()            => {};

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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full text-left ${
                isActive
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
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
            menuOpen
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

function StreakCard() {
  const { days, best, activeDays } = STATS.streak;
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
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i < activeDays ? "bg-white" : "bg-white/25"}`} />
        ))}
      </div>
    </article>
  );
}

function AccuracyCard() {
  const { value, trend, quizCount } = STATS.accuracy;
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

function NotesCountCard() {
  const { total, weeklyDelta } = STATS.notes;
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

function WeeklyActivityChart() {
  const maxVal = Math.max(...DAILY_NOTES_DATA.map((d) => Math.max(d.notes, d.quizzes)));
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
          {DAILY_NOTES_DATA.map((d) => (
            <div key={d.day} className="flex-1 flex items-end justify-center gap-0.5 group relative">
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-2 py-1 shadow-md text-[10px] text-foreground font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                {d.notes} notes · {d.quizzes} quizzes
              </div>
              <div className="w-full max-w-[14px] rounded-t-[3px] bg-primary" style={{ height: `${(d.notes / maxVal) * chartH}px` }} />
              <div className="w-full max-w-[14px] rounded-t-[3px] bg-accent" style={{ height: `${(d.quizzes / maxVal) * chartH}px` }} />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-6 flex justify-between" style={{ top: chartH + 6 }}>
          {DAILY_NOTES_DATA.map((d) => (
            <div key={d.day} className="flex-1 text-center text-[11px] text-muted-foreground font-medium">{d.day}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeMain() {
  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-8">
      <section aria-label="Welcome header">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Welcome back, Raúl 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Friday, June 20, 2026 — You have 3 pending reviews today.</p>
      </section>
      <section aria-label="Study statistics" className="grid grid-cols-3 gap-4">
        <StreakCard />
        <AccuracyCard />
        <NotesCountCard />
      </section>
      <WeeklyActivityChart />
      <section aria-label="Study subjects">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Study Subjects</h2>
          <button onClick={handleViewAllSubjects} className="text-xs font-semibold text-primary hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {SUBJECTS.map((s) => (
            <article key={s.id}>
              <button
                onClick={() => handleViewSubject(s.id)}
                className="w-full text-left p-4 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ background: s.bg, borderColor: s.border }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl leading-none">{s.icon}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground bg-white/70 px-2 py-0.5 rounded-full">{s.notes} notes</span>
                </div>
                <p className="text-sm font-bold text-foreground leading-snug whitespace-pre-line">{s.name}</p>
                <div className="mt-3 h-1 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary/70" style={{ width: `${s.progress}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{s.progress}% mastered</p>
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function HomePanel() {
  const radialData = [{ value: WEEKLY_COMPLETION, fill: "#2563EB" }];
  return (
    <aside aria-label="Activity panel" className="w-72 shrink-0 border-l border-border bg-card flex flex-col h-full overflow-y-auto">
      <section aria-label="Weekly goals" className="px-5 py-5 border-b border-border">
        <div className="relative h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="68%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: "#F1F5F9" }} dataKey="value" cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-extrabold text-foreground">{WEEKLY_COMPLETION}%</p>
            <p className="text-[10px] text-muted-foreground font-semibold">Goal Met</p>
          </div>
        </div>
        <ul className="space-y-2.5 mt-2">
          {WEEKLY_GOALS.map((g) => (
            <li key={g.label} className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: g.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-medium text-foreground">{g.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: g.color }}>{g.done}/{g.goal}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(g.done / g.goal) * 100}%`, background: g.color }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-label="Recent quizzes" className="flex-1 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">Recent Quizzes</h3>
          <button onClick={handleViewAllQuizzes} className="text-[10px] font-semibold text-primary hover:underline">See all</button>
        </div>
        <ul className="space-y-2.5">
          {QUIZ_RESULTS.map((r) => {
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
                    <div className="shrink-0 text-right">
                      <p className="text-base font-extrabold leading-none" style={{ color: ok ? "#10B981" : "#F59E0B" }}>{r.score}</p>
                      <p className="text-[9px] text-muted-foreground">/100</p>
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
          })}
        </ul>
      </section>
      <aside aria-label="Tip" className="mx-4 mb-4 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/15">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-primary shrink-0" />
          <p className="text-[11px] font-bold text-foreground">Keep it up!</p>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          You&apos;re in the top 15% of students this week. One more quiz to hit your daily goal.
        </p>
      </aside>
    </aside>
  );
}

// ─────────────────────────────────────────────
// My Notebooks Screen
// ─────────────────────────────────────────────

function NoteCard({ note, onOpen }: { note: typeof NOTEBOOKS[number]; onOpen?: () => void }) {
  const badge = SUBJECT_BADGE[note.subject];
  return (
    <article className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col gap-3 cursor-pointer relative">
      {/* Pinned indicator */}
      {note.pinned && (
        <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-primary" title="Pinned" />
      )}

      {/* Subject badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: badge.bg, color: badge.text }}
        >
          <Tag className="w-2.5 h-2.5" />
          {note.subject}
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
        onClick={() => { handleOpenNote(note.id); onOpen?.(); }}
        className="text-left"
      >
        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {note.title}
        </h3>
      </button>

      {/* Preview */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {note.preview}
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
            onClick={() => handleEditNote(note.id)}
            className="p-1 rounded-lg hover:bg-muted transition"
            aria-label="Edit note"
          >
            <Edit3 className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={() => handleDeleteNote(note.id)}
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
  pdf:   <FileText  className="w-4 h-4 text-red-500"    />,
  image: <FileImage className="w-4 h-4 text-purple-500" />,
  video: <FileVideo className="w-4 h-4 text-blue-500"   />,
  doc:   <File      className="w-4 h-4 text-primary"    />,
};

const MOCK_FILES: UploadedFile[] = [
  { id: 1, name: "Sistemas_Distribuidos.pdf",      size: "2.4 MB", type: "pdf",   progress: 65, done: false },
  { id: 2, name: "OOP_Class_Diagram.png",           size: "840 KB", type: "image", progress: 100, done: true  },
  { id: 3, name: "Lecture_Notes_Databases.docx",   size: "1.1 MB", type: "doc",   progress: 30, done: false },
];

function ImportModal({ onClose }: { onClose: () => void }) {
  const [isDragging, setIsDragging]   = useState(false);
  const [files, setFiles]             = useState<UploadedFile[]>(MOCK_FILES);
  const inputRef                      = useRef<HTMLInputElement>(null);

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true);  };
  const handleDragLeave = ()                    => setIsDragging(false);
  const handleDrop      = (e: React.DragEvent) => {
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
            className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 px-6 cursor-pointer transition-all duration-200 ${
              isDragging
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
              onChange={() => {/* TODO: handle file input */}}
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

function NotebooksMain({ filter, setFilter, viewMode, setViewMode, onImport, onCreateNote, onStudy, onOpenNote }: {
  filter: string;
  setFilter: (f: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (m: "grid" | "list") => void;
  onImport: () => void;
  onCreateNote: () => void;
  onStudy: () => void;
  onOpenNote?: () => void;
}) {
  const filtered = filter === "All Subjects"
    ? NOTEBOOKS
    : NOTEBOOKS.filter((n) => n.subject === filter);

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-6">
      {/* Page header */}
      <section aria-label="Notebooks header" className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">My Notebooks</p>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Study Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {NOTEBOOKS.length} notes across {SUBJECTS.length} subjects
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
          onClick={onCreateNote}
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

      {/* Note cards grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} onOpen={onOpenNote} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((note) => {
            const badge = SUBJECT_BADGE[note.subject];
            return (
              <article
                key={note.id}
                className="group bg-card border border-border rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all flex items-center gap-5 cursor-pointer"
                onClick={() => handleOpenNote(note.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                      {note.subject}
                    </span>
                    {note.pinned && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />}
                  </div>
                  <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{note.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{note.preview}</p>
                </div>
                <div className="shrink-0 flex items-center gap-4 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{note.date}</div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{note.readTime}</div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={(e) => { e.stopPropagation(); handleEditNote(note.id); }} className="p-1.5 rounded-lg hover:bg-muted transition"><Edit3 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} className="p-1.5 rounded-lg hover:bg-red-50 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
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

function NotebooksPanel() {
  const bySubject = SUBJECTS.map((s) => ({
    ...s,
    count: NOTEBOOKS.filter((n) => n.subject === s.name.replace("\n", " ") || n.subject === s.name.split("\n")[0]).length,
  }));

  return (
    <aside aria-label="Notebooks panel" className="w-72 shrink-0 border-l border-border bg-card flex flex-col h-full overflow-y-auto">
      {/* Quick stats */}
      <section aria-label="Note stats" className="px-5 py-5 border-b border-border space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Overview</h3>
        {NOTEBOOKS_STATS.map((s) => (
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
            const count = NOTEBOOKS.filter((n) => n.subject === s.name.replace("\n", " ").split(" ")[0] || s.name.includes(n.subject) || n.subject === s.name.replace("\n"," ")).length;
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
          {NOTEBOOKS.filter((n) => n.pinned).map((n) => {
            const badge = SUBJECT_BADGE[n.subject];
            return (
              <li key={n.id}>
                <button
                  onClick={() => handleOpenNote(n.id)}
                  className="w-full text-left p-3 rounded-xl border border-border hover:bg-muted/50 transition group"
                >
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                    {n.subject}
                  </span>
                  <p className="text-xs font-semibold text-foreground mt-1.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {n.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.date}</p>
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

const handleStudyMode   = () => { /* wired via prop in App */ };
const handleSendMessage = (_msg: string) => {};
const handleConfirmLink = (_ids: number[]) => {};

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

function LinkNotesModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<Set<number>>(new Set([10]));

  const filtered = search
    ? LINKABLE_NOTES.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.tag.toLowerCase().includes(search.toLowerCase())
      )
    : LINKABLE_NOTES;

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleLink = () => {
    handleConfirmLink(Array.from(selected));
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
            return (
              <li key={note.id}>
                <button
                  onClick={() => toggle(note.id)}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                    isSelected
                      ? "bg-primary/5 border-primary/30 shadow-sm"
                      : "bg-background border-border hover:bg-muted/60 hover:border-border"
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-primary border-primary" : "border-border bg-card"
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
                        {note.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {note.preview}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: note.tagStyle.bg, color: note.tagStyle.text }}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {note.tag}
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
              disabled={selected.size === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Link2 className="w-4 h-4" />
              Link Selected Notes
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

function LinkedNoteCard({ note, onOpen }: { note: typeof LINKED_NOTES[number]; onOpen?: () => void }) {
  return (
    <article
      className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col gap-3 cursor-pointer"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors flex-1">
          {note.title}
        </h3>
        <BookMarked className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {note.preview}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        {note.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3 shrink-0" />
          <time>{note.date}</time>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3 shrink-0" />
          {note.readTime}
        </div>
      </div>
    </article>
  );
}

function StudyNotebooksMain({ onStudy = () => {}, onOpenNote }: { onStudy?: () => void; onOpenNote?: () => void }) {
  const [noteSearch, setNoteSearch]   = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);

  const filtered = noteSearch
    ? LINKED_NOTES.filter((n) =>
        n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
        n.tags.some((t) => t.toLowerCase().includes(noteSearch.toLowerCase()))
      )
    : LINKED_NOTES;

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-6">
      {/* Header */}
      <section aria-label="Notebook header" className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            Study Notebooks
          </p>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Programación Orientada a Objetos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {LINKED_NOTES.length} linked notes · Last updated Jun 20, 2026
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
        <span className="ml-auto text-xs text-muted-foreground shrink-0">
          {filtered.length} of {LINKED_NOTES.length} notes
        </span>
      </section>

      {/* Linked note cards grid */}
      <section aria-label="Linked notes">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <LinkedNoteCard key={note.id} note={note} onOpen={onOpenNote} />
          ))}
        </div>
      </section>

      {/* Link Notes Modal */}
      {showLinkModal && <LinkNotesModal onClose={() => setShowLinkModal(false)} />}
    </main>
  );
}

// ─────────────────────────────────────────────
// Study Notebooks — Right AI Panel
// ─────────────────────────────────────────────

function StudyNotebooksPanel() {
  const [activeTab, setActiveTab]   = useState<"summary" | "quiz">("summary");
  const [selected, setSelected]     = useState<Record<number, string>>({});
  const [chatMsg, setChatMsg]       = useState("");
  const [quizIdx, setQuizIdx]       = useState(0);

  const currentQ = QUIZ_QUESTIONS[quizIdx];
  const answered = selected[currentQ.id];
  const isCorrect = answered === currentQ.correct;

  const handleAnswer = (label: string) => {
    if (!answered) setSelected((prev) => ({ ...prev, [currentQ.id]: label }));
  };

  const handleNext = () => setQuizIdx((i) => Math.min(i + 1, QUIZ_QUESTIONS.length - 1));
  const handlePrev = () => setQuizIdx((i) => Math.max(i - 1, 0));

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
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold transition-all ${
              activeTab === tab
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
          <section aria-label="AI Summary" className="px-5 py-5 space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-primary/15">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <p className="text-[11px] font-semibold text-foreground">
                AI-generated summary of your 6 linked notes
              </p>
            </div>
            <ul className="space-y-3">
              {AI_SUMMARY_POINTS.map((point) => (
                <li key={point.id} className="flex gap-3 group">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                    {point.text}
                  </p>
                </li>
              ))}
            </ul>

            {/* Key concepts chips */}
            <div className="pt-2 border-t border-border">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Key Concepts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Inheritance", "Polymorphism", "SOLID", "Encapsulation", "UML", "Factory Pattern", "Singleton", "Abstraction"].map((kw) => (
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
                Focus on the difference between compile-time and runtime polymorphism — it appears frequently in exams.
              </p>
            </div>
          </section>
        ) : (
          <section aria-label="Smart Quiz" className="px-5 py-5 space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Question {quizIdx + 1} of {QUIZ_QUESTIONS.length}
              </p>
              <div className="flex gap-1">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-5 h-1.5 rounded-full transition-colors ${
                      i === quizIdx ? "bg-primary" : selected[QUIZ_QUESTIONS[i].id] ? "bg-accent" : "bg-muted"
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
                const isRight    = opt.label === currentQ.correct;
                let style = "bg-card border-border text-foreground hover:bg-muted hover:border-primary/40";
                if (answered) {
                  if (isRight)     style = "bg-emerald-50 border-emerald-300 text-emerald-800";
                  else if (isSelected) style = "bg-red-50 border-red-300 text-red-700";
                  else             style = "bg-card border-border text-muted-foreground opacity-60";
                }
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.label)}
                    disabled={!!answered}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-semibold text-left transition-all ${style}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                      answered && isRight ? "bg-accent text-white border-accent"
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
                disabled={quizIdx === QUIZ_QUESTIONS.length - 1}
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
    { icon: Bold,         label: "Bold"         },
    { icon: Italic,       label: "Italic"       },
    { icon: Underline,    label: "Underline"    },
  ],
  [
    { icon: AlignLeft,    label: "Align left"   },
    { icon: List,         label: "Bullet list"  },
    { icon: ListOrdered,  label: "Ordered list" },
    { icon: Quote,        label: "Blockquote"   },
  ],
  [
    { icon: Type,         label: "Heading"      },
  ],
];


function CreateNoteMain({ onSave }: { onSave: () => void }) {
  const [title,        setTitle]        = useState("");
  const [body,         setBody]         = useState("");
  const [subject,      setSubject]      = useState("");
  const [isDragging,   setIsDragging]   = useState(false);
  const [showImport,   setShowImport]   = useState(false);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const charCount = body.length;

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop      = (e: React.DragEvent) => {
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
          <input
            type="text"
            placeholder="Subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="text-xs font-semibold text-muted-foreground bg-muted border border-border rounded-lg px-2.5 py-1.5 w-36 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:text-foreground transition placeholder:font-normal"
          />
        </div>
        <button
          onClick={onSave}
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
          className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            isDragging
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
  const [name,          setName]         = useState("Raúl Andrade");
  const [email,         setEmail]        = useState("r.andrade@ufrontera.cl");
  const [institution,   setInstitution]  = useState("Universidad de La Frontera");
  const [apiKey,        setApiKey]       = useState("AIzaSy••••••••••••••••••••••");
  const [showKey,       setShowKey]      = useState(false);
  const [emailRemind,   setEmailRemind]  = useState(true);
  const [defaultSubj,   setDefaultSubj] = useState("OOP");

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
const QUESTION_COUNTS    = [5, 10, 15, 20];
const TIME_OPTIONS       = ["No limit", "5 min", "10 min", "20 min"];

const handleLaunchSession = () => {};

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
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  difficulty === d
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
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  qCount === n
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
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  timeLimit === t
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
              ["Mode",       selectedMode?.title ?? "—"],
              ["Difficulty", difficulty],
              ["Questions",  `${qCount} items`],
              ["Time",       timeLimit],
              ["Scope",      "All linked notes"],
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
                className={`group relative text-left p-6 rounded-2xl border-2 bg-gradient-to-br transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${mode.gradient} ${
                  isActive
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
  { id: 1, title: "Lesson 1: Intro to Classes & Objects",   snippet: "A class is a blueprint for creating objects...", active: false },
  { id: 2, title: "Lesson 2: Encapsulation",                snippet: "Encapsulation hides internal state using access...", active: false },
  { id: 3, title: "Lesson 3: Inheritance in Java",          snippet: "Inheritance allows a child class to acquire...", active: false },
  { id: 4, title: "Lesson 4: Polymorphism and Interfaces",  snippet: "Polymorphism enables one interface to be used...", active: true  },
  { id: 5, title: "Lesson 5: Abstract Classes",             snippet: "Abstract classes cannot be instantiated and may...", active: false },
  { id: 6, title: "Lesson 6: Design Patterns",              snippet: "Design patterns are reusable solutions to common...", active: false },
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
    options: [{ label:"A", text:"Method overloading" }, { label:"B", text:"Method overriding" }, { label:"C", text:"Operator overloading" }],
    correct: "B",
  },
  {
    id: 2,
    question: "Can a Java class implement more than one interface?",
    options: [{ label:"A", text:"No, only one" }, { label:"B", text:"Yes, multiple" }, { label:"C", text:"Only abstract classes" }],
    correct: "B",
  },
];

// ─────────────────────────────────────────────
// Note Viewer Screen
// ─────────────────────────────────────────────

function NoteViewerScreen({ onBack, darkMode, context = "notes" }: {
  onBack: () => void;
  darkMode: boolean;
  context?: "notes" | "study";
}) {
  const [editMode,   setEditMode]  = useState(false);
  const [aiTab,      setAiTab]     = useState<"chat"|"summary"|"quiz">("chat");
  const [chatMsg,    setChatMsg]   = useState("");
  const [quizAnswers,setQA]        = useState<Record<number,string>>({});
  const [sideCollapsed, setSideCollapsed] = useState(false);

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
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 mx-1 rounded-xl transition-all ${
                    note.active
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
              POO — Lesson 4: Polymorphism and Interfaces
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Last saved · Jun 20, 2026 at 2:28 PM
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {context === "study" && (
              <button
                onClick={() => {}}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-violet-300 dark:border-violet-500/40 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Summary
              </button>
            )}
            <button
              onClick={() => setEditMode(e => !e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                editMode
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
            <button className="p-2 rounded-xl border border-border hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 hover:text-red-500 transition text-muted-foreground" aria-label="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-12 py-10">
          <article className="max-w-2xl mx-auto space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>

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
            {(["chat","summary","quiz"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAiTab(tab)}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg capitalize transition-all ${
                  aiTab === tab
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
                        className={`px-3 py-2.5 rounded-2xl text-[11px] leading-relaxed ${
                          msg.role === "user"
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
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md shrink-0">Q{qi+1}</span>
                      <p className="text-xs font-bold text-foreground leading-snug">{q.question}</p>
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt) => {
                        const isSelected = ans === opt.label;
                        const isCorrect  = opt.label === q.correct;
                        let cls = "bg-card border-border text-foreground hover:bg-muted hover:border-primary/30";
                        if (ans) {
                          if (isCorrect)           cls = "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 text-emerald-800 dark:text-emerald-300";
                          else if (isSelected)     cls = "bg-red-50 dark:bg-red-500/10 border-red-300 text-red-700 dark:text-red-400";
                          else                     cls = "bg-card border-border text-muted-foreground opacity-50";
                        }
                        return (
                          <button
                            key={opt.label}
                            disabled={!!ans}
                            onClick={() => handleQuizAnswer(q.id, opt.label)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-[11px] font-medium text-left transition-all ${cls}`}
                          >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                              ans && isCorrect ? "bg-accent text-white border-accent"
                              : ans && isSelected ? "bg-red-400 text-white border-red-400"
                              : "bg-muted border-border text-muted-foreground"
                            }`}>{opt.label}</span>
                            {opt.text}
                            {ans && isCorrect  && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-accent" />}
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
  const [activeNav,    setActiveNav]    = useState("Home");
  const [nbFilter,     setNbFilter]     = useState("All Subjects");
  const [viewMode,     setViewMode]     = useState<"grid" | "list">("grid");
  const [showImport,   setShowImport]   = useState(false);
  const [darkMode,     setDarkMode]     = useState(false);
  const [hubMode,      setHubMode]      = useState("quiz");
  const [hubDiff,      setHubDiff]      = useState("Medium");
  const [hubQCount,    setHubQCount]    = useState(10);
  const [hubTime,      setHubTime]      = useState("No limit");
  const [noteViewerSource, setNoteViewerSource] = useState<"notes"|"study">("notes");

  const isNotebooks   = activeNav === "My Notes";
  const isStudy       = activeNav === "Study Notebooks";
  const isCreateNote  = activeNav === "Create Note";
  const isSettings    = activeNav === "Settings";
  const isHub         = activeNav === "Study Hub";
  const isNoteViewer  = activeNav === "Note Viewer";

  const rightPanelTitle = isStudy || isCreateNote ? "AI Study Assistant"
                        : isNotebooks              ? "Notes Overview"
                        : isSettings               ? "Account Info"
                        :                            "Weekly Progress";
  const rightPanelSub   = isStudy      ? "POO — 6 linked notes"
                        : isCreateNote ? "Analyzing your note..."
                        : isNotebooks  ? `${NOTEBOOKS.length} total notes`
                        : isSettings   ? "Raúl Andrade · UFRO"
                        :                "Jun 16 – Jun 20, 2026";

  // Note viewer is a full-page override — no shared header
  if (isNoteViewer) {
    return (
      <NoteViewerScreen
        onBack={() => setActiveNav(noteViewerSource === "study" ? "Study Notebooks" : "My Notes")}
        darkMode={darkMode}
        context={noteViewerSource}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm transition"
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
        {isCreateNote ? <CreateNoteMain onSave={() => setActiveNav("My Notes")} /> :
         isHub        ? <StudyHubMain selectedMode={hubMode} setSelectedMode={setHubMode} onLaunch={handleLaunchSession} /> :
         isStudy      ? <StudyNotebooksMain onStudy={() => setActiveNav("Study Hub")} onOpenNote={() => { setNoteViewerSource("study"); setActiveNav("Note Viewer"); }} /> :
         isNotebooks  ? <NotebooksMain filter={nbFilter} setFilter={setNbFilter} viewMode={viewMode} setViewMode={setViewMode} onImport={() => setShowImport(true)} onCreateNote={() => setActiveNav("Create Note")} onStudy={() => setActiveNav("Study Hub")} onOpenNote={() => { setNoteViewerSource("notes"); setActiveNav("Note Viewer"); }} /> :
         isSettings   ? <SettingsMain /> :
                        <HomeMain />}
        {isHub        ? <StudyHubPanel selectedMode={STUDY_MODES.find(m => m.id === hubMode)} difficulty={hubDiff} setDifficulty={setHubDiff} qCount={hubQCount} setQCount={setHubQCount} timeLimit={hubTime} setTimeLimit={setHubTime} onLaunch={handleLaunchSession} /> :
         isCreateNote || isStudy ? <StudyNotebooksPanel /> :
         isNotebooks              ? <NotebooksPanel /> :
         isSettings               ? null :
                                    <HomePanel />}
      </div>

      {/* Import modal — rendered outside columns so it overlays everything */}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
