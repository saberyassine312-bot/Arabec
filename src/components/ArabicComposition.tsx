import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Send, AlertCircle, Info, RefreshCw, ArrowRight, MessageSquare, Sparkles, Lightbulb, Camera, Upload, Image as ImageIcon, X, Check } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Correction {
  original: string;
  corrected: string;
  type: 'spelling' | 'grammar' | 'structure';
  explanation: string;
  rule: string;
}

interface AnalysisResult {
  correctedText: string;
  corrections: Correction[];
  rating: string;
  stats: {
    errorCount: number;
    spellingErrors: number;
    grammarErrors: number;
    structureErrors: number;
  };
  suggestions: string[];
}

const ArabicComposition: React.FC = () => {
  const [text, setText] = useState('');
  const [stage, setStage] = useState<'input' | 'highlight' | 'final'>('input');
  const [inputMode, setInputMode] = useState<'text' | 'camera' | 'upload'>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("تعذر الوصول إلى الكاميرا. يرجى التأكد من منح الإذن.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
        processImage(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedImage(dataUrl);
        processImage(dataUrl, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64Image: string, mimeType: string = "image/jpeg") => {
    setIsOcrLoading(true);
    setError(null);
    try {
      const base64Data = base64Image.split(',')[1];
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            {
              text: "أنت خبير في التعرف الضوئي على الحروف (OCR) للغة العربية. استخرج النص العربي الموجود في هذه الصورة أو الملف بدقة عالية. حافظ على ترتيب الفقرات والأسطر. لا تضف أي تعليقات أو شرح، فقط النص المستخرج."
            }
          ]
        }]
      });

      const extractedText = response.text;
      if (extractedText) {
        setText(extractedText);
        setInputMode('text');
      } else {
        setError("لم يتم العثور على نص في الصورة.");
      }
    } catch (err) {
      console.error("OCR error:", err);
      setError("حدث خطأ أثناء استخراج النص من الصورة.");
    } finally {
      setIsOcrLoading(false);
      setCapturedImage(null);
    }
  };

  const startHighlightStage = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{
          role: 'user',
          parts: [{
            text: `أنت أداة تعليمية ذكية لتصحيح النصوص باللغة العربية.
            المرحلة 2: عرض النص مع تظليل.
            أعد عرض النص التالي كما هو تماماً، لكن قم بوضع الكلمات التي تحتوي على أخطاء محتملة (إملائية، نحوية، أو تركيبية) بين وسوم <error> و </error>.
            قواعد صارمة:
            1. لا تشرح أي شيء.
            2. لا تضع ملاحظات.
            3. لا تعطي إجابة أو تصحيح.
            4. فقط ضع الوسوم حول الكلمات الخاطئة داخل النص الأصلي.
            
            النص: "${text}"`
          }]
        }]
      });

      const rawText = response.text;
      setHighlightedText(rawText);
      setStage('highlight');
    } catch (err) {
      console.error("Highlight stage error:", err);
      setError("حدث خطأ أثناء تحديد الأخطاء. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startFinalStage = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{
          role: 'user',
          parts: [{
            text: `أنت أداة تعليمية ذكية لتصحيح النصوص باللغة العربية.
            المرحلة 3: التصحيح النهائي والشرح.
            قم بتصحيح النص التالي كاملاً بشكل صحيح، ثم اشرح الأخطاء التي وقع فيها المتعلم مع ذكر القاعدة النحوية أو الإملائية لكل خطأ بأسلوب مبسط.
            
            النص: "${text}"
            
            يجب أن يكون الرد بتنسيق JSON حصراً كالتالي:
            {
              "correctedText": "النص الكامل بعد التصحيح",
              "corrections": [
                {
                  "original": "الكلمة الخاطئة",
                  "corrected": "التصحيح",
                  "type": "spelling" | "grammar" | "structure",
                  "explanation": "شرح الخطأ",
                  "rule": "القاعدة اللغوية"
                }
              ],
              "rating": "التقييم العام",
              "stats": {
                "errorCount": 0,
                "spellingErrors": 0,
                "grammarErrors": 0,
                "structureErrors": 0
              },
              "suggestions": ["نصيحة 1", "نصيحة 2"]
            }`
          }]
        }],
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

      const analysis = JSON.parse(response.text);
      setResult(analysis);
      setStage('final');
    } catch (err) {
      console.error("Final stage error:", err);
      setError("حدث خطأ أثناء التصحيح النهائي. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderHighlightedStageText = () => {
    const parts = highlightedText.split(/(<error>.*?<\/error>)/g);
    return parts.map((part, index) => {
      if (part.startsWith('<error>') && part.endsWith('</error>')) {
        const word = part.replace('<error>', '').replace('</error>', '');
        return (
          <span key={index} className="bg-red-100 text-red-700 border-b-2 border-red-500 px-1 rounded mx-0.5 font-bold">
            {word}
          </span>
        );
      }
      return part;
    });
  };

  const renderFinalHighlightedText = () => {
    if (!result) return text;
    let lastIndex = 0;
    const parts: (string | React.ReactNode)[] = [];
    
    const matches: { start: number; end: number; correction: Correction }[] = [];
    result.corrections.forEach(c => {
      let index = text.indexOf(c.original);
      if (index !== -1) {
        matches.push({ start: index, end: index + c.original.length, correction: c });
      }
    });

    matches.sort((a, b) => a.start - b.start);

    matches.forEach((match, i) => {
      parts.push(text.substring(lastIndex, match.start));
      parts.push(
        <span key={i} className="bg-red-50 text-red-600 border-b border-red-200 px-0.5 rounded">
          {match.correction.original}
        </span>
      );
      lastIndex = match.end;
    });
    parts.push(text.substring(lastIndex));
    return parts;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-6">
          <PenTool size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">أداة التصحيح الذكي</h1>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all", stage === 'input' ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400")}>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
            إدخال النص
          </div>
          <ArrowRight size={16} className="text-gray-300" />
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all", stage === 'highlight' ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400")}>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
            تظليل الأخطاء
          </div>
          <ArrowRight size={16} className="text-gray-300" />
          <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all", stage === 'final' ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400")}>
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
            التصحيح النهائي
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex items-center justify-center gap-4">
              <button 
                onClick={() => { setInputMode('text'); stopCamera(); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  inputMode === 'text' ? "bg-white text-emerald-600 shadow-sm border border-emerald-100" : "text-gray-500 hover:bg-white/50"
                )}
              >
                <PenTool size={18} />
                <span>نص مباشر</span>
              </button>
              <button 
                onClick={() => { setInputMode('camera'); startCamera(); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  inputMode === 'camera' ? "bg-white text-emerald-600 shadow-sm border border-emerald-100" : "text-gray-500 hover:bg-white/50"
                )}
              >
                <Camera size={18} />
                <span>تصوير</span>
              </button>
              <button 
                onClick={() => { setInputMode('upload'); stopCamera(); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  inputMode === 'upload' ? "bg-white text-emerald-600 shadow-sm border border-emerald-100" : "text-gray-500 hover:bg-white/50"
                )}
              >
                <Upload size={18} />
                <span>رفع صورة</span>
              </button>
            </div>

            <div className="p-8">
              {inputMode === 'text' && (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="اكتب نصك هنا ليقوم المساعد الذكي بتظليل الأخطاء..."
                  className="w-full h-80 p-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none text-lg leading-relaxed resize-none"
                  dir="rtl"
                />
              )}

              {inputMode === 'camera' && (
                <div className="relative w-full h-80 bg-black rounded-2xl overflow-hidden group">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={capturePhoto}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-xl hover:scale-110 transition-transform"
                    >
                      <Camera size={32} />
                    </button>
                  </div>
                  {isOcrLoading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-4">
                      <RefreshCw className="animate-spin" size={40} />
                      <p className="font-bold">جاري استخراج النص من الصورة...</p>
                    </div>
                  )}
                </div>
              )}

              {inputMode === 'upload' && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => processImage(event.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full h-80 border-4 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={handleFileUpload}
                  />
                  <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <ImageIcon size={40} />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-700">اسحب الصورة أو ملف PDF هنا أو اضغط للرفع</p>
                    <p className="text-gray-400 mt-2">يدعم JPG, PNG, WEBP, PDF</p>
                  </div>
                  {isOcrLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-600 gap-4">
                      <RefreshCw className="animate-spin" size={40} />
                      <p className="font-bold">جاري استخراج النص من الصورة...</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={startHighlightStage}
                  disabled={!text.trim() || isAnalyzing || isOcrLoading}
                  className={cn(
                    "flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg",
                    text.trim() && !isAnalyzing && !isOcrLoading ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200" : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  )}
                >
                  {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                  <span>تظليل الأخطاء</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'highlight' && (
          <motion.div 
            key="highlight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <span>الكلمات المظللة بالأحمر تحتوي على أخطاء محتملة:</span>
                </h3>
                <div className="p-8 bg-gray-50 rounded-2xl text-xl leading-loose text-gray-800" dir="rtl">
                  {renderHighlightedStageText()}
                </div>
                <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                  <Info className="text-amber-500 shrink-0 mt-1" size={18} />
                  <p className="text-sm text-amber-800 font-medium">
                    حاول إعادة كتابة النص وتصحيح الكلمات المظللة بنفسك قبل الانتقال للمرحلة النهائية.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
              <h3 className="text-lg font-bold mb-4">أعد كتابة النص المصحح:</h3>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 p-6 bg-gray-50 rounded-2xl border-2 border-emerald-500 focus:bg-white transition-all outline-none text-lg leading-relaxed resize-none mb-6"
                dir="rtl"
              />
              <div className="flex justify-between items-center">
                <button onClick={() => setStage('input')} className="text-gray-500 font-bold hover:text-gray-700">العودة للبداية</button>
                <button
                  onClick={startFinalStage}
                  disabled={isAnalyzing}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-3"
                >
                  {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  <span>عرض التصحيح النهائي والشرح</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'final' && result && (
          <motion.div 
            key="final"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="text-sm text-gray-500 mb-2">التقييم</div>
                <div className="text-2xl font-black text-emerald-600">{result.rating}</div>
              </div>
              <div className="md:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-around">
                <div className="text-center">
                  <div className="text-2xl font-black text-red-500">{result.stats.spellingErrors}</div>
                  <div className="text-xs text-gray-500">إملاء</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-blue-500">{result.stats.grammarErrors}</div>
                  <div className="text-xs text-gray-500">نحو</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-purple-500">{result.stats.structureErrors}</div>
                  <div className="text-xs text-gray-500">تركيب</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 font-bold text-gray-700">نصك الأخير</div>
                <div className="p-8 text-lg leading-relaxed" dir="rtl">{renderFinalHighlightedText()}</div>
              </div>
              <div className="bg-emerald-50/30 rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 font-bold text-emerald-700">التصحيح النهائي</div>
                <div className="p-8 text-lg leading-relaxed text-gray-800" dir="rtl">{result.correctedText}</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <MessageSquare className="text-blue-500" />
                <span>شرح الأخطاء والقواعد</span>
              </h3>
              <div className="space-y-4">
                {result.corrections.map((c, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-red-500 line-through font-bold">{c.original}</span>
                      <ArrowRight size={16} className="text-gray-400" />
                      <span className="text-emerald-600 font-black">{c.corrected}</span>
                      <span className="mr-auto px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase text-gray-400 border border-gray-100">
                        {c.type === 'spelling' ? 'إملاء' : c.type === 'grammar' ? 'نحو' : 'تركيب'}
                      </span>
                    </div>
                    <p className="text-gray-700 font-bold mb-2">{c.explanation}</p>
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-xl">
                      <Lightbulb size={16} />
                      <span className="font-bold">القاعدة: {c.rule}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  setText('');
                  setStage('input');
                  setResult(null);
                }}
                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
              >
                موضوع جديد
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ArabicComposition;
