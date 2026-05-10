import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const seedDatabase = async () => {
  try {
    // 1. Create a Course
    const courseRef = await addDoc(collection(db, 'courses'), {
      title: "إتقان الإملاء العربي",
      description: "دورة شاملة للمبتدئين لتعلم قواعد الإملاء الأساسية في اللغة العربية، من الهمزات إلى الألف الفارقة.",
      thumbnail: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=80",
      level: "beginner",
      category: "spelling",
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

    // Add a Grammar course
    await addDoc(collection(db, 'courses'), {
      title: "أساسيات النحو العربي",
      description: "تعلم المبتدأ والخبر، الفعل والفاعل، والجملة الاسمية والفعلية.",
      thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
      level: "beginner",
      category: "grammar",
      duration: "4 أسابيع",
      teacherId: "system",
      rating: 4.9,
      enrolledCount: 200,
      createdAt: serverTimestamp()
    });

    // Add a Morphology course
    await addDoc(collection(db, 'courses'), {
      title: "علم الصرف الميسر",
      description: "دراسة الميزان الصرفي، المجرد والمزيد، وتصريف الأفعال.",
      thumbnail: "https://images.unsplash.com/photo-1509062588-4a12a3babec0?auto=format&fit=crop&w=800&q=80",
      level: "intermediate",
      category: "morphology",
      duration: "5 أسابيع",
      teacherId: "system",
      rating: 4.7,
      enrolledCount: 120,
      createdAt: serverTimestamp()
    });

    // Add Second Preparatory Grammar Course (المثنى وصيغه)
    const dualCourseId = 'dual-lesson-2apic';
    await setDoc(doc(db, 'courses', dualCourseId), {
      title: "الدرس اللغوي: المثنى وصيغه",
      description: "درس شامل حول المثنى، صياغته من الأسماء المختلفة (صحيح، مقصور، منقوص، ممدود) وإعرابه.",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      level: "2apic",
      category: "grammar",
      duration: "أسبوع واحد",
      teacherId: "system",
      rating: 5.0,
      enrolledCount: 0,
      createdAt: serverTimestamp()
    });

    const dualModuleRef = await addDoc(collection(db, `courses/${dualCourseId}/modules`), {
      courseId: dualCourseId,
      title: "الوحدة الأولى: أحكام المثنى",
      order: 1
    });

    // Lesson 1: Introduction & Observation
    await addDoc(collection(db, `courses/${dualCourseId}/modules/${dualModuleRef.id}/lessons`), {
      courseId: dualCourseId,
      moduleId: dualModuleRef.id,
      title: "1. التقديم والملاحظة",
      content: `### 🟨 1- التقديم (الوضعية المشكلة)
**الوضعية:**
قرأ أحمد الجملتين التاليتين:
* *جاء التلميذان إلى المدرسة*
* *رأيت التلميذين في الساحة*

فاستغرب اختلاف شكل الكلمة (التلميذان / التلميذين)، وتساءل:
👉 لماذا تغيرت نهاية الكلمة؟
👉 هل هناك قاعدة تضبط هذا التغيير؟
👉 كيف نحول الاسم المفرد إلى مثنى؟

### 🟨 2- الملاحظة والاكتشاف
**الأمثلة:**
* حضر **التلميذان** إلى القسم
* شاهدت **التلميذين** في الساحة
* سلمت على **الأستاذين**`,
      type: "text",
      order: 1
    });

    // Lesson 2: Analysis & Rules
    await addDoc(collection(db, `courses/${dualCourseId}/modules/${dualModuleRef.id}/lessons`), {
      courseId: dualCourseId,
      moduleId: dualModuleRef.id,
      title: "2. التحليل والقاعدة",
      content: `### 🟨 3- التحليل والفهم
**تعريف المثنى:**
المثنى اسم يدل على اثنين أو اثنتين بزيادة:
* **ألف ونون (ان)** في حالة الرفع
* **ياء ونون (ين)** في حالتي النصب والجر

**صياغة المثنى:**
1. **الاسم الصحيح:** كتاب -> كتابان / كتابين
2. **الاسم المقصور:** فتى -> فتيان / فتيين
3. **الاسم المنقوص:** قاضٍ -> قاضيان / قاضيين
4. **الاسم الممدود:** سماء -> سماوان / سماوين

**إعراب المثنى:**
* الرفع: الألف (جاء التلميذان)
* النصب: الياء (رأيت التلميذين)
* الجر: الياء (مررت بالتلميذين)`,
      type: "text",
      order: 2
    });

    // Lesson 3: Quiz
    await addDoc(collection(db, `courses/${dualCourseId}/modules/${dualModuleRef.id}/lessons`), {
      courseId: dualCourseId,
      moduleId: dualModuleRef.id,
      title: "3. تطبيق وتقويم",
      type: "quiz",
      order: 3,
      questions: [
        {
          id: 1,
          text: "ما هي علامة رفع المثنى؟",
          options: ["الضمة", "الألف", "الواو", "الياء"],
          correctAnswer: 1
        },
        {
          id: 2,
          text: "حول كلمة 'قلم' إلى مثنى في حالة النصب:",
          options: ["قلمان", "قلمون", "قلمين", "قلمات"],
          correctAnswer: 2
        },
        {
          id: 3,
          text: "ما هو مثنى كلمة 'فتى'؟",
          options: ["فتوان", "فتيان", "فتاتان", "فتون"],
          correctAnswer: 1
        }
      ]
    });

    // 5. Seed Students for 3rd Prep
    const studentsData = [
      { fullName: 'منى مطهار', email: 'mona.matthar1@edu.local', accessCode: '3A-001', classLevel: 'الثالثة إعدادي' },
      { fullName: 'فاطمة الزهراء أعزيزي', email: 'fatimazahra.aazizi2@edu.local', accessCode: '3A-002', classLevel: 'الثالثة إعدادي' },
      { fullName: 'جهان البكرة', email: 'jihan.bakkra3@edu.local', accessCode: '3A-003', classLevel: 'الثالثة إعدادي' },
      { fullName: 'شيماء بالفقير', email: 'chaymae.balfakir4@edu.local', accessCode: '3A-004', classLevel: 'الثالثة إعدادي' },
      { fullName: 'سكينة حفيان', email: 'sakina.hafian5@edu.local', accessCode: '3A-005', classLevel: 'الثالثة إعدادي' },
      { fullName: 'حليمة كزيز', email: 'halima.kziz6@edu.local', accessCode: '3A-006', classLevel: 'الثالثة إعدادي' },
      { fullName: 'غزلان أفاريد', email: 'ghizlane.afarid7@edu.local', accessCode: '3A-007', classLevel: 'الثالثة إعدادي' },
      { fullName: 'حليمة اسماعيلي', email: 'halima.ismaili8@edu.local', accessCode: '3A-008', classLevel: 'الثالثة إعدادي' },
      { fullName: 'فاطمة الزهراء صاديق', email: 'fatimazahra.sadiq9@edu.local', accessCode: '3A-009', classLevel: 'الثالثة إعدادي' },
      { fullName: 'نورة عريف', email: 'noura.arif10@edu.local', accessCode: '3A-010', classLevel: 'الثالثة إعدادي' },
      { fullName: 'يوسف النكشاوي', email: 'youssef.nakchawi11@edu.local', accessCode: '3A-011', classLevel: 'الثالثة إعدادي' },
      { fullName: 'لبنى بقادير', email: 'lobna.bqadir12@edu.local', accessCode: '3A-012', classLevel: 'الثالثة إعدادي' },
      { fullName: 'يونس فكاك', email: 'younes.fekak13@edu.local', accessCode: '3A-013', classLevel: 'الثالثة إعدادي' },
      { fullName: 'سهام أخي', email: 'siham.akhi14@edu.local', accessCode: '3A-014', classLevel: 'الثالثة إعدادي' },
      { fullName: 'وداد البقالي', email: 'wadad.baqali15@edu.local', accessCode: '3A-015', classLevel: 'الثالثة إعدادي' },
      { fullName: 'محمد أزراولي', email: 'mohamed.azraouli16@edu.local', accessCode: '3A-016', classLevel: 'الثالثة إعدادي' },
      { fullName: 'فاطمة الزهراء أدميني', email: 'fatimazahra.admini17@edu.local', accessCode: '3A-017', classLevel: 'الثالثة إعدادي' },
      { fullName: 'إكرام الحجوجي', email: 'ikram.hajouji18@edu.local', accessCode: '3A-018', classLevel: 'الثالثة إعدادي' },
      { fullName: 'يوسف أحميمصة', email: 'youssef.ahmimsa19@edu.local', accessCode: '3A-019', classLevel: 'الثالثة إعدادي' },
      { fullName: 'جميلة العرصاوي', email: 'jamila.arsawi20@edu.local', accessCode: '3A-020', classLevel: 'الثالثة إعدادي' },
      { fullName: 'زينب كرومي', email: 'zineb.karoumi21@edu.local', accessCode: '3A-021', classLevel: 'الثالثة إعدادي' },
      { fullName: 'لكبيرة أعربان', email: 'lakbira.aerban22@edu.local', accessCode: '3A-022', classLevel: 'الثالثة إعدادي' },
      { fullName: 'ياسين صابر', email: 'yassin.saber23@edu.local', accessCode: '3A-023', classLevel: 'الثالثة إعدادي' },
      { fullName: 'سعد المتوكل', email: 'saad.motawakil24@edu.local', accessCode: '3A-024', classLevel: 'الثالثة إعدادي' },
      { fullName: 'هجار الهواري', email: 'hajar.houwari25@edu.local', accessCode: '3A-025', classLevel: 'الثالثة إعدادي' },
      { fullName: 'منى أرحى', email: 'mona.arha26@edu.local', accessCode: '3A-026', classLevel: 'الثالثة إعدادي' },
      { fullName: 'آية تمسنا', email: 'aya.temsna27@edu.local', accessCode: '3A-027', classLevel: 'الثالثة إعدادي' },
      { fullName: 'محمد الأمغاري', email: 'mohamed.amghari28@edu.local', accessCode: '3A-028', classLevel: 'الثالثة إعدادي' },
      { fullName: 'حميد العلواني', email: 'hamid.alwani29@edu.local', accessCode: '3A-029', classLevel: 'الثالثة إعدادي' },
      { fullName: 'أنس جنان', email: 'anas.jnan30@edu.local', accessCode: '3A-030', classLevel: 'الثالثة إعدادي' }
    ];

    for (const student of studentsData) {
      // Use accessCode as document ID for uniqueness and consistency
      await setDoc(doc(db, 'students', student.accessCode), {
        ...student,
        createdAt: serverTimestamp()
      }, { merge: true });
    }

    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};
