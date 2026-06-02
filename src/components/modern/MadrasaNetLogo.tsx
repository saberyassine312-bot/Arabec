import React from 'react';

interface MadrasaNetLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const MadrasaNetLogo: React.FC<MadrasaNetLogoProps> = ({ 
  className = '', 
  size = 'md', 
  showTagline = true 
}) => {
  // Dimensions and sizes
  const dims = {
    sm: {
      svg: 'w-10 h-10',
      text: 'text-lg',
      slogan: 'text-[8px]',
      gap: 'gap-2',
    },
    md: {
      svg: 'w-14 h-14',
      text: 'text-xl',
      slogan: 'text-[9px]',
      gap: 'gap-3',
    },
    lg: {
      svg: 'w-24 h-24',
      text: 'text-3xl',
      slogan: 'text-xs',
      gap: 'gap-4',
    }
  }[size];

  return (
    <div className={`flex items-center rtl select-none ${dims.gap} ${className}`}>
      {/* 🔮 MadrasaNet Vector Logo Icon */}
      <div className={`${dims.svg} relative shrink-0 transition-transform duration-500 hover:scale-105`}>
        <svg 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
        >
          {/* 🎓 1. GRADUATION CAP (Floating navy/indigo crown) */}
          <g id="graduation-cap">
            {/* Diamond top plate */}
            <path 
              d="M60 14L102 30L60 46L18 30L60 14Z" 
              fill="url(#cap-gradient)" 
              stroke="#0f172a" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            {/* Cap under-arch/skull base */}
            <path 
              d="M38 36.5V45.5C38 45.5 45 52 60 52C75 52 82 45.5 82 45.5V36.5" 
              fill="#1e3a8a" 
              stroke="#0f172a" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
            />
            {/* Tassel line and hanging ornament */}
            <path 
              d="M60 30C60 30 74 33 88 40V49.5" 
              stroke="#1d4ed8" 
              strokeWidth="1.25" 
              strokeLinecap="round" 
            />
            <path 
              d="M86.5 49.5C86.5 48.1 88 47 88 47C88 47 89.5 48.1 89.5 49.5C89.5 50.9 88.8 54 88 54C87.2 54 86.5 50.9 86.5 49.5Z" 
              fill="#3b82f6" 
              stroke="#1e3a8a" 
              strokeWidth="0.75" 
            />
          </g>

          {/* 💻 2. LAPTOP SCREEN / OPEN BOOK BASE */}
          <g id="laptop-book">
            {/* Upper display bezel / open pages */}
            <path 
              d="M34 50H28C26.8954 50 26 50.8954 26 52V85C26 86.1046 26.8954 87 28 87H92C93.1046 87 94 86.1046 94 85V52C94 50.8954 93.1046 50H86" 
              stroke="#0f172a" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Rounded laptop base edge */}
            <path 
              d="M21 91H99C101 91 103 91.5 103 93.5C103 96.5 97 97 97 97H23C23 97 17 96.5 17 93.5C17 91.5 19 91 21 91Z" 
              fill="url(#base-gradient)" 
              stroke="#0f172a" 
              strokeWidth="1.75" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Trackpad notch */}
            <path 
              d="M52 91C52 91.5 54 93.5 60 93.5C66 93.5 68 91.5 68 91" 
              stroke="#0f172a" 
              strokeWidth="1.5" 
              fill="#ffffff" 
              strokeLinecap="round" 
            />
            {/* Open book pages lines at standard page bottom inside laptop screen */}
            <path 
              d="M30 82C40 82 48 84 58 84H62C72 84 80 82 90 82" 
              stroke="#0f172a" 
              strokeWidth="1.25" 
              strokeLinecap="round" 
            />
            <path 
              d="M32 79C40 79 48 81 58 81H62C72 81 80 79 88 79" 
              stroke="#0f172a" 
              strokeWidth="0.75" 
              strokeLinecap="round" 
            />
          </g>

          {/* 👥 3. TWO STUDENTS FORMING "M" (Blue and Green unified) */}
          <g id="students-m">
            {/* Left student head (Blue) */}
            <circle cx="48" cy="56" r="4.5" fill="#1e3a8a" stroke="#ffffff" strokeWidth="1" />
            {/* Left student body (shaking arm / curves to M) */}
            <path 
              d="M38 78C38 73 39 63 46.5 63C49 63 51 65 54 68.5" 
              stroke="#1e3a8a" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            
            {/* Right student head (Emerald Green) */}
            <circle cx="72" cy="56" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
            {/* Right student body (shaking arm / curves to M) */}
            <path 
              d="M82 78C82 73 81 63 73.5 63C71 63 69 65 66 68.5" 
              stroke="#10b981" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
          </g>

          {/* 🔍 Defs for high-end gradients */}
          <defs>
            <linearGradient id="cap-gradient" x1="60" y1="14" x2="60" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="base-gradient" x1="60" y1="91" x2="60" y2="97" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Dynamic decorative pixel nodes matching top-right of original image logo */}
        <div className="absolute top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-sm animate-pulse"></div>
        <div className="absolute top-3 -right-2.5 w-1 h-1 bg-sky-500 rounded-sm"></div>
        <div className="absolute top-4 -right-1 w-1.2 h-1.2 bg-indigo-600 rounded-sm"></div>
      </div>

      {/* 📝 Brand Text & Tagline */}
      <div className="flex flex-col text-right justify-center">
        <div className={`${dims.text} font-black tracking-tight leading-none flex items-center gap-0.5`}>
          <span className="text-slate-900 font-sans">Madrasa</span>
          <span className="text-emerald-600 font-sans font-black">Net</span>
        </div>
        
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-px w-2.5 bg-emerald-500/30"></div>
            <span className={`${dims.slogan} font-black text-slate-500 leading-none whitespace-nowrap`}>
              تعلم اليوم .. لتبدع غداً
            </span>
            <div className="h-px w-2.5 bg-emerald-500/30"></div>
          </div>
        )}
      </div>
    </div>
  );
};
