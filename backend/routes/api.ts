import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbCollections } from '../db/localDb';
import { generateToken, authenticateJWT, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const router = express.Router();

let ioInstance: any = null;

export function setSocketIO(io: any) {
  ioInstance = io;
}

function notifyRealtime(event: string, data: any) {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
}

// 🔐 Authentication & Access Endpoints
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'الرجاء كتابة البريد الإلكتروني وكلمة المرور' });
    return;
  }

  const usersDb = dbCollections.getCollection<any>('users');
  const user = usersDb.findOne(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    res.status(401).json({ error: 'البريد الإلكتروني غير مسجل بالمنظومة' });
    return;
  }

  // Verification
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    return;
  }

  // Update Login tracking
  const device = req.headers['user-agent']?.includes('Mobile') ? 'جوال - ذكي' : 'حاسوب - مكتب';
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const updatedLoginCount = (user.loginCount || 0) + 1;
  const lastLogin = new Date().toISOString();

  const loginLog = {
    action: 'تسجيل دخول إلى النظام',
    page: '/student-dashboard',
    timestamp: lastLogin,
    duration: 0,
    ipAddress,
    device
  };

  const activityLogs = user.activityLogs || [];
  activityLogs.unshift(loginLog);

  usersDb.updateOne(u => u.id === user.id, {
    lastLogin,
    loginCount: updatedLoginCount,
    activityLogs: activityLogs.slice(0, 50) // keep last 50
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    class: user.class
  });

  const refreshedUser = usersDb.findOne(u => u.id === user.id);
  const { password: _, ...userSafe } = refreshedUser;

  // Realtime Alert
  notifyRealtime('student-login', {
    studentName: user.name,
    class: user.class,
    time: lastLogin
  });

  res.json({
    token,
    user: userSafe
  });
});

// 👨🎓 Students Dashboard Management
router.get('/students', authenticateJWT, (req: AuthenticatedRequest, res) => {
  const usersDb = dbCollections.getCollection<any>('users');
  const classFilter = req.query.class as string;
  
  let students = usersDb.find(u => u.role === 'student');
  if (classFilter) {
    students = students.filter(s => s.class === classFilter);
  }

  // Hide passwords
  students = students.map(({ password, ...s }) => s);
  res.json(students);
});

router.get('/students/:id', authenticateJWT, (req: AuthenticatedRequest, res) => {
  const usersDb = dbCollections.getCollection<any>('users');
  const student = usersDb.findOne(u => u.id === req.params.id);

  if (!student) {
    res.status(404).json({ error: 'المتعلم غير مسجل' });
    return;
  }

  const { password, ...studentSafe } = student;
  
  // Attach and load correlated records (exams, intelligence results, exercises)
  const exams = dbCollections.getCollection<any>('exam_results').find(e => e.studentId === student.id);
  const intelligence = dbCollections.getCollection<any>('intelligence_results').findOne(i => i.studentId === student.id);
  const exercises = dbCollections.getCollection<any>('exercise_submissions').find(ex => ex.studentId === student.id);
  const writings = dbCollections.getCollection<any>('writing_submissions').find(w => w.studentId === student.id);

  res.json({
    student: studentSafe,
    exams,
    intelligence,
    exercises,
    writings
  });
});

// ⏱️ Activity Tracking Middleware Logic Endpoint
router.post('/students/log-activity', authenticateJWT, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(403).json({ error: 'غير مصرح' });
    return;
  }

  const { action, page, duration } = req.body;
  const usersDb = dbCollections.getCollection<any>('users');
  const student = usersDb.findOne(u => u.id === req.user?.id);

  if (!student) {
    res.status(404).json({ error: 'المتعلم غير متوفر' });
    return;
  }

  const device = req.headers['user-agent']?.includes('Mobile') ? 'جوال - ذكي' : 'حاسوب - مكتب';
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

  const newLog = {
    action: action || 'تصفح صفحة',
    page: page || '/',
    timestamp: new Date().toISOString(),
    duration: duration || 1, // list in minutes
    ipAddress,
    device
  };

  const activityLogs = student.activityLogs || [];
  activityLogs.unshift(newLog);

  const updatedTimeSpent = (student.totalTimeSpent || 0) + (duration || 1);

  usersDb.updateOne(u => u.id === student.id, {
    totalTimeSpent: updatedTimeSpent,
    activityLogs: activityLogs.slice(0, 50)
  });

  notifyRealtime('activity-logged', {
    studentId: student.id,
    studentName: student.name,
    class: student.class,
    action: newLog.action,
    page: newLog.page,
    timestamp: newLog.timestamp
  });

  res.json({ success: true, totalTimeSpent: updatedTimeSpent });
});

