import React from "react";
import { 
  ArrowLeft, Calendar, Award, Trash2, CheckCircle2, 
  XCircle, Info, Sparkles, BookOpen, Clock, Target
} from "lucide-react";
import { toast } from "sonner";

export interface TestDetailScreenProps {
  quiz: any;
  onBack: () => void;
  onDelete: (id: string) => Promise<boolean>;
  darkMode: boolean;
}

export function TestDetailScreen({
  quiz,
  onBack,
  onDelete,
  darkMode,
}: TestDetailScreenProps) {
  if (!quiz) return null;

  const isGood = quiz.score >= 70;
  const isExcellent = quiz.score >= 90;
  
  // Extract info from subject (e.g. "OOP — Inheritance & Polymorphism — Smart Quiz")
  const subjectParts = quiz.subject ? quiz.subject.split(" — ") : [];
  const notebookTitle = subjectParts[0] || "Notebook";
  const modeLabel = subjectParts[1] || "Quiz";

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta evaluación de tu historial?")) {
      const success = await onDelete(quiz.id);
      if (success) {
        toast.success("Evaluación eliminada correctamente.");
        onBack();
      } else {
        toast.error("Error al eliminar la evaluación.");
      }
    }
  };

  const getScoreColor = () => {
    if (isExcellent) return "text-emerald-500 dark:text-emerald-400";
    if (isGood) return "text-blue-500 dark:text-blue-400";
    return "text-amber-500 dark:text-amber-400";
  };

  const getScoreBg = () => {
    if (isExcellent) return "bg-emerald-500/10";
    if (isGood) return "bg-blue-500/10";
    return "bg-amber-500/10";
  };

  const getScoreStroke = () => {
    if (isExcellent) return "#10B981";
    if (isGood) return "#3B82F6";
    return "#F59E0B";
  };

  return (
    <div className={`flex flex-col h-screen w-full overflow-hidden bg-background ${darkMode ? "dark" : ""}`} style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      {/* Top Header */}
      <header className="flex shrink-0 items-center justify-between px-8 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold shadow-sm transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver
          </button>
          <div>
            <h1 className="text-sm font-bold text-foreground">{notebookTitle}</h1>
            <p className="text-[10px] text-muted-foreground">{modeLabel} · Detalle del Test</p>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200/50 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold shadow-sm transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar Test
        </button>
      </header>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto bg-muted/20 px-8 py-8 space-y-6">
        {/* Test Summary Panel */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Score Gauge */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex items-center gap-6 col-span-1 md:col-span-2">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              {/* Circular SVG Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="48" 
                  cy="48" 
                  r="40" 
                  className="stroke-muted" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <circle 
                  cx="48" 
                  cy="48" 
                  r="40" 
                  stroke={getScoreStroke()} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * quiz.score) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black text-foreground">{quiz.score}%</span>
                <span className="text-[9px] text-muted-foreground font-semibold">Nota</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getScoreBg()} ${getScoreColor()}`}>
                <Award className="w-3 h-3" />
                {quiz.badge || (isGood ? "Aprobado" : "Reprobado")}
              </span>
              <h2 className="text-base font-extrabold text-foreground leading-snug">Resultado de tu Evaluación</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isExcellent 
                  ? "¡Excelente rendimiento! Has demostrado una comprensión sobresaliente de los conceptos evaluados."
                  : isGood 
                    ? "Buen trabajo. Has aprobado este cuestionario, pero aún hay áreas menores que puedes repasar para perfeccionar tu conocimiento."
                    : "Esta evaluación requiere práctica adicional. Te recomendamos releer tus apuntes vinculados y volver a intentar la sesión de estudio."
                }
              </p>
            </div>
          </div>

          {/* Card 2: Details metadata */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between col-span-1 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Fecha Realización</p>
                  <p className="text-xs font-bold text-foreground">{quiz.date || "Fecha no registrada"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Materia / Tema</p>
                  <p className="text-xs font-bold text-foreground truncate max-w-[180px]">{notebookTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Tipo de Test</p>
                  <p className="text-xs font-bold text-foreground">{modeLabel}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border my-1" />

            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Estado de Aprobación</span>
              <span className={`font-bold ${isGood ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {isGood ? "Aprobado (>=70%)" : "Repasando (<70%)"}
              </span>
            </div>
          </div>
        </section>

        {/* Detailed Questions Breakdown */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Desglose de Preguntas y Respuestas
          </h3>

          {!quiz.questions || quiz.questions.length === 0 ? (
            /* Fallback card for legacy tests */
            <div className="bg-card border border-border rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-muted rounded-full">
                <Info className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Detalles No Disponibles</h4>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                Este test se realizó en una versión previa que no almacenaba el historial detallado de preguntas y respuestas. Las futuras sesiones de estudio que completes guardarán el desglose para que puedas revisarlas aquí de forma interactiva.
              </p>
            </div>
          ) : (
            /* List of questions */
            <div className="space-y-4">
              {quiz.questions.map((q: any, idx: number) => {
                const hasOptions = q.options && q.options.length > 0;
                
                return (
                  <div key={idx} className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-3 justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Pregunta {idx + 1}</span>
                        <h4 className="text-sm font-bold text-foreground leading-snug">{q.questionText}</h4>
                      </div>
                      
                      {q.isCorrect ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correcto
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full shrink-0">
                          <XCircle className="w-3.5 h-3.5" />
                          Incorrecto
                        </span>
                      )}
                    </div>

                    {/* Options (if applicable) */}
                    {hasOptions && (
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {q.options.map((opt: any) => {
                          const isUserAnswer = q.userAnswer === opt.label;
                          const isCorrectAnswer = q.correctAnswer === opt.label;

                          let optStyle = "border-border bg-muted/20 opacity-80";
                          if (isCorrectAnswer) {
                            optStyle = "border-emerald-500/50 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 font-semibold";
                          } else if (isUserAnswer && !q.isCorrect) {
                            optStyle = "border-red-500/50 bg-red-500/5 text-red-800 dark:text-red-400 font-semibold";
                          }

                          return (
                            <div 
                              key={opt.label}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-colors ${optStyle}`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                                isCorrectAnswer 
                                  ? "bg-emerald-500 border-emerald-500 text-white" 
                                  : isUserAnswer && !q.isCorrect 
                                    ? "bg-red-500 border-red-500 text-white" 
                                    : "border-muted-foreground/30 text-muted-foreground bg-card"
                              }`}>
                                {opt.label}
                              </span>
                              <span>{opt.text}</span>
                              {isCorrectAnswer && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-500" />}
                              {isUserAnswer && !q.isCorrect && <XCircle className="w-3.5 h-3.5 ml-auto text-red-500" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* True/False text feedback if not formatted as options */}
                    {!hasOptions && (q.correctAnswer === "Verdadero" || q.correctAnswer === "Falso") && (
                      <div className="flex gap-4 pt-1">
                        {["Verdadero", "Falso"].map((val) => {
                          const isUserVal = q.userAnswer === val;
                          const isCorrectVal = q.correctAnswer === val;

                          let style = "border-border opacity-70";
                          if (isCorrectVal) {
                            style = "border-emerald-500 bg-emerald-500/5 text-emerald-600 font-bold";
                          } else if (isUserVal && !q.isCorrect) {
                            style = "border-red-500 bg-red-500/5 text-red-600 font-bold";
                          }

                          return (
                            <div key={val} className={`flex-1 py-3 px-4 rounded-xl border text-center text-xs ${style}`}>
                              {val}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Open/Deep Development Answers */}
                    {!hasOptions && q.correctAnswer !== "Verdadero" && q.correctAnswer !== "Falso" && (
                      <div className="space-y-3 pt-1">
                        <div className="p-3 bg-muted/30 border border-border rounded-xl space-y-1">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Tu Respuesta Escrita:</p>
                          <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{q.userAnswer || "Sin respuesta del estudiante."}</p>
                        </div>
                        {q.correctAnswer && (
                          <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-1">
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Respuesta Sugerida por la IA:</p>
                            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap italic">{q.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* IA Explanation / Feedback Box */}
                    {q.explanation && (
                      <div className="p-4 bg-muted/40 border border-border rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 text-foreground font-semibold text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span>Retroalimentación del Mentor IA</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
