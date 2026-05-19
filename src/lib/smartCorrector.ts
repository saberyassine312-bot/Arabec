
export enum AssessmentType {
  DIAGNOSTIC = 'تشخيصي',
  FORMATIVE = 'تكويني',
  SUMMATIVE = 'إجمالي/نهائي',
  INTERACTIVE = 'تفاعلي/تطبيقي'
}

export interface CorrectionReport {
  type: AssessmentType;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  score: number; // /20
  grade: string;
  levelInfo?: {
    status: string;
    diagnosis: string;
    supportPlan: string;
    priorities: string[];
    strengths: string[];
    weaknesses: string[];
  };
}

export function calculateGrade(correct: number, total: number): number {
  if (total === 0) return 0;
  return Number(((correct / total) * 20).toFixed(2));
}

export function getOfficialGradeLabel(score: number): string {
  if (score >= 18) return 'ممتاز';
  if (score >= 16) return 'حسن جدًا';
  if (score >= 14) return 'حسن';
  if (score >= 12) return 'مستحسن';
  if (score >= 10) return 'متوسط / مقبول';
  return 'ضعيف / يحتاج دعم';
}

export function getDiagnosticLevel(score: number): string {
  if (score >= 18) return 'تحكم ممتاز';
  if (score >= 14) return 'تحكم جيد';
  if (score >= 10) return 'مكتسبات أولية مقبولة';
  if (score >= 5) return 'تعثر متوسط';
  return 'تعثر كبير';
}

export function generateCorrectionReport(
  type: AssessmentType,
  correct: number,
  total: number,
  wrongAnswers: string[] = []
): CorrectionReport {
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  const score = calculateGrade(correct, total);
  const grade = getOfficialGradeLabel(score);

  const report: CorrectionReport = {
    type,
    totalQuestions: total,
    correctAnswers: correct,
    percentage: Math.round(percentage),
    score,
    grade
  };

  if (type === AssessmentType.DIAGNOSTIC) {
    const status = getDiagnosticLevel(score);
    let diagnosis = '';
    let supportPlan = '';
    let priorities: string[] = [];

    if (score < 10) {
      diagnosis = 'وجود ثغرات جوهرية في المكتسبات القبلية الأساسية.';
      supportPlan = 'تخصيص حصص مكثفة لمراجعة المفاهيم القاعدية قبل الانتقال للبرنامج.';
      priorities = ['ضبط أركان الجملة', 'التمرن على الإعراب الأساسي', 'فهم حركات الإعراب'];
    } else if (score < 14) {
      diagnosis = 'تحكم جزئي في المعارف، مع وجود بعض الارتباك في التطبيقات المركبة.';
      supportPlan = 'تعزيز المكتسبات من خلال تمارين تطبيقية متنوعة ووضعيات دالة.';
      priorities = ['دقة التطبيق الإعرابي', 'التمييز بين النواسخ', 'التدرب على الإملاء'];
    } else {
      diagnosis = 'تحكم جيد جداً في المبادئ الأساسية للمادة.';
      supportPlan = 'الاستمرار في التعلم الذاتي وتعميق المعارف من خلال نصوص أدبية رفيعة.';
      priorities = ['تعميق التحليل اللغوي', 'الإبداع في التعبير', 'إتقان الإعراب التقديري'];
    }

    report.levelInfo = {
      status,
      diagnosis,
      supportPlan,
      priorities,
      strengths: percentage > 70 ? ['الفهم العام', 'سرعة البديهة'] : ['الرغبة في التعلم'],
      weaknesses: wrongAnswers.slice(0, 3)
    };
  }

  return report;
}
