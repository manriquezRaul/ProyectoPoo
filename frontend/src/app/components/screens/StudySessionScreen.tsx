import React, { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Award, CheckCircle2, Sparkles, Brain, RefreshCw
} from "lucide-react";

export interface StudySessionScreenProps {
  tipoEstudio: string;
  dificultad: string;
  sessionData: any[];
  onBack: () => void;
  notebookTitle: string;
  notebookId: string | null;
  onFinished: (score: number) => void;
  darkMode: boolean;
}

export function StudySessionScreen({
  tipoEstudio,
  dificultad,
  sessionData,
  onBack,
  notebookTitle,
  notebookId,
  onFinished,
  darkMode,
}: StudySessionScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);
  const [userAnswerText, setUserAnswerText] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [trueFalseAnswers, setTrueFalseAnswers] = useState<Record<number, boolean>>({});
  const [flashcardRecall, setFlashcardRecall] = useState<Record<number, boolean>>({});
  const [deepAnswers, setDeepAnswers] = useState<Record<number, { score: number; feedback: string; improvements: string }>>({});
  
  const [isFinished, setIsFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentItem = sessionData[currentIndex];

  const handleNext = () => {
    setSelectedAnswer(null);
    setTrueFalseAnswer(null);
    setUserAnswerText("");
    setEvaluationResult(null);
    setCardFlipped(false);

    if (currentIndex < sessionData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSelectQuizOption = (label: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(label);
    setQuizAnswers(prev => ({ ...prev, [currentIndex]: label }));
  };

  const handleSelectTrueFalse = (answer: boolean) => {
    if (trueFalseAnswer !== null) return;
    setTrueFalseAnswer(answer);
    setTrueFalseAnswers(prev => ({ ...prev, [currentIndex]: answer }));
  };

  const handleRecallFlashcard = (gotIt: boolean) => {
    setFlashcardRecall(prev => ({ ...prev, [currentIndex]: gotIt }));
    handleNext();
  };

  const handleEvaluateDeep = async () => {
    if (!userAnswerText.trim()) {
      toast.error("Please type your response before submitting.");
      return;
    }
    setEvaluating(true);
    try {
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const res = await fetch('/api/ia/evaluar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Gemini-API-Key': apiKey
        },
        body: JSON.stringify({
          question: currentItem.question,
          studentAnswer: userAnswerText,
          rubric: currentItem.rubric || "",
        }),
      });

      if (!res.ok) throw new Error("Evaluation request failed.");
      const data = await res.json();
      setEvaluationResult(data);
      setDeepAnswers(prev => ({
        ...prev,
        [currentIndex]: {
          score: data.score,
          feedback: data.feedback,
          improvements: data.improvements,
        }
      }));
      toast.success("Answer evaluated by AI!");
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to evaluate answer.");
    } finally {
      setEvaluating(false);
    }
  };

  let finalScore = 0;
  if (tipoEstudio === "quiz") {
    let correctCount = 0;
    sessionData.forEach((item, idx) => {
      if (quizAnswers[idx] === item.correct) correctCount++;
    });
    finalScore = Math.round((correctCount / sessionData.length) * 100);
  } else if (tipoEstudio === "truefalse") {
    let correctCount = 0;
    sessionData.forEach((item, idx) => {
      if (trueFalseAnswers[idx] === item.correctAnswer) correctCount++;
    });
    finalScore = Math.round((correctCount / sessionData.length) * 100);
  } else if (tipoEstudio === "flashcard") {
    let correctCount = 0;
    sessionData.forEach((_, idx) => {
      if (flashcardRecall[idx] === true) correctCount++;
    });
    finalScore = Math.round((correctCount / sessionData.length) * 100);
  } else if (tipoEstudio === "deep") {
    let totalScore = 0;
    sessionData.forEach((_, idx) => {
      totalScore += deepAnswers[idx]?.score || 0;
    });
    finalScore = Math.round(totalScore / sessionData.length);
  }

  const handleSubmitResults = async () => {
    setSubmitting(true);
    try {
      const modeLabel = 
        tipoEstudio === "quiz" ? "Smart Quiz" :
        tipoEstudio === "truefalse" ? "True / False Blitz" :
        tipoEstudio === "flashcard" ? "Flashcard Memorize" : "Deep Development";

      const questionsWithAnswers = sessionData.map((item, idx) => {
        let userAnswer = "";
        let isCorrect = false;
        
        if (tipoEstudio === "quiz") {
          userAnswer = quizAnswers[idx] || "";
          isCorrect = userAnswer === item.correct;
        } else if (tipoEstudio === "truefalse") {
          userAnswer = trueFalseAnswers[idx] !== undefined ? (trueFalseAnswers[idx] ? "Verdadero" : "Falso") : "";
          isCorrect = trueFalseAnswers[idx] === item.correctAnswer;
        } else if (tipoEstudio === "flashcard") {
          userAnswer = flashcardRecall[idx] ? "Recordado" : "No recordado";
          isCorrect = flashcardRecall[idx] === true;
        } else if (tipoEstudio === "deep") {
          userAnswer = deepAnswers[idx] ? `Evaluado (Nota: ${deepAnswers[idx].score})` : "";
          isCorrect = (deepAnswers[idx]?.score || 0) >= 70;
        }

        return {
          questionText: item.question || item.statement || "",
          options: item.options || [],
          correctAnswer: item.correct !== undefined ? String(item.correct) : item.correctAnswer !== undefined ? (item.correctAnswer ? "Verdadero" : "Falso") : item.answer || item.suggestedAnswer || "",
          userAnswer: userAnswer,
          isCorrect: isCorrect,
          explanation: item.explanation || (deepAnswers[idx] ? `Retroalimentación: ${deepAnswers[idx].feedback}. Sugerencias: ${deepAnswers[idx].improvements}` : "") || ""
        };
      });

      const quizResult = {
        subject: `${notebookTitle} — ${modeLabel}`,
        score: finalScore,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: finalScore >= 70 ? "success" : "warning",
        badge: finalScore >= 90 ? "Excellent" : finalScore >= 80 ? "Great" : finalScore >= 70 ? "Good" : "Needs Work",
        goalMet: finalScore >= 70,
        questions: questionsWithAnswers
      };

      const res = await fetch('/api/dashboard/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizResult),
      });

      if (!res.ok) throw new Error('Quiz submit failed');

      toast.success(`Study session results saved!`);
      onFinished(finalScore);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save results.");
    } finally {
      setSubmitting(false);
    }
  };

  const getThemeColor = () => {
    switch(tipoEstudio) {
      case "quiz": return { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40", border: "#2563EB", hover: "hover:bg-blue-50 dark:hover:bg-blue-950/20" };
      case "deep": return { text: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40", border: "#7C3AED", hover: "hover:bg-violet-50 dark:hover:bg-violet-950/20" };
      case "flashcard": return { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", border: "#10B981", hover: "hover:bg-emerald-50 dark:hover:bg-emerald-950/20" };
      case "truefalse": return { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", border: "#F59E0B", hover: "hover:bg-amber-50 dark:hover:bg-amber-950/20" };
      default: return { text: "text-primary", bg: "bg-primary/10", border: "#2563EB", hover: "hover:bg-primary/5" };
    }
  };

  const colors = getThemeColor();

  return (
    <div className={`flex flex-col h-screen w-full overflow-hidden bg-background ${darkMode ? "dark" : ""}`} style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      {/* Top Session Bar */}
      <header className="flex shrink-0 items-center justify-between px-8 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (window.confirm("¿Seguro que quieres salir de esta sesión? Perderás el progreso actual.")) {
                onBack();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold shadow-sm transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Salir de la sesión
          </button>
          <div>
            <h1 className="text-sm font-bold text-foreground">{notebookTitle}</h1>
            <p className="text-[10px] text-muted-foreground">Modo de Estudio: {tipoEstudio === "quiz" ? "Smart Quiz" : tipoEstudio === "truefalse" ? "True/False Blitz" : tipoEstudio === "flashcard" ? "Flashcards" : "Deep Development"}</p>
          </div>
        </div>

        {!isFinished && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground">{currentIndex + 1} de {sessionData.length}</span>
            <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / sessionData.length) * 100}%`, backgroundColor: colors.border }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 bg-muted/20">
        {isFinished ? (
          /* Finished / Summary Screen */
          <div className="w-full max-w-lg p-8 rounded-3xl border border-border bg-card shadow-xl flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-500 mb-2">
              <Award className="w-10 h-10 animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">¡Felicitaciones!</h2>
              <p className="text-sm text-muted-foreground mt-1">Has completado la sesión de estudio con Inteligencia Artificial.</p>
            </div>

            <div className="w-full p-6 rounded-2xl bg-muted/40 border border-border flex flex-col items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Calificación de Sesión</span>
              <span className="text-4xl font-black text-foreground" style={{ color: colors.border }}>
                {finalScore}%
              </span>
              <div className="flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sesión Terminada
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={onBack}
                className="flex-1 py-3 px-4 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold transition"
              >
                Volver al Hub
              </button>
              <button 
                onClick={handleSubmitResults}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: colors.border }}
              >
                {submitting ? "Guardando..." : "Guardar Progreso"}
              </button>
            </div>
          </div>
        ) : (
          /* Active Question Cards */
          <div className="w-full max-w-2xl p-6 md:p-8 rounded-3xl border border-border bg-card shadow-xl flex flex-col space-y-6">
            
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {tipoEstudio === "quiz" ? "Smart Quiz" : tipoEstudio === "truefalse" ? "True / False Blitz" : tipoEstudio === "flashcard" ? "Flashcard Memorize" : "Deep Development"}
              </span>
              <span className="text-xs text-muted-foreground">Dificultad: <strong className="text-foreground">{dificultad}</strong></span>
            </div>

            {tipoEstudio === "quiz" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-foreground leading-snug">{currentItem.question}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {currentItem.options.map((opt: any) => {
                    const isSelected = selectedAnswer === opt.label;
                    const isCorrect = opt.label === currentItem.correct;
                    const hasAnswered = selectedAnswer !== null;

                    let btnStyle = "border-border hover:bg-muted/30";
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400";
                      } else if (isSelected) {
                        btnStyle = "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400";
                      } else {
                        btnStyle = "opacity-50 border-border";
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        disabled={hasAnswered}
                        onClick={() => handleSelectQuizOption(opt.label)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left text-sm font-semibold transition-all ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/30 text-muted-foreground"}`}>
                          {opt.label}
                        </span>
                        <span className="text-foreground">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 animate-in slide-in-from-bottom-2 duration-200">
                    <p className="text-xs font-bold text-foreground">
                      {selectedAnswer === currentItem.correct ? "🎉 ¡Correcto!" : `❌ Incorrecto (Correcta: Opción ${currentItem.correct})`}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{currentItem.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {tipoEstudio === "truefalse" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-foreground leading-snug">{currentItem.statement}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {[true, false].map((val) => {
                    const isSelected = trueFalseAnswer === val;
                    const isCorrect = val === currentItem.correctAnswer;
                    const hasAnswered = trueFalseAnswer !== null;

                    let btnStyle = "border-border hover:bg-muted/30";
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400";
                      } else if (isSelected) {
                        btnStyle = "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400";
                      } else {
                        btnStyle = "opacity-50 border-border";
                      }
                    }

                    return (
                      <button
                        key={val ? "true" : "false"}
                        disabled={hasAnswered}
                        onClick={() => handleSelectTrueFalse(val)}
                        className={`flex flex-col items-center gap-2 p-6 rounded-xl border text-center font-bold text-base transition-all ${btnStyle}`}
                      >
                        <span className="text-lg">{val ? "Verdadero" : "Falso"}</span>
                      </button>
                    );
                  })}
                </div>

                {trueFalseAnswer !== null && (
                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 animate-in slide-in-from-bottom-2 duration-200">
                    <p className="text-xs font-bold text-foreground">
                      {trueFalseAnswer === currentItem.correctAnswer ? "🎉 ¡Correcto!" : "❌ Incorrecto"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{currentItem.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {tipoEstudio === "flashcard" && (
              <div className="flex flex-col items-center space-y-6">
                <div 
                  style={{ perspective: "1000px" }} 
                  className="w-full max-w-md h-64 cursor-pointer"
                  onClick={() => setCardFlipped(!cardFlipped)}
                >
                  <div 
                    style={{ 
                      transformStyle: "preserve-3d", 
                      transform: cardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 0.6s"
                    }} 
                    className="relative w-full h-full rounded-2xl border-2 border-border shadow-md"
                  >
                    {/* Front Side */}
                    <div 
                      style={{ backfaceVisibility: "hidden" }} 
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-card text-center rounded-2xl"
                    >
                      <Brain className="w-8 h-8 text-primary/40 mb-4" />
                      <h4 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-widest">Pregunta / Concepto</h4>
                      <p className="text-lg font-bold text-foreground leading-relaxed">{currentItem.question}</p>
                      <span className="text-[10px] text-muted-foreground mt-8 font-semibold uppercase tracking-wider animate-pulse">Haz clic para ver la respuesta</span>
                    </div>
                    
                    {/* Back Side */}
                    <div 
                      style={{ 
                        backfaceVisibility: "hidden", 
                        transform: "rotateY(180deg)" 
                      }} 
                      className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-emerald-500/5 text-center rounded-2xl overflow-y-auto"
                    >
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4" />
                      <h4 className="text-sm font-bold text-emerald-600/80 mb-1 uppercase tracking-widest">Respuesta</h4>
                      <p className="text-base font-semibold text-foreground leading-relaxed">{currentItem.answer}</p>
                      <span className="text-[10px] text-muted-foreground mt-8 font-semibold uppercase tracking-wider">Haz clic para voltear al frente</span>
                    </div>
                  </div>
                </div>

                {cardFlipped && (
                  <div className="flex gap-4 w-full max-w-xs animate-in slide-in-from-bottom-2 duration-200">
                    <button
                      onClick={() => handleRecallFlashcard(false)}
                      className="flex-1 py-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold shadow-sm transition"
                    >
                      Repasar de nuevo
                    </button>
                    <button
                      onClick={() => handleRecallFlashcard(true)}
                      className="flex-1 py-3 border border-emerald-200 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl text-xs font-bold shadow-sm transition"
                    >
                      ¡Lo recordé!
                    </button>
                  </div>
                )}
              </div>
            )}

            {tipoEstudio === "deep" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-foreground leading-snug">{currentItem.question}</h3>
                
                {evaluationResult === null ? (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Escribe tu respuesta conceptual o código aquí..."
                      value={userAnswerText}
                      onChange={(e) => setUserAnswerText(e.target.value)}
                      disabled={evaluating}
                      className="w-full h-44 p-4 border border-border rounded-2xl bg-muted/10 text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none leading-relaxed transition"
                    />
                    <button
                      disabled={evaluating || !userAnswerText.trim()}
                      onClick={handleEvaluateDeep}
                      className="w-full py-3.5 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: colors.border }}
                    >
                      {evaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          El Mentor IA está evaluando tu respuesta...
                        </>
                      ) : (
                        "Enviar para Evaluación de IA"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="p-4 rounded-xl border border-border flex items-center justify-between" style={{ backgroundColor: `${colors.border}10` }}>
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nota de Evaluación de IA</h4>
                        <p className="text-2xl font-black mt-1" style={{ color: colors.border }}>{evaluationResult.score} / 100</p>
                      </div>
                      <div className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: colors.border }}>
                        {evaluationResult.score >= 80 ? "Excelente Trabajo" : evaluationResult.score >= 60 ? "Buen Progreso" : "Requiere Repasar"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                        <h4 className="text-xs font-bold text-foreground">Retroalimentación Constructiva</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{evaluationResult.feedback}</p>
                      </div>
                      <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                        <h4 className="text-xs font-bold text-foreground">Sugerencias de Mejora</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{evaluationResult.improvements}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                      <h4 className="text-xs font-bold text-foreground">Esbozo de Respuesta Sugerida</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">{currentItem.suggestedAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions Bar */}
            {!isFinished && (
              <div className="flex justify-end pt-4 border-t border-border">
                {(
                  (tipoEstudio === "quiz" && selectedAnswer !== null) ||
                  (tipoEstudio === "truefalse" && trueFalseAnswer !== null) ||
                  (tipoEstudio === "deep" && evaluationResult !== null)
                ) && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition"
                    style={{ backgroundColor: colors.border }}
                  >
                    {currentIndex < sessionData.length - 1 ? "Siguiente Pregunta" : "Ver Resultados"}
                  </button>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
