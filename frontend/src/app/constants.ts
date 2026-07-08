import {
  Home, BookOpen, Settings, StickyNote,
  ClipboardList, PenLine, Layers, Zap,
} from "lucide-react";

// ─────────────────────────────────────────────
// Shared Data
// ─────────────────────────────────────────────

export const NAV_ITEMS = [
  { icon: Home, label: "Home" },
  { icon: BookOpen, label: "Study Notebooks" },
  { icon: StickyNote, label: "My Notes" },
  { icon: Settings, label: "Settings" },
];

export const SUBJECTS = [
  { id: 1, name: "Object-Oriented\nProgramming", notes: 8, icon: "⬡", progress: 72, bg: "#EFF6FF", border: "#BFDBFE" },
  { id: 2, name: "Databases", notes: 5, icon: "🗄", progress: 58, bg: "#ECFDF5", border: "#A7F3D0" },
  { id: 3, name: "Calculus", notes: 4, icon: "∫", progress: 45, bg: "#FEF3C7", border: "#FDE68A" },
  { id: 4, name: "Data Structures", notes: 4, icon: "⟨⟩", progress: 61, bg: "#F5F3FF", border: "#DDD6FE" },
  { id: 5, name: "Linear Algebra", notes: 2, icon: "Σ", progress: 30, bg: "#FFF1F2", border: "#FECDD3" },
  { id: 6, name: "Discrete Math", notes: 1, icon: "∩", progress: 20, bg: "#F0FDF4", border: "#BBF7D0" },
];

export const DAILY_NOTES_DATA = [
  { day: "Mon", notes: 3, quizzes: 1 },
  { day: "Tue", notes: 5, quizzes: 2 },
  { day: "Wed", notes: 2, quizzes: 1 },
  { day: "Thu", notes: 7, quizzes: 3 },
  { day: "Fri", notes: 4, quizzes: 2 },
  { day: "Sat", notes: 2, quizzes: 0 },
  { day: "Sun", notes: 1, quizzes: 1 },
];

// ─────────────────────────────────────────────
// Notebooks Data
// ─────────────────────────────────────────────

export const SUBJECT_FILTERS = [
  "All Subjects", "OOP", "Databases", "Calculus", "Data Structures", "Linear Algebra", "Discrete Math",
];

export type SubjectKey = "OOP" | "Databases" | "Calculus" | "Data Structures" | "Linear Algebra" | "Discrete Math";

export const SUBJECT_BADGE: Record<SubjectKey, { bg: string; text: string }> = {
  "OOP": { bg: "#EFF6FF", text: "#1D4ED8" },
  "Databases": { bg: "#ECFDF5", text: "#065F46" },
  "Calculus": { bg: "#FEF3C7", text: "#92400E" },
  "Data Structures": { bg: "#F5F3FF", text: "#5B21B6" },
  "Linear Algebra": { bg: "#FFF1F2", text: "#9F1239" },
  "Discrete Math": { bg: "#F0FDF4", text: "#14532D" },
};

// ─────────────────────────────────────────────
// Study Notebooks Data
// ─────────────────────────────────────────────

export const LINKED_NOTES = [
  {
    id: 1,
    title: "Inheritance & Polymorphism in Java",
    preview: "Polymorphism allows objects of different classes to be treated as objects of a common superclass. Method overriding enables runtime polymorphism through dynamic dispatch.",
    tags: ["OOP", "Java", "Core"],
    date: "Jun 20, 2026",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Design Patterns — Singleton & Factory",
    preview: "The Singleton pattern ensures a class has only one instance. The Factory pattern delegates object creation to subclasses, promoting loose coupling and extensibility.",
    tags: ["OOP", "Patterns"],
    date: "Jun 18, 2026",
    readTime: "6 min",
  },
  {
    id: 3,
    title: "SOLID Principles — Complete Guide",
    preview: "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Five principles that make software designs more maintainable.",
    tags: ["OOP", "Architecture"],
    date: "Jun 17, 2026",
    readTime: "8 min",
  },
  {
    id: 4,
    title: "Encapsulation & Abstraction",
    preview: "Encapsulation hides the internal state of an object and requires all interaction to be performed through an object's methods. Abstraction simplifies complex reality.",
    tags: ["OOP", "Core"],
    date: "Jun 15, 2026",
    readTime: "4 min",
  },
  {
    id: 5,
    title: "UML Class Diagrams — Notation",
    preview: "Class diagrams show the static structure of a system. They represent classes, attributes, operations, and the relationships between objects using standardized notation.",
    tags: ["OOP", "UML", "Diagrams"],
    date: "Jun 14, 2026",
    readTime: "7 min",
  },
  {
    id: 6,
    title: "Interfaces vs Abstract Classes",
    preview: "Interfaces define a contract without implementation. Abstract classes can have both abstract and concrete methods. Java 8+ allows default methods in interfaces.",
    tags: ["OOP", "Java"],
    date: "Jun 13, 2026",
    readTime: "5 min",
  },
];

