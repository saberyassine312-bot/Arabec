import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown, 
  FileText, 
  Compass, 
  PenTool, 
  Lightbulb, 
  Zap, 
  Search, 
  Brain, 
  Layers, 
  CheckCircle, 
  Target, 
  ArrowRight,
  Home,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ArabicCompositionDashboard } from './ArabicCompositionDashboard';
import { firstYearCompositionLessons } from '../data/compositionData';

// Types
interface LessonStep {
  scenario: string;
  question: string;
  questions: string[];
  analysis: string;
  rule: string;
  examples: string[];
  exercise: {
    question: string;
    correction: string;
  };
}

interface Lesson {
  id: string;
  title: string;
  content: LessonStep;
}

// Data
const grammarLessons: Lesson[] = [
  {
    id: 'mizan-sarfi',
    title: 'الميزان الصرفي المجرد والمزيد',
    content: {
      scenario: 'بينما كان عمر يطالع قصة، وجد كلمات: (دخل، استخرج، خرج، دحرج). لاحظ أن (دخل) و(خرج) تتكون من ثلاثة حروف، بينما (استخرج) طويلة، و(دحرج) أربعة حروف. تساءل: هل هناك "ميزان" لغوي نزن به هذه الكلمات لنعرف أصولها؟',
      question: 'كيف يمكننا معرفة الحروف الأصلية والزائدة في هذه الكلمات؟ وما هو الميزان الذي نستخدمه؟',
      questions: [
        'ما هي الحروف المشتركة بين "دخل" و"استخرج"؟',
        'ماذا يحدث لو حذفنا حرف الدال من "دخل"؟ هل يبقى لها معنى؟',
        'هل كلمة "دحرج" يمكن حذف أحد حروفها مع بقاء معناها؟'
      ],
      analysis: 'لاحظنا أن أغلب كلمات اللغة العربية تعود إلى أصل ثلاثي (فعل). الحروف الزائدة تضاف للميزان كما هي، بينما تقابل الحروف الأصلية بالفاء والعين واللام.',
      rule: 'الميزان الصرفي هو مقياس لوزن الكلمات؛ الميزان الأصلي هو "فَعَلَ" للثلاثي، و"فَعْلَلَ" للرباعي. المجرد ما كانت كل حروفه أصلية، والمزيد ما زيد فيه حرف أو أكثر على حروفه الأصلية.',
      examples: ['كَتَبَ -> فَعَلَ', 'استَخْرَجَ -> اسْتَفْعَلَ', 'دَحْرَجَ -> فَعْلَلَ'],
      exercise: {
        question: 'زن الكلمات التالية: (فهم، انطلق، زلزل)',
        correction: 'فهم: فَعَلَ | انطلق: انفعَلَ | زلزل: فَعْلَلَ'
      }
    }
  },
  {
    id: 'mazid-thulathi',
    title: 'مزيد الثلاثي والرباعي ومعاني صيغ الزوائد',
    content: {
      scenario: 'قال الأستاذ: "خَرَجَ التلميذ" و"أَخْرَجَ التلميذُ كتابَه". لاحظ خالد أن زيادة حرف "الألف" في البداية غيرت معنى الجملة وحولتها من خروج الشخص إلى إخراج شيء آخر.',
      question: 'ما هي حروف الزيادة؟ وكيف تغير معنى الفعل عند إضافتها؟',
      questions: [
        'ما الفرق في المعنى بين "خرج" و"أخرج"؟',
        'هل زيادة الحروف تكون عشوائية أم لها قواعد؟',
        'ما هي مجموعة حروف الزيادة (سألتمونيها)؟'
      ],
      analysis: 'الحروف الزائدة مثل الهمزة والتضعيف والألف والتاء والسين والميم... تضاف للفعل لتعطيه معاني جديدة مثل التعدية والمشاركة والمبالغة والطلب.',
      rule: 'الثلاثي المزيد يكون بحرف واحد (أفعل، فاعل، فعّل) أو حرفين (انفعل، افتعل، افعلّ، تفاعل، تفعّل) أو ثلاثة أحرف (استفعل). حروف الزيادة مجموعة في كلمة "سألتمونيها".',
      examples: ['أكرم (تعدية)', 'تشارك (مشاركة)', 'استغفر (طلب)'],
      exercise: {
        question: 'ما معنى الزيادة في "استعلم" و"تضارب"؟',
        correction: 'استعلم: الطلب (طلب العلم) | تضارب: المشاركة (بين اثنين أو أكثر)'
      }
    }
  },
  {
    id: 'tasrif-sahih',
    title: 'تصريف الفعل الصحيح (السالم، المهموز، المضعف)',
    content: {
      scenario: 'في نص قرائي وجدنا: "كتبتُ، قرأنا، شددتم". لاحظ التلاميذ أن حروف هذه الأفعال لا تتغير جذرياً عند إضافتها للضمائر، فكلها حروف صحيحة وقوية.',
      question: 'كيف نصرف الأفعال التي تخلو حروفها من العلة (و، ا، ي)؟ وما الذي يطرأ على الفعل المضعف؟',
      questions: [
        'هل يتغير الفعل "كتب" عند إسناده لتاء الفاعل؟',
        'ماذا حدث لفك الإدغام في "شدّ" عندما قلنا "شددت"؟',
        'هل تظهر الهمزة في "قرأ" واضحة في كل التصريفات؟'
      ],
      analysis: 'الفعل الصحيح هو ما خلت حروفه الأصلية من حروف العلة. السالم ما خلا من الهمز والتضعيف، والمهموز ما كان أحد حروفه همزة، والمضعف ما كان فيه حرفان من جنس واحد.',
      rule: 'عند تصريف السالم والمهموز لا يتغير فيهما شيء. المضعف يفك إدغامه عند إسناده لضمائر الرفع المتحركة (تاء الفاعل، نا الفاعلين، نون النسوة).',
      examples: ['أنا كتبتُ (سالم)', 'نحن قرأنا (مهموز)', 'هنّ شددْن (مضعف)'],
      exercise: {
        question: 'صرف الفعل "مدّ" مع ضمير "أنتنّ" في الماضي.',
        correction: 'أنتنّ مددتنّ (تم فك الإدغام).'
      }
    }
  },
  {
    id: 'tasrif-mutal-mithal',
    title: 'تصريف الفعل المعتل (المثال والأجوف)',
    content: {
      scenario: 'قال المذيع: "وصل المسافر" و"قال الحق". لاحظنا أن فعل "وصل" بدأ بحرف واو، وفعل "قال" في وسطه ألف. عندما حولناهما للمضارع قلنا: "يصل" و"يقول". سقطت الواو من الأول وبقي حرف العلة في الثاني.',
      question: 'لماذا سقط حرف العلة في "يصل" وبقي في "يقول"؟ وكيف نصرف الأفعال المعتلة في البداية أو الوسط؟',
      questions: [
        'ما هو حرف العلة في "وعد"؟ وأين مكانه؟',
        'ماذا يحدث للألف في "باع" عند قولنا "بعتُ" في الماضي؟',
        'هل نحذف الواو دائماً من الفعل المثال في المضارع؟'
      ],
      analysis: 'الفعل المثال يبدأ بحرف علة، والأجوف وسطه حرف علة. في المثال الواوي تحذف الواو غالباً في المضارع والأمر. في الأجوف تحذف عينه إذا سكن آخره.',
      rule: 'تصريف المثال: تحذف الواو في المضارع والأمر (وجد -> يجد -> جد). تصريف الأجوف: تحذف الألف إذا سكن آخره عند الإسناد لضمائر الرفع المتحركة (قال -> قلْت).',
      examples: ['أنا وصفتُ - هو يصف (مثال)', 'أنتَ قمتَ - هنّ يقُلن (أجوف)'],
      exercise: {
        question: 'حول الفعل "قام" إلى المضارع مع ضمير "هنّ".',
        correction: 'هنّ يقُمن (حذفت الألف لالتقاء الساكنين).'
      }
    }
  },
  {
    id: 'tasrif-mutal-naqis',
    title: 'تصريف الفعل المعتل الناقص',
    content: {
      scenario: 'كتبت مريم: "رمى الولد الكرة" و"دعوت الله". لاحظت أن الألف في آخر "رمى" انقلبت ياء، والألف في "دعا" انقلبت واواً. وعندما قالت "هم رموا"، اختفى حرف العلة تماماً.',
      question: 'ما الذي يحدث لحرف العلة في آخر الفعل المعتل الناقص عند تصريفه؟',
      questions: [
        'ما هو أصل الألف في "رمى"؟ (يرمي)',
        'ما هو أصل الألف في "دعا"؟ (يدعو)',
        'لماذا نحذف حرف العلة عند إسناده لواو الجماعة؟'
      ],
      analysis: 'الفعل الناقص ينتهي بحرف علة. عند تصريفه، يعاد حرف العلة لأصله (واو أو ياء)، أو يحذف إذا التقى بساكن آخر مثل واو الجماعة أو ياء المخاطبة.',
      rule: 'الناقص هو ما كان آخره حرف علة. عند إسناده لضمائر الرفع، يعود حرف العلة لأصله. ويحذف حرف العلة مع واو الجماعة وياء المخاطبة.',
      examples: ['أنا رميتُ - هم رموا', 'أنتِ تدعين - نحن دعونا'],
      exercise: {
        question: 'أسند الفعل "سعى" إلى واو الجماعة في الماضي.',
        correction: 'هم سعَوا (حذف حرف العلة مع فتح ما قبله).'
      }
    }
  },
  {
    id: 'lafif',
    title: 'الفعل اللفيف المفروق واللفيف المقرون',
    content: {
      scenario: 'وجدنا أفعالاً "غريبة" مثل (وقى) و(روى). الأول حروف علته مفترقة بحرف (القاف)، والثاني حروف علته ملتصقة. هذا "ازدواج" في حروف العلة!',
      question: 'كيف نصرف أفعالاً تحتوي على حرفي علة في نفس الكلمة؟',
      questions: [
        'ما الفرق بين "وعى" و"كوى" من حيث ترتيب حروف العلة؟',
        'هل يعامل "وقى" معاملة المثال والناقص معاً؟',
        'كيف نزن هذه الأفعال في الميزان الصرفي؟'
      ],
      analysis: 'اللفيف ما كان فيه حرفا علة. المفروق ما فرق بين حرفي علته حرف صحيح (وقى). المقرون ما اقترن فيه حرفا علة (روى).',
      rule: 'اللفيف المفروق يعامل معاملة المثال في أوله والناقص في آخره. اللفيف المقرون يعامل معاملة الناقص فقط، ويبقى حرف علته الأول ثابتاً.',
      examples: ['وقى -> بقي -> قِ (أمر)', 'روى -> رويتُ -> رووا'],
      exercise: {
        question: 'ما هو الأمر من الفعل "وعى" للمخاطب الواحد؟',
        correction: 'عِ (حذفت الواو لأنها مثال والألف لأنها ناقص في الأمر).'
      }
    }
  },
  {
    id: 'irab-bina',
    title: 'الإعراب والبناء',
    content: {
      scenario: 'لاحظ التلميذ تغير آخر كلمة "محمد" في الجمل: (جاء محمدٌ، رأيت محمداً، سلمت على محمدٍ). بينما كلمة "هؤلاء" بقيت ثابتة: (جاء هؤلاءِ، رأيت هؤلاءِ، سلمت على هؤلاءِ).',
      question: 'لماذا تغير آخر "محمد" ولم يتغير آخر "هؤلاء"؟ وماذا نسمي هذا التغير أو الثبات؟',
      questions: [
        'ما هي الحركة التي ظهرت على "محمد" في الرفع؟',
        'هل تغيرت حركة "هؤلاء" رغم تغير موقعها؟',
        'ما هي الكلمات الأكثر في اللغة العربية: المعربة أم المبنية؟'
      ],
      analysis: 'الكلمة المعربة هي التي يتغير شكل آخرها بتغير موقعها الإعرابي. الكلمة المبنية هي التي يلزم آخرها حالة واحدة مهما تغير موقعها.',
      rule: 'الإعراب: تغير يلحق أواخر الكلمات بتغير وظيفتها في الجملة. البناء: لزوم آخر الكلمة حالة واحدة. الحروف كلها مبنية، والأفعال معظمها مبنية، والأسماء معظمها معربة.',
      examples: ['التلميذُ (معرب)', 'هذا (مبني)', 'من (حرف مبني)'],
      exercise: {
        question: 'حدد الكلمة المبنية في الجملة: "نجح هذا الطالب".',
        correction: 'الكلمة المبنية هي "هذا" (اسم إشارة).'
      }
    }
  },
  {
    id: 'asm-irab-bina',
    title: 'الأسماء المعربة والأسماء المبنية',
    content: {
      scenario: 'في نص القراءة وجدنا: (المدارس، هو، الذي، جبال، نحن، أولئك). أراد الأستاذ منا تصنيفها إلى "مستقرة" (مبنية) و"متحركة" (معربة).',
      question: 'ما هي أنواع الأسماء التي تكون مبنية دائماً؟ وكيف نميزها عن بقية الأسماء؟',
      questions: [
        'هل "نحن" تتغير حركتها لتصبح "نحنَ" أو "نحنِ"؟',
        'ماذا عن أسماء الإشارة والأسماء الموصولة؟',
        'هل الأعداد المركبة (11-19) معربة أم مبنية؟'
      ],
      analysis: 'أغلب الأسماء معربة، لكن هناك عائلات من الأسماء مبنية دائماً مثل الضمائر، أسماء الإشارة (عدا المثنى)، الأسماء الموصولة (عدا المثنى)، وأسماء الاستفهام والشرط.',
      rule: 'الأسماء المبنية تشمل: الضمائر، أسماء الإشارة (هذا، هذه، هؤلاء...)، الأسماء الموصولة (الذي، التي، الذين...)، أسماء الاستفهام (متى، أين، كيف...)، وأسماء الشرط وبقية الأسماء معربة.',
      examples: ['نحن (ضمير مبني)', 'الكتاب (اسم معرب)', 'الذي (موصول مبني)'],
      exercise: {
        question: 'استخرج الأسماء المبنية من: "أنت الذي تجتهد في هذه المدرسة".',
        correction: 'الأسماء المبنية: أنت (ضمير)، الذي (موصول)، هذه (إشارة).'
      }
    }
  },
  {
    id: 'bina-afal',
    title: 'علامات البناء في الأفعال',
    content: {
      scenario: 'وجدنا في النص أفعالاً ماضية: (خرجَ، خرجوا، خرجتَ). وأفعال أمر: (اكتبْ، اكتبا، اكتبوا). يبدو أن الأفعال لها "قوانين بناء" صارمة تلزم آخرها.',
      question: 'ما هي الأفعال المبنية دائماً؟ وعلى ماذا تبنى؟',
      questions: [
        'على ماذا يبنى الفعل الماضي "خرج"؟',
        'ماذا يحدث للفعل الماضي إذا اتصلت به واو الجماعة؟',
        'ما هي حركة بناء فعل الأمر "اسعَ"؟'
      ],
      analysis: 'الفعل الماضي مبني دائماً (على الفتح أو الضم أو السكون). فعل الأمر مبني دائماً (على السكون أو حذف حرف العلة أو حذف النون). الفعل المضارع يبنى في حالتين فقط (نون النسوة ونون التوكيد).',
      rule: 'الماضي يبنى على الفتح أصلناً. الأمر يبنى على ما يجزم به مضارعه. المضارع يبنى على السكون مع نون النسوة، وعلى الفتح مع نون التوكيد.',
      examples: ['كَتَبَ (فتح)', 'كَتَبُوا (ضم)', 'اكْتُبْ (سكون)'],
      exercise: {
        question: 'ما علامة بناء الفعل "ادعُ"؟ وما علامة بناء "كتبتُ"؟',
        correction: 'ادعُ: حذف حرف العلة | كتبتُ: السكون لاتصاله بالتاء المتحركة.'
      }
    }
  },
  {
    id: 'irab-mudari-nasb',
    title: 'إعراب الفعل المضارع (الرفع والنصب)',
    content: {
      scenario: 'نقول: "يدرسُ الطالب" (مرفوع). لكن عندما أضفنا "لن" قلنا: "لن يدرسَ الطالب" (منصوب). يبدو أن هناك أدوات "تخطف" الرفع وتحوله لنصب.',
      question: 'متى يكون المضارع مرفوعاً؟ وما هي الأدوات التي تنصبه؟',
      questions: [
        'ما هي الحركة الأصلية للفعل المضارع؟',
        'ما عمل الأدوات: أن، لن، كي، إذن؟',
        'هل "أن" المضمرة تنصب أيضاً؟'
      ],
      analysis: 'يرفع المضارع إذا لم تسبقه أداة نصب أو جزم. ينصب إذا سبقته أداة نصب (أن، لن، إذن، كي). وهناك نصب بـ (أن) مضمرة بعد لام التعليل أو حتى أو واو المعية وفاء السببية.',
      rule: 'المضارع معرب يرفع بضمة ظاهرة أو مقدرة أو ثبوت النون. وينصب بفتحة ظاهرة أو مقدرة أو حذف النون إذا سبقته أداة نصب.',
      examples: ['يأكلُ (رفع)', 'أن يأكلَ (نصب)', 'لن يلعبوا (نصب بحذف النون)'],
      exercise: {
        question: 'اعرب: "لن ينجحَ الكسولُ".',
        correction: 'لن: أداة نصب | ينجح: فعل مضارع منصوب بالفتحة الظاهرة.'
      }
    }
  },
  {
    id: 'irab-mudari-jazm',
    title: 'إعراب الفعل المضارع (الجزم)',
    content: {
      scenario: 'قال الأب لابنه: "لا تكذبْ". لاحظت أن الفعل "يكذب" الذي كان مرفوعاً (يكذبُ) أصبح ساكن الآخر بعد أداة "لا".',
      question: 'ما هي أدوات الجزم؟ وكيف تؤثر على نهاية الفعل المضارع؟',
      questions: [
        'ما عمل الأدوات: لم، لما، لام الأمر، لا الناهية؟',
        'ماذا يحدث للفعل المعتل الأخير عند جزمه؟ (يدعو -> لم يدعُ)',
        'ما هي الأدوات التي تجزم فعلين مضارعين؟'
      ],
      analysis: 'الجزم هو قطع الحركة أو الحرف من آخر المضارع. هناك أدوات تجزم فعلاً واحداً (لم، لما، لام الأمر، لا الناهية) وأدوات تجزم فعلين وتسمى أدوات الشرط الجازمة.',
      rule: 'يجزم المضارع بالسكون إذا كان صحيح الآخر، وبحذف حرف العلة إذا كان معتل الآخر، وبحذف النون إذا كان من الأفعال الخمسة.',
      examples: ['لم يقُم (سكون)', 'لا تدعُ (حذف حرف العلة)', 'إن تدرس تنجح (شرط)'],
      exercise: {
        question: 'اعرب: "لم يسعَ في الشر".',
        correction: 'لم: أداة جزم | يسعَ: فعل مضارع مجزوم وعلامة جزمه حذف حرف العلة.'
      }
    }
  }
];

