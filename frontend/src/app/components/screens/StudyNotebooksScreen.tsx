import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Link2, Search, Tag, X, BookMarked, Calendar, Clock,
  BookOpen, Plus, Trash2, ChevronRight, ChevronLeft,
  Sparkles, Brain, CircleDot, Lightbulb, CheckCircle2, Award,
  MessageSquare, Send, FileText
} from "lucide-react";
import { SUBJECT_FILTERS, SUBJECT_BADGE, SubjectKey, SUBJECTS } from "../../constants";

// ─────────────────────────────────────────────
// LinkNotesModal
// ─────────────────────────────────────────────

export interface LinkNotesModalProps {
  activeCuaderno: any;
  notes: any[];
  onSaveCuaderno: (cuaderno: any, id?: string) => Promise<boolean>;
  onClose: () => void;
}

export function LinkNotesModal({
  activeCuaderno,
  notes = [],
  onSaveCuaderno,
  onClose,
}: LinkNotesModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set(activeCuaderno.noteIds || []));

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
      toast.success("¡Apuntes vinculados exitosamente!");
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
      aria-label="Vincular apuntes al cuaderno"
    >
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-lg mx-4 flex flex-col overflow-hidden" style={{ maxHeight: "85vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Vincular Apuntes al Cuaderno</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {selected.size} apunte{selected.size !== 1 ? "s" : ""} seleccionado{selected.size !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition text-muted-foreground hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-border shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar apuntes por título o tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              autoFocus
            />
          </div>
        </div>

        {/* Note list */}
        <ul className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {filtered.length === 0 && (
            <li className="py-10 text-center text-sm text-muted-foreground">
              No se encontraron apuntes que coincidan con la búsqueda.
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
                  <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-primary border-primary" : "border-border bg-card"
                    }`}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-xs font-bold leading-snug transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {note.title || note.titulo || "Sin Título"}
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

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0">
          <p className="text-[10px] text-muted-foreground">
            {filtered.length} apunte{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleLink}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Link2 className="w-4 h-4" />
              Guardar Vinculación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LinkedNoteCard
// ─────────────────────────────────────────────

export function LinkedNoteCard({ note, onOpen, onUnlink }: { note: any; onOpen?: () => void; onUnlink?: () => void }) {
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

// ─────────────────────────────────────────────
// StudyNotebooksMain
// ─────────────────────────────────────────────

export interface StudyNotebooksMainProps {
  notes?: any[];
  cuadernos?: any[];
  selectedCuadernoId: string | null;
  setSelectedCuadernoId: (id: string | null) => void;
  onSaveCuaderno: (cuaderno: any, id?: string) => Promise<boolean>;
  onDeleteCuaderno: (id: string) => Promise<boolean>;
  onStudy?: () => void;
  onOpenNote?: (id: string) => void;
}

export function StudyNotebooksMain({
  notes = [],
  cuadernos = [],
  selectedCuadernoId,
  setSelectedCuadernoId,
  onSaveCuaderno,
  onDeleteCuaderno,
  onStudy,
  onOpenNote,
}: StudyNotebooksMainProps) {
  const [noteSearch, setNoteSearch] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [cuadernoForm, setCuadernoForm] = useState({ titulo: "", descripcion: "", materia: "OOP" });

  const activeCuaderno = cuadernos.find((c) => c.id === selectedCuadernoId);

  if (!activeCuaderno) {
    const handleCreateSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!cuadernoForm.titulo.trim()) {
        toast.error("Por favor ingresa un título");
        return;
      }
      const success = await onSaveCuaderno(cuadernoForm);
      if (success) {
        toast.success("¡Cuaderno de estudio creado exitosamente!");
        setCuadernoForm({ titulo: "", descripcion: "", materia: "OOP" });
        setShowCreateForm(false);
      }
    };

    return (
      <main className="flex-1 min-w-0 overflow-y-auto px-8 py-7 space-y-6">
        <section aria-label="Cuadernos de estudio cabecera" className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Cuadernos de Estudio</p>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Mis Cuadernos de Estudio</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {cuadernos.length} cuadernos registrados en la base de datos
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "#fff" }}
          >
            <Plus className="w-4 h-4" />
            Crear Cuaderno
          </button>
        </section>

        {showCreateForm && (
          <form onSubmit={handleCreateSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm max-w-xl transition-all duration-150 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-sm font-bold text-foreground">Nuevo Cuaderno de Estudio</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Ej: Programación Orientada a Objetos"
                  value={cuadernoForm.titulo}
                  onChange={(e) => setCuadernoForm((f) => ({ ...f, titulo: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Materia</label>
                  <select
                    value={cuadernoForm.materia}
                    onChange={(e) => setCuadernoForm((f) => ({ ...f, materia: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    {SUBJECT_FILTERS.filter((f) => f !== "All Subjects").map((f) => (
                      <option key={f} value={f}>{f === "OOP" ? "OOP" : f === "Databases" ? "Bases de Datos" : f === "Calculus" ? "Cálculo" : f === "Data Structures" ? "Estructuras de Datos" : f === "Linear Algebra" ? "Álgebra Lineal" : "Matemática Discreta"}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Descripción</label>
                <textarea
                  placeholder="¿De qué trata este cuaderno de estudio?"
                  value={cuadernoForm.descripcion}
                  onChange={(e) => setCuadernoForm((f) => ({ ...f, descripcion: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow hover:bg-primary/95 transition">Crear</button>
              <button type="button" onClick={() => { setShowCreateForm(false); setCuadernoForm({ titulo: "", descripcion: "", materia: "OOP" }); }} className="px-5 py-2 rounded-xl bg-card border text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition">Cancelar</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cuadernos.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-card border border-dashed border-border rounded-2xl space-y-3">
              <BookOpen className="w-10 h-10 text-muted-foreground/60 mx-auto" />
              <p className="text-sm font-semibold text-muted-foreground">No hay cuadernos de estudio registrados en la base de datos</p>
              <p className="text-xs text-muted-foreground/80">¡Crea tu primer cuaderno de estudio para comenzar!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
              >
                Crear Primer Cuaderno
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
                        {c.materia === "OOP" ? "OOP" : c.materia === "Databases" ? "Bases de Datos" : c.materia === "Calculus" ? "Cálculo" : c.materia === "Data Structures" ? "Estructuras de Datos" : c.materia === "Linear Algebra" ? "Álgebra Lineal" : "Matemática Discreta"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("¿Estás seguro de que quieres eliminar este cuaderno de estudio?")) {
                            onDeleteCuaderno(c.id);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title="Eliminar Cuaderno"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-base font-extrabold text-foreground leading-snug group-hover:text-primary transition-colors">{c.titulo}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.descripcion || "Sin descripción."}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-3 text-[10px] text-muted-foreground font-semibold">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-primary" />
                      {noteCount} apunte{noteCount !== 1 ? "s" : ""} vinculado{noteCount !== 1 ? "s" : ""}
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
    toast.info("Apunte desvinculado del cuaderno de estudio.");
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
          Volver a todos los cuadernos
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                Cuaderno de Estudio
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: (SUBJECT_BADGE[activeCuaderno.materia as SubjectKey] || { bg: "#F3F4F6", text: "#111827" }).bg,
                  color: (SUBJECT_BADGE[activeCuaderno.materia as SubjectKey] || { bg: "#F3F4F6", text: "#111827" }).text,
                }}
              >
                {activeCuaderno.materia === "OOP" ? "OOP" : activeCuaderno.materia === "Databases" ? "Bases de Datos" : activeCuaderno.materia === "Calculus" ? "Cálculo" : activeCuaderno.materia === "Data Structures" ? "Estructuras de Datos" : activeCuaderno.materia === "Linear Algebra" ? "Álgebra Lineal" : "Matemática Discreta"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {activeCuaderno.titulo}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {activeCuaderno.descripcion || "Sin descripción."}
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {linkedNotes.length} apunte{linkedNotes.length !== 1 ? "s" : ""} vinculado{linkedNotes.length !== 1 ? "s" : ""} · Creado el {new Date(activeCuaderno.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
          <button
            onClick={onStudy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 shrink-0"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", color: "#fff" }}
          >
            <Sparkles className="w-4 h-4" />
            Estudiar Ahora
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
          Vincular Apuntes Existentes
        </button>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar apuntes vinculados..."
            value={noteSearch}
            onChange={(e) => setNoteSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-card rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition shadow-sm"
          />
        </div>
        <span className="ml-auto text-xs text-muted-foreground shrink-0 font-medium">
          {filtered.length} de {linkedNotes.length} apuntes
        </span>
      </section>

      {/* Linked note cards grid */}
      <section aria-label="Linked notes">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-card border border-dashed border-border rounded-2xl space-y-3">
            <BookMarked className="w-10 h-10 text-muted-foreground/60 mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">Aún no hay apuntes vinculados a este cuaderno de estudio</p>
            <p className="text-xs text-muted-foreground/80">¡Vincula apuntes existentes para comenzar a resumir y generar cuestionarios!</p>
            <button
              onClick={() => setShowLinkModal(true)}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
            >
              Vincular Apuntes Ahora
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
// StudyNotebooksPanel
// ─────────────────────────────────────────────

export interface StudyNotebooksPanelProps {
  onQuizSubmit?: () => void;
  selectedCuaderno?: any;
  notes?: any[];
}

export function StudyNotebooksPanel({
  onQuizSubmit,
  selectedCuaderno,
  notes = [],
}: StudyNotebooksPanelProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "quiz">("chat");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [chatMsg, setChatMsg] = useState("");
  const [quizIdx, setQuizIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Chat states
  const [messages, setMessages] = useState<Array<{ id: string | number; role: "user" | "ai"; text: string; time: string; source?: string }>>([]);
  const [sendingMsg, setSendingMsg] = useState(false);

  // Clear chat when notebook changes
  useEffect(() => {
    setMessages([]);
  }, [selectedCuaderno]);

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

  const dynamicSummaryPoints = linkedNotes.map((note, index) => {
    const title = note.title || note.titulo || "Untitled Note";
    const content = note.contenido || note.preview || "";
    const shortDesc = content.length > 90 ? content.substring(0, 90) + "..." : content;
    return {
      id: note.id || index,
      text: `${title}: ${shortDesc || "No content provided yet."}`
    };
  });

  const keyConcepts = Array.from(new Set(
    linkedNotes.map(n => n.subject || "General")
  )).filter(Boolean);
  const displayConcepts = keyConcepts.length > 0 ? keyConcepts : [selectedCuaderno.materia || "Study Guide"];

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
  const handlePrev = () => setQuizIdx((i) => Math.max(i - 1, 0));

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
      
      // Concatenate the content of all linked notes to serve as context for the notebook
      const combinedNotesContent = linkedNotes.map(n => {
        const title = n.title || n.titulo || "Untitled Note";
        const content = n.contenido || n.preview || "";
        return `Nota: ${title}\nContenido:\n${content}`;
      }).join("\n\n");

      const res = await fetch("/api/ia/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Gemini-API-Key": apiKey
        },
        body: JSON.stringify({
          message: msgText,
          noteContent: combinedNotesContent || "No hay notas vinculadas en este cuaderno de estudio."
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
    <aside
      aria-label="AI Study Panel"
      className="w-80 shrink-0 border-l border-border bg-card flex flex-col h-full"
    >
      {/* Tabs */}
      <div className="flex shrink-0 border-b border-border">
        {(["chat", "quiz"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold transition-all ${activeTab === tab
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
          >
            {tab === "chat"
              ? <><MessageSquare className="w-3.5 h-3.5" /> AI Chat</>
              : <><CircleDot className="w-3.5 h-3.5" /> Smart Quiz</>
            }
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "chat" ? (
          <div className="flex flex-col h-full min-h-[300px]">
            <ul className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 py-8 space-y-2">
                  <Sparkles className="w-8 h-8 text-primary/45 animate-pulse" />
                  <p className="text-xs font-semibold text-foreground">¡Chatea con MenteColmena AI!</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Haz preguntas sobre tu cuaderno de estudio para resolver dudas, resumir conceptos o profundizar en la materia.
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
                setActiveTab("chat");
                handleSendMessage(chatMsg);
                setChatMsg("");
              }
            }}
            className="flex-1 text-xs text-foreground bg-transparent placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={() => { if (chatMsg.trim()) { setActiveTab("chat"); handleSendMessage(chatMsg); setChatMsg(""); } }}
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
