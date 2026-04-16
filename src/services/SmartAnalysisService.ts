import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface QuizResult {
  userId: string;
  quizType: 'grammar' | 'morphology' | 'spelling' | string;
  score: number;
  totalQuestions: number;
  wrongAnswers: string[];
  timeSpent?: number; // in seconds
  learningStyle?: string;
  isIntelligenceTest?: boolean;
}

export const analyzePerformance = async (result: QuizResult) => {
  const userRef = doc(db, 'users', result.userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  
  // If it's an intelligence test, we just update the learning style and return
  if (result.isIntelligenceTest && result.learningStyle) {
    await updateDoc(userRef, {
      learningStyle: result.learningStyle,
      updatedAt: new Date().toISOString()
    });
    return { learningStyle: result.learningStyle };
  }

  const percentage = (result.score / result.totalQuestions) * 100;

  // 1. Update Difficulty Areas
  let difficultyAreas = userData.difficultyAreas || [];
  if (percentage < 60) {
    if (!difficultyAreas.includes(result.quizType)) {
      difficultyAreas.push(result.quizType);
    }
  } else {
    difficultyAreas = difficultyAreas.filter((area: string) => area !== result.quizType);
  }

  // 2. Simple Learning Style Heuristic
  // This is a placeholder logic. Real analysis would be more complex.
  let learningStyle = userData.learningStyle || 'analytical';
  if (result.timeSpent && result.timeSpent < 30 && percentage > 80) {
    learningStyle = 'applied'; // Fast and correct
  } else if (percentage > 90) {
    learningStyle = 'analytical'; // Very precise
  } else if (userData.points > 500) {
    learningStyle = 'visual'; // Engaged with interactive elements
  }

  // 3. Update Firestore
  await updateDoc(userRef, {
    difficultyAreas,
    learningStyle,
    points: (userData.points || 0) + (result.score * 10),
    lastQuizScore: result.score,
    lastQuizType: result.quizType,
    updatedAt: new Date().toISOString()
  });

  return {
    learningStyle,
    difficultyAreas,
    newPoints: (userData.points || 0) + (result.score * 10)
  };
};
