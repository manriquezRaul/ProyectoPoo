import React, { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Tag, MoreVertical, Calendar, Clock, Edit3, Trash2,
  CloudUpload, X, Sparkles, FileText, FileImage, FileVideo, File,
  Search, Filter, Grid3X3, List, Plus, Upload
} from "lucide-react";
import { SUBJECTS, SUBJECT_FILTERS, SUBJECT_BADGE, SubjectKey } from "../../constants";

// ─────────────────────────────────────────────
// NoteCard
// ─────────────────────────────────────────────

export interface NoteCardProps {
  note: any;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePin?: () => void;
}

export function NoteCard({ note, onOpen, onEdit, onDelete, onTogglePin }: NoteCardProps) {
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
    <article
      onClick={() => onOpen?.()}
      className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col gap-3 cursor-pointer relative"
    >
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
      <div className="text-left font-bold">
        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>

      {/* Preview */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {preview}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3 shrink-0" />
          <time>{formattedDate}</time>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="w-3 h-3 shrink-0" />
          {calculatedReadTime}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1 rounded-lg hover:bg-muted transition"
            aria-label="Edit note"
          >
            <Edit3 className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
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
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "video" | "doc";
  progress: number;
  done: boolean;
  error?: boolean;
};

const FILE_ICON: Record<UploadedFile["type"], React.ReactNode> = {
  pdf: <FileText className="w-4 h-4 text-red-500" />,
  image: <FileImage className="w-4 h-4 text-purple-500" />,
  video: <FileVideo className="w-4 h-4 text-blue-500" />,
  doc: <File className="w-4 h-4 text-primary" />,
};

export interface ImportModalProps {
  onClose: () => void;
  onUploadSuccess?: (importedNote?: any) => void;
}

export function ImportModal({ onClose, onUploadSuccess }: ImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileType = (fileName: string): UploadedFile["type"] => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) return 'image';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) return 'video';
    return 'doc';
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const uploadFile = (file: File, fileId: string) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", "/api/notas/import", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: percent } : f))
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        let importedNote = null;
        try {
          importedNote = JSON.parse(xhr.responseText);
        } catch (e) {
          console.error(e);
        }

        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, done: true, progress: 100 } : f))
        );
        if (onUploadSuccess) {
          onUploadSuccess(importedNote);
        }
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, error: true, progress: 0 } : f))
        );
        toast.error(`Error uploading ${file.name}: ${xhr.responseText || "Unknown error"}`);
      }
    };

    xhr.onerror = () => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, error: true, progress: 0 } : f))
      );
      toast.error(`Network error uploading ${file.name}`);
    };

    xhr.send(formData);
  };

  const processFiles = (fileList: FileList) => {
    const allowedExtensions = ["pdf", "docx", "doc", "txt", "md"];
    const addedFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || "";
      if (!allowedExtensions.includes(ext)) {
        toast.error(`Format .${ext} is not supported. Please upload PDF, DOCX, TXT or MD.`);
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds the 50MB size limit.`);
        return;
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: formatBytes(file.size),
        type: getFileType(file.name),
        progress: 0,
        done: false,
      };

      addedFiles.push(newFile);
      uploadFile(file, fileId);
    });

    if (addedFiles.length > 0) {
      setFiles((prev) => [...prev, ...addedFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleBrowse = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleProcessWithAI = () => {
    const completedCount = files.filter(f => f.done).length;
    if (completedCount > 0) {
      toast.success(`${completedCount} file(s) imported successfully!`);
      onClose();
    } else if (files.length > 0 && files.every(f => f.error)) {
      toast.error("No files were successfully imported.");
    } else if (files.length > 0) {
      toast.info("Files are still importing. Please wait.");
    } else {
      toast.info("Please select or drop files to import.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Import study files"
    >
      <div className="relative bg-card rounded-2xl shadow-2xl border border-border w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CloudUpload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Import Study Files</h2>
              <p className="text-[10px] text-muted-foreground mt-0.5">PDF, DOCX, TXT, MD — max 50 MB each</p>
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
              accept=".pdf,.docx,.doc,.txt,.md"
              className="sr-only"
              onChange={handleFileChange}
            />
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
              {["PDF", "DOCX", "TXT", "MD"].map((ext) => (
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
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      {FILE_ICON[f.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-foreground truncate max-w-[200px]">{f.name}</p>
                        <span className={`text-[10px] font-bold shrink-0 ml-2 ${f.error ? "text-red-400" : f.done ? "text-accent" : "text-muted-foreground"}`}>
                          {f.error ? "Error ✗" : f.done ? "Done ✓" : `${f.progress}%`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${f.error ? "bg-red-400" : f.done ? "bg-accent" : "bg-primary"}`}
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {f.size} · {f.error ? "Upload failed" : f.done ? "Upload complete" : `Uploading...`}
                      </p>
                    </div>
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

// ─────────────────────────────────────────────
// NotebooksMain
// ─────────────────────────────────────────────

export interface NotebooksMainProps {
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
  handleSearch?: (q: string) => void;
}

export function NotebooksMain({
  filter,
  setFilter,
  viewMode,
  setViewMode,
  onImport,
  onStudy,
  onOpenNote,
  notes,
  onSave,
  onDelete,
  handleSearch = () => {},
}: NotebooksMainProps) {
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
    setForm({ titulo: n.titulo || n.title, contenido: n.contenido || n.preview, subject: n.subject || "OOP", pinned: n.pinned || false });
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

// ─────────────────────────────────────────────
// NotebooksPanel
// ─────────────────────────────────────────────

export interface NotebooksPanelProps {
  notes?: any[];
  onOpenNote?: (id: string) => void;
}

export function NotebooksPanel({ notes = [], onOpenNote }: NotebooksPanelProps) {
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
