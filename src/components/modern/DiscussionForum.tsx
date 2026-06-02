import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Plus, ThumbsUp, Search, 
  Send, Brain, User2, MessageCircle, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reply {
  id: string;
  author: string;
  authorRole: 'student' | 'teacher' | 'ai';
  content: string;
  timestamp: string;
  likes: number;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'student' | 'teacher';
  category: 'grammar' | 'composition' | 'spelling' | 'general';
  likes: number;
  replies: Reply[];
  timestamp: string;
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 'thread_1',
    title: 'كيف أميز بين التاء المربوطة والتاء المبسوطة بسهولة؟',
    content: 'السلام عليكم يا زملائي، أواجه صعوبة أثناء الإملاء في التفريق بسرعة بين التاء المربوطة والمبسوطة في الكلمات. هل من قاعدة بسيطة وسريعة؟',
    author: 'أمين الحداد',
    authorRole: 'student',
    category: 'spelling',
    likes: 12,
    timestamp: 'منذ ساعتين',
    replies: [
      {
        id: 'reply_1',
        author: 'الأستاذ مصطفى',
        authorRole: 'teacher',
        content: 'وعليكم السلام يا أمين. القاعدة الذهبية هي "الوقف بالهاء". إذا وقفت على الكلمة وسكنت آخرها ونطقتها هاءً فهي تاء مربوطة (مثل: مدرسة -> مدرسه). وإذا لم تتمكن من نطقها هاءً فهي تاء مبسوطة (مثل: بيت -> بيه؟ لا تصح، إذن مبسوطة).',
        timestamp: 'منذ ساعة واحدة',
        likes: 8
      },
      {
        id: 'reply_2',
        author: 'مرشد MadrasaNet الذكي',
        authorRole: 'ai',
        content: 'إضافة رائعة من أستاذنا الفاضل! تذكر أيضاً يا أمين أن التاء في الأفعال دائماً ما تكون مبسوطة (مثال: كتبتُ، درستْ، ذهبتَ)، بينما تأتي المربوطة في الأسماء المفردة المؤنثة غالباً دلالةً على التأنيث.',
        timestamp: 'منذ 45 دقيقة',
        likes: 15
      }
    ]
  },
  {
    id: 'thread_2',
    title: 'تحديد المفعول المطلق في سورة البقرة',
    content: 'أبحث عن أمثلة واضحة للمفعول المطلق المبين للنوع والمؤكد للفعل من القصص القرآنية في سورة البقرة لإعداد عرض التمارين التفاعلية.',
    author: 'يسرى البهيسي',
    authorRole: 'student',
    category: 'grammar',
    likes: 8,
    timestamp: 'منذ أربع ساعات',
    replies: [
      {
        id: 'reply_3',
        author: 'مرشد MadrasaNet الذكي',
        authorRole: 'ai',
        content: 'أهلاً بكِ يسرى. إليك من سورة البقرة: مفعول مطلق مؤكد للفعل: ﴿وَكَلَّمَ اللَّهُ مُوسَىٰ تَكْلِيمًا﴾، فكلمة "تكليماً" أكدت حدث التكلم. ومثال آخر مبين للنوع: ﴿فَاضْرِبُوا فَوْقَ الْأَعْنَاقِ وَاضْرِبُوا مِنْهُمْ كُلَّ بَنَانٍ﴾ أو قوله تعالى: ﴿يَنظُرُونَ إِلَيْكَ نَظَرَ الْمَغْشِيِّ عَلَيْهِ مِنَ الْمَوْتِ﴾ حيث "نظر" مفعول مطلق مبين لنوع النظر بإضافته إلى المغشي عليه.',
        timestamp: 'منذ ساعتين',
        likes: 10
      }
    ]
  }
];

