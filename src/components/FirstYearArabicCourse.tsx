import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Lightbulb, 
  Search, 
  Brain, 
  CheckCircle, 
  PenTool, 
  Target, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Zap,
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LessonContent {
  id: string;
  title: string;
  problem: {
    scenario: string;
    question: string;
  };
  observation: string[];
  analysis: {
    examples: { text: string; note: string }[];
    steps: string[];
  };
  rule: {
    definition: string;
    examples: string[];
  };
  application: {
    question: string;
    exercises: string[];
  };
  production: string;
  evaluation: string[];
}

const lessons: LessonContent[] = [
  {
    id: 'nominal-sentence',
    title: 'الجملة الاسمية: المبتدأ والخبر',
    problem: {
      scenario: 'دخل أحمد إلى قسمه الجديد في أول يوم دراسي، فأراد أن يصفه لصديقه في رسالة نصية، فكتب: "المدرسةُ واسعةٌ. القسمُ نظيفٌ. الأستاذُ طيبٌ." لاحظ أحمد أنه لم يستخدم أي أفعال في وصفه، ومع ذلك فهم صديقه كل شيء.',
      question: 'كيف استطاع أحمد إيصال المعنى دون استخدام أفعال؟ وبماذا بدأت هذه الجمل؟'
    },
    observation: [
      'تأمل الكلمات الأولى في جمل أحمد: (المدرسة، القسم، الأستاذ).',
      'هل هذه الكلمات أسماء أم أفعال أم حروف؟',
      'هل المعنى تام في هذه الجمل؟'
    ],
    analysis: {
      examples: [
        { text: 'المدرسةُ واسعةٌ', note: 'المدرسة: اسم بدأنا به الجملة (مبتدأ). واسعة: خبرنا بها عن المدرسة (خبر).' },
        { text: 'القسمُ نظيفٌ', note: 'القسم: مبتدأ مرفوع. نظيف: خبر مرفوع.' }
      ],
      steps: [
        'الجملة التي تبدأ باسم تسمى جملة اسمية.',
        'الاسم الذي نبدأ به يسمى "مبتدأ" لأنه يبتدئ الكلام.',
        'الكلمة التي تتمم المعنى وتخبرنا عن المبتدأ تسمى "خبراً".'
      ]
    },
    rule: {
      definition: 'الجملة الاسمية هي كل جملة تبدأ باسم، وتتكون من ركنين أساسيين هما: المبتدأ (اسم مرفوع تبدأ به الجملة) والخبر (ما يخبر به عن المبتدأ ويتمم معه معنى مفيداً).',
      examples: ['العلمُ نورٌ', 'الجوُّ صحوٌ', 'المطالعةُ مفيدةٌ']
    },
    application: {
      question: 'حدد المبتدأ والخبر في الجمل التالية:',
      exercises: [
        'الساحةُ فسيحةٌ.',
        'التلميذُ مجتهدٌ.',
        'القصةُ رائعةٌ.'
      ]
    },
    production: 'اكتب ثلاث جمل تصف فيها غرفتك، مستخدماً الجملة الاسمية فقط.',
    evaluation: [
      'ما هو الركن الأول في الجملة الاسمية؟',
      'هل يمكن أن يأتي الخبر قبل المبتدأ؟ (فكر في الأمر)',
      'أعط مثالاً لجملة اسمية من إنشائك.'
    ]
  },
  {
    id: 'verbal-sentence',
    title: 'الجملة الفعلية: الفعل والفاعل',
    problem: {
      scenario: 'في ساحة المدرسة، شاهدت مريم زملاءها يلعبون، فقالت: "يجري التلميذُ بسرعة. سقطت الكرةُ في السلة. صفق الجمهورُ." لاحظت مريم أن كل جملة تعبر عن حركة أو عمل قام به شخص أو شيء ما.',
      question: 'بماذا بدأت جمل مريم؟ ومن الذي قام بالأفعال المذكورة؟'
    },
    observation: [
      'لاحظ الكلمات: (يجري، سقطت، صفق). هل تدل على زمن وعمل؟',
      'من الذي "جرى"؟ ومن الذي "سقط"؟',
      'ماذا نسمي الجملة التي تبدأ بعمل (فعل)؟'
    ],
    analysis: {
      examples: [
        { text: 'يجري التلميذُ', note: 'يجري: فعل يدل على حدث في الحاضر. التلميذ: هو من قام بالجري (فاعل).' },
        { text: 'سقطت الكرةُ', note: 'سقطت: فعل ماضٍ. الكرة: هي التي سقطت (فاعل).' }
      ],
      steps: [
        'الجملة التي تبدأ بفعل تسمى جملة فعلية.',
        'الفعل يدل على حدث مرتبط بزمن (ماض، مضارع، أمر).',
        'الفاعل هو الاسم الذي قام بالفعل، ويكون دائماً مرفوعاً.'
      ]
    },
    rule: {
      definition: 'الجملة الفعلية هي التي تبدأ بفعل، وتتكون أساساً من: الفعل (يدل على حدث وزمن) والفاعل (اسم مرفوع يدل على من قام بالفعل).',
      examples: ['نجحَ المجتهدُ', 'يغردُ العصفورُ', 'حافظْ على نظافتك']
    },
    application: {
      question: 'استخرج الفعل والفاعل من الجمل التالية:',
      exercises: [
        'أشرقت الشمسُ.',
        'يراجعُ عليٌّ دروسَه.',
        'فازَ الفريقُ بالكأس.'
      ]
    },
    production: 'صف مشهداً في الشارع مستخدماً ثلاث جمل فعلية تبدأ بأفعال مختلفة.',
    evaluation: [
      'بماذا تبدأ الجملة الفعلية؟',
      'ما هي الحالة الإعرابية للفاعل؟',
      'هل يمكن أن تستغني الجملة الفعلية عن الفاعل؟'
    ]
  },
  {
    id: 'object',
    title: 'المفعول به',
    problem: {
      scenario: 'كتب ياسين جملة: "أكل الولدُ..." وسكت. سأله زملاؤه: ماذا أكل؟ هل أكل تفاحة؟ أم خبزاً؟ أم لمجة؟ شعر ياسين أن جملته ناقصة رغم وجود فعل وفاعل.',
      question: 'لماذا لم يكتمل المعنى في جملة ياسين؟ وما الكلمة التي نحتاجها لتوضيح ماذا وقع عليه فعل الأكل؟'
    },
    observation: [
      'قارن بين: "نام الطفل" و "أكل الولد التفاحة".',
      'هل كلمة "التفاحة" هي من قامت بالفعل أم وقع عليها الفعل؟',
      'ما هي الحركة الإعرابية الموجودة على آخر كلمة "التفاحة"؟'
    ],
    analysis: {
      examples: [
        { text: 'رسمَ الفنانُ لوحةً', note: 'لوحةً: هي الشيء الذي وقع عليه فعل الرسم (مفعول به).' },
        { text: 'شربَ المريضُ الدواءَ', note: 'الدواءَ: اسم منصوب وقع عليه فعل الشرب.' }
      ],
      steps: [
        'بعض الأفعال لا تكتفي بالفاعل بل تحتاج لاسم آخر يوضح المعنى.',
        'الاسم الذي يقع عليه فعل الفاعل يسمى "مفعولاً به".',
        'المفعول به يكون دائماً منصوباً (وعلامته الفتحة غالباً).'
      ]
    },
    rule: {
      definition: 'المفعول به اسم منصوب يقع عليه فعل الفاعل في الجملة الفعلية. نسأل عنه غالباً بـ "ماذا؟".',
      examples: ['قرأ التلميذُ القصةَ', 'يحترمُ الابنُ الوالدينِ', 'شاهدتُ المباراةَ']
    },
    application: {
      question: 'ضع مفعولاً به مناسباً في الفراغات التالية مع ضبطه بالشكل:',
      exercises: [
        'حرث الفلاحُ .......',
        'نظفت البنتُ .......',
        'ركب المسافرُ .......'
      ]
    },
    production: 'تخيل أنك في مطعم، اطلب ثلاث وجبات مستخدماً جملة فعلية تتضمن مفعولاً به.',
    evaluation: [
      'ما هو المفعول به؟',
      'كيف نميز بين الفاعل والمفعول به من خلال الحركة الإعرابية؟',
      'هل كل الأفعال تحتاج لمفعول به؟'
    ]
  },
  {
    id: 'pronouns',
    title: 'الضمائر: المنفصلة والمتصلة',
    problem: {
      scenario: 'أراد خالد أن يتحدث عن نفسه وعن أصدقائه في الإذاعة المدرسية، فبدأ يقول: "خالد يحب القراءة، وخالد وأصدقاء خالد يذهبون للمكتبة..." ضحك أصدقاؤه وقالوا له: "لماذا تكرر اسمك كثيراً؟ يمكنك استخدام كلمات تنوب عن الأسماء!"',
      question: 'ما هي الكلمات التي يمكن لخالد استخدامها بدلاً من تكرار الأسماء؟ وكيف تجعل الكلام أخف وأجمل؟'
    },
    observation: [
      'بدل "خالد يحب"، يمكننا قول: "أنا أحب".',
      'بدل "كتاب خالد"، يمكننا قول: "كتابه".',
      'ما الفرق بين "أنا" و "الهاء" في "كتابه" من حيث الالتصاق بالكلمة؟'
    ],
    analysis: {
      examples: [
        { text: 'أنتَ مجتهدٌ', note: 'أنت: ضمير منفصل (لم يلتصق بكلمة أخرى).' },
        { text: 'درستُ درسي', note: 'التاء في (درست) والياء في (درسي) ضمائر متصلة.' }
      ],
      steps: [
        'الضمير هو اسم ينوب عن اسم ظاهر للاختصار ومنع التكرار.',
        'الضمائر المنفصلة تأتي مستقلة (أنا، نحن، أنت، هو...).',
        'الضمائر المتصلة تتصل بآخر الكلمة (التاء المتحركة، واو الجماعة، ياء المتكلم...).'
      ]
    },
    rule: {
      definition: 'الضمير اسم معرفة ينوب عن اسم ظاهر. وهو نوعان: منفصل (يستقل بنفسه في النطق والكتابة) ومتصل (لا يستقل بنفسه ويتصل بكلمة قبله).',
      examples: ['هو طالبٌ ذكي (منفصل)', 'كتابُك مفيد (متصل)', 'نحنُ نحبُّ الوطن (منفصل)']
    },
    application: {
      question: 'حول الأسماء الظاهرة إلى ضمائر مناسبة:',
      exercises: [
        'محمد يلعب بالكرة -> .... يلعب بالكرة.',
        'قلمُ أحمد ضائع -> قلمُـ... ضائع.',
        'المعلمات مخلصات -> .... مخلصات.'
      ]
    },
    production: 'اكتب فقرة قصيرة تعرف فيها بنفسك وبأسرتك مستخدماً الضمائر المنفصلة والمتصلة.',
    evaluation: [
      'لماذا نستخدم الضمائر؟',
      'اذكر ثلاثة ضمائر منفصلة للمخاطب.',
      'ما الفرق بين الضمير المتصل والمنفصل؟'
    ]
  },
  {
    id: 'adjective',
    title: 'النعت (الصفة)',
    problem: {
      scenario: 'ضاع هاتف ذكي في ساحة المدرسة. أعلن الحارس في المذياع: "لقد وجدنا هاتفاً". لم يتقدم أحد لاستلامه. في اليوم التالي أعلن: "وجدنا هاتفاً أسودَ كبيراً". فوراً تقدم صاحبه لاستلامه.',
      question: 'لماذا لم يعرف صاحب الهاتف جهازه في المرة الأولى؟ وما الذي أضافته كلمتا "أسود" و "كبير" للجملة؟'
    },
    observation: [
      'كلمة "هاتف" اسم عام (منعوت).',
      'كلمتا "أسود" و "كبير" وصفتا الهاتف (نعت).',
      'هل يتبع الوصف الكلمة التي يصفها في الحركة الإعرابية؟ (هاتفٌ كبيرٌ / هاتفاً كبيراً).'
    ],
    analysis: {
      examples: [
        { text: 'هذا تلميذٌ مهذبٌ', note: 'مهذب: نعت يصف التلميذ. كلاهما مرفوع ونكرة ومذكر ومفرد.' },
        { text: 'قرأتُ القصةَ المشوقةَ', note: 'المشوقة: نعت يصف القصة. كلاهما منصوب ومعرف بـ (ال).' }
      ],
      steps: [
        'النعت هو اسم يصف اسماً قبله يسمى "المنعوت".',
        'النعت يتبع المنعوت في أربعة أشياء: الإعراب، التذكير والتأنيث، العدد، والتعريف والتنكير.'
      ]
    },
    rule: {
      definition: 'النعت (الصفة) تابع يذكر لبيان صفة في اسم قبله يسمى المنعوت. يتبع النعت منعوته في رفعه ونصبه وجره، وفي تعريفه وتنكيره، وفي تذكيره وتأنيثه، وفي إفراده وتثنيته وجمعه.',
      examples: ['الرجلُ الصالحُ محبوبٌ', 'رأيتُ عصفوراً جميلاً', 'مررتُ بحديقةٍ واسعةٍ']
    },
    application: {
      question: 'ضع نعتاً مناسباً مكان الفراغ واضبطه بالشكل:',
      exercises: [
        'السماءُ ....... تريح الناظرين.',
        'اشتريتُ كتاباً .......',
        'هؤلاء طلابٌ .......'
      ]
    },
    production: 'صف صديقك المفضل مستخدماً ثلاث جمل تتضمن نعتاً ومنعوتاً.',
    evaluation: [
      'ما هو النعت؟ وما هو المنعوت؟',
      'في ماذا يتبع النعت منعوته؟',
      'هل يمكن أن يسبق النعت المنعوت؟'
    ]
  },
  {
    id: 'punctuation',
    title: 'علامات الترقيم',
    problem: {
      scenario: 'تلقى عمر رسالة من صديقه تقول: "هل ستأتي غداً يا عمر أنا أنتظرك بفارغ الصبر لا تتأخر". شعر عمر بالارتباك لأن الكلام متصل ببعضه ولا يعرف أين ينتهي السؤال وأين تبدأ الجملة الجديدة.',
      question: 'كيف يمكننا تنظيم هذه الرسالة لتصبح واضحة؟ وما هي الرموز التي نضعها بين الجمل؟'
    },
    observation: [
      'أين نضع الرمز (؟) في الرسالة؟',
      'أين نضع النقطة (.)؟',
      'ما الفائدة من الفاصلة (،)؟'
    ],
    analysis: {
      examples: [
        { text: 'ما أجملَ الطبيعةَ!', note: 'علامة التأثر/التعجب (!) توضع بعد جملة تدل على شعور قوي.' },
        { text: 'قال المعلم: العلم نور.', note: 'النقطتان (:) توضعان بعد القول أو قبل التفصيل.' }
      ],
      steps: [
        'علامات الترقيم رموز توضع بين الكلمات والجمل لتنظيم القراءة وفهم المعنى.',
        'لكل علامة وظيفة محددة (سؤال، تعجب، وقف قصير، وقف تام).'
      ]
    },
    rule: {
      definition: 'علامات الترقيم هي رموز اصطلاحية توضع بين الجمل لتحقيق الفهم، ومن أهمها: الفاصلة (،) للوقف القصير، النقطة (.) للوقف التام، علامة الاستفهام (؟) بعد السؤال، علامة التعجب (!) بعد الدهشة، والنقطتان (:) بعد القول.',
      examples: ['كيف حالك؟', 'الجو جميل، والسماء صافية.', 'قال أبي: الصدق منجاة.']
    },
    application: {
      question: 'ضع علامات الترقيم المناسبة في النص التالي:',
      exercises: [
        'هل راجعت دروسك ( ) نعم ( ) لقد راجعتها جيداً ( )',
        'يا له من منظر رائع ( )',
        'أقسام الكلمة ثلاثة ( ) اسم وفعل وحرف ( )'
      ]
    },
    production: 'اكتب رسالة قصيرة لصديقك تدعوه فيها لزيارتك، مع الحرص على استخدام أربع علامات ترقيم مختلفة.',
    evaluation: [
      'متى نستخدم الفاصلة المنقوطة (؛)؟',
      'أين توضع النقطة في الفقرة؟',
      'لماذا تعتبر علامات الترقيم مهمة في الكتابة؟'
    ]
  },
  {
    id: 'connectives',
    title: 'أدوات الربط (حروف العطف)',
    problem: {
      scenario: 'أراد سامي أن يخبر أمه عما فعله في المدرسة، فقال: "دخلتُ القسم. جلستُ في مكاني. فتحتُ المحفظة. أخرجتُ الكتاب." شعرت أمه أن كلامه مقطع مثل الروبوت، ولا يوجد انسجام بين الجمل.',
      question: 'كيف يمكن لسامي أن يربط بين هذه الأفعال ليجعل كلامه متصلاً ومنسجماً؟ وما هي الكلمات التي تقوم بدور "الجسر" بين الجمل؟'
    },
    observation: [
      'جرب إضافة "و" أو "ثم" بين جمل سامي.',
      'ما الفرق بين: "دخلتُ وجلستُ" و "دخلتُ ثم جلستُ" من حيث السرعة؟',
      'ماذا نسمي هذه الحروف التي تعطف كلمة على أخرى؟'
    ],
    analysis: {
      examples: [
        { text: 'جاء محمدٌ وعليٌّ', note: 'الواو: تفيد المشاركة (جاءا معاً).' },
        { text: 'دخل الأستاذُ فـالتلاميذُ', note: 'الفاء: تفيد الترتيب والسرعة (دخلوا مباشرة بعده).' }
      ],
      steps: [
        'أدوات الربط (حروف العطف) تربط بين كلمتين أو جملتين.',
        'كل حرف له معنى خاص (الواو للمشاركة، الفاء للسرعة، ثم للتراخي، أو للتخيير).'
      ]
    },
    rule: {
      definition: 'أدوات الربط (حروف العطف) هي كلمات تربط بين لفظين أو جملتين، ومن أهمها: الواو (لمطلق الجمع)، الفاء (للترتيب والتعقيب)، ثم (للترتيب مع التراخي)، أو (للتخيير أو الشك).',
      examples: ['أكلتُ التفاحَ والعنبَ', 'سأزورك اليومَ أو غداً', 'توضأتُ ثم صليتُ']
    },
    application: {
      question: 'اختر حرف العطف المناسب (و، فـ، ثم، أو) وضعه في الفراغ:',
      exercises: [
        'سأدرس الطب .... الهندسة (تخيير).',
        'وصل القطار .... ركب المسافرون (سرعة).',
        'زرعت البذرة .... حصدت الثمرة (بعد مدة طويلة).'
      ]
    },
    production: 'احكِ روتينك الصباحي مستخدماً حروف العطف (و، فـ، ثم) لربط أحداثك.',
    evaluation: [
      'ما هي وظيفة حروف العطف؟',
      'متى نستخدم "ثم" بدلاً من "الفاء"؟',
      'أعط جملة تتضمن حرف العطف "أو".'
    ]
  },
  {
    id: 'sentence-types',
    title: 'التمييز بين أنواع الجمل',
    problem: {
      scenario: 'في مسابقة "فارس اللغة"، طُلب من المتسابقين تصنيف مجموعة من البطاقات في صندوقين: صندوق "الجمل الاسمية" وصندوق "الجمل الفعلية". وجد المتسابقون جملة: "اللاعبُ يركضُ" وجملة "يركضُ اللاعبُ". ارتبك البعض وظنوا أنهما نفس الشيء.',
      question: 'هل هاتان الجملتان من نفس النوع؟ وما هو المعيار الأساسي الذي نعتمد عليه لتصنيف أي جملة؟'
    },
    observation: [
      'بماذا بدأت الجملة الأولى؟ (اللاعب). هل هو اسم أم فعل؟',
      'بماذا بدأت الجملة الثانية؟ (يركض). هل هو اسم أم فعل؟',
      'هل يتغير نوع الجملة إذا غيرنا ترتيب الكلمات؟'
    ],
    analysis: {
      examples: [
        { text: 'الجوُّ باردٌ اليوم', note: 'بدأت باسم (الجو) فهي جملة اسمية.' },
        { text: 'ينزلُ المطرُ بغزارة', note: 'بدأت بفعل (ينزل) فهي جملة فعلية.' }
      ],
      steps: [
        'نوع الجملة يتحدد دائماً بالكلمة الأولى فيها.',
        'إذا كانت الكلمة الأولى اسماً، فالجملة اسمية (مبتدأ + خبر).',
        'إذا كانت الكلمة الأولى فعلاً، فالجملة فعلية (فعل + فاعل).'
      ]
    },
    rule: {
      definition: 'للتمييز بين أنواع الجمل، ننظر دائماً إلى الكلمة الأولى: الجملة الاسمية هي التي تبدأ باسم، والجملة الفعلية هي التي تبدأ بفعل. يمكن تحويل الجملة من اسمية إلى فعلية والعكس بتغيير الترتيب.',
      examples: ['الشمس تشرق (اسمية) -> تشرق الشمس (فعلية)', 'المطر ينهمر (اسمية) -> ينهمر المطر (فعلية)']
    },
    application: {
      question: 'حدد نوع الجمل التالية وحولها للنوع الآخر:',
      exercises: [
        'المعلمُ يشرحُ الدرس.',
        'تفتحت الأزهارُ في الربيع.',
        'القطارُ يتحركُ ببطء.'
      ]
    },
    production: 'اكتب فقرة من ثلاث جمل، ابدأ الأولى باسم، والثانية بفعل، والثالثة باسم، ثم حدد نوع كل واحدة.',
    evaluation: [
      'كيف نعرف نوع الجملة؟',
      'حول "نام الطفل" إلى جملة اسمية.',
      'هل يمكن للجملة أن تبدأ بحرف؟ وكيف نصنفها حينها؟'
    ]
  }
];