// ─────────────────────────────────────────────
// Study Hub Data
// ─────────────────────────────────────────────

export const STUDY_MODES = [
  {
    id: "quiz",
    title: "Smart Quiz",
    description: "Multiple-choice questions with AI tracking and instant feedback on each answer.",
    icon: ClipboardList,
    gradient: "from-blue-500/15 to-blue-600/5",
    borderActive: "#2563EB",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    accent: "#2563EB",
    tag: "AI-Generated",
  },
  {
    id: "deep",
    title: "Deep Development",
    description: "Open-ended conceptual and coding questions requiring manual written answers.",
    icon: PenLine,
    gradient: "from-violet-500/15 to-violet-600/5",
    borderActive: "#7C3AED",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    accent: "#7C3AED",
    tag: "Critical Thinking",
  },
  {
    id: "flashcard",
    title: "Flashcard Memorize",
    description: "Interactive active recall flashcards. Flip to reveal definitions and concepts.",
    icon: Layers,
    gradient: "from-emerald-500/15 to-emerald-600/5",
    borderActive: "#10B981",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accent: "#10B981",
    tag: "Memory Boost",
  },
  {
    id: "truefalse",
    title: "True / False Blitz",
    description: "Rapid-fire true or false statements generated from your notes to test agility.",
    icon: Zap,
    gradient: "from-amber-500/15 to-amber-600/5",
    borderActive: "#F59E0B",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    accent: "#F59E0B",
    tag: "Speed Round",
  },
];

export const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
export const QUESTION_COUNTS = [5, 10, 15, 20];
export const TIME_OPTIONS = ["No limit", "5 min", "10 min", "20 min"];

// ─────────────────────────────────────────────
// Note Viewer Data
// ─────────────────────────────────────────────

export const VIEWER_NOTE_LIST = [
  { id: 1, title: "Lesson 1: Intro to Classes & Objects", snippet: "A class is a blueprint for creating objects...", active: false },
  { id: 2, title: "Lesson 2: Encapsulation", snippet: "Encapsulation hides internal state using access...", active: false },
  { id: 3, title: "Lesson 3: Inheritance in Java", snippet: "Inheritance allows a child class to acquire...", active: false },
  { id: 4, title: "Lesson 4: Polymorphism and Interfaces", snippet: "Polymorphism enables one interface to be used...", active: true },
  { id: 5, title: "Lesson 5: Abstract Classes", snippet: "Abstract classes cannot be instantiated and may...", active: false },
  { id: 6, title: "Lesson 6: Design Patterns", snippet: "Design patterns are reusable solutions to common...", active: false },
];

export const VIEWER_QUIZ = [
  {
    id: 1,
    question: "Which type of polymorphism is resolved at runtime?",
    options: [{ label: "A", text: "Method overloading" }, { label: "B", text: "Method overriding" }, { label: "C", text: "Operator overloading" }],
    correct: "B",
  },
  {
    id: 2,
    question: "Can a Java class implement more than one interface?",
    options: [{ label: "A", text: "No, only one" }, { label: "B", text: "Yes, multiple" }, { label: "C", text: "Only abstract classes" }],
    correct: "B",
  },
];
