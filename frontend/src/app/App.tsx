import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  Hexagon, Clock, Search, Sun, Moon,
  X, Check, FolderArchive, FileText, Brain, Rocket,
} from "lucide-react";

// ─────────────────────────────────────────────
// Extracted Screens and Components
// ─────────────────────────────────────────────
import { Sidebar } from "./components/screens/Sidebar";
import { HomeMain, HomePanel } from "./components/screens/DashboardScreen";
import { NotebooksMain, NotebooksPanel, ImportModal } from "./components/screens/NotesScreen";
import { StudyNotebooksMain, StudyNotebooksPanel } from "./components/screens/StudyNotebooksScreen";
import { CreateNoteMain } from "./components/screens/CreateNoteScreen";
import { SettingsMain } from "./components/screens/SettingsScreen";
import { StudyHubMain, StudyHubPanel } from "./components/screens/StudyHubScreen";
import { NoteViewerScreen } from "./components/screens/NoteViewerScreen";
import { StudySessionScreen } from "./components/screens/StudySessionScreen";

// ─────────────────────────────────────────────
// Shared Constants and Types
// ─────────────────────────────────────────────
import {
  SUBJECT_FILTERS,
  SubjectKey,
  SUBJECT_BADGE,
  STUDY_MODES,
} from "./constants";