// 📝 Exam Outcomes Endpoints
router.get('/exams', authenticateJWT, (req, res) => {
  const exams = dbCollections.getCollection<any>('exam_results').find();
  res.json(exams);
});

router.post('/exams', authenticateJWT, (req: AuthenticatedRequest, res) => {
  const { studentId, subject, examType, score, semester, academicYear } = req.body;
  if (!studentId || !subject || !examType || score === undefined || !semester) {
    res.status(400).json({ error: 'الرجاء توفير جميع معلومات النقطة' });
    return;
  }

  const student = dbCollections.getCollection<any>('users').findOne(u => u.id === studentId);
  if (!student) {
    res.status(404).json({ error: 'المتعلم غير مسجل بالمنظومة' });
    return;
  }

  const examDb = dbCollections.getCollection<any>('exam_results');
  const newResult = {
    id: `exam_${Date.now()}`,
    studentId: student.id,
    studentName: student.name,
    class: student.class,
    subject,
    examType,
    score: parseFloat(score),
    semester,
    academicYear: academicYear || '2025/2026',
    teacher: req.user?.name || 'الأستاذ صابر ياسين',
    timestamp: new Date().toISOString()
  };

  examDb.insertOne(newResult);

  // Auto push notification for results
  const notificationsDb = dbCollections.getCollection<any>('notifications');
  notificationsDb.insertOne({
    id: `notif_${Date.now()}`,
    studentId: student.id,
    title: 'نقطة امتحان جديدة 📝',
    text: `لقد سجل لك أستاذك نقطة ${score}/20 في ${subject} (${examType}).`,
    type: 'result',
    timestamp: new Date().toISOString(),
    isRead: false
  });

  notifyRealtime('exam-added', newResult);

  res.status(201).json(newResult);
});

// 🧠 Multiple Intelligences Diagnoses Endpoints
router.get('/intelligence', authenticateJWT, (req, res) => {
  const items = dbCollections.getCollection<any>('intelligence_results').find();
  res.json(items);
});

router.get('/intelligence/:studentId', authenticateJWT, (req, res) => {
  const item = dbCollections.getCollection<any>('intelligence_results').findOne(i => i.studentId === req.params.studentId);
  if (!item) {
    res.status(404).json({ error: 'لم يجرى أي اختبار تشخيصي بعد لهذا التلميذ' });
    return;
  }
  res.json(item);
});

router.post('/intelligence', authenticateJWT, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(403).json({ error: 'غير مصرح' });
    return;
  }

  const { linguistic, logical, visual, kinesthetic, musical, interpersonal, intrapersonal, naturalistic, answers } = req.body;

  const intelDb = dbCollections.getCollection<any>('intelligence_results');
  
  // Calculate Dominant Intelligence
  const scores = [
    { name: 'Linguistic (اللغوي)', value: linguistic || 0 },
    { name: 'Logical (المنطقي الرياضي)', value: logical || 0 },
    { name: 'Visual (البصري الفضائي)', value: visual || 0 },
    { name: 'Kinesthetic (الحركي البدني)', value: kinesthetic || 0 },
    { name: 'Musical (الموسيقي الإيقاعي)', value: musical || 0 },
    { name: 'Interpersonal (الاجتماعي)', value: interpersonal || 0 },
    { name: 'Intrapersonal (الذاتي الفردي)', value: intrapersonal || 0 },
    { name: 'Naturalistic (الصديق للبيئة)', value: naturalistic || 0 }
  ];

  scores.sort((a, b) => b.value - a.value);
  const dominantIntelligence = scores[0].name;

  // Find or insert record
  const existing = intelDb.findOne(i => i.studentId === req.user?.id);

  const payload = {
    studentId: req.user.id,
    studentName: req.user.name,
    class: req.user.class || 'الأولى إعدادي',
    linguistic: linguistic || 0,
    logical: logical || 0,
    visual: visual || 0,
    kinesthetic: kinesthetic || 0,
    musical: musical || 0,
    interpersonal: interpersonal || 0,
    intrapersonal: intrapersonal || 0,
    naturalistic: naturalistic || 0,
    dominantIntelligence,
    answers: answers || {},
    timestamp: new Date().toISOString()
  };

  if (existing) {
    intelDb.updateOne(i => i.studentId === req.user?.id, payload);
  } else {
    intelDb.insertOne({ id: `intel_${Date.now()}`, ...payload });
  }

  notifyRealtime('intelligence-completed', {
    studentName: req.user.name,
    dominantIntelligence,
    class: req.user.class
  });

  res.json({ success: true, dominantIntelligence });
});

