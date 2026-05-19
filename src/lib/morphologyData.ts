
import { AssessmentType } from './smartCorrector';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface MorphologyLessonData {
  id: string;
  title: string;
  slug: string;
  level: string; // e.g. "الأولى إعدادي"
  intro: {
    problem: string;
    diagnosticQuestions: Question[];
  };
  objectives: string[];
  theory: {
    definition: string;
    sections: {
      title: string;
      content: string;
      table?: { header: string[]; rows: string[][] };
    }[];
  };
  solvedExamples: {
    word: string;
    analysis: string;
    explanation: string;
  }[];
  activities: Question[];
  summary: {
    content: string;
    rules: string[];
    mistakes: string[];
  };
  summativeQuiz: Question[];
}

export const morphologyLessons: MorphologyLessonData[] = [
  {
    id: 'morphological-scale',
    title: 'الميزان الصرفي',
    slug: 'morphological-scale',
    level: 'الأولى إعدادي',
    intro: {
      problem: 'كيف يمكننا معرفة أصل الكلمة وما طرأ عليها من زيادة أو حذف؟ تخيل أن للكلمات موازين مثل الذهب!',
      diagnosticQuestions: [
        {
          id: 1,
          text: 'ما هي الحروف التي اختارها العلماء لتكون ميزاناً للكلمات؟',
          options: ['أ ب ج', 'ف ع ل', 'س ك ن'],
          correctAnswer: 1,
          explanation: 'اختار العلماء (ف ع ل) لأنها تشمل أغلب الأفعال.'
        }
      ]
    },
    objectives: [
      'تعريف الميزان الصرفي وأهميته.',
      'القدرة على وزن الكلمات الثلاثية المجردة.',
      'ضبط الكلمات المزيدة بزيادة ما يماثلها في الميزان.'
    ],
    theory: {
      definition: 'الميزان الصرفي مقياس وضعه علماء الصرف لمعرفة أحوال بنية الكلمة.',
      sections: [
        {
          title: 'وزن الثلاثي المجرد',
          content: 'توزن الكلمات الثلاثية بمقابلة حروفها بحروف (ف ع ل) مع نقل الحركات.',
          table: {
            header: ['الكلمة', 'الوزن'],
            rows: [
              ['كَتَبَ', 'فَعَلَ'],
              ['حَسُنَ', 'فَعُلَ'],
              ['سَمِعَ', 'فَعِلَ']
            ]
          }
        },
        {
          title: 'وزن المزيد بحرف أو أكثر',
          content: 'إذا كانت الزيادة ناتجة عن تكرار حرف أصلي، نكرر ما يقابله. وإذا كانت بحرف من حروف (سألتمونيها)، نزيد الحرف نفسه.'
        }
      ]
    },
    solvedExamples: [
      { word: 'كاتِب', analysis: 'ف + ا + ع + ل', explanation: 'أصلها (كتب) وزيدت الألف بعد الفاء.' },
      { word: 'انكسر', analysis: 'ا + ن + ف + ع + ل', explanation: 'أصلها (كسر) وزيدت الألف والنون في الأول.' }
    ],
    activities: [
      {
        id: 1,
        text: 'ما هو وزن كلمة "مَلْعَب"؟',
        options: ['فَعْلَل', 'مَفْعَل', 'فَاعِل'],
        correctAnswer: 1,
        explanation: 'مَلْعَب على وزن مَفْعَل من الفعل لَعِبَ.'
      }
    ],
    summary: {
      content: 'خلاصة الدرس في نقاط مركزة:',
      rules: [
        'الميزان الأساسي هو (ف ع ل).',
        'الحركات في الكلمة تنتقل كما هي إلى الميزان.',
        'الزيادة في الكلمة تقابلها زيادة في الميزان.'
      ],
      mistakes: [
        'إغفال التضعيف (الشدة) في الميزان.',
        'خلط حروف الزيادة بحروف الأصل.'
      ]
    },
    summativeQuiz: [
      {
        id: 1,
        text: 'وزن كلمة "استخراج" هو:',
        options: ['افتعال', 'انفعال', 'استفعال'],
        correctAnswer: 2,
        explanation: 'استخراج من خَرَجَ، فنضيف حروف الزيادة (ا س ت ا) فتصبح استفعال.'
      },
      {
        id: 2,
        text: 'كلمة "دحرج" وزنها:',
        options: ['فعلل', 'فعل', 'مفعل'],
        correctAnswer: 0,
        explanation: 'دحرج فعل رباعي أصلي، وزنه فعلل.'
      }
    ]
  },
  {
    id: 'active-participle',
    title: 'اسم الفاعل',
    slug: 'active-participle',
    level: 'الثانية إعدادي',
    intro: {
      problem: 'إذا قلت "أنا كاتب الدرس"، فمن الذي قام بالكتابة؟ وكيف اشتققنا كلمة "كاتب"؟',
      diagnosticQuestions: [
        {
          id: 1,
          text: 'ما هو الفعل من كلمة "صانع"؟',
          options: ['صنع', 'تصنيع', 'استصنع'],
          correctAnswer: 0,
          explanation: 'صانع مشتق من صنع.'
        }
      ]
    },
    objectives: [
      'صياغة اسم الفاعل من الثلاثي على وزن فاعل.',
      'صياغة اسم الفاعل من غير الثلاثي بإبدال حرف المضارعة ميماً مضمومة وكسر ما قبل الآخر.'
    ],
    theory: {
      definition: 'اسم الفاعل اسم مشتق ليدل على من قام بالفعل.',
      sections: [
        {
          title: 'من الفعل الثلاثي',
          content: 'يصاغ على وزن (فَاعِل) غالباً.',
          table: {
            header: ['الفعل', 'اسم الفاعل'],
            rows: [
              ['دخل', 'داخل'],
              ['قال', 'قائل'],
              ['سعى', 'ساعٍ']
            ]
          }
        },
        {
          title: 'من غير الثلاثي',
          content: 'نأخذ المضارع، ثم نبدل حرف المضارعة ميماً مضمومة، ونكسر الحرف قبل الأخير.'
        }
      ]
    },
    solvedExamples: [
      { word: 'مُستخرج', analysis: 'استخرَج -> يستخرِج -> مُستخرِج', explanation: 'قلبت الياء ميماً مضمومة وكسر الراء.' }
    ],
    activities: [
      {
        id: 1,
        text: 'ما هو اسم الفاعل من "أخرج"؟',
        options: ['خارج', 'مُخرِج', 'مُخرَج'],
        correctAnswer: 1,
        explanation: 'أخرج غير ثلاثي، مضارعه يخرج، اسم فاعله مخرج.'
      }
    ],
    summary: {
      content: 'تذكر دائماً:',
      rules: [
        'للثلاثي: فاعِل.',
        'لغير الثلاثي: مـُ...ِ.',
        'يعمل عمل فعله في حالات معينة.'
      ],
      mistakes: [
        'فتح ما قبل الآخر في غير الثلاثي (هذا اسم مفعول).',
        'نسيان قلب حرف العلة همزة في الأجوف (قال -> قائل).'
      ]
    },
    summativeQuiz: [
      {
        id: 1,
        text: 'اسم الفاعل من "انتصر" هو:',
        options: ['ناصر', 'مُنتصِر', 'مُنتصَر'],
        correctAnswer: 1,
        explanation: 'انتصر غير ثلاثي، فيصبح مـُنتصِر.'
      }
    ]
  },
  {
    id: 'abstract-augmented',
    title: 'الفعل المجرد والمزيد',
    slug: 'abstract-augmented',
    level: 'الأولى إعدادي',
    intro: {
      problem: 'هل كل حروف الفعل أصلية أم أن بعضها مجرد "ضيوف"؟ كيف نميز بين الحروف الأساسية والحروف الزائدة؟',
      diagnosticQuestions: [
        {
          id: 1,
          text: 'أي من الأفعال التالية يعتبر أصل حروفه ثلاثة فقط؟',
          options: ['خرج', 'استخرج', 'كلاهما'],
          correctAnswer: 2,
          explanation: 'كلاهما أصل حروفهما (خ ر ج)، لكن "استخرج" زيدت عليه حروف.'
        }
      ]
    },
    objectives: [
      'تعريف الفعل المجرد وأقسامه.',
      'تعريف الفعل المزيد وأنواع الزيادة.',
      'التمييز بين حروف الزيادة والحروف الأصلية.'
    ],
    theory: {
      definition: 'الفعل المجرد هو ما كانت كل حروفه أصلية، والمزيد هو ما زيد على حروفه الأصلية حرف أو أكثر.',
      sections: [
        {
          title: 'الفعل المجرد',
          content: 'ينقسم إلى مجرد ثلاثي (مثل: دخل) ومجرد رباعي (مثل: دحرج).',
          table: {
            header: ['النوع', 'المثال'],
            rows: [
              ['مجرد ثلاثي', 'نَصَرَ، فَتَحَ'],
              ['مجرد رباعي', 'زَلْزَلَ، بَعْثَرَ']
            ]
          }
        },
        {
          title: 'الفعل المزيد',
          content: 'هو ما زيد فيه حرف أو أكثر على حروفه الأصلية. حروف الزيادة تجمع في كلمة (سألتمونيها).',
          table: {
            header: ['نوع الزيادة', 'المثال'],
            rows: [
              ['مزيد بحرف', 'أخرَجَ، كاتَبَ، قدّمَ'],
              ['مزيد بحرفين', 'انكسرَ، تكاتَبَ، احمرَّ'],
              ['مزيد بثلاثة', 'استخرجَ، استعمرَ']
            ]
          }
        }
      ]
    },
    solvedExamples: [
      { word: 'استقبل', analysis: 'قبل + ا س ت', explanation: 'فعل مزيد بثلاثة أحرف.' },
      { word: 'طَمأن', analysis: 'ط م أ ن', explanation: 'فعل مجرد رباعي (كل حروفه أصلية).' }
    ],
    activities: [
      {
        id: 1,
        text: 'الفعل "اندفع" هو فعل:',
        options: ['مجرد', 'مزيد بحرف', 'مزيد بحرفين'],
        correctAnswer: 2,
        explanation: 'أصله (دفع) وزيدت الألف والنون.'
      }
    ],
    summary: {
      content: 'خلاصة التمييز بين المجرد والمزيد:',
      rules: [
        'المجرد: حروفه كلها أصلية لا تسقط في أي تصريف.',
        'المزيد: يزاد فيه حرف أو اثنان أو ثلاثة.',
        'أقصى عدد لحروف الفعل هو ستة أحرف.'
      ],
      mistakes: [
        'اعتبار حروف المضارعة (أ ن ي ت) من حروف الزيادة (لا، هي حروف تصريف).',
        'اعتبار الضمائر المتصلة من حروف الزيادة.'
      ]
    },
    summativeQuiz: [
      {
        id: 1,
        text: 'الزيادة في فعل "استغفر" هي:',
        options: ['حرف واحد', 'حرفان', 'ثلاثة أحرف'],
        correctAnswer: 2,
        explanation: 'الحروف الزائدة هي (ا س ت).'
      },
      {
        id: 2,
        text: 'الفعل "بعثر" هو فعل:',
        options: ['مجرد ثلاثي', 'مجرد رباعي', 'مزيد بحرف'],
        correctAnswer: 1,
        explanation: 'بعثر حروفه الأربعة أصلية.'
      }
    ]
  }
];
