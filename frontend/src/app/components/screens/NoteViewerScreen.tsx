import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, ChevronLeft, FileText, Clock, Sparkles, Pencil,
  Share2, Trash2, Hash, Code2, Lightbulb, CheckCircle2, X, Send, Paperclip, Brain
} from "lucide-react";
import {
  SUBJECT_FILTERS, SUBJECT_BADGE, SubjectKey,
  LINKED_NOTES, VIEWER_NOTE_LIST, VIEWER_QUIZ
} from "../../constants";

export interface NoteViewerScreenProps {
  onBack: () => void;
  darkMode: boolean;
  context?: "notes" | "study";
  note: any;
  notes?: any[];
  onSelectNote?: (id: string) => void;
  onDelete?: (id: string) => Promise<boolean>;
  onSave?: (note: any, id?: string) => Promise<boolean>;
}

export function NoteViewerScreen({
  onBack,
  darkMode,
  context = "notes",
  note,
  notes = [],
  onSelectNote,
  onDelete,
  onSave
}: NoteViewerScreenProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedSubject, setEditedSubject] = useState("OOP");
  const [aiTab, setAiTab] = useState<"chat" | "quiz">("chat");
  const [chatMsg, setChatMsg] = useState("");
  const [sideCollapsed, setSideCollapsed] = useState(false);

  // Chat states
  const [messages, setMessages] = useState<Array<{ id: string | number; role: "user" | "ai"; text: string; time: string; source?: string }>>([]);
  const [sendingMsg, setSendingMsg] = useState(false);

  // Quiz states
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState<{
    id: string | number;
    question: string;
    options: Array<{ label: string; text: string }>;
    correct: string;
    explanation?: string;
  } | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    if (note) {
      setEditedTitle(note.titulo || note.title || "");
      setEditedContent(note.contenido || note.preview || "");
      setEditedSubject(note.subject || "OOP");
    }
    // Clear chat and quiz state when note changes
    setMessages([]);
    setCurrentQuizQuestion(null);
    setQuizAnswered(null);
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

  const generateNewQuizQuestion = async () => {
    setLoadingQuiz(true);
    setQuizAnswered(null);
    try {
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const res = await fetch("/api/ia/generar", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Gemini-API-Key": apiKey
        },
        body: JSON.stringify({
          noteIds: note && note.id ? [note.id] : [],
          tipoEstudio: "quiz",
          dificultad: "Medium",
          cantidadPreguntas: 1,
          scope: "Custom Selection"
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setCurrentQuizQuestion(data[0]);
          return;
        }
      }
      throw new Error("Failed to generate from AI");
    } catch (err) {
      console.error(err);
      // Fallback to a random default question from constants
      const randomIdx = Math.floor(Math.random() * VIEWER_QUIZ.length);
      const fallbackQ = VIEWER_QUIZ[randomIdx];
      setCurrentQuizQuestion({
        ...fallbackQ,
        id: `fallback-${Date.now()}`
      });
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    if (aiTab === "quiz" && !currentQuizQuestion && !loadingQuiz) {
      generateNewQuizQuestion();
    }
  }, [aiTab]);

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      text: msgText,
      time: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setSendingMsg(true);

    try {
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const res = await fetch("/api/ia/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Gemini-API-Key": apiKey
        },
        body: JSON.stringify({
          message: msgText,
          noteContent: note ? (note.contenido || note.preview || "") : ""
        })
      });

      if (!res.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await res.json();
      const aiResponseText = data.response || data.text || data.respuesta || "";

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: "ai" as const,
        text: aiResponseText,
        time: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = {
        id: `error-${Date.now()}`,
        role: "ai" as const,
        text: "Lo siento, no pude procesar tu mensaje en este momento. Por favor verifica que la API Key de Gemini esté configurada en el backend.",
        time: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSendingMsg(false);
    }
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
              {(notes && notes.length > 0
                ? notes.map((n) => ({
                    id: n.id,
                    title: n.titulo || n.title || "Untitled",
                    snippet: n.contenido || n.preview || "",
                    active: note && n.id === note.id,
                  }))
                : (context === "study"
                  ? LINKED_NOTES.map((n, i) => ({
                      id: String(n.id),
                      title: n.title,
                      snippet: n.preview,
                      active: note ? n.title === (note.titulo || note.title) : i === 3,
                    }))
                  : VIEWER_NOTE_LIST.map((n) => ({
                      id: String(n.id),
                      title: n.title,
                      snippet: n.snippet,
                      active: note ? n.title === (note.titulo || note.title) : n.active,
                    }))
                  )
              ).map((nItem) => (
                <button
                  key={nItem.id}
                  onClick={() => {
                    if (notes && notes.length > 0) {
                      onSelectNote?.(nItem.id);
                    }
                  }}
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 mx-1 rounded-xl transition-all ${nItem.active
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted border border-transparent"
                    }`}
                  style={{ width: "calc(100% - 8px)" }}
                >
                  <FileText className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${nItem.active ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="min-w-0">
                    <p className={`text-[11px] font-semibold leading-snug ${nItem.active ? "text-primary" : "text-foreground"}`}>
                      {nItem.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{nItem.snippet}</p>
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
                <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight">
                  Polymorphism and Interfaces in Java
                </h1>

                <p className="text-sm text-foreground leading-7">
                  Polymorphism is one of the four fundamental pillars of Object-Oriented Programming.
                  The word comes from Greek and means <span className="bg-primary/15 text-primary font-semibold px-1 rounded">"many forms"</span>.
                  In Java, polymorphism allows a single interface to represent different underlying data types,
                  enabling code that is both flexible and reusable.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <Hash className="w-4 h-4 text-primary shrink-0" />
                  <h2 className="text-base font-bold text-foreground">Types of Polymorphism</h2>
                </div>

                <div className="pl-4 border-l-4 border-primary bg-primary/5 py-3 pr-4 rounded-r-xl">
                  <p className="text-sm text-foreground leading-7">
                    Java supports two types of polymorphism:{" "}
                    <span className="font-bold text-primary">compile-time</span> (method overloading) and{" "}
                    <span className="font-bold text-primary">runtime</span> (method overriding).
                    Understanding the difference is essential for writing maintainable OOP systems.
                  </p>
                </div>

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

                <div className="flex items-center gap-2 pt-2">
                  <Hash className="w-4 h-4 text-primary shrink-0" />
                  <h2 className="text-base font-bold text-foreground">Interface Declaration</h2>
                </div>

                <p className="text-sm text-foreground leading-7">
                  An <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold px-1 rounded">interface</span> in Java defines a contract — a set of method signatures that any implementing class must provide.
                  Unlike abstract classes, interfaces support multiple inheritance, allowing a class to implement several interfaces simultaneously.
                </p>

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
          {/* 2 tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            {(["chat", "quiz"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAiTab(tab)}
                className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg capitalize transition-all ${aiTab === tab
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab === "chat" ? "AI Chat" : "Quizzes"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab body */}
        <div className="flex-1 overflow-y-auto">
          {/* AI Chat */}
          {aiTab === "chat" && (
            <div className="flex flex-col h-full">
              <ul className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-2">
                    <Sparkles className="w-8 h-8 text-primary/45 animate-pulse" />
                    <p className="text-xs font-semibold text-foreground">¡Chatea con MenteColmena AI!</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Haz preguntas sobre tu apunte para resolver dudas, resumir conceptos o profundizar en la materia.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <li key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "ai" && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mr-2 mt-0.5">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="max-w-[82%] space-y-1.5">
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
                  ))
                )}
                {sendingMsg && (
                  <li className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mr-2 mt-0.5">
                      <Sparkles className="w-3 h-3 text-white animate-spin" />
                    </div>
                    <div className="max-w-[82%] bg-muted text-muted-foreground px-3 py-2.5 rounded-2xl rounded-tl-sm border border-border text-[11px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-150" />
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Quizzes */}
          {aiTab === "quiz" && (
            <section className="px-5 py-5 space-y-4 animate-in fade-in">
              {loadingQuiz ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 text-center">
                  <Brain className="w-8 h-8 text-primary animate-pulse" />
                  <p className="text-xs font-semibold text-foreground">Generando pregunta con IA...</p>
                </div>
              ) : currentQuizQuestion ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 bg-background border border-border rounded-2xl p-4 shadow-sm">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md shrink-0">Q</span>
                    <p className="text-xs font-bold text-foreground leading-snug">{currentQuizQuestion.question}</p>
                  </div>

                  <div className="space-y-1.5">
                    {currentQuizQuestion.options.map((opt) => {
                      const isSelected = quizAnswered === opt.label;
                      const isCorrect = opt.label === currentQuizQuestion.correct;
                      let cls = "bg-card border-border text-foreground hover:bg-muted hover:border-primary/30";
                      if (quizAnswered) {
                        if (isCorrect) cls = "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 text-emerald-800 dark:text-emerald-300";
                        else if (isSelected) cls = "bg-red-50 dark:bg-red-500/10 border-red-300 text-red-700 dark:text-red-400";
                        else cls = "bg-card border-border text-muted-foreground opacity-50";
                      }
                      return (
                        <button
                          key={opt.label}
                          disabled={!!quizAnswered}
                          onClick={() => setQuizAnswered(opt.label)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-[11px] font-medium text-left transition-all ${cls}`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${quizAnswered && isCorrect ? "bg-accent text-white border-accent"
                            : quizAnswered && isSelected ? "bg-red-400 text-white border-red-400"
                              : "bg-muted border-border text-muted-foreground"
                            }`}>{opt.label}</span>
                          {opt.text}
                          {quizAnswered && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-accent" />}
                          {quizAnswered && isSelected && !isCorrect && <X className="w-3.5 h-3.5 ml-auto text-red-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <div className="space-y-3 pt-2">
                      <p className={`text-[10px] font-semibold px-3 py-2 rounded-lg ${quizAnswered === currentQuizQuestion.correct ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                        {quizAnswered === currentQuizQuestion.correct ? "✓ ¡Correcto!" : `✗ La respuesta correcta es: ${currentQuizQuestion.correct}`}
                      </p>
                      {currentQuizQuestion.explanation && (
                        <div className="p-3 bg-muted rounded-xl border border-border">
                          <p className="text-[10px] font-bold text-foreground mb-1">Explicación:</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{currentQuizQuestion.explanation}</p>
                        </div>
                      )}
                      
                      <button
                        onClick={generateNewQuizQuestion}
                        className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Generar otra pregunta
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
                  <Brain className="w-10 h-10 text-primary/40 animate-pulse" />
                  <p className="text-xs font-semibold text-foreground">¿Listo para un Quiz?</p>
                  <p className="text-[10px] text-muted-foreground max-w-[200px] leading-relaxed">
                    Pon a prueba tus conocimientos sobre este apunte generando preguntas de opción múltiple con IA.
                  </p>
                  <button
                    onClick={generateNewQuizQuestion}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generar Pregunta
                  </button>
                </div>
              )}
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
