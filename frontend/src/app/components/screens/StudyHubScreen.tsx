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
      aria-label="Configuración de la sesión"
      className="w-72 shrink-0 border-l border-border bg-card flex flex-col h-full overflow-y-auto"
    >
      <div className="px-5 py-5 border-b border-border">
        <h2 className="text-sm font-bold text-foreground">Configuración de la Sesión</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Personaliza tu sesión de estudio</p>
      </div>

      <div className="flex-1 px-5 py-5 space-y-6">
        {/* Selected mode preview */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Modo Seleccionado</p>
          {selectedMode ? (
            <div
              className="flex items-center gap-3 p-3 rounded-xl border-2"
              style={{ borderColor: selectedMode.borderActive, background: `${selectedMode.borderActive}10` }}
            >
              <div className={`p-2 rounded-lg ${selectedMode.iconBg}`}>
                <selectedMode.icon className={`w-4 h-4 ${selectedMode.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{selectedMode.title === "Smart Quiz" ? "Smart Quiz" : selectedMode.title === "Deep Development" ? "Desarrollo Profundo" : selectedMode.title === "Flashcard Memorize" ? "Tarjetas de Memoria" : "Verdadero / Falso Blitz"}</p>
                <p className="text-[10px] text-muted-foreground">{selectedMode.tag === "AI-Generated" ? "Generado por IA" : selectedMode.tag === "Critical Thinking" ? "Pensamiento Crítico" : selectedMode.tag === "Memory Boost" ? "Refuerzo de Memoria" : "Ronda Rápida"}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-dashed border-border text-center">
              <p className="text-xs text-muted-foreground">Ningún modo seleccionado aún</p>
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Gauge className="w-3 h-3" /> Dificultad
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
                {d === "Easy" ? "Fácil" : d === "Medium" ? "Medio" : "Difícil"}
              </button>
            ))}
          </div>
        </div>

        {/* Questions count */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <ClipboardList className="w-3 h-3" /> Preguntas
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
            <Timer className="w-3 h-3" /> Límite de Tiempo
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
                {t === "No limit" ? "Sin límite" : t === "5 min" ? "5 min" : t === "10 min" ? "10 min" : "20 min"}
              </button>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <BookOpenCheck className="w-3 h-3" /> Alcance del Contenido
          </p>
          <div className="p-3 bg-muted/65 border border-border rounded-xl space-y-3">
            <p className="text-[10px] text-muted-foreground leading-normal">
              Selecciona los apuntes y cuadernos de estudio que quieres incluir en esta sesión.
            </p>
            <div className="text-[10px] text-muted-foreground leading-normal space-y-0.5">
              <div>Seleccionado:</div>
              <div className="font-bold text-foreground pl-1">• {selectedNotebookIds.length} cuadernos</div>
              <div className="font-bold text-foreground pl-1">• {selectedNoteIds.length} apuntes</div>
            </div>
            <button 
              onClick={onOpenSelector}
              className="w-full text-center py-2 text-xs font-bold text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-xl transition"
            >
              Elegir apuntes/cuadernos
            </button>
          </div>
        </div>

        {/* Session summary */}
        <div className="p-3 rounded-xl bg-muted border border-border space-y-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Vista Previa de la Sesión</p>
          <div className="space-y-1">
            {[
              ["Modo", selectedMode ? (selectedMode.title === "Smart Quiz" ? "Smart Quiz" : selectedMode.title === "Deep Development" ? "Desarrollo Profundo" : selectedMode.title === "Flashcard Memorize" ? "Tarjetas de Memoria" : "Verdadero / Falso Blitz") : "—"],
              ["Dificultad", difficulty === "Easy" ? "Fácil" : difficulty === "Medium" ? "Medio" : "Difícil"],
              ["Preguntas", `${qCount} elementos`],
              ["Tiempo", timeLimit === "No limit" ? "Sin límite" : timeLimit],
              ["Alcance", scope === "Custom Selection" ? "Selección Personalizada" : scope],
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
          Iniciar Sesión
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
  quizzes?: any[];
  onSelectQuiz?: (quiz: any) => void;
}

export function StudyHubMain({
  selectedMode,
  setSelectedMode,
  onLaunch,
  notebookTitle,
  noteCount,
  quizzes = [],
  onSelectQuiz,
}: StudyHubMainProps) {
  const selected = STUDY_MODES.find((m) => m.id === selectedMode);

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8 space-y-8">
      {/* Header */}
      <section aria-label="Estudio Hub cabecera">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Centro de Estudio</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Selecciona tu Modo de Estudio</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <BookOpenCheck className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-primary">Contenido Activo:</span>
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
                  {mode.tag === "AI-Generated" ? "Generado por IA" : mode.tag === "Critical Thinking" ? "Pensamiento Crítico" : mode.tag === "Memory Boost" ? "Refuerzo de Memoria" : "Ronda Rápida"}
                </span>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${mode.iconBg}`}>
                  <mode.icon className={`w-6 h-6 ${mode.iconColor}`} />
                </div>

                <h3
                  className="text-base font-extrabold text-foreground mb-2 tracking-tight"
                  style={isActive ? { color: mode.borderActive } : {}}
                >
                  {mode.title === "Smart Quiz" ? "Smart Quiz" : mode.title === "Deep Development" ? "Desarrollo Profundo" : mode.title === "Flashcard Memorize" ? "Tarjetas de Memoria" : "Verdadero / Falso Blitz"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mode.description === "Multiple-choice questions with AI tracking and instant feedback on each answer." ? "Preguntas de opción múltiple con seguimiento de IA y retroalimentación instantánea." : mode.description === "Open-ended conceptual and coding questions requiring manual written answers." ? "Preguntas conceptuales y de codificación abiertas que requieren respuestas escritas manuales." : mode.description === "Interactive active recall flashcards. Flip to reveal definitions and concepts." ? "Tarjetas de memoria interactivas de recuerdo activo. Voltea para revelar definiciones." : "Declaraciones rápidas de verdadero o falso generadas a partir de tus apuntes para probar tu agilidad."}
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
          Iniciar Sesión de Estudio con IA
          <Rocket className="w-5 h-5" />
        </button>
        {selected && (
          <p className="text-xs text-muted-foreground">
            Iniciando <strong className="text-foreground">{selected.title === "Smart Quiz" ? "Smart Quiz" : selected.title === "Deep Development" ? "Desarrollo Profundo" : selected.title === "Flashcard Memorize" ? "Tarjetas de Memoria" : "Verdadero / Falso Blitz"}</strong> · {selected.tag === "AI-Generated" ? "Generado por IA" : selected.tag === "Critical Thinking" ? "Pensamiento Crítico" : selected.tag === "Memory Boost" ? "Refuerzo de Memoria" : "Ronda Rápida"}
          </p>
        )}
      </section>

      {/* Historial de Tests de Estudio */}
      <section aria-label="Historial de cuestionarios" className="space-y-4 pt-6 border-t border-border">
        <div>
          <h2 className="text-sm font-bold text-foreground">Historial de Tests de Estudio</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Revisa el desglose y las notas obtenidas en tus sesiones previas.</p>
        </div>

        {quizzes && quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {quizzes.map((quiz) => {
              const isGood = quiz.score >= 70;
              // Extract mode and subject
              const parts = quiz.subject ? quiz.subject.split(" — ") : [];
              const title = parts[0] || quiz.subject;
              const mode = parts[1] || "Test";
              
              return (
                <button
                  key={quiz.id}
                  onClick={() => onSelectQuiz?.(quiz)}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 text-left transition shadow-sm w-full"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">{title}</p>
                    <p className="text-[10px] text-muted-foreground">{mode} · {quiz.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className={`text-xs font-black ${isGood ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {quiz.score}%
                    </span>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                      isGood ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50" : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50"
                    }`}>
                      {quiz.badge === "Excellent" ? "Excelente" : quiz.badge === "Great" ? "Genial" : quiz.badge === "Good" ? "Bueno" : "Necesita Práctica"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-border text-center">
            <p className="text-xs text-muted-foreground italic">No has realizado ninguna sesión de estudio aún. ¡Configura una y haz clic en "Iniciar Sesión de Estudio con IA" para empezar!</p>
          </div>
        )}
      </section>
    </main>
  );
}
