import React, { useState } from "react";
import { toast } from "sonner";
import {
  Bold, Italic, Underline, AlignLeft, List, ListOrdered, Quote, Type, Save, Upload
} from "lucide-react";
import { SUBJECT_FILTERS } from "../../constants";
import { ImportModal } from "./NotesScreen";

const TOOLBAR_GROUPS = [
  [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Underline, label: "Underline" },
  ],
  [
    { icon: AlignLeft, label: "Align left" },
    { icon: List, label: "Bullet list" },
    { icon: ListOrdered, label: "Ordered list" },
    { icon: Quote, label: "Blockquote" },
  ],
  [
    { icon: Type, label: "Heading" },
  ],
];

export interface CreateNoteMainProps {
  onSave: (note: { titulo: string; contenido: string; subject: string }) => void;
}

export function CreateNoteMain({ onSave }: CreateNoteMainProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("OOP");
  const [isDragging, setIsDragging] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const charCount = body.length;

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setShowImport(true);
  };

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-background">
      {/* Editor top bar */}
      <div className="flex items-center justify-between px-8 py-3.5 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Create New Note</p>
          <span className="text-border">·</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="text-xs font-semibold text-muted-foreground bg-muted border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:text-foreground transition appearance-none cursor-pointer"
          >
            {SUBJECT_FILTERS.filter(f => f !== "All Subjects").map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            if (!title.trim()) {
              toast.error("Please enter a title for the note.");
              return;
            }
            onSave({ titulo: title, contenido: body, subject: subject });
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          <Save className="w-4 h-4" />
          Save Note
        </button>
      </div>

      {/* Formatting toolbar */}
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

      {/* Editor body */}
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
          className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${isDragging
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

      {/* Status bar */}
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

      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onUploadSuccess={(importedNote?: any) => {
            if (importedNote) {
              setTitle(importedNote.titulo || "");
              setBody(importedNote.contenido || "");
            }
          }}
        />
      )}
    </main>
  );
}
