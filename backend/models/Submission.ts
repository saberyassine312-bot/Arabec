export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  exerciseId: string;
  title: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  timestamp: string;
}
