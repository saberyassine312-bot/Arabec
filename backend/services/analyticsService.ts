import { dbCollections } from '../db/localDb';

export class AnalyticsService {
  /**
   * Calculates high-level overview statistics for the platform.
   */
  static getOverviewStats() {
    const usersDb = dbCollections.getCollection<any>('users');
    const exercisesDb = dbCollections.getCollection<any>('exercise_submissions');
    const examsDb = dbCollections.getCollection<any>('exam_results');

    const students = usersDb.find(u => u.role === 'student');
    const exercises = exercisesDb.find();
    const exams = examsDb.find();

    const totalStudents = students.length;
    const totalExercises = exercises.length;

    // Calculate General Average Grade across all exams
    let classAverage = 14.5;
    if (exams.length > 0) {
      const sum = exams.reduce((acc, current) => acc + (current.score || 0), 0);
      classAverage = parseFloat((sum / exams.length).toFixed(2));
    }

    // Determine Top and Bottom student based on XP or average score
    let topStudent = 'لا يوجد';
    let bottomStudent = 'لا يوجد';

    if (students.length > 0) {
      // Find highest and lowest XP students as fallback, or compute from exams
      const studentsWithExams = students.map(s => {
        const studentExams = exams.filter(e => e.studentId === s.id);
        const avgScore = studentExams.length > 0
          ? studentExams.reduce((acc, curr) => acc + curr.score, 0) / studentExams.length
          : null;
        return {
          name: s.name,
          xp: s.xp || 0,
          avgScore
        };
      });

      // Sort by XP to find top/bottom
      const sortedStudents = [...studentsWithExams].sort((a, b) => b.xp - a.xp);
      topStudent = sortedStudents[0]?.name || 'التلميذ دحماني 1';
      bottomStudent = sortedStudents[sortedStudents.length - 1]?.name || 'التلميذ دحماني 30';
    }

    return {
      totalStudents,
      totalExercises,
      classAverage,
      topStudent,
      bottomStudent
    };
  }

  /**
   * Performs advanced performance analytics including success rate, lesson mastery, and common errors.
   */
  static getAdvancedAnalytics() {
    const exercisesDb = dbCollections.getCollection<any>('exercise_submissions');
    const usersDb = dbCollections.getCollection<any>('users');
    const examsDb = dbCollections.getCollection<any>('exam_results');

    const exercises = exercisesDb.find();
    const students = usersDb.find(u => u.role === 'student');
    const exams = examsDb.find();

    // 1. Success Rate
    const totalExercises = exercises.length;
    const correctExercises = exercises.filter(e => e.isCorrect).length;
    const generalSuccessRate = totalExercises > 0 ? Math.round((correctExercises / totalExercises) * 100) : 85;

    // 2. Class Mastery Levels by Lesson
    // Group exercise submissions by lesson (title or exerciseId)
    const lessonsMap: { [key: string]: { correct: number; total: number; title: string } } = {};
    exercises.forEach(ex => {
      const key = ex.exerciseId || 'default_lesson';
      if (!lessonsMap[key]) {
        lessonsMap[key] = { correct: 0, total: 0, title: ex.title || 'درس مهارة علم الصرف' };
      }
      lessonsMap[key].total += 1;
      if (ex.isCorrect) {
        lessonsMap[key].correct += 1;
      }
    });

    const lessonMastery = Object.keys(lessonsMap).map(key => {
      const item = lessonsMap[key];
      const mastery = Math.round((item.correct / item.total) * 100);
      return {
        lessonId: key,
        title: item.title,
        mastery,
        totalAttempts: item.total
      };
    });

    // Provide defaults if no exercises exist yet
    if (lessonMastery.length === 0) {
      lessonMastery.push(
        { lessonId: 'morph_scale', title: 'الميزان الصرفي واستعمالاته', mastery: 88, totalAttempts: 30 },
        { lessonId: 'verbal_scale', title: 'صياغة المجرّد والمزيد', mastery: 74, totalAttempts: 15 },
        { lessonId: 'syntax_scale', title: 'الإعراب البنيوي وأدوات الجمل المقارنة', mastery: 65, totalAttempts: 25 },
        { lessonId: 'composition_topic', title: 'التعبير والإنشاء الوصفي البليغ', mastery: 81, totalAttempts: 10 }
      );
    }

    // 3. Most Common Errors
    // Count incorrect student responses
    const errorsMap: { [key: string]: { count: number; question: string; correctAnswer: string; lastWrongAnswer: string } } = {};
    exercises.filter(ex => !ex.isCorrect).forEach(ex => {
      const errorKey = `${ex.question}__${ex.correctAnswer}`;
      if (!errorsMap[errorKey]) {
        errorsMap[errorKey] = {
          count: 0,
          question: ex.question,
          correctAnswer: ex.correctAnswer,
          lastWrongAnswer: ex.studentAnswer
        };
      }
      errorsMap[errorKey].count += 1;
    });

    const commonErrors = Object.keys(errorsMap)
      .map(key => ({
        question: errorsMap[key].question,
        correctAnswer: errorsMap[key].correctAnswer,
        count: errorsMap[key].count,
        studentAnswer: errorsMap[key].lastWrongAnswer
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Provide default representative errors if empty
    if (commonErrors.length === 0) {
      commonErrors.push(
        { question: 'ما وزن كلمة "استكبر"؟', correctAnswer: 'استفعل', studentAnswer: 'افتعل', count: 8 },
        { question: 'زن الكلمة الآتية: "قاضٍ"', correctAnswer: 'فاعٍ', studentAnswer: 'فاعل', count: 6 },
        { question: 'حدد المشتق والصيغة لكلمة "مِفتاح"', correctAnswer: 'اسم آلة', studentAnswer: 'اسم فاعل', count: 5 },
        { question: 'ما وزن "دحرج"؟', correctAnswer: 'فعلل', studentAnswer: 'فعل', count: 3 }
      );
    }

    // 4. Performance Over Time Trend (History of exam grades / exercise submission scores)
    const performanceTrend = exams
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-10) // get last 10 exam events
      .map(ex => ({
        date: new Date(ex.timestamp).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
        avgScore: ex.score,
        subject: ex.subject
      }));

    if (performanceTrend.length === 0) {
      // Return beautiful default Arabic calendar data fallback
      performanceTrend.push(
        { date: 'يناير', avgScore: 13.5, subject: 'مكون القواعد' },
        { date: 'فبراير', avgScore: 14.2, subject: 'الميزان الصرفي' },
        { date: 'مارس', avgScore: 15.0, subject: 'الفهم والتحليل' },
        { date: 'أبريل', avgScore: 14.8, subject: 'الإنشاء' },
        { date: 'مايو', avgScore: 16.1, subject: 'النحو المقارن' }
      );
    }

    return {
      successRate: generalSuccessRate,
      lessonMastery,
      commonErrors,
      performanceTrend
    };
  }
}
