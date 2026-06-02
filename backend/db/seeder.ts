import bcrypt from 'bcryptjs';
import { dbCollections } from './localDb';

export function seedDatabase() {
  const usersDb = dbCollections.getCollection<any>('users');
  
  // Always ensure the requested administrator exists!
  const requestedAdmin = usersDb.findOne(u => u.email.toLowerCase() === 'saberyassine312@gmail.com');
  if (!requestedAdmin) {
    console.log('Inserting requested administrator account...');
    usersDb.insertOne({
      id: 'admin_saber',
      name: 'الأستاذ ياسين صابر',
      email: 'saberyassine312@gmail.com',
      password: bcrypt.hashSync('saber1997', 10),
      class: 'الإدارة',
      role: 'admin',
      xp: 10000,
      streak: 99
    });
  }

  const realStudents = [
    { name: 'منى مطهار', email: 'mona.matthar1@edu.local' },
    { name: 'فاطمة الزهراء أعزيزي', email: 'fatimazahra.aazizi2@edu.local' },
    { name: 'جهان البكرة', email: 'jihan.bakkra3@edu.local' },
    { name: 'شيماء بالفقير', email: 'chaymae.balfakir4@edu.local' },
    { name: 'سكينة حفيان', email: 'sakina.hafian5@edu.local' },
    { name: 'حليمة كزيز', email: 'halima.kziz6@edu.local' },
    { name: 'غزلان أفاريد', email: 'ghizlane.afarid7@edu.local' },
    { name: 'حليمة اسماعيلي', email: 'halima.ismaili8@edu.local' },
    { name: 'فاطمة الزهراء صاديق', email: 'fatimazahra.sadiq9@edu.local' },
    { name: 'نورة عريف', email: 'noura.arif10@edu.local' },
    { name: 'يوسف النكشاوي', email: 'youssef.nakchawi11@edu.local' },
    { name: 'لبنى بقادير', email: 'lobna.bqadir12@edu.local' },
    { name: 'يوسف فكاك', email: 'youssef.fkak13@edu.local' },
    { name: 'سهام أخي', email: 'siham.akhi14@edu.local' },
    { name: 'وداد البقالي', email: 'wadad.baqali15@edu.local' },
    { name: 'محمد أزراولي', email: 'mohamed.azraouli16@edu.local' },
    { name: 'فاطمة الزهراء أدميني', email: 'fatimazahra.admini17@edu.local' },
    { name: 'إكرام الحجوجي', email: 'ikram.hajouji18@edu.local' },
    { name: 'يوسف أحميمصة', email: 'youssef.ahmimsa19@edu.local' },
    { name: 'جميلة العرصاوي', email: 'jamila.arsawi20@edu.local' },
    { name: 'زينب كرومي', email: 'zineb.karoumi21@edu.local' },
    { name: 'لكبيرة أعربان', email: 'lakbira.aerban22@edu.local' },
    { name: 'ياسين صابر', email: 'yassin.saber23@edu.local' },
    { name: 'سعد المتوكل', email: 'saad.motawakil24@edu.local' },
    { name: 'هجار الهواري', email: 'hajar.houwari25@edu.local' },
    { name: 'منى أرحى', email: 'mona.arha26@edu.local' },
    { name: 'آية تمسنا', email: 'aya.temsna27@edu.local' },
    { name: 'محمد الأمغاري', email: 'mohamed.amghari28@edu.local' },
    { name: 'حميد العلواني', email: 'hamid.alwani29@edu.local' },
    { name: 'أنس جنان', email: 'anas.jnan30@edu.local' }
  ];

  const existingStudents = usersDb.find(u => u.role === 'student');

  // If we already have students, but they are generic (dahmani), migrate them!
  const firstStudent = usersDb.findOne(u => u.id === 'std_1');
  if (firstStudent && (firstStudent.name.includes('دحماني') || firstStudent.name.includes('التلميذ'))) {
    console.log('Migrating existing generic student names to official 30 students registry...');
    
    const examDb = dbCollections.getCollection<any>('exam_results');
    const intelDb = dbCollections.getCollection<any>('intelligence_results');
    const exerciseDb = dbCollections.getCollection<any>('exercise_submissions');
    const writingDb = dbCollections.getCollection<any>('writing_submissions');

    for (let i = 1; i <= 30; i++) {
      const studentInfo = realStudents[i - 1];
      let prepClass = 'الأولى إعدادي';
      if (i >= 11 && i <= 20) {
        prepClass = 'الثانية إعدادي';
      } else if (i >= 21) {
        prepClass = 'الثالثة إعدادي';
      }

      usersDb.updateOne(u => u.id === `std_${i}`, {
        name: studentInfo.name,
        email: studentInfo.email,
        class: prepClass
      });

      // Update child collections to sync real names and correct grade classes
      examDb.updateAll(e => e.studentId === `std_${i}`, { studentName: studentInfo.name, class: prepClass });
      intelDb.updateAll(intel => intel.studentId === `std_${i}`, { studentName: studentInfo.name, class: prepClass });
      exerciseDb.updateAll(ex => ex.studentId === `std_${i}`, { studentName: studentInfo.name, class: prepClass });
      writingDb.updateAll(w => w.studentId === `std_${i}`, { studentName: studentInfo.name, class: prepClass });
    }
    console.log('Database migration successfully completed!');
    return;
  }

  if (existingStudents.length > 0) {
    console.log('Database already successfully seeded with student records.');
    return;
  }

  console.log('Seeding student registry with official 30 students...');

  const passwordHash = bcrypt.hashSync('password123', 10);

  // Seed 30 students
  for (let i = 1; i <= 30; i++) {
    const studentInfo = realStudents[i - 1];
    let prepClass = 'الأولى إعدادي';
    if (i >= 11 && i <= 20) {
      prepClass = 'الثانية إعدادي';
    } else if (i >= 21) {
      prepClass = 'الثالثة إعدادي';
    }

    // Diverse simulated stats for analytics
    const loginCount = Math.floor(Math.random() * 15) + 5;
    const totalTimeSpent = Math.floor(Math.random() * 300) + 60; // minutes
    const attendanceRate = Math.floor(Math.random() * 20) + 80; // 80% to 100%
    const progressPercentage = Math.floor(Math.random() * 40) + 40; // 40% to 80%
    const xp = Math.floor(Math.random() * 1000) + 100;

    usersDb.insertOne({
      id: `std_${i}`,
      name: studentInfo.name,
      email: studentInfo.email,
      password: passwordHash,
      class: prepClass,
      role: 'student',
      xp,
      streak: Math.floor(Math.random() * 5) + 1,
      lastLogin: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 3).toISOString(),
      loginCount,
      totalTimeSpent,
      attendanceRate,
      progressPercentage,
      activityLogs: [
        {
          id: `log_init_${i}`,
          action: 'تسجيل دخول',
          page: '/student-dashboard',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          duration: Math.floor(Math.random() * 30) + 10,
          ipAddress: `192.168.1.${10 + i}`,
          device: 'مكتب - ويندوز'
        },
        {
          id: `log_learn_${i}`,
          action: 'عرض درس الميزان الصرفي',
          page: '/courses',
          timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
          duration: 15,
          ipAddress: `192.168.1.${10 + i}`,
          device: 'جوال - أندرويد'
        }
      ],
      completedLessons: ['morphological-scale'],
      completedAssignments: []
    });
  }

  // Seed Teacher/Admin Accounts
  const teacherHash = bcrypt.hashSync('teacher123', 10);
  usersDb.insertOne({
    id: 'teacher_1',
    name: 'الأستاذ صابر ياسين',
    email: 'wadifamaroc60@gmail.com',
    password: teacherHash,
    class: 'منسق عام',
    role: 'teacher',
    xp: 2500,
    streak: 15
  });

  const adminHash = bcrypt.hashSync('admin123', 10);
  usersDb.insertOne({
    id: 'admin_1',
    name: 'المدير العام للمنصة',
    email: 'admin@school.ma',
    password: adminHash,
    class: 'الإدارة',
    role: 'admin',
    xp: 5000,
    streak: 30
  });

  // Seed Exam Results
  console.log('Seeding evaluation and examination transcripts...');
  const examDb = dbCollections.getCollection<any>('exam_results');
  const examSubjects = ['مكون قواعد النحو', 'مكون الصرف والتحويل', 'مكون التطبيقات اللغوية', 'الفهم والتحليل الصرفي'];
  const examTypes = ['فرض', 'محلي', 'جهوي'];

  for (let i = 1; i <= 30; i++) {
    let prepClass = i <= 10 ? 'الأولى إعدادي' : i <= 20 ? 'الثانية إعدادي' : 'الثالثة إعدادي';
    // Generate 3 exam results per student
    examSubjects.forEach((subject, subIdx) => {
      const type = examTypes[subIdx % examTypes.length];
      const score = Math.floor(Math.random() * 8) + 12; // 12 to 20
      examDb.insertOne({
        id: `exam_${i}_${subIdx}`,
        studentId: `std_${i}`,
        studentName: `التلميذ دحماني ${i}`,
        class: prepClass,
        subject,
        examType: type,
        score,
        semester: subIdx % 2 === 0 ? 'الدورة الأولى' : 'الدورة الثانية',
        academicYear: '2025/2026',
        teacher: 'الأستاذ صابر ياسين',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * (3 + subIdx)).toISOString()
      });
    });
  }

  // Seed Multiple Intelligence Results
  console.log('Seeding analytical Multiple Intelligence (MI) maps...');
  const intelDb = dbCollections.getCollection<any>('intelligence_results');
  const intelligences = [
    'Linguistic (اللغوي)', 'Logical (المنطقي الرياضي)', 'Visual (البصري الفضائي)', 
    'Kinesthetic (الحركي البدني)', 'Musical (الموسيقي الإيقاعي)', 'Interpersonal (الاجتماعي)', 
    'Intrapersonal (الذاتي الفردي)', 'Naturalistic (الصديق للبيئة)'
  ];

  for (let i = 1; i <= 30; i++) {
    let prepClass = i <= 10 ? 'الأولى إعدادي' : i <= 20 ? 'الثانية إعدادي' : 'الثالثة إعدادي';
    const values = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 50); // 50-100
    const maxValIdx = values.indexOf(Math.max(...values));
    
    intelDb.insertOne({
      id: `intel_${i}`,
      studentId: `std_${i}`,
      studentName: `التلميذ دحماني ${i}`,
      class: prepClass,
      linguistic: values[0],
      logical: values[1],
      visual: values[2],
      kinesthetic: values[3],
      musical: values[4],
      interpersonal: values[5],
      intrapersonal: values[6],
      naturalistic: values[7],
      answers: {},
      dominantIntelligence: intelligences[maxValIdx],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
    });
  }

  // Seed Exercises
  console.log('Seeding practice works sheets...');
  const exerciseDb = dbCollections.getCollection<any>('exercise_submissions');
  for (let i = 1; i <= 30; i++) {
    let prepClass = i <= 10 ? 'الأولى إعدادي' : i <= 20 ? 'الثانية إعدادي' : 'الثالثة إعدادي';
    exerciseDb.insertOne({
      id: `ex_${i}_1`,
      studentId: `std_${i}`,
      studentName: `التلميذ دحماني ${i}`,
      class: prepClass,
      exerciseId: 'morph_ex_1',
      title: 'الميزان الصرفي - وزن المبنيات والمشتقات',
      question: 'ما وزن "استكبر"؟',
      studentAnswer: 'استفعل',
      correctAnswer: 'استفعل',
      isCorrect: true,
      score: 20,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    });
  }

  // Seed Writing/Essay composition items
  console.log('Seeding essay correction reviews...');
  const writingDb = dbCollections.getCollection<any>('writing_submissions');
  for (let i = 1; i <= 30; i++) {
    if (i % 3 === 0) {
      let prepClass = i <= 10 ? 'الأولى إعدادي' : i <= 20 ? 'الثانية إعدادي' : 'الثالثة إعدادي';
      writingDb.insertOne({
        id: `writing_${i}`,
        studentId: `std_${i}`,
        studentName: `التلميذ دحماني ${i}`,
        class: prepClass,
        topicTitle: 'وصف مشهد طبيعي خريفي بجبال الأطلس المتوسط',
        content: `عندما يحل فصل الخريف بربوع جبال الأطلس المتوسط، تتزين الغابات بحلة ذهبية خلابة. تتساقط أوراق شجر الأرز والشربين لترسم سجادة رقيقة فوق المسارات الحجرية الوعرة. وتهب النسمات الباردة القادمة من القمم المكللة بالغيوم الداكنة، ناشرة عبير الطبيعة الندية وصوت خرير الأودية المتدفقة. إنه لمشهد بديع ينطق بعظمة الخالق وروعة التناسق في ملكوته.`,
        wordCount: 65,
        status: 'reviewed',
        teacherFeedback: 'تعبير رائع ووصف لغوي بليغ وموفق، أحسنت استخدام الصور المجازية والتعابير النعتية المتناغمة مع الميزان الصرفي للنعوت والصيغ.',
        score: 18,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
      });
    }
  }

  // Seed Notifications
  console.log('Seeding user and system updates panel...');
  const notifyDb = dbCollections.getCollection<any>('notifications');
  notifyDb.insertOne({
    id: 'notify_all_1',
    studentId: 'all',
    title: 'درس صرفي تفاعلي جديد',
    text: 'تم رفع درس الميزان الصرفي التفاعلي بالكامل لجميع الفصول الإعدادية العامة.',
    type: 'lesson',
    timestamp: new Date().toISOString(),
    isRead: false
  });

  notifyDb.insertOne({
    id: 'notify_all_2',
    studentId: 'all',
    title: 'الاختبار الأسبوعي الشامل',
    text: 'المرجو من تلاميذ السنتين الثانية والثالثة إتمام الفرض المنزلي في مهارة علم الصرف.',
    type: 'quiz',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: false
  });

  console.log('LMS Data seeding successfully completed!');
}