import { useSearchParams, Link } from 'react-router-dom';

const ArabicLMSFirstYear: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialComponent = searchParams.get('component');
  
  const [view, setView] = useState<'main' | 'grammar-list' | 'lesson' | 'composition-list'>(
    initialComponent === 'grammar' ? 'grammar-list' : initialComponent === 'composition' ? 'composition-list' : 'main'
  );
  const [activeComponent, setActiveComponent] = useState<string | null>(initialComponent);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showCorrection, setShowCorrection] = useState(false);

  // Computed
  const currentLesson = grammarLessons.find(l => l.id === activeLessonId);

  const steps = [
    { id: 'problem', label: 'وضعية مشكلة', icon: <Zap size={18} /> },
    { id: 'observation', label: 'الفهم والملاحظة', icon: <Search size={18} /> },
    { id: 'analysis', label: 'الاكتشاف والتحليل', icon: <Brain size={18} /> },
    { id: 'rule', label: 'أبني قاعدتي', icon: <Layers size={18} /> },
    { id: 'examples', label: 'أمثلة توضيحية', icon: <CheckCircle size={18} /> },
    { id: 'exercise', label: 'تمرين تطبيق', icon: <Target size={18} /> }
  ];

  const goBack = () => {
    if (view === 'lesson') setView('grammar-list');
    else if (view === 'grammar-list' || view === 'composition-list') setView('main');
  };

  const handleComponentSelect = (comp: string) => {
    setActiveComponent(comp);
    if (comp === 'grammar') {
      setView('grammar-list');
    } else if (comp === 'composition') {
      setView('composition-list');
    }
  };

  const handleLessonSelect = (id: string) => {
    setActiveLessonId(id);
    setActiveStep(0);
    setShowCorrection(false);
    setView('lesson');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Path Visualization */}
        <div className="flex items-center gap-2 mb-8 bg-white p-3 rounded-2xl border border-gray-100 w-fit shadow-sm">
           <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
              <Link to="/levels" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                <Home size={16} />
                <span>الأسلاك</span>
              </Link>
              <ChevronLeft size={14} className="text-gray-300" />
              <Link to="/prep-years" className="hover:text-emerald-600 transition-colors">السلك الإعدادي</Link>
              <ChevronLeft size={14} className="text-gray-300" />
              <button 
                onClick={() => setView('main')}
                className={cn("transition-colors", view === 'main' ? "text-emerald-600" : "hover:text-emerald-600")}
              >
                السنة الأولى إعدادي
              </button>
              {view !== 'main' && (
                <>
                  <ChevronLeft size={14} className="text-gray-300" />
                  <span className={(view === 'grammar-list' || view === 'lesson') ? 'text-emerald-600 font-bold' : 'text-purple-600 font-bold'}>
                    {(view === 'grammar-list' || view === 'lesson') ? 'مكون الدرس اللغوي' : 'مكون التعبير والإنشاء'}
                  </span>
                </>
              )}
              {view === 'lesson' && currentLesson && (
                <>
                  <ChevronLeft size={14} />
                  <span className="text-emerald-600 truncate max-w-[150px]">{currentLesson.title}</span>
                </>
              )}
           </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'main' && (
            <motion.div 
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                 <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">السنة الأولى إعدادي</h1>
                 <p className="text-gray-500 font-bold text-lg">اختر أحد مكونات مادة اللغة العربية للبدء</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                 <ComponentCard 
                    title="مكون النصوص" 
                    desc="قراءة وتحليل النصوص الأدبية والقرائية المقررة"
                    icon={<BookOpen size={32} />}
                    color="bg-blue-50 text-blue-600 hover:bg-blue-600"
                    onClick={() => handleComponentSelect('texts')}
                 />
                 <ComponentCard 
                    title="مكون الدرس اللغوي" 
                    desc="اكتشاف القواعد اللغوية وبنائها عبر وضعيات مشكلة"
                    icon={<FileText size={32} />}
                    color="bg-emerald-50 text-emerald-600 hover:bg-emerald-600"
                    onClick={() => handleComponentSelect('grammar')}
                 />
                 <ComponentCard 
                    title="مكون التعبير والإنشاء" 
                    desc="تنمية مهارات التعبير الكتابي والإنشائي"
                    icon={<PenTool size={32} />}
                    color="bg-purple-50 text-purple-600 hover:bg-purple-600"
                    onClick={() => handleComponentSelect('composition')}
                 />
              </div>
            </motion.div>
          )}

          {view === 'grammar-list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
               <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">دروس الدورة الأولى</h2>
                    <p className="text-gray-400 font-bold">مكون الدرس اللغوي • 11 درساً</p>
                  </div>
                  <div className="flex gap-4">
                    <Link to="/grammar-smart-path" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                      <Brain size={20} />
                      <span>مسارات التعلم الذكي</span>
                    </Link>
                    <button onClick={goBack} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm">
                      <ArrowRight size={20} className="rotate-180" />
                    </button>
                  </div>
               </div>

               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grammarLessons.map((lesson, index) => (
                    <motion.button
                      key={lesson.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLessonSelect(lesson.id)}
                      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all text-right group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          {index + 1}
                        </div>
                        <Compass className="text-emerald-100 group-hover:text-emerald-400 transition-colors" size={40} />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2">{lesson.title}</h3>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mt-4">
                         <span>ابدأ الدرس</span>
                         <ArrowRight size={14} className="rotate-180" />
                      </div>
                    </motion.button>
                  ))}
               </div>
            </motion.div>
          )}

          {view === 'lesson' && currentLesson && (
            <motion.div 
              key="lesson"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-8"
            >
               {/* Lesson Header */}
               <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                     <button onClick={goBack} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 transition-all">
                        <ChevronRight size={24} />
                     </button>
                     <div>
                        <h2 className="text-3xl font-black text-gray-900">{currentLesson.title}</h2>
                        <div className="text-sm text-gray-400 font-bold mt-1">السنة الأولى إعدادي • الدرس اللغوي</div>
                     </div>
                  </div>
                  <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                     {steps.map((s, i) => (
                        <div 
                          key={s.id} 
                          className={cn(
                            "w-3 h-3 rounded-full mx-1 transition-all",
                            i === activeStep ? "bg-emerald-600 w-8" : i < activeStep ? "bg-emerald-200" : "bg-gray-200"
                          )}
                        />
                     ))}
                  </div>
               </div>

               {/* Stepper Navigation */}
               <div className="flex flex-wrap justify-center gap-3">
                  {steps.map((step, i) => (
                    <button
                      key={step.id}
                      onClick={() => { setActiveStep(i); setShowCorrection(false); }}
                      className={cn(
                        "flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all border-2",
                        activeStep === i 
                          ? "bg-emerald-600 text-white border-transparent shadow-xl shadow-emerald-200 -translate-y-1" 
                          : "bg-white text-gray-400 border-gray-100 hover:border-emerald-100 hover:text-emerald-600"
                      )}
                    >
                      {step.icon}
                      <span>{step.label}</span>
                    </button>
                  ))}
               </div>

               {/* Active Content */}
               <div className="bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden min-h-[500px]">
                  <AnimatePresence mode="wait">
                     <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-10 md:p-16"
                     >
                        {activeStep === 0 && (
                          <div className="space-y-8">
                             <ContentTag label="🧩 وضعية مشكلة" color="emerald" />
                             <div className="p-10 bg-emerald-50/50 rounded-[3rem] border border-emerald-100 text-2xl font-bold text-emerald-900 leading-relaxed shadow-inner">
                                {currentLesson.content.scenario}
                             </div>
                             <div className="flex items-start gap-4 p-8 bg-amber-50 rounded-[2rem] border border-amber-100">
                                <Lightbulb size={32} className="text-amber-500 shrink-0 mt-1" />
                                <div className="text-xl font-black text-amber-900 leading-relaxed">{currentLesson.content.question}</div>
                             </div>
                             <button onClick={() => setActiveStep(1)} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">أبدأ الفهم والملاحظة</button>
                          </div>
                        )}

                        {activeStep === 1 && (
                          <div className="space-y-10">
                             <ContentTag label="🔍 الفهم والملاحظة" color="blue" />
                             <div className="grid gap-6">
                                {currentLesson.content.questions.map((q, i) => (
                                  <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-all"
                                  >
                                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">{i + 1}</div>
                                     <p className="text-xl font-bold text-gray-700 leading-relaxed">{q}</p>
                                  </motion.div>
                                ))}
                             </div>
                             <button onClick={() => setActiveStep(2)} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-xl">تحليل النتائج</button>
                          </div>
                        )}

                        {activeStep === 2 && (
                          <div className="space-y-10">
                             <ContentTag label="🧠 الاكتشاف والتحليل" color="purple" />
                             <div className="p-10 bg-purple-50 rounded-[3rem] border border-purple-100">
                                <p className="text-2xl font-bold text-purple-900 leading-relaxed">{currentLesson.content.analysis}</p>
                             </div>
                             <div className="bg-gray-50 p-8 rounded-3xl space-y-4">
                                <h4 className="font-black text-gray-400 text-sm uppercase">استنتاجات أولية</h4>
                                <ul className="space-y-3">
                                   <li className="flex items-center gap-3 text-gray-700 font-bold">
                                      <CheckCircle className="text-emerald-500" />
                                      <span>اللغة العربية غنية بصيغها وأوزانها</span>
                                   </li>
                                   <li className="flex items-center gap-3 text-gray-700 font-bold">
                                      <CheckCircle className="text-emerald-500" />
                                      <span>كل زيادة في المبنى تدل على زيادة في المعنى</span>
                                   </li>
                                </ul>
                             </div>
                             <button onClick={() => setActiveStep(3)} className="w-full py-5 bg-purple-600 text-white rounded-[2rem] font-black text-xl hover:bg-purple-700 transition-all shadow-xl">بناء القاعدة النهائية</button>
                          </div>
                        )}

                        {activeStep === 3 && (
                          <div className="space-y-10">
                             <ContentTag label="📌 أبني قاعدتي" color="emerald" />
                             <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="p-12 bg-emerald-600 text-white rounded-[4rem] shadow-2xl shadow-emerald-200 text-3xl font-black leading-relaxed relative overflow-hidden"
                             >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                <div className="relative z-10">{currentLesson.content.rule}</div>
                             </motion.div>
                             <button onClick={() => setActiveStep(4)} className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-600 transition-all shadow-xl">عرض الأمثلة التوضيحية</button>
                          </div>
                        )}

                        {activeStep === 4 && (
                          <div className="space-y-10">
                             <ContentTag label="✨ أمثلة توضيحية" color="amber" />
                             <div className="grid md:grid-cols-3 gap-6">
                                {currentLesson.content.examples.map((ex, i) => (
                                  <motion.div 
                                    key={i} 
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-white border-2 border-amber-100 rounded-[2.5rem] shadow-sm text-center"
                                  >
                                     <Star className="text-amber-400 mx-auto mb-4" size={32} />
                                     <div className="text-2xl font-black text-gray-900">{ex}</div>
                                  </motion.div>
                                ))}
                             </div>
                             <button onClick={() => setActiveStep(5)} className="w-full py-5 bg-amber-500 text-white rounded-[2rem] font-black text-xl hover:bg-amber-600 transition-all shadow-xl shadow-amber-100">تطبيق ما تعلمته</button>
                          </div>
                        )}

                        {activeStep === 5 && (
                          <div className="space-y-10">
                             <ContentTag label="🧪 تمرين تطبيق" color="rose" />
                             <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 font-mono">السؤال:</h3>
                                <p className="text-2xl font-bold text-gray-700 leading-relaxed">{currentLesson.content.exercise.question}</p>
                             </div>
                             
                             <AnimatePresence>
                                {showCorrection && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    className="p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100"
                                  >
                                     <h3 className="text-xl font-black text-emerald-700 mb-4 flex items-center gap-2">
                                        <CheckCircle size={20} /> التصحيح النموذجي:
                                     </h3>
                                     <p className="text-2xl font-black text-emerald-800 leading-relaxed">{currentLesson.content.exercise.correction}</p>
                                  </motion.div>
                                )}
                             </AnimatePresence>

                             <div className="flex flex-col md:flex-row gap-4 pt-6">
                                <button 
                                  onClick={() => setShowCorrection(!showCorrection)}
                                  className="flex-1 py-5 bg-white border-2 border-gray-900 text-gray-900 rounded-[2rem] font-black text-xl hover:bg-gray-50 transition-all"
                                >
                                   {showCorrection ? 'إخفاء التصحيح' : 'عرض التصحيح'}
                                </button>
                                <button 
                                  onClick={() => {
                                    const nextIdx = grammarLessons.findIndex(l => l.id === activeLessonId) + 1;
                                    if (nextIdx < grammarLessons.length) {
                                      handleLessonSelect(grammarLessons[nextIdx].id);
                                    } else {
                                      setView('grammar-list');
                                    }
                                  }}
                                  className="flex-1 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                                >
                                   الدرس القادم
                                </button>
                             </div>
                          </div>
                        )}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </motion.div>
          )}

          {view === 'composition-list' && (
            <motion.div
              key="composition"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ArabicCompositionDashboard 
                lessons={firstYearCompositionLessons} 
                gradeName="السنة الأولى إعدادي" 
                onBack={() => setView('main')} 
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

// Sub-components
const ComponentCard = ({ title, desc, icon, color, onClick }: any) => (
  <motion.button
    whileHover={{ y: -10, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all text-right group border border-gray-50 flex flex-col items-start h-full"
  >
     <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-300 group-hover:scale-110", color)}>
        {icon}
     </div>
     <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
     <p className="text-gray-400 font-bold leading-relaxed mb-10">{desc}</p>
     <div className="mt-auto flex items-center gap-2 text-emerald-600 font-black">
        <span>استعرض المكون</span>
        <ArrowRight size={20} className="rotate-180" />
     </div>
  </motion.button>
);

const ContentTag = ({ label, color }: any) => {
  const colors: any = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div className={cn("inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-black tracking-wide", colors[color])}>
       {label}
    </div>
  );
};

export default ArabicLMSFirstYear;
