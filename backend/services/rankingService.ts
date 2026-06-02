import { dbCollections } from '../db/localDb';

export class RankingService {
  /**
   * Generates ranking tables of students grouped by classes or globally, returning Top and Bottom lists.
   */
  static getClassRankings(classFilter?: string) {
    const usersDb = dbCollections.getCollection<any>('users');
    const examsDb = dbCollections.getCollection<any>('exam_results');
    const exercisesDb = dbCollections.getCollection<any>('exercise_submissions');

    const students = usersDb.find(u => u.role === 'student');
    const exams = examsDb.find();
    const exercises = exercisesDb.find();

    // Map through students and calculate overall average score, exercises submitted, and general tier
    const rankedStudents = students.map(student => {
      const studentExams = exams.filter(e => e.studentId === student.id);
      const studentExs = exercises.filter(ex => ex.studentId === student.id);

      const examAvg = studentExams.length > 0
        ? parseFloat((studentExams.reduce((sum, e) => sum + e.score, 0) / studentExams.length).toFixed(1))
        : 14.0; // fallback default average if no exam scores present

      // Count exercises solved
      const exerciseCount = studentExs.length;
      
      // Compute performance level label (ممتاز / متوسط / ضعيف)
      let performanceTier: 'ممتاز' | 'متوسط' | 'ضعيف' = 'متوسط';
      if (student.xp && student.xp > 600) {
        performanceTier = 'ممتاز';
      } else if (student.xp && student.xp < 300) {
        performanceTier = 'ضعيف';
      } else if (examAvg >= 16) {
        performanceTier = 'ممتاز';
      } else if (examAvg < 10) {
        performanceTier = 'ضعيف';
      }

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class || 'الأولى إعدادي',
        xp: student.xp || 100,
        averageGrade: examAvg,
        exerciseCount,
        performanceTier
      };
    });

    // Filter by prep year class if provided
    let filteredRanked = rankedStudents;
    if (classFilter) {
      filteredRanked = rankedStudents.filter(s => s.class === classFilter);
    }

    // Sort descending by XP, then Average Grade
    const sortedDescending = [...filteredRanked].sort((a, b) => {
      if (b.xp !== a.xp) {
        return b.xp - a.xp;
      }
      return b.averageGrade - a.averageGrade;
    });

    // Attach ranks
    const finalRanked = sortedDescending.map((s, index) => ({
      ...s,
      rank: index + 1
    }));

    const top10 = finalRanked.slice(0, 10);
    const bottom10 = [...finalRanked].reverse().slice(0, 10);

    return {
      all: finalRanked,
      top10,
      bottom10
    };
  }
}
