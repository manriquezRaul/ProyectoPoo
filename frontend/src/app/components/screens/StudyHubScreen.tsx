import React from "react";
import {
  Gauge, ClipboardList, Timer, BookOpenCheck, Rocket, FileText, CheckCircle2, Sparkles
} from "lucide-react";
import { STUDY_MODES, DIFFICULTY_OPTIONS, QUESTION_COUNTS, TIME_OPTIONS } from "../../constants";

// ─────────────────────────────────────────────
// StudyHubPanel
// ─────────────────────────────────────────────

export interface StudyHubPanelProps {
  selectedMode: typeof STUDY_MODES[number] | undefined;
  difficulty: string;
  setDifficulty: (v: string) => void;
  qCount: number;
  setQCount: (v: number) => void;
  timeLimit: string;
  setTimeLimit: (v: string) => void;
  onLaunch: () => void;
  scope: string;
  setScope: (v: string) => void;
  selectedNotebookIds: string[];
  selectedNoteIds: string[];
  onOpenSelector: () => void;
}

export function StudyHubPanel({
  selectedMode,
  difficulty,
  setDifficulty,
  qCount,
  setQCount,
  timeLimit,
  setTimeLimit,
  onLaunch,
  scope,
  selectedNotebookIds,
  selectedNoteIds,
  onOpenSelector,
}: StudyHubPanelProps) {
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
          <div className="p-3 bg-muted/65 border border-border rounded-xl space-y-3">
            <p className="text-[10px] text-muted-foreground leading-normal">
              Select the study notes and notebooks you want to include in this session.
            </p>
            <div className="text-[10px] text-muted-foreground leading-normal space-y-0.5">
              <div>Selected:</div>
              <div className="font-bold text-foreground pl-1">• {selectedNotebookIds.length} notebooks</div>
              <div className="font-bold text-foreground pl-1">• {selectedNoteIds.length} notes</div>
            </div>
            <button 
              onClick={onOpenSelector}
              className="w-full text-center py-2 text-xs font-bold text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-xl transition"
            >
              Choose notes/notebooks
            </button>
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
              ["Scope", scope],
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
// StudyHubMain
// ─────────────────────────────────────────────

export interface StudyHubMainProps {
  selectedMode: string;
  setSelectedMode: (id: string) => void;
  onLaunch: () => void;
  notebookTitle: string;
  noteCount: number;
}

export function StudyHubMain({
  selectedMode,
  setSelectedMode,
  onLaunch,
  notebookTitle,
  noteCount,
}: StudyHubMainProps) {
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
            <span className="text-xs font-bold text-foreground">{notebookTitle}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border">
            <FileText className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">{noteCount} apuntes vinculados</span>
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
                {isActive && (
                  <div
                    className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: mode.borderActive }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <span
                  className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full mb-4"
                  style={{ background: `${mode.accent}20`, color: mode.accent }}
                >
                  {mode.tag}
                </span>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${mode.iconBg}`}>
                  <mode.icon className={`w-6 h-6 ${mode.iconColor}`} />
                </div>

                <h3
                  className="text-base font-extrabold text-foreground mb-2 tracking-tight"
                  style={isActive ? { color: mode.borderActive } : {}}
                >
                  {mode.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>

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
