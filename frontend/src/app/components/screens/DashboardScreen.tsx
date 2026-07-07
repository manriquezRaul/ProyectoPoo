import React from "react";
import {
  Flame, Target, FileText, Calendar, TrendingUp, Award, BookOpen, Clock
} from "lucide-react";
import { DAILY_NOTES_DATA } from "../../constants";
import { t } from "../../translations";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

export function StreakCard({ data }: { data: { days: number; best: number; activeDays: number } }) {
  const { days, best, activeDays } = data;
  const lang = localStorage.getItem("settings_language") || "Español";
  return (
    <article aria-label="Study streak" className="col-span-1 bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-5 text-white shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-white/15 rounded-lg"><Flame className="w-5 h-5 text-white" /></div>
        <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">🔥 {t("On fire", lang)}</span>
      </div>
      <p className="text-4xl font-extrabold leading-none">{days}</p>
      <p className="text-sm font-semibold mt-1 text-white/90">{t("Day Study Streak", lang)}</p>
      <p className="text-xs text-white/60 mt-3">{t("Best", lang)}: {best} {lang === "Español" ? "días — ¡sigue así!" : "days — keep going!"}</p>
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
  const lang = localStorage.getItem("settings_language") || "Español";
  return (
    <article aria-label="Accuracy rate" className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-accent/10 rounded-lg"><Target className="w-5 h-5 text-accent" /></div>
        <span className="flex items-center gap-1 text-xs font-semibold text-accent">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      </div>
      <p className="text-3xl font-extrabold text-foreground">{value}%</p>
      <p className="text-sm font-semibold text-muted-foreground mt-1">{t("Accuracy Rate", lang)}</p>
      <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{t("Avg. across", lang)} {quizCount} {t("quizzes", lang)}</p>
    </article>
  );
}

export function NotesCountCard({ data }: { data: { total: number; weeklyDelta: string } }) {
  const { total, weeklyDelta } = data;
  const lang = localStorage.getItem("settings_language") || "Español";
  return (
    <article aria-label="Total notes" className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-purple-100 rounded-lg"><FileText className="w-5 h-5 text-purple-600" /></div>
        <span className="flex items-center gap-1 text-xs font-semibold text-purple-600">
          <Calendar className="w-3 h-3" /> {t("This month", lang)}
        </span>
      </div>
      <p className="text-3xl font-extrabold text-foreground">{total}</p>
      <p className="text-sm font-semibold text-muted-foreground mt-1">{t("Registered Notes", lang)}</p>
      <p className="text-xs text-muted-foreground mt-1">{weeklyDelta} {t("notes from last week", lang)}</p>
    </article>
  );
}

export function WeeklyActivityChart({ weeklyActivity }: { weeklyActivity: { day: string; notes: number; quizzes: number }[] }) {
  const data = weeklyActivity && weeklyActivity.length ? weeklyActivity : DAILY_NOTES_DATA;
  const maxVal = Math.max(...data.map((d) => Math.max(d.notes, d.quizzes)));
  const chartH = 120;
  const lang = localStorage.getItem("settings_language") || "Español";
  return (
    <section aria-label="Weekly activity" className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-foreground">{t("Weekly Activity", lang)}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{t("Notes created & quizzes taken per day", lang)}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> {t("Notes", lang)}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" /> {t("Quizzes", lang)}
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
                {d.notes} {lang === "Español" ? "apuntes" : "notes"} · {d.quizzes} {lang === "Español" ? "cuestionarios" : "quizzes"}
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
  notes?: any[];
  language?: string;
  onSelectQuiz?: (quiz: any) => void;
}

export function HomeMain({ dashboard, currentUser, currentTime, notes = [], language, onSelectQuiz }: HomeMainProps) {
  const stats = dashboard || {};
  const recentQuizzes = stats.recentQuizzes || [];
  const lang = language || localStorage.getItem("settings_language") || "Español";

  const firstName = currentUser?.fullName ? currentUser.fullName.split(' ')[0] : "";
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  
  const dateFormatted = currentTime.toLocaleDateString(lang === "Español" ? 'es-ES' : 'en-US', dateOptions);
  const timeFormatted = currentTime.toLocaleTimeString(lang === "Español" ? 'es-ES' : 'en-US', timeOptions);
  const dateCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  const getSubjectBadgeStyle = (subject: string) => {
    const s = (subject || "").toLowerCase();
    if (s.includes("oop") || s.includes("program")) return { bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/30", text: "text-blue-700 dark:text-blue-400" };
    if (s.includes("data") || s.includes("base")) return { bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" };
    if (s.includes("calc") || s.includes("mate")) return { bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30", text: "text-amber-700 dark:text-amber-400" };
    if (s.includes("estruc") || s.includes("struct")) return { bg: "bg-purple-50 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-900/30", text: "text-purple-700 dark:text-purple-400" };
    return { bg: "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/40", text: "text-slate-700 dark:text-slate-300" };
  };

  const formatNoteDate = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString(lang === "Español" ? 'es-ES' : 'en-US', { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return isoString;
    }
  };

  const sessionsStartedText = lang === "Español"
    ? `Tienes ${stats.totalSessionsStarted || 0} sesiones iniciadas esta semana.`
    : `You have ${stats.totalSessionsStarted || 0} sessions started this week.`;

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-8">
      <section aria-label="Welcome header">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{t("Welcome back", lang)}, {firstName} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">{dateCapitalized} · {timeFormatted} — {sessionsStartedText}</p>
      </section>
      
      <section aria-label="Study statistics" className="grid grid-cols-3 gap-4">
        <StreakCard data={{ days: stats.streakDays || 0, best: stats.bestStreak || 0, activeDays: stats.activeDays || 0 }} />
        <AccuracyCard data={{ value: stats.accuracyValue || 0, trend: stats.accuracyTrend || "+0%", quizCount: stats.quizCount || 0 }} />
        <NotesCountCard data={{ total: stats.totalNotes || 0, weeklyDelta: stats.notesWeeklyDelta ? `+${stats.notesWeeklyDelta}` : "+0" }} />
      </section>
      
      <WeeklyActivityChart weeklyActivity={stats.weeklyActivity || DAILY_NOTES_DATA} />
      
      <section aria-label="Resumen de actividad reciente" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Apuntes Recientes */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> {lang === "Español" ? "Apuntes Recientes" : "Recent Notes"}
            </h2>
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {notes.length} {lang === "Español" ? "creados" : "created"}
            </span>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {notes.slice(0, 3).map((note: any) => {
              const badge = getSubjectBadgeStyle(note.subject);
              return (
                <article key={note.id} className="p-3 border border-border bg-muted/20 hover:bg-muted/40 rounded-xl transition flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xs font-bold text-foreground leading-snug line-clamp-1">{note.titulo}</h3>
                    <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded-md ${badge.bg} ${badge.text}`}>
                      {note.subject || "General"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {note.contenido || (lang === "Español" ? "Sin contenido." : "No content.")}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground/60" />
                    <span>{lang === "Español" ? "Creado:" : "Created:"} {formatNoteDate(note.createdAt)}</span>
                  </div>
                </article>
              );
            })}
            {notes.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <FileText className="w-8 h-8 text-muted-foreground/45 mb-2" />
                <p className="text-xs text-muted-foreground italic text-center">
                  {lang === "Español" ? "No hay apuntes creados aún." : "No notes created yet."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Cuestionarios Recientes */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" /> {lang === "Español" ? "Últimas Evaluaciones" : "Recent Quizzes"}
            </h2>
            <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {recentQuizzes.length} {lang === "Español" ? "realizadas" : "completed"}
            </span>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {recentQuizzes.slice(0, 3).map((quiz: any) => {
              const isGood = quiz.score >= 70;
              return (
                <button 
                  key={quiz.id} 
                  onClick={() => onSelectQuiz?.(quiz)}
                  className="w-full text-left p-3 border border-border bg-muted/20 hover:bg-muted/40 rounded-xl transition flex flex-col gap-2 cursor-pointer shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xs font-bold text-foreground leading-snug line-clamp-1">{quiz.subject}</h3>
                    <span className={`text-[10px] font-extrabold ${isGood ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {quiz.score}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${quiz.score}%`, background: isGood ? "#10B981" : "#F59E0B" }} />
                    </div>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                      isGood ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50" : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50"
                    }`}>
                      {t(quiz.badge || "Completado", lang)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground/60" />
                    <span>{lang === "Español" ? "Realizado:" : "Completed:"} {quiz.date}</span>
                  </div>
                </button>
              );
            })}
            {recentQuizzes.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <Target className="w-8 h-8 text-muted-foreground/45 mb-2" />
                <p className="text-xs text-muted-foreground italic text-center">
                  {lang === "Español" ? "No hay cuestionarios realizados aún." : "No quizzes completed yet."}
                </p>
              </div>
            )}
          </div>
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

export function HomePanel({}: HomePanelProps) {
  return null;
}
