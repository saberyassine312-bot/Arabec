export interface StudentSafe {
  id: string;
  name: string;
  email: string;
  class: string;
  role: 'student';
  xp: number;
  streak: number;
  lastLogin: string;
  loginCount: number;
  totalTimeSpent: number;
  attendanceRate: number;
  progressPercentage: number;
  activityLogs: {
    action: string;
    page: string;
    timestamp: string;
    duration: number;
    ipAddress: string;
    device: string;
  }[];
  completedLessons: string[];
  completedAssignments: string[];
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  examType: string; // 'فرض' | 'محلي' | 'جهوي'
  score: number;
  semester: string;
  academicYear: string;
  teacher: string;
  timestamp: string;
}

export interface MultipleIntelligenceResult {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  linguistic: number;
  logical: number;
  visual: number;
  kinesthetic: number;
  musical: number;
  interpersonal: number;
  intrapersonal: number;
  naturalistic: number;
  dominantIntelligence: string;
  answers: any;
  timestamp: string;
}

export interface ExerciseSubmission {
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

export interface WritingSubmission {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  topicTitle: string;
  content: string;
  wordCount: number;
  teacherFeedback: string;
  score: number | null;
  status: 'pending' | 'reviewed';
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  studentId: string;
  title: string;
  text: string;
  type: string;
  timestamp: string;
  isRead: boolean;
}

export interface SchoolAnalytics {
  totalStudents: number;
  avgAttendance: number;
  avgExamsScore: number;
  averageIntelligence: {
    linguistic: number;
    logical: number;
    visual: number;
    kinesthetic: number;
    musical: number;
    interpersonal: number;
    intrapersonal: number;
    naturalistic: number;
  };
  excSuccessRate: number;
  exercisesCount: number;
  writingsCount: number;
  leaderboard: StudentSafe[];
  classesDist: Record<string, number>;
}

const getHeaders = () => {
  const token = localStorage.getItem('school_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const schoolApi = {
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'فشل تسجيل الدخول للخدمات المدرسية الذكية.');
    }
    const data = await res.json();
    localStorage.setItem('school_jwt_token', data.token);
    localStorage.setItem('school_user', JSON.stringify(data.user));
    return data;
  },

  logout(): void {
    localStorage.removeItem('school_jwt_token');
    localStorage.removeItem('school_user');
  },

  getCurrentUser(): any {
    const user = localStorage.getItem('school_user');
    return user ? JSON.parse(user) : null;
  },

  async getStudents(className?: string): Promise<StudentSafe[]> {
    const url = className ? `/api/students?class=${encodeURIComponent(className)}` : '/api/students';
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل تحميل قائمة فصول المتعلمين.');
    return res.json();
  },

  async getStudentDetails(id: string): Promise<{
    student: StudentSafe;
    exams: ExamResult[];
    intelligence: MultipleIntelligenceResult | null;
    exercises: ExerciseSubmission[];
    writings: WritingSubmission[];
  }> {
    const res = await fetch(`/api/students/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل جلب ملف التلميذ التحليلي.');
    return res.json();
  },

  async logActivity(action: string, page: string, duration: number): Promise<boolean> {
    try {
      const res = await fetch('/api/students/log-activity', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action, page, duration })
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getExams(): Promise<ExamResult[]> {
    const res = await fetch('/api/exams', { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل جلب نتائج الامتحانات العامة.');
    return res.json();
  },

  async submitExam(data: Omit<ExamResult, 'id' | 'timestamp' | 'studentName' | 'class' | 'teacher'>): Promise<ExamResult> {
    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('فشل إرسال نقطة التقييم الجديدة.');
    return res.json();
  },

  async getIntelligence(studentId: string): Promise<MultipleIntelligenceResult> {
    const res = await fetch(`/api/intelligence/${studentId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل جلب نتيجة الذكاءات للمتعلم.');
    return res.json();
  },

  async submitIntelligence(data: Omit<MultipleIntelligenceResult, 'id' | 'timestamp' | 'studentName' | 'class' | 'dominantIntelligence'>): Promise<{ success: boolean; dominantIntelligence: string }> {
    const res = await fetch('/api/intelligence', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('فشل حفظ نتائج اختبار الذكاءات المتعددة.');
    return res.json();
  },

  async getExercises(): Promise<ExerciseSubmission[]> {
    const res = await fetch('/api/exercises', { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل تحميل نتائج تمارين المتعلمين.');
    return res.json();
  },

  async submitExercise(data: Omit<ExerciseSubmission, 'id' | 'timestamp' | 'studentName' | 'studentId' | 'class'>): Promise<ExerciseSubmission> {
    const res = await fetch('/api/exercises/submit', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('فشل إرسال نتيجة التمرين الصرفي.');
    return res.json();
  },

  async getWritings(): Promise<WritingSubmission[]> {
    const res = await fetch('/api/writing', { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل جلب مواضيع الإنشاء المرفوعة.');
    return res.json();
  },

  async getStudentWritings(studentId: string): Promise<WritingSubmission[]> {
    const res = await fetch(`/api/writing/student/${studentId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل جلب مواضيع الإنشاء وتعبير هذا التلميذ.');
    return res.json();
  },

  async submitWriting(topicTitle: string, content: string, wordCount: number): Promise<WritingSubmission> {
    const res = await fetch('/api/writing/submit', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topicTitle, content, wordCount })
    });
    if (!res.ok) throw new Error('تعذر إيداع موضوع الإنشاء للتصحيح.');
    return res.json();
  },

  async gradeWriting(id: string, score: number, teacherFeedback: string): Promise<WritingSubmission> {
    const res = await fetch(`/api/writing/${id}/grade`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ score, teacherFeedback })
    });
    if (!res.ok) throw new Error('فشل إرسال مراجعة وتقييم الإنشاء.');
    return res.json();
  },

  async getAnalytics(): Promise<SchoolAnalytics> {
    const res = await fetch('/api/analytics', { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل معالجة المؤشرات والإحصائيات الكلية.');
    return res.json();
  },

  async getNotifications(): Promise<SystemNotification[]> {
    const res = await fetch('/api/notifications', { headers: getHeaders() });
    if (!res.ok) throw new Error('تعذر جلب إشعارات التلميذ اليومية.');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const res = await fetch(`/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return res.ok;
  }
};