// 📝 Interactive Practice Worksheets
router.get('/exercises', authenticateJWT, (req, res) => {
  const list = dbCollections.getCollection<any>('exercise_submissions').find();
  res.json(list);
});

router.post('/exercises/submit', authenticateJWT, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(403).json({ error: 'غير مصرح' });
    return;
  }

  const { exerciseId, title, question, studentAnswer, correctAnswer, isCorrect, score } = req.body;

  const exerciseDb = dbCollections.getCollection<any>('exercise_submissions');
  const submission = {
    id: `ex_${Date.now()}`,
    studentId: req.user.id,
    studentName: req.user.name,
    class: req.user.class || 'الأولى إعدادي',
    exerciseId,
    title: title || 'تمرين صرفي ونحوي',
    question,
    studentAnswer,
    correctAnswer,
    isCorrect,
    score: score || (isCorrect ? 20 : 0),
    timestamp: new Date().toISOString()
  };

  exerciseDb.insertOne(submission);

  notifyRealtime('exercise-submitted', submission);

  res.status(201).json(submission);
});

// ✍️ Composition / Essay Writings
router.get('/writing', authenticateJWT, (req, res) => {
  const writings = dbCollections.getCollection<any>('writing_submissions').find();
  res.json(writings);
});

router.get('/writing/student/:studentId', authenticateJWT, (req, res) => {
  const list = dbCollections.getCollection<any>('writing_submissions').find(w => w.studentId === req.params.studentId);
  res.json(list);
});

router.post('/writing/submit', authenticateJWT, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(403).json({ error: 'غير مسموح' });
    return;
  }

  const { topicTitle, content, wordCount } = req.body;
  if (!topicTitle || !content) {
    res.status(400).json({ error: 'الرجاء توفير عنوان الموضوع ونص الإنشاء كاملاً' });
    return;
  }

  const writingDb = dbCollections.getCollection<any>('writing_submissions');
  const newSubmission = {
    id: `writing_${Date.now()}`,
    studentId: req.user.id,
    studentName: req.user.name,
    class: req.user.class || 'الأولى إعدادي',
    topicTitle,
    content,
    wordCount: wordCount || content.trim().split(/\s+/).length,
    teacherFeedback: '',
    score: null,
    status: 'pending',
    timestamp: new Date().toISOString()
  };

  writingDb.insertOne(newSubmission);

  notifyRealtime('writing-submitted', newSubmission);

  res.status(201).json(newSubmission);
});