export const DiscussionForum: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  
  // New thread state
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'grammar' | 'composition' | 'spelling' | 'general'>('general');
  
  // New reply state
  const [newReplyText, setNewReplyText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const categories = [
    { id: 'all', label: 'الكل', count: threads.length },
    { id: 'grammar', label: 'قواعد النحو', count: threads.filter(t => t.category === 'grammar').length },
    { id: 'composition', label: 'التعبير والإنشاء', count: threads.filter(t => t.category === 'composition').length },
    { id: 'spelling', label: 'مهارات الإملاء', count: threads.filter(t => t.category === 'spelling').length },
    { id: 'general', label: 'نقاش عام', count: threads.filter(t => t.category === 'general').length },
  ];

  const handleLikeThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
    if (activeThread?.id === id) {
      setActiveThread(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleLikeReply = (threadId: string, replyId: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: t.replies.map(r => r.id === replyId ? { ...r, likes: r.likes + 1 } : r)
        };
      }
      return t;
    }));
    
    if (activeThread?.id === threadId) {
      setActiveThread(prev => {
        if (!prev) return null;
        return {
          ...prev,
          replies: prev.replies.map(r => r.id === replyId ? { ...r, likes: r.likes + 1 } : r)
        };
      });
    }
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newThreadObj: Thread = {
      id: `thread_${Date.now()}`,
      title: newTitle,
      content: newContent,
      author: 'متعلم ذكي',
      authorRole: 'student',
      category: newCategory,
      likes: 0,
      timestamp: 'الآن',
      replies: []
    };

    setThreads([newThreadObj, ...threads]);
    setNewTitle('');
    setNewContent('');
    setIsCreatingThread(false);
    
    // Automatically trigger AI Copilot reply simulations for educational support
    setTimeout(() => {
      triggerAiReply(newThreadObj.id, newTitle, newContent);
    }, 2000);
  };

  const triggerAiReply = async (threadId: string, title: string, content: string) => {
    // API call mock/trigger fallback helper
    try {
      const response = await fetch('/api/smartpath/ask-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: `منتدى النقاش: ${title}`,
          prompt: content
        })
      });
      const data = await response.json();
      
      const aiReply: Reply = {
        id: `ai_${Date.now()}`,
        author: 'مساعد MadrasaNet الذكي',
        authorRole: 'ai',
        content: data.text || 'مرحباً، يسعدني الإجابة والمساعدة والمرافقة في بوابتك التعليمية!',
        timestamp: 'الآن',
        likes: 1
      };

      setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return { ...t, replies: [...t.replies, aiReply] };
        }
        return t;
      }));

      if (activeThread?.id === threadId) {
        setActiveThread(prev => prev ? { ...prev, replies: [...prev.replies, aiReply] } : null);
      }
    } catch {
      // safe fallback
    }
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyText.trim() || !activeThread) return;

    const userReply: Reply = {
      id: `reply_${Date.now()}`,
      author: 'أنت',
      authorRole: 'student',
      content: newReplyText,
      timestamp: 'الآن',
      likes: 0
    };

    const updatedThread = {
      ...activeThread,
      replies: [...activeThread.replies, userReply]
    };

    setThreads(prev => prev.map(t => t.id === activeThread.id ? updatedThread : t));
    setActiveThread(updatedThread);
    const textSnapshot = newReplyText;
    setNewReplyText('');

    // Trigger AI response if requested or if conversation was initiated
    if (textSnapshot.includes('@ذكاء') || textSnapshot.includes('مساعد') || textSnapshot.includes('AI')) {
      setIsGeneratingAi(true);
      setTimeout(async () => {
        await triggerAiReply(activeThread.id, activeThread.title, textSnapshot);
        setIsGeneratingAi(false);
      }, 1500);
    }
  };

  const filteredThreads = threads.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16 pt-6 px-4 md:px-8 rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header section with brand colors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <MessageSquare size={24} />
              </span>
              <h1 className="text-2xl font-black text-slate-800">منتدى الحوار ونقاش المعرفة</h1>
            </div>
            <p className="text-xs text-slate-500 font-bold">بوابة اجتماعية لتبادل الأسئلة الأكاديمية وحلول التمارين اللغوية</p>
          </div>
          <button 
            onClick={() => {
              setIsCreatingThread(true);
              setActiveThread(null);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-lg shadow-emerald-100 shrink-0"
          >
            <Plus size={18} />
            <span>طرح سؤال لغوي جديد</span>
          </button>
        </div>

        {/* Outer Section layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Categories and List column */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Search thread bar */}
            <div className="relative">
              <Search className="absolute right-4 top-3.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن سؤال لغوي..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Categories filters */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1">
              <span className="block text-[10px] font-black text-slate-400 mb-3 tracking-widest px-2">الفئات المواضيعية</span>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setActiveThread(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${
                    selectedCategory === cat.id 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    selectedCategory === cat.id ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Live AI support promo */}
            <div className="p-5 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-3xl shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400 animate-pulse" />
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">مساعد الذكاء الاصطناعي</span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed text-emerald-100">
                اطرح أي سؤال وسيجيبك مرشد اللغة التفاعلي فوراً داخل نقاشك لمساعدتك في فهم قواعد النحو وتصحيح التعبيرات!
              </p>
            </div>
          </div>

          {/* Details & Interactive thread view column */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              
              {/* Creation form modal frame */}
              {isCreatingThread && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <h2 className="text-lg font-black text-slate-800">كتابة سؤال لغوي جديد</h2>
                    <button 
                      onClick={() => setIsCreatingThread(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      إلغاء
                    </button>
                  </div>

                  <form onSubmit={handleCreateThread} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500">عنوان السؤال</label>
                      <input 
                        type="text"
                        placeholder="مثل: إعراب جمع المؤنث السالم المنصوب"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="text-xs font-black text-slate-500">فئة الموضوع</label>
                        <select 
                          value={newCategory}
                          onChange={e => setNewCategory(e.target.value as any)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="grammar">قواعد النحو والصرف</option>
                          <option value="composition">التعبير والإنشاء</option>
                          <option value="spelling">مهارات الإملاء</option>
                          <option value="general">نقاش تعليمي عام</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500">شرح السؤال أو تفاصيل الاستفسار</label>
                      <textarea 
                        rows={4}
                        placeholder="اكتب بالتفصيل المشكلة أو الفقرة التي تود شرحها..."
                        value={newContent}
                        onChange={e => setNewContent(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-100 cursor-pointer"
                    >
                      طرح السؤال في المنتدى
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Thread list (When nothing is selected) */}
              {!isCreatingThread && !activeThread && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {filteredThreads.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 text-slate-500 space-y-3">
                      <AlertCircle className="mx-auto text-slate-300" size={32} />
                      <p className="text-sm font-bold">لا توجد مواضيع حوارية متوافقة مع اختياراتك في الحساب</p>
                      <button 
                        onClick={() => setIsCreatingThread(true)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl"
                      >
                        ابدأ نقاشاً طرياً الآن
                      </button>
                    </div>
                  ) : (
                    filteredThreads.map(thread => (
                      <div 
                        key={thread.id}
                        onClick={() => setActiveThread(thread)}
                        className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 hover:border-emerald-600/30 hover:scale-[1.01] transition-all cursor-pointer shadow-sm shadow-slate-100 space-y-4 text-right"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                            thread.category === 'grammar' ? 'bg-indigo-50 text-indigo-700' :
                            thread.category === 'composition' ? 'bg-amber-50 text-amber-700' :
                            thread.category === 'spelling' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {thread.category === 'grammar' ? 'نحو وصرف' :
                             thread.category === 'composition' ? 'إنشاء وتعبير' :
                             thread.category === 'spelling' ? 'إملاء' : 'عام'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">{thread.timestamp}</span>
                        </div>

                        <h3 className="text-base font-black text-slate-800 line-clamp-1">{thread.title}</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{thread.content}</p>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-[10px] font-black">
                              {thread.author[0]}
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold">{thread.author} ({thread.authorRole === 'student' ? 'تلميذ' : 'أستاذ'})</span>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                            <button 
                              onClick={(e) => handleLikeThread(thread.id, e)}
                              className="flex items-center gap-1.5 hover:text-emerald-600"
                            >
                              <ThumbsUp size={14} />
                              <span>{thread.likes}</span>
                            </button>
                            <span className="flex items-center gap-1.5">
                              <MessageCircle size={14} />
                              <span>{thread.replies.length} ردود</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* Active Thread details and reply section */}
              {!isCreatingThread && activeThread && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6"
                >
                  {/* Return button */}
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <button 
                      onClick={() => setActiveThread(null)}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      <ChevronRight size={16} />
                      <span>العودة لقائمة المناقشات</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-bold">{activeThread.timestamp}</span>
                  </div>

                  {/* Main Thread details */}
                  <div className="space-y-4 text-right">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                        activeThread.category === 'grammar' ? 'bg-indigo-50 text-indigo-700' :
                        activeThread.category === 'composition' ? 'bg-amber-50 text-amber-700' :
                        activeThread.category === 'spelling' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {activeThread.category === 'grammar' ? 'نحو وصرف' :
                         activeThread.category === 'composition' ? 'إنشاء وتعبير' :
                         activeThread.category === 'spelling' ? 'إملاء' : 'عام'}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-800">{activeThread.title}</h2>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl whitespace-pre-line">{activeThread.content}</p>

                    <div className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center text-xs font-black">
                          {activeThread.author[0]}
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-xs font-bold text-slate-700">{activeThread.author}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{activeThread.authorRole === 'student' ? 'تلميذ' : 'أستاذ'}</span>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => handleLikeThread(activeThread.id, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-500 rounded-xl text-xs font-bold transition-all"
                      >
                        <ThumbsUp size={12} />
                        <span>أعجبني ({activeThread.likes})</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Replies */}
                  <div className="space-y-4 border-t border-slate-50 pt-6">
                    <h3 className="text-xs font-black text-slate-400 tracking-wider text-right uppercase">الردود والمناقشات اللغوية ({activeThread.replies.length})</h3>
                    
                    <div className="space-y-3">
                      {activeThread.replies.map((reply) => (
                        <div 
                          key={reply.id} 
                          className={`p-4 rounded-2xl border text-right space-y-2 transition-all ${
                            reply.authorRole === 'ai' 
                            ? 'bg-gradient-to-br from-emerald-50/50 to-indigo-50/30 border-emerald-100/70' 
                            : 'bg-white border-slate-50 shadow-sm shadow-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                                reply.authorRole === 'ai' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {reply.authorRole === 'ai' ? <Sparkles size={10} /> : reply.author[0]}
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-xs font-black text-slate-800">{reply.author}</span>
                                <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${
                                  reply.authorRole === 'ai' ? 'bg-emerald-100 text-emerald-800' :
                                  reply.authorRole === 'teacher' ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-500'
                                }`}>
                                  {reply.authorRole === 'ai' ? 'مساعد ذكي' :
                                   reply.authorRole === 'teacher' ? 'أستاذ' : 'تلميذ'}
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">{reply.timestamp}</span>
                          </div>

                          <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">{reply.content}</p>

                          <div className="flex justify-end pt-1">
                            <button 
                              onClick={() => handleLikeReply(activeThread.id, reply.id)}
                              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-600 font-bold"
                            >
                              <ThumbsUp size={10} />
                              <span>{reply.likes} أعجبني</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {isGeneratingAi && (
                        <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-2 justify-center">
                          <Brain size={14} className="text-emerald-600 animate-bounce" />
                          <span className="text-xs text-slate-400 font-bold">يقوم المساعد الذكي بمعالجة وصياغة الرد الآن...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply Addition Form */}
                  <form onSubmit={handleAddReply} className="border-t border-slate-50 pt-4 flex gap-2">
                    <input 
                      type="text"
                      placeholder="اكتب ردك أو اسأل بـ @ذكاء المساعد العلمي..."
                      value={newReplyText}
                      onChange={e => setNewReplyText(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button 
                      type="submit"
                      className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md shadow-emerald-100 shrink-0 cursor-pointer"
                    >
                      <Send size={16} className="-rotate-90" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};
