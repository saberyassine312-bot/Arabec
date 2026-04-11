import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const seedDatabase = async () => {
  try {
    // 1. Create a Course
    const courseRef = await addDoc(collection(db, 'courses'), {
      title: "إتقان الإملاء العربي",
      description: "دورة شاملة للمبتدئين لتعلم قواعد الإملاء الأساسية في اللغة العربية، من الهمزات إلى الألف الفارقة.",
      thumbnail: "https://picsum.photos/seed/arabic/800/600",
      level: "beginner",
      duration: "3 أسابيع",
      teacherId: "system",
      rating: 4.8,
      enrolledCount: 150,
      createdAt: serverTimestamp()
    });

    const courseId = courseRef.id;

    // 2. Create Modules
    const module1Ref = await addDoc(collection(db, `courses/${courseId}/modules`), {
      courseId,
      title: "الوحدة الأولى: قواعد الهمزة",
      order: 1
    });

    const module2Ref = await addDoc(collection(db, `courses/${courseId}/modules`), {
      courseId,
      title: "الوحدة الثانية: التاء والألف",
      order: 2
    });

    // 3. Create Lessons for Module 1
    await addDoc(collection(db, `courses/${courseId}/modules/${module1Ref.id}/lessons`), {
      courseId,
      moduleId: module1Ref.id,
      title: "الهمزة في أول الكلمة",
      content: "شرح همزة القطع وهمزة الوصل...",
      type: "text",
      order: 1
    });

    await addDoc(collection(db, `courses/${courseId}/modules/${module1Ref.id}/lessons`), {
      courseId,
      moduleId: module1Ref.id,
      title: "الهمزة المتوسطة",
      content: "قاعدة أقوى الحركات...",
      type: "text",
      order: 2
    });

    // 4. Create a Quiz Lesson
    await addDoc(collection(db, `courses/${courseId}/modules/${module1Ref.id}/lessons`), {
      courseId,
      moduleId: module1Ref.id,
      title: "اختبار الهمزات",
      type: "quiz",
      order: 3,
      questions: [
        {
          id: 1,
          text: "أي كلمة مما يلي تحتوي على همزة قطع؟",
          options: ["استغفر", "أحمد", "ابن", "امرأة"],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "تكتب الهمزة المتوسطة على نبرة (ئ) إذا كانت حركتها:",
          options: ["الفتحة", "الضمة", "الكسرة", "السكون"],
          correctAnswer: 2
        }
      ]
    });

    console.log("Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};