const FirstYearArabicCourse: React.FC = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<'problem' | 'observation' | 'analysis' | 'rule' | 'application' | 'production' | 'evaluation'>('problem');

  const currentLesson = lessons[currentLessonIndex];

  const steps = [
    { id: 'problem', label: 'وضعية مشكلة', icon: <Zap size={18} /> },
    { id: 'observation', label: 'الفهم والملاحظة', icon: <Search size={18} /> },
    { id: 'analysis', label: 'الاكتشاف والتحليل', icon: <Brain size={18} /> },
    { id: 'rule', label: 'أبني قاعدتي', icon: <Layers size={18} /> },
    { id: 'application', label: 'التطبيق', icon: <PenTool size={18} /> },
    { id: 'production', label: 'الإنتاج', icon: <MessageSquare size={18} /> },
    { id: 'evaluation', label: 'التقويم', icon: <Target size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-black mb-4">
            <BookOpen size={16} />
            <span>السنة الأولى إعدادي - الدورة الأولى</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">{currentLesson.title}</h1>
          <div className="flex items-center justify-center gap-4">
            <button 
              disabled={currentLessonIndex === 0}
              onClick={() => {
                setCurrentLessonIndex(prev => prev - 1);
                setActiveStep('problem');
              }}
              className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-600 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={24} />
            </button>
            <span className="text-sm font-bold text-gray-400">الدرس {currentLessonIndex + 1} من {lessons.length}</span>
            <button 
              disabled={currentLessonIndex === lessons.length - 1}
              onClick={() => {
                setCurrentLessonIndex(prev => prev + 1);
                setActiveStep('problem');
              }}
              className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-600 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Steps */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all border-2",
                activeStep === step.id 
                  ? "bg-emerald-600 text-white border-transparent shadow-lg shadow-emerald-200 scale-105" 
                  : "bg-white text-gray-500 border-gray-100 hover:border-emerald-100 hover:text-emerald-600"
              )}
            >
              {step.icon}
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentLesson.id}-${activeStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              {activeStep === 'problem' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                      <Zap size={28} />
                    </div>
                    <h2 className="text-2xl font-black">🧩 وضعية مشكلة</h2>
                  </div>
                  <div className="p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 leading-relaxed text-xl font-bold text-gray-800">
                    {currentLesson.problem.scenario}
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                    <Lightbulb className="text-amber-500 shrink-0 mt-1" />
                    <p className="text-lg font-black text-amber-900">{currentLesson.problem.question}</p>
                  </div>
                  <button 
                    onClick={() => setActiveStep('observation')}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    <span>أبدأ الملاحظة</span>
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
                </div>
              )}

              {activeStep === 'observation' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-blue-600">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Search size={28} />
                    </div>
                    <h2 className="text-2xl font-black">🔍 الفهم والملاحظة</h2>
                  </div>
                  <div className="grid gap-4">
                    {currentLesson.observation.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm">{i + 1}</div>
                        <p className="text-lg font-bold text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 'analysis' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-purple-600">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                      <Brain size={28} />
                    </div>
                    <h2 className="text-2xl font-black">🧠 الاكتشاف والتحليل</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentLesson.analysis.examples.map((ex, i) => (
                      <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="text-2xl font-black text-emerald-600 mb-3">{ex.text}</div>
                        <p className="text-sm font-bold text-gray-500 leading-relaxed">{ex.note}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 pt-6">
                    <h3 className="font-black text-gray-900">خطوات الاكتشاف:</h3>
                    {currentLesson.analysis.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-600 font-bold">
                        <CheckCircle size={18} className="text-emerald-500" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 'rule' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                      <Layers size={28} />
                    </div>
                    <h2 className="text-2xl font-black">📌 أبني قاعدتي</h2>
                  </div>
                  <div className="p-10 bg-emerald-600 text-white rounded-[2.5rem] shadow-2xl shadow-emerald-200 leading-relaxed text-2xl font-black">
                    {currentLesson.rule.definition}
                  </div>
                  <div className="grid gap-4">
                    <h3 className="font-black text-gray-900">أمثلة توضيحية:</h3>
                    <div className="flex flex-wrap gap-4">
                      {currentLesson.rule.examples.map((ex, i) => (
                        <div key={i} className="px-6 py-3 bg-white border-2 border-emerald-100 rounded-2xl text-emerald-600 font-black">
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 'application' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-amber-600">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                      <PenTool size={28} />
                    </div>
                    <h2 className="text-2xl font-black">🧪 التطبيق</h2>
                  </div>
                  <p className="text-xl font-black text-gray-800">{currentLesson.application.question}</p>
                  <div className="grid gap-4">
                    {currentLesson.application.exercises.map((ex, i) => (
                      <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-700">{ex}</span>
                        <input type="text" placeholder="الإجابة..." className="px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeStep === 'production' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-indigo-600">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      <MessageSquare size={28} />
                    </div>
                    <h2 className="text-2xl font-black">🗣️ الإنتاج الكتابي أو الشفهي</h2>
                  </div>
                  <div className="p-10 bg-indigo-50 rounded-[2.5rem] border-2 border-dashed border-indigo-200">
                    <p className="text-xl font-bold text-indigo-900 leading-relaxed text-center">
                      {currentLesson.production}
                    </p>
                  </div>
                  <textarea 
                    placeholder="اكتب إنتاجك هنا..."
                    className="w-full h-48 p-6 bg-white border border-gray-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg shadow-inner"
                  />
                </div>
              )}

              {activeStep === 'evaluation' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 text-red-600">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                      <Target size={28} />
                    </div>
                    <h2 className="text-2xl font-black">📊 التقويم</h2>
                  </div>
                  <div className="grid gap-6">
                    {currentLesson.evaluation.map((q, i) => (
                      <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-start gap-4">
                        <Star className="text-amber-400 shrink-0 mt-1" />
                        <p className="text-lg font-bold text-gray-700">{q}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-10 flex justify-center">
                    <button 
                      onClick={() => {
                        if (currentLessonIndex < lessons.length - 1) {
                          setCurrentLessonIndex(prev => prev + 1);
                          setActiveStep('problem');
                        }
                      }}
                      className="flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200"
                    >
                      <span>انتقل للدرس القادم</span>
                      <ArrowRight size={24} className="rotate-180" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Progress */}
        <div className="mt-12 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-emerald-600 font-black shadow-sm">
              {Math.round(((currentLessonIndex + 1) / lessons.length) * 100)}%
            </div>
            <div className="text-sm font-bold text-gray-400">تقدمك في الدورة</div>
          </div>
          <div className="flex gap-2">
            {lessons.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-500",
                  i === currentLessonIndex ? "bg-emerald-600 w-8" : i < currentLessonIndex ? "bg-emerald-200" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstYearArabicCourse;
