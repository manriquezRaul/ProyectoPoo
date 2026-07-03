import {
  Home, BookOpen, Settings, StickyNote,
  Flame, Target, FileText, ChevronRight, Clock,
  TrendingUp, Calendar, 
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

// ─────────────────────────────────────────────
// Home Data
// ─────────────────────────────────────────────

export const STATS = {
  streak: { days: 5, best: 12, activeDays: 5 },
  accuracy: { value: 84, trend: "+4.2%", quizCount: 24 },
  notes: { total: 24, weeklyDelta: "+6" },
};

export const SUBJECTS = [
  { id: 1, name: "Object-Oriented\nProgramming", notes: 8, icon: "⬡", progress: 72, bg: "#EFF6FF", border: "#BFDBFE" },
  { id: 2, name: "Databases", notes: 5, icon: "🗄", progress: 58, bg: "#ECFDF5", border: "#A7F3D0" },
  { id: 3, name: "Calculus", notes: 4, icon: "∫", progress: 45, bg: "#FEF3C7", border: "#FDE68A" },
  { id: 4, name: "Data Structures", notes: 4, icon: "⟨⟩", progress: 61, bg: "#F5F3FF", border: "#DDD6FE" },
  { id: 5, name: "Linear Algebra", notes: 2, icon: "Σ", progress: 30, bg: "#FFF1F2", border: "#FECDD3" },
  { id: 6, name: "Discrete Math", notes: 1, icon: "∩", progress: 20, bg: "#F0FDF4", border: "#BBF7D0" },
];

export const WEEKLY_GOALS = [
  { label: "Study Sessions", done: 5, goal: 7, color: "#2563EB" },
  { label: "Quizzes Taken", done: 4, goal: 5, color: "#10B981" },
  { label: "Notes Reviewed", done: 12, goal: 15, color: "#8B5CF6" },
];

export const QUIZ_RESULTS = [
  { id: 1, subject: "OOP — Inheritance & Polymorphism", score: 94, date: "Today, 2:30 PM", status: "success", badge: "Excellent" },
  { id: 2, subject: "Databases — SQL Joins", score: 87, date: "Yesterday, 6:15 PM", status: "success", badge: "Great" },
  { id: 3, subject: "Calculus — Derivatives", score: 71, date: "Jun 18, 4:00 PM", status: "warning", badge: "Good" },
  { id: 4, subject: "OOP — Design Patterns", score: 91, date: "Jun 17, 11:20 AM", status: "success", badge: "Excellent" },
  { id: 5, subject: "Data Structures — Trees", score: 63, date: "Jun 16, 3:45 PM", status: "warning", badge: "Needs Work" },
];

export const WEEKLY_COMPLETION = 71;

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

export const NOTEBOOKS = [
  {
    id: 1,
    title: "Inheritance & Polymorphism in Java",
    preview: "Polymorphism allows objects of different classes to be treated as objects of a common superclass. The most common use is when a parent class reference is used to refer to a child class object...",
    subject: "OOP" as SubjectKey,
    date: "Jun 20, 2026",
    readTime: "5 min read",
    pinned: true,
  },
  {
    id: 2,
    title: "SQL JOIN Types — INNER, LEFT, RIGHT, FULL",
    preview: "A JOIN clause is used to combine rows from two or more tables, based on a related column. INNER JOIN returns records that have matching values in both tables...",
    subject: "Databases" as SubjectKey,
    date: "Jun 19, 2026",
    readTime: "8 min read",
    pinned: false,
  },
  {
    id: 3,
    title: "Design Patterns — Singleton & Factory",
    preview: "The Singleton pattern ensures a class has only one instance and provides a global point of access to it. Use a private constructor and a static method that returns the single instance...",
    subject: "OOP" as SubjectKey,
    date: "Jun 18, 2026",
    readTime: "6 min read",
    pinned: true,
  },
  {
    id: 4,
    title: "Derivatives — Chain Rule & Product Rule",
    preview: "The chain rule is a formula for computing the derivative of a composition of two or more functions. If h(x) = f(g(x)), then h'(x) = f'(g(x)) · g'(x)...",
    subject: "Calculus" as SubjectKey,
    date: "Jun 17, 2026",
    readTime: "4 min read",
    pinned: false,
  },
  {
    id: 5,
    title: "Binary Search Trees — Insertion & Traversal",
    preview: "A BST is a node-based binary tree data structure where each node has at most two child nodes. The left subtree contains nodes with keys less than the parent node's key...",
    subject: "Data Structures" as SubjectKey,
    date: "Jun 16, 2026",
    readTime: "7 min read",
    pinned: false,
  },
  {
    id: 6,
    title: "Normalization — 1NF, 2NF, 3NF",
    preview: "Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. First Normal Form requires atomic values in each column...",
    subject: "Databases" as SubjectKey,
    date: "Jun 15, 2026",
    readTime: "9 min read",
    pinned: false,
  },
  {
    id: 7,
    title: "Matrix Operations & Determinants",
    preview: "A matrix is a rectangular array of numbers arranged in rows and columns. Matrix multiplication is only defined when the number of columns in the first matrix equals the number of rows in the second...",
    subject: "Linear Algebra" as SubjectKey,
    date: "Jun 14, 2026",
    readTime: "6 min read",
    pinned: false,
  },
  {
    id: 8,
    title: "Graph Theory — BFS & DFS Algorithms",
    preview: "Breadth-first search explores the neighbor nodes first, before moving to the next level. It uses a queue data structure. DFS explores as far as possible along each branch before backtracking...",
    subject: "Discrete Math" as SubjectKey,
    date: "Jun 13, 2026",
    readTime: "5 min read",
    pinned: false,
  },
];

export const NOTEBOOKS_STATS = [
  { label: "Total Notes", value: "24", color: "#2563EB", bg: "#EFF6FF" },
  { label: "This Week", value: "6", color: "#10B981", bg: "#ECFDF5" },
  { label: "Pinned", value: "2", color: "#8B5CF6", bg: "#F5F3FF" },
];

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

export const AI_SUMMARY_POINTS = [
  { id: 1, text: "OOP is built on four pillars: Encapsulation, Abstraction, Inheritance, and Polymorphism — each addressing a different dimension of code organization." },
  { id: 2, text: "Inheritance enables code reuse by allowing a child class to acquire properties and behaviors of a parent class, forming an IS-A relationship." },
  { id: 3, text: "Polymorphism (runtime & compile-time) allows one interface to be used for a general class of actions, resolved at runtime via dynamic dispatch." },
  { id: 4, text: "SOLID principles ensure that class designs remain maintainable and scalable, reducing the cost of changes in large codebases." },
  { id: 5, text: "Design patterns (Singleton, Factory, Observer) are reusable solutions to commonly occurring problems in software design." },
  { id: 6, text: "UML class diagrams model relationships (association, aggregation, composition, dependency) between classes using standardized notation." },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which OOP principle states that a class should have only one reason to change?",
    options: [
      { label: "A", text: "Open/Closed Principle" },
      { label: "B", text: "Single Responsibility Principle" },
      { label: "C", text: "Liskov Substitution Principle" },
    ],
    correct: "B",
  },
  {
    id: 2,
    question: "What type of polymorphism is achieved through method overriding in Java?",
    options: [
      { label: "A", text: "Compile-time polymorphism" },
      { label: "B", text: "Parametric polymorphism" },
      { label: "C", text: "Runtime polymorphism" },
    ],
    correct: "C",
  },
  {
    id: 3,
    question: "Which design pattern ensures a class has only one instance globally?",
    options: [
      { label: "A", text: "Singleton Pattern" },
      { label: "B", text: "Factory Pattern" },
      { label: "C", text: "Observer Pattern" },
    ],
    correct: "A",
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

export const CHAT_MESSAGES = [
  {
    id: 1,
    role: "user" as const,
    text: "What is the difference between method overloading and method overriding?",
    time: "2:31 PM",
  },
  {
    id: 2,
    role: "ai" as const,
    text: "Great question! Here's the key distinction:\n\n**Method Overloading** (compile-time polymorphism) occurs when multiple methods share the same name but differ in parameters — number, type, or order. The compiler resolves which version to call.\n\n**Method Overriding** (runtime polymorphism) occurs when a subclass provides its own implementation of a method already defined in its superclass. The JVM resolves it at runtime via dynamic dispatch.",
    source: "Paragraph 2 — Polymorphism Types",
    time: "2:31 PM",
  },
  {
    id: 3,
    role: "user" as const,
    text: "Can you give me a Java example of overriding?",
    time: "2:33 PM",
  },
  {
    id: 4,
    role: "ai" as const,
    text: "Of course! Here's a minimal example:\n\n```java\nclass Animal {\n  void speak() { System.out.println(\"...\"); }\n}\nclass Dog extends Animal {\n  @Override\n  void speak() { System.out.println(\"Woof!\"); }\n}\n```\n\nWhen you call `speak()` on a `Dog` reference stored as `Animal`, Java uses the `Dog` version at runtime.",
    source: "Lesson 3 — Inheritance",
    time: "2:33 PM",
  },
];

export const VIEWER_SUMMARY = [
  "Polymorphism is one of the four pillars of OOP, allowing objects of different types to be accessed through the same interface.",
  "Runtime polymorphism is achieved via method overriding — the JVM resolves the correct method at execution time using dynamic dispatch.",
  "Compile-time polymorphism is achieved via method overloading — resolved by the compiler based on method signatures.",
  "Interfaces define a pure contract with no implementation. A class may implement multiple interfaces, bypassing Java's single-inheritance limit.",
  "The `@Override` annotation is best practice when overriding methods — it lets the compiler catch errors if the signature doesn't match.",
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
