import React, { useEffect, useRef, useState } from 'react';
import { 
  Canvas, 
  Rect, 
  Circle, 
  Line, 
  Group, 
  Triangle, 
  IText, 
  FabricImage,
  PencilBrush,
  BaseBrush
} from 'fabric';
import { 
  Pencil, 
  Eraser, 
  Square, 
  Circle as CircleIcon, 
  Minus, 
  ArrowUpRight, 
  Type, 
  Trash2, 
  Download, 
  Image as ImageIcon, 
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>('pencil');
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(3);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.7,
        backgroundColor: '#ffffff',
      });

      const pencilBrush = new PencilBrush(fabricCanvas);
      pencilBrush.color = color;
      pencilBrush.width = brushSize;
      fabricCanvas.freeDrawingBrush = pencilBrush;

      setCanvas(fabricCanvas);

      const handleResize = () => {
        fabricCanvas.setDimensions({
          width: window.innerWidth * 0.9,
          height: window.innerHeight * 0.7,
        });
        fabricCanvas.renderAll();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        fabricCanvas.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushSize;
      
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        if (activeObject instanceof IText) {
          activeObject.set('fill', color);
        } else {
          activeObject.set('stroke', color);
        }
        canvas.renderAll();
      }
    }
  }, [color, brushSize, canvas]);

  const setTool = (tool: string) => {
    setActiveTool(tool);
    if (canvas) {
      canvas.isDrawingMode = tool === 'pencil' || tool === 'eraser';
      if (tool === 'eraser') {
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = '#ffffff';
        }
      } else if (tool === 'pencil') {
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = color;
        }
      }
    }
  };

  const addRect = () => {
    if (canvas) {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: 'transparent',
        stroke: color,
        strokeWidth: brushSize,
        width: 100,
        height: 100,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
      setTool('select');
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        left: 150,
        top: 150,
        fill: 'transparent',
        stroke: color,
        strokeWidth: brushSize,
        radius: 50,
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
      setTool('select');
    }
  };

  const addLine = () => {
    if (canvas) {
      const line = new Line([50, 50, 200, 200], {
        left: 170,
        top: 170,
        stroke: color,
        strokeWidth: brushSize,
      });
      canvas.add(line);
      canvas.setActiveObject(line);
      setTool('select');
    }
  };

  const addArrow = () => {
    if (canvas) {
      const line = new Line([0, 50, 100, 50], {
        stroke: color,
        strokeWidth: brushSize,
        originX: 'center',
        originY: 'center'
      });

      const head = new Triangle({
        width: 15,
        height: 15,
        fill: color,
        left: 100,
        top: 50,
        angle: 90,
        originX: 'center',
        originY: 'center'
      });

      const group = new Group([line, head], {
        left: 200,
        top: 200,
      });

      canvas.add(group);
      canvas.setActiveObject(group);
      setTool('select');
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new IText('اكتب هنا...', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fill: color,
        fontSize: 24,
        direction: 'rtl'
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      setTool('select');
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
    }
  };

  const saveCanvas = async () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = dataURL;
      link.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = async (f) => {
        const data = f.target?.result;
        const img = await FabricImage.fromURL(data as string);
        img.scaleToWidth(canvas.width! * 0.8);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.renderAll();
      };
      reader.readAsDataURL(file);
    }
  };

  const colors = [
    '#000000', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7', '#f97316', '#ec4899'
  ];

  return (
    <div className="flex flex-col items-center gap-4 p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-80px)]" dir="rtl">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex items-center bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
              <button 
                onClick={() => setTool('pencil')}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  activeTool === 'pencil' ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-gray-500 hover:bg-gray-50"
                )}
                title="قلم"
              >
                <Pencil size={20} />
              </button>
              <button 
                onClick={() => setTool('eraser')}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  activeTool === 'eraser' ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-gray-500 hover:bg-gray-50"
                )}
                title="ممحاة"
              >
                <Eraser size={20} />
              </button>
              <button 
                onClick={() => setTool('select')}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  activeTool === 'select' ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "text-gray-500 hover:bg-gray-50"
                )}
                title="تحديد"
              >
                <ArrowUpRight size={20} />
              </button>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-1"></div>

            <div className="flex items-center bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
              <button onClick={addLine} className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all" title="خط">
                <Minus size={20} />
              </button>
              <button onClick={addRect} className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all" title="مستطيل">
                <Square size={20} />
              </button>
              <button onClick={addCircle} className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all" title="دائرة">
                <CircleIcon size={20} />
              </button>
              <button onClick={addArrow} className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all" title="سهم">
                <ArrowUpRight size={20} className="rotate-45" />
              </button>
              <button onClick={addText} className="p-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all" title="نص">
                <Type size={20} />
              </button>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-1"></div>

            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-1 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1">
                {colors.map(c => (
                  <button 
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                      color === c ? "border-emerald-500 scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">السمك</span>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-20 accent-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all cursor-pointer font-bold text-gray-600 text-sm">
              <ImageIcon size={18} className="text-blue-500" />
              <span>إدراج صورة</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <button 
              onClick={saveCanvas}
              className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all font-bold text-gray-600 text-sm"
            >
              <Download size={18} className="text-emerald-500" />
              <span>حفظ</span>
            </button>
            <button 
              onClick={clearCanvas}
              className="flex items-center gap-2 bg-red-50 px-4 py-2.5 rounded-2xl border border-red-100 shadow-sm hover:bg-red-100 transition-all font-bold text-red-600 text-sm"
            >
              <Trash2 size={18} />
              <span>مسح</span>
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-200 p-4 md:p-8 flex items-center justify-center min-h-[500px]">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden cursor-crosshair">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl flex items-center gap-4 text-gray-400 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>السبورة تدعم اللمس والأجهزة اللوحية</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>يمكنك تحريك وتكبير الأشكال بعد رسمها</span>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
