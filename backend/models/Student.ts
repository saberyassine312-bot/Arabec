export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  role: 'student';
  xp: number;
  streak: number;
  lastLogin?: string;
  loginCount?: number;
  totalTimeSpent?: number;
  attendanceRate?: number;
  progressPercentage?: number;
  completedLessons?: string[];
}