// 🤖 AI-Powered Composition Analysis & Tutoring
router.post('/writing/ai-grade', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { lessonTitle, content } = req.body;
  if (!lessonTitle || !content) {
    res.status(400).json({ error: 'الرجاء توفير عنوان المهارة والنص المراد تحليله' });
    return;
  }

  try {
    const prompt = `أنت مصحح ومرشد تربوي خبير في اللغة العربية بالسلك الإعدادي المغربي.
قم بتقييم وتصحيح الموضوع الإنشائي المكتوب من لدن تلميذ وفق مهارة التعبير والإنشاء التالية:
المهارة المستهدفة: "${lessonTitle}"
نص موضوع التلميذ:
"${content}"

معايير التقييم التي يجب عليك احترامها وتوزيع النقاط بناءً عليها (المجموع من 20 ن):
1. ملاءمة المنتج للمطلوب واحترام خصائص المهارة: 8 نقاط.
2. اتساق الأفكار وتسلسلها المنطقي والمنهجي (مقدمة، عرض، خاتمة): 5 نقاط.
3. سلامة اللغة والأسلوب من الأخطاء النحوية والإملائية والتركيبية: 5 نقاط.
4. التنظيم الجيد واستعمال علامات الترقيم المناسبة: نقطتان.

قم بتحليل النص بدقة بالغة وبأسلوب تشجيعي تربوي رصين يرفع معنويات التلميذ ويذلل الصعاب له.
أخرج النتيجة بصيغة JSON متوافقة تماماً مع هذا الهيكل:
{
  "score": 15.5, // درجة مقترحة من 20 (رقم عشري أو صحيح)
  "feedback": "مقدمة عامة تقيم المحتوى وتشكر المحاولة بعبارات تربوية رائعة ومحفزة.",
  "strengths": [
    "نقطة القوة الأولى التي أبان عنها المتعلم بنجاح",
    "نقطة القوة الثانية في الأسلوب أو الالتزام بالمهارة"
  ],
  "weaknesses": [
    "نقطة الضعف الأولى أو الخطأ النحوي المكتشف",
    "نقطة الضعف الثانية وكيفية تلافيها"
  ],
  "corrections": [
    {
      "original": "العبارة الخاطئة أو الركيكة التي وردت في النص",
      "suggested": "العبارة المصححة والبليغة البديلة",
      "explanation": "تعليل مبسط للقاعدة النحوية أو الأسلوبية"
    }
  ],
  "remedy": "توجيه داعم ونصيحة مركزة لتقوية هذه المهارة مستقبلاً."
}
ملاحظة هامة: يجب أن يكون الرد عبارة عن كود JSON صالح فقط وخالٍ من أي تعليقات أو علامات ماركداون إضافية غير صالحة للتحليل البرمجي.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let resultText = response.text || '{}';
    resultText = resultText.replace(/^\s*```[jJ][sS][oO][nN]?\s*/, '').replace(/\s*```\s*$/, '').trim();
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error('AI Composition Grading failed:', error);
    res.status(500).json({ error: 'عذراً، فشل الاتصال بالذكاء الاصطناعي لتصحيح النص حالياً.' });
  }
});

// 🤖 AI Tutor Chat for Smart learning Paths
router.post('/smartpath/ask-tutor', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { title, prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: 'الرجاء كتابة السؤال.' });
    return;
  }
  try {
    const fullPrompt = `أنت خبير في تعليم النحو العربي للسلك الإعدادي المغربي. 
    الموضوع الحالي: ${title || 'مراجعة عامة للنحو'}.
    التلميذ يسأل: ${prompt}.
    اشرح بأسلوب مبسط، استخدم أمثلة من البيئة المغربية، وكن مشجعاً جداً. 
    اجعل الرد بصيغة Markdown.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: fullPrompt
    });
    res.json({ text: response.text || "عذراً، لم أستطع توليد رد حالياً." });
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    res.status(500).json({ error: "عذراً، حدث خطأ في التواصل مع المعلم الذكي. حاول مجدداً." });
  }
});

// 🤖 AI Spelling and Dictation inspector
router.post('/spelling/inspect', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'الرجاء كتابة النص لفحصه.' });
    return;
  }
  try {
    const prompt = `أنت "محقق الإملاء الذكي". حلل النص التالي واكتشف الأخطاء الإملائية.
    النص: "${text}"
    
    المهمة:
    1. اكتشف كل خطأ إملائي (همزات، تاءات، ألف لينة، تنوين، حروف متشابهة).
    2. قدم النص المصحح بالكامل.
    3. لكل خطأ، حدد نوعه واشرح القاعدة بأسلوب تعليمي مشوق لتلاميذ الإعدادي.
    4. حدد نقاط XP مستحقة (بين 10 و 100 حسب عدد الأخطاء المكتشفة).
    5. قدم نصيحة أخيرة للمتعلم لتجنب هذه الأخطاء مستقبلاً.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: { type: Type.STRING },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['hemza', 'ta', 'alif', 'tanwin', 'letters', 'other'] },
                  explanation: { type: Type.STRING },
                  rule: { type: Type.STRING }
                },
                required: ['original', 'corrected', 'type', 'explanation', 'rule']
              }
            },
            xpGained: { type: Type.NUMBER },
            badge: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ['correctedText', 'corrections', 'xpGained', 'advice']
        }
      }
    });

    let resultText = response.text || '{}';
    resultText = resultText.replace(/^\s*```[jJ][sS][oO][nN]?\s*/, '').replace(/\s*```\s*$/, '').trim();
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Spelling Inspection Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء فحص النص. يرجى المحاولة لاحقاً." });
  }
});

// 🤖 AI OCR for handwritten image analysis
router.post('/composition/ocr', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { base64Image, mimeType } = req.body;
  if (!base64Image) {
    res.status(400).json({ error: 'الرجاء تزويد الصورة.' });
    return;
  }
  try {
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: base64Data
          }
        },
        "أنت خبير في التعرف الضوئي على الحروف (OCR) للغة العربية. استخرج النص العربي الموجود في هذه الصورة أو الملف بدقة عالية. حافظ على ترتيب الفقرات والأسطر. لا تضف أي تعليقات أو شرح، فقط النص المستخرج."
      ]
    });
    res.json({ text: (response.text || '').trim() });
  } catch (error: any) {
    console.error("OCR API Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء استخراج النص من الصورة." });
  }
});

// 🤖 AI text error highlighting
router.post('/composition/highlight', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'الرجاء توفير النص.' });
    return;
  }
  try {
    const prompt = `أنت أداة تعليمية ذكية لتصحيح النصوص باللغة العربية.
    المرحلة 2: عرض النص مع تظليل.
    أعد عرض النص التالي كما هو تماماً، لكن قم بوضع الكلمات التي تحتوي على أخطاء محتملة (إملائية، نحوية، أو تركيبية) بين وسوم <error> و </error>.
    قواعد صارمة:
    1. لا تشرح أي شيء.
    2. لا تضغ ملاحظات.
    3. لا تعطي إجابة أو تصحيح.
    4. فقط ضع الوسوم حول الكلمات الخاطئة داخل النص الأصلي.
    
    النص: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt
    });
    res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error("Highlight stage API error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تحديد الأخطاء. يرجى المحاولة مرة أخرى." });
  }
});