export default function App() {
  const [activeNav, setActiveNav] = useState("Home");
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
  const [studySessionData, setStudySessionData] = useState<any>(null);
  const [studySessionLoading, setStudySessionLoading] = useState(false);
  const [hubScope, setHubScope] = useState<string>("Custom Selection");
  const [selectedNotebookIds, setSelectedNotebookIds] = useState<string[]>([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [showScopeModal, setShowScopeModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>({
    id: "1",
    fullName: "Raúl Andrade",
    email: "raul.andrade@ufro.cl",
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleLaunchSession = async () => {
    if (hubScope !== "Custom Selection" && !selectedCuadernoId) {
      toast.error("Por favor selecciona un cuaderno de estudio primero.");
      return;
    }
    if (hubScope === "Custom Selection" && selectedNotebookIds.length === 0 && selectedNoteIds.length === 0) {
      toast.error("Por favor selecciona al menos un cuaderno o un apunte en el selector.");
      return;
    }
    
    setStudySessionLoading(true);
    try {
      const res = await fetch('/api/ia/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notebookId: selectedCuadernoId,
          tipoEstudio: hubMode,
          dificultad: hubDiff,
          cantidadPreguntas: hubQCount,
          scope: hubScope,
          notebookIds: selectedNotebookIds,
          noteIds: selectedNoteIds,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'No se pudo generar el contenido de estudio.');
      }

      const data = await res.json();
      if (!data || data.length === 0) {
        throw new Error("No se pudo generar contenido. Asegúrate de que tus notas tengan texto.");
      }

      setStudySessionData(data);
      
      const today = new Date().toISOString().slice(0, 10);
      await fetch('/api/dashboard/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today }),
      });

      await loadDashboard();
      setActiveNav('Study Session');
      toast.success("¡Sesión de estudio iniciada con éxito!");
    } catch (error: any) {
      console.error('Session launch failed', error);
      toast.error(error.message || 'Error al iniciar la sesión.');
    } finally {
      setStudySessionLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Por favor completa todos los campos del login.");
      return;
    }

    try {
      const res = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {}

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión.");
      }

      setCurrentUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      setLoginEmail("");
      setLoginPassword("");
      setActiveNav("Home");
      toast.success(`¡Bienvenido de vuelta, ${data.fullName}!`);
    } catch (error: any) {
      console.error("Login error", error);
      toast.error(error.message || "Error al iniciar sesión.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirm.trim()) {
      toast.error("Por favor completa todos los campos de registro.");
      return;
    }

    if (regPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (regPassword !== regConfirm) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch('/api/usuarios/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regName,
          email: regEmail,
          password: regPassword,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {}

      if (!res.ok) {
        throw new Error(data.error || "Error al registrarse.");
      }

      setCurrentUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirm("");
      setActiveNav("Home");
      toast.success("¡Cuenta creada exitosamente!");
    } catch (error: any) {
      console.error("Registration error", error);
      toast.error(error.message || "Error al registrarse.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setActiveNav("Login");
    toast.info("Sesión cerrada.");
  };

  useEffect(() => {
    loadDashboard();
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {}
    }
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

  // Removed authentication redirect effect
  const isLogin = false;
  const isRegister = false;
  const isNotebooks = activeNav === "My Notes";
  const isStudy = activeNav === "Study Notebooks";
  const isCreateNote = activeNav === "Create Note";
  const isSettings = activeNav === "Settings";
  const isHub = activeNav === "Study Hub";
  const isNoteViewer = activeNav === "Note Viewer";

  // userInitials calculation removed

  const activeCuadernoForHeader = cuadernos.find((c) => c.id === selectedCuadernoId);
  const rightPanelTitle = isStudy || isCreateNote ? "AI Study Assistant"
    : isNotebooks ? "Notes Overview"
      : isSettings ? "Account Info"
        : "Weekly Progress";
  const rightPanelSub = isStudy
    ? (activeCuadernoForHeader ? `${activeCuadernoForHeader.titulo} — ${(activeCuadernoForHeader.noteIds || []).length} linked notes` : "Select a notebook to start")
    : isCreateNote ? "Analyzing your note..."
      : isNotebooks ? `${notes.length} total notes`
        : isSettings ? (currentUser?.fullName ? `${currentUser.fullName} · UFRO` : "")
          : "Jun 16 – Jun 20, 2026";

  // Login and Register screens removed.

  const isStudySession = activeNav === "Study Session";
  if (isStudySession && studySessionData) {
    const activeCuaderno = cuadernos.find((c) => c.id === selectedCuadernoId);
    return (
      <StudySessionScreen
        tipoEstudio={hubMode}
        dificultad={hubDiff}
        sessionData={studySessionData}
        onBack={() => setActiveNav("Study Hub")}
        notebookTitle={activeCuaderno?.titulo || "No Notebook Selected"}
        notebookId={selectedCuadernoId}
        onFinished={async () => {
          await loadDashboard();
          setActiveNav("Study Hub");
        }}
        darkMode={darkMode}
      />
    );
  }

  if (isNoteViewer) {
    const activeCuaderno = cuadernos.find((c) => c.id === selectedCuadernoId);
    const viewerNotesList = noteViewerSource === "study" && activeCuaderno
      ? notes.filter((n) => activeCuaderno.noteIds?.includes(n.id))
      : notes;
    return (
      <NoteViewerScreen
        onBack={() => setActiveNav(noteViewerSource === "study" ? "Study Notebooks" : "My Notes")}
        darkMode={darkMode}
        context={noteViewerSource}
        note={selectedNote}
        notes={viewerNotesList}
        onSelectNote={(id) => setSelectedNoteId(id)}
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
      {studySessionLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/85 backdrop-blur-md">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Brain className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Analizando tus apuntes...</h2>
          <p className="text-sm text-muted-foreground animate-pulse">Nuestra IA está generando una sesión de estudio personalizada.</p>
        </div>
      )}
      
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
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-muted-foreground mr-4 bg-muted px-3 py-1.5 rounded-xl border border-border">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{(() => {
                const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
                const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
                const dateFormatted = currentTime.toLocaleDateString('es-ES', dateOptions);
                const timeFormatted = currentTime.toLocaleTimeString('es-ES', timeOptions);
                return `${dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1)} · ${timeFormatted}`;
              })()}</span>
            </div>
            
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
            {/* Notification and profile initials removed */}
          </div>
        </div>

        {/* Right panel title */}
        {!(isSettings || activeNav === "Home") && (
          <div className="w-72 shrink-0 px-5 flex flex-col justify-center border-l border-border">
            <h2 className="text-sm font-bold text-foreground">{rightPanelTitle}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{rightPanelSub}</p>
          </div>
        )}
      </div>

      {/* Body columns */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} currentUser={currentUser} onLogout={handleLogout} />
        {isCreateNote ? (
          <CreateNoteMain
            onSave={async (note) => {
              const success = await saveNote(note);
              if (success) {
                toast.success("Note created successfully!");
                setActiveNav("My Notes");
              }
            }}
          />
        ) :
          isHub ? (
            <StudyHubMain
              selectedMode={hubMode}
              setSelectedMode={setHubMode}
              onLaunch={handleLaunchSession}
              notebookTitle={activeCuadernoForHeader?.titulo || "No Notebook Selected"}
              noteCount={activeCuadernoForHeader?.noteIds?.length || 0}
            />
          ) :
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
              isNotebooks ? <NotebooksMain filter={nbFilter} setFilter={setNbFilter} viewMode={viewMode} setViewMode={setViewMode} onImport={() => setShowImport(true)} onCreateNote={() => setActiveNav("Create Note")} onStudy={() => setActiveNav("Study Hub")} onOpenNote={(id) => openNoteViewer(id, "notes")} notes={notes} loading={notesLoading} onSave={saveNote} onDelete={deleteNote} handleSearch={handleSearch} /> :
                isSettings ? (
                  <SettingsMain
                    currentUser={currentUser}
                    onUpdateUser={(updatedUser) => {
                      setCurrentUser(updatedUser);
                      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
                    }}
                  />
                ) :
                  <HomeMain dashboard={dashboard} currentUser={currentUser} currentTime={currentTime} notes={notes} />}
        {isHub ? (
          <StudyHubPanel
            selectedMode={STUDY_MODES.find(m => m.id === hubMode)}
            difficulty={hubDiff}
            setDifficulty={setHubDiff}
            qCount={hubQCount}
            setQCount={setHubQCount}
            timeLimit={hubTime}
            setTimeLimit={setHubTime}
            onLaunch={handleLaunchSession}
            scope={hubScope}
            setScope={setHubScope}
            selectedNotebookIds={selectedNotebookIds}
            selectedNoteIds={selectedNoteIds}
            onOpenSelector={() => setShowScopeModal(true)}
          />
        ) :
          isCreateNote || isStudy ? (
            <StudyNotebooksPanel
              onQuizSubmit={loadDashboard}
              selectedCuaderno={cuadernos.find((c) => c.id === selectedCuadernoId)}
              notes={notes}
            />
          ) :
            isNotebooks ? <NotebooksPanel notes={notes} onOpenNote={(id) => openNoteViewer(id, "notes")} /> :
              (isSettings || activeNav === "Home") ? null :
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
      {showImport && <ImportModal onClose={() => setShowImport(false)} onUploadSuccess={loadNotes} />}
      {showScopeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Select Study Content</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Select the notebooks and notes you want the AI to base your test on.</p>
              </div>
              <button 
                onClick={() => setShowScopeModal(false)}
                className="p-1.5 hover:bg-muted rounded-xl transition text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section: Notebooks */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-primary" /> Notebooks ({cuadernos.length})
                </h4>
                {cuadernos.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic pl-6">No notebooks created yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {cuadernos.map((c) => {
                      const isSelected = selectedNotebookIds.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedNotebookIds(selectedNotebookIds.filter(id => id !== c.id));
                            } else {
                              setSelectedNotebookIds([...selectedNotebookIds, c.id]);
                            }
                          }}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-muted/50 border-border hover:bg-muted"
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border transition flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border bg-white"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{c.titulo}</p>
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                              {c.descripcion || "No description"} • {c.noteIds?.length || 0} notes
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="h-px bg-border" />

              {/* Section: Notes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Individual Notes ({notes.length})
                </h4>
                {notes.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic pl-6">No notes created yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {notes.map((n) => {
                      const isSelected = selectedNoteIds.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedNoteIds(selectedNoteIds.filter(id => id !== n.id));
                            } else {
                              setSelectedNoteIds([...selectedNoteIds, n.id]);
                            }
                          }}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-muted/50 border-border hover:bg-muted"
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border transition flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border bg-white"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{n.titulo}</p>
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                              Subject: {n.subject || "General"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">
                Selected: {selectedNotebookIds.length} notebooks, {selectedNoteIds.length} notes
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedNotebookIds([]);
                    setSelectedNoteIds([]);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold hover:bg-muted rounded-xl transition border"
                >
                  Clear Selection
                </button>
                <button 
                  onClick={() => {
                    setHubScope("Custom Selection");
                    setShowScopeModal(false);
                  }}
                  className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition shadow-sm"
                >
                  Apply Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" richColors />
    </div>
  );
}
