// Question types
export interface Question {
  id: string;
  subject: string;
  year: number;
  paper: string;
  question: string;
  answer: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionFilter {
  subject?: string;
  year?: string;
  paper?: string;
  searchQuery?: string;
}

// Subject types
export interface Subject {
  id: string;
  name: string;
  code: string;
  icon: string;
  topics: string;
  color: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Progress types
export interface UserProgress {
  id: string;
  userId: string;
  examsTaken: number;
  subjectsStudied: string[];
  totalQuestionsAnswered: number;
  correctAnswers: number;
  progress: number;
  lastActive: string;
  createdAt: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  subject: string;
  year: number;
  paper: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalQuestions: number;
  totalSubjects: number;
  totalUsers: number;
  totalExams: number;
  userStats?: {
    examsTaken: number;
    subjectsStudied: number;
    progress: number;
    totalQuestions: number;
    correctAnswers: number;
  } | null;
}

// UI types
export interface NavLink {
  name: string;
  href: string;
  icon?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Statistic {
  value: number;
  suffix: string;
  label: string;
}