// 🤖 AI final correction stage
router.post('/composition/final', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'الرجاء توفير النص.' });
    return;
  }
  try {
    const prompt = `أنت أداة تعليمية ذكية لتصحيح النصوص باللغة العربية.
    المرحلة 3: التصحيح النهائي والشرح.
    قم بتصحيح النص التالي كاملاً بشكل صحيح، ثم اشرح الأخطاء التي وقع فيها المتعلم مع ذكر القاعدة النحوية أو الإملائية لكل خطأ بأسلوب مبسط.
    
    النص: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: { type: Type.STRING },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['spelling', 'grammar', 'structure'] },
                  explanation: { type: Type.STRING },
                  rule: { type: Type.STRING }
                },
                required: ['original', 'corrected', 'type', 'explanation', 'rule']
              }
            },
            rating: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                errorCount: { type: Type.NUMBER },
                spellingErrors: { type: Type.NUMBER },
                grammarErrors: { type: Type.NUMBER },
                structureErrors: { type: Type.NUMBER }
              },
              required: ['errorCount', 'spellingErrors', 'grammarErrors', 'structureErrors']
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['correctedText', 'corrections', 'rating', 'stats', 'suggestions']
        }
      }
    });

    let resultText = response.text || '{}';
    resultText = resultText.replace(/^\s*```[jJ][sS][oO][nN]?\s*/, '').replace(/\s*```\s*$/, '').trim();
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Final stage API error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تصحيح النص الكلي." });
  }
});

router.put('/writing/:id/grade', authenticateJWT, requireRole(['teacher', 'admin']), (req, res) => {
  const { score, teacherFeedback } = req.body;
  if (score === undefined || !teacherFeedback) {
    res.status(400).json({ error: 'الرجاء توفير النقطة والتقييم والملحوظات للإنشاء' });
    return;
  }

  const writingDb = dbCollections.getCollection<any>('writing_submissions');
  const submission = writingDb.findOne(w => w.id === req.params.id);

  if (!submission) {
    res.status(404).json({ error: 'الإنشاء غير مسجل بالنظام للتصحيح' });
    return;
  }

  writingDb.updateOne(w => w.id === req.params.id, {
    score: parseFloat(score),
    teacherFeedback,
    status: 'reviewed'
  });

  const updated = writingDb.findOne(w => w.id === req.params.id);

  // Send Notification to student
  const notificationsDb = dbCollections.getCollection<any>('notifications');
  notificationsDb.insertOne({
    id: `notif_${Date.now()}`,
    studentId: updated.studentId,
    title: 'تصحيح موضوع الإنشاء والتعبير ✍️',
    text: `أنهى الأستاذ تصحيح تعبيرك "${updated.topicTitle}" بنقطة ${score}/20 والملحوظة.`,
    type: 'result',
    timestamp: new Date().toISOString(),
    isRead: false
  });

  notifyRealtime('writing-graded', updated);

  res.json(updated);
});

// 📊 Comprehensive Analytics Dashboard Computing
router.get('/analytics', authenticateJWT, (req, res) => {
  const usersDb = dbCollections.getCollection<any>('users');
  const examsDb = dbCollections.getCollection<any>('exam_results');
  const intelDb = dbCollections.getCollection<any>('intelligence_results');
  const exercisesDb = dbCollections.getCollection<any>('exercise_submissions');
  const writingDb = dbCollections.getCollection<any>('writing_submissions');

  const students = usersDb.find(u => u.role === 'student');

  if (students.length === 0) {
    res.json({ error: 'مستودع المتعلمين فارغ.' });
    return;
  }

  // 1. Attendance Average
  const totalAttendance = students.reduce((sum, s) => sum + (s.attendanceRate || 0), 0);
  const avgAttendance = parseFloat((totalAttendance / students.length).toFixed(1));

  // 2. Average exam grades
  const exams = examsDb.find();
  const totalExamsScore = exams.reduce((sum, e) => sum + (e.score || 0), 0);
  const avgExamsScore = exams.length > 0 ? parseFloat((totalExamsScore / exams.length).toFixed(1)) : 14.5;

  // 3. Multi intelligences averaged profiles
  const intels = intelDb.find();
  let linguistic = 0, logical = 0, visual = 0, kinesthetic = 0, musical = 0, interpersonal = 0, intrapersonal = 0, naturalistic = 0;
  if (intels.length > 0) {
    intels.forEach(i => {
      linguistic += i.linguistic || 0;
      logical += i.logical || 0;
      visual += i.visual || 0;
      kinesthetic += i.kinesthetic || 0;
      musical += i.musical || 0;
      interpersonal += i.interpersonal || 0;
      intrapersonal += i.intrapersonal || 0;
      naturalistic += i.naturalistic || 0;
    });
    const len = intels.length;
    linguistic = Math.round(linguistic / len);
    logical = Math.round(logical / len);
    visual = Math.round(visual / len);
    kinesthetic = Math.round(kinesthetic / len);
    musical = Math.round(musical / len);
    interpersonal = Math.round(interpersonal / len);
    intrapersonal = Math.round(intrapersonal / len);
    naturalistic = Math.round(naturalistic / len);
  } else {
    linguistic = 75; logical = 68; visual = 71; kinesthetic = 62; musical = 55; interpersonal = 80; intrapersonal = 78; naturalistic = 64;
  }

  // 4. Exercise rates
  const exercises = exercisesDb.find();
  const totalExcCount = exercises.length;
  const correctExcCount = exercises.filter(e => e.isCorrect).length;
  const excSuccessRate = totalExcCount > 0 ? Math.round((correctExcCount / totalExcCount) * 100) : 85;

  // 5. XP Leaderboard top 10 ranked
  const leaderboard = [...students]
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, 10)
    .map(({ password, ...s }) => s);

  // 6. Distribution across classes
  const classesDist = {
    'الأولى إعدادي': students.filter(s => s.class === 'الأولى إعدادي').length,
    'الثانية إعدادي': students.filter(s => s.class === 'الثانية إعدادي').length,
    'الثالثة إعدادي': students.filter(s => s.class === 'الثالثة إعدادي').length
  };

  res.json({
    totalStudents: students.length,
    avgAttendance,
    avgExamsScore,
    averageIntelligence: {
      linguistic, logical, visual, kinesthetic, musical, interpersonal, intrapersonal, naturalistic
    },
    excSuccessRate,
    exercisesCount: totalExcCount,
    writingsCount: writingDb.find().length,
    leaderboard,
    classesDist
  });
});

// 🔔 User Notifications API
router.get('/notifications', authenticateJWT, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(403).json({ error: 'غير مصرح' });
    return;
  }

  const list = dbCollections.getCollection<any>('notifications').find(
    n => n.studentId === 'all' || n.studentId === req.user?.id
  );
  
  res.json(list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
});

router.put('/notifications/:id/read', authenticateJWT, (req, res) => {
  const notifyDb = dbCollections.getCollection<any>('notifications');
  notifyDb.updateOne(n => n.id === req.params.id, { isRead: true });
  res.json({ success: true });
});

// Admin Dashboard Integrations (User Request)
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';
router.use('/', authRoutes);
router.use('/', dashboardRoutes);

export default router;
