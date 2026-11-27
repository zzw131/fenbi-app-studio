import React from 'react';

export const FenbiLogo: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <img
    src="/assets/aistudio/logo_7d45683f.svg"
    alt="粉笔教育 Logo"
    referrerPolicy="no-referrer"
    draggable={false}
    className={`object-contain select-none ${className}`}
  />
);

export const FenbiMascotAvatar: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-label="粉笔吉祥物头像">
    <circle cx="32" cy="32" r="32" fill="#DCEBFF" />
    <path d="M18 54C18 44.6 24.3 39 32 39C39.7 39 46 44.6 46 54" fill="#2E6BF6" />
    <path d="M26 42L32 48L38 42" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="32" cy="27" r="13" fill="#FFFFFF" stroke="#B7D2FF" strokeWidth="1.5" />
    <path d="M29 14L32 8L35 14" fill="#FFFFFF" />
    <path d="M19.5 23C24 20.5 40 20.5 44.5 23V26.5C40 24.5 24 24.5 19.5 26.5V23Z" fill="#EF4444" />
    <circle cx="27" cy="29" r="1.8" fill="#1E293B" />
    <circle cx="37" cy="29" r="1.8" fill="#1E293B" />
    <circle cx="23.5" cy="32" r="2" fill="#FDA4AF" opacity="0.7" />
    <circle cx="40.5" cy="32" r="2" fill="#FDA4AF" opacity="0.7" />
    <path d="M29.5 32.5C30.8 34 33.2 34 34.5 32.5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const StatusBar: React.FC<{ dark?: boolean; time?: string }> = ({ dark = false, time = '2:25' }) => (
  <div
    className={`flex items-center justify-between px-5 pt-2 pb-1 text-[11px] font-medium select-none shrink-0 ${
      dark ? 'text-white/90' : 'text-slate-800'
    }`}
  >
    <span className="tabular-nums tracking-tight">{time}</span>
    <div className="flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4.5C7 4.5 2.7 6.8 0 10.5L12 21L24 10.5C21.3 6.8 17 4.5 12 4.5Z" opacity="0.85" />
      </svg>
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 22H22V2L2 22Z" opacity="0.85" />
      </svg>
      <div className="flex items-center gap-0.5">
        <div
          className={`w-4 h-2.5 rounded-[2px] border p-[1px] flex items-center ${
            dark ? 'border-white/70' : 'border-slate-700'
          }`}
        >
          <div className={`w-2.5 h-full rounded-[1px] ${dark ? 'bg-white' : 'bg-slate-800'}`} />
        </div>
      </div>
    </div>
  </div>
);

export type BottomTabIconName = 'practice' | 'course' | 'discover' | 'me';

export const BottomTabIcon: React.FC<{ name: BottomTabIconName; active: boolean }> = ({
  name,
  active,
}) => {
  const outlineClass = `absolute inset-0 w-full h-full transition-all duration-200 ease-out ${
    active ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
  }`;
  const filledClass = `absolute inset-0 w-full h-full transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    active ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
  }`;

  return (
    <span className="relative w-[22px] h-[22px] inline-block shrink-0" aria-hidden="true">
      {name === 'practice' && (
        <>
          {/* 线性 */}
          <svg viewBox="0 0 24 24" fill="none" className={outlineClass}>
            <path
              d="M3.75 10.6L11.2 4.35C11.66 3.96 12.34 3.96 12.8 4.35L20.25 10.6"
              stroke="#232833"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 9.5V18.5C5.5 19.6 6.4 20.5 7.5 20.5H16.5C17.6 20.5 18.5 19.6 18.5 18.5V9.5"
              stroke="#232833"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.75 20.5V15.25C9.75 14.56 10.31 14 11 14H13C13.69 14 14.25 14.56 14.25 15.25V20.5"
              stroke="#232833"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* 面型 */}
          <svg viewBox="0 0 24 24" fill="none" className={filledClass}>
            <path
              d="M11.12 3.74C11.63 3.31 12.37 3.31 12.88 3.74L20.55 10.17C20.84 10.41 21 10.76 21 11.14V11.35C21 11.98 20.49 12.5 19.85 12.5H19V18.6C19 19.93 17.93 21 16.6 21H7.4C6.07 21 5 19.93 5 18.6V12.5H4.15C3.51 12.5 3 11.98 3 11.35V11.14C3 10.76 3.16 10.41 3.45 10.17L11.12 3.74Z"
              fill="#2856EB"
            />
            <rect x="9.8" y="14.2" width="4.4" height="6.8" rx="1.4" fill="#FFFFFF" />
          </svg>
        </>
      )}

      {name === 'course' && (
        <>
          {/* 线性 */}
          <svg viewBox="0 0 24 24" fill="none" className={outlineClass}>
            <rect
              x="3.5"
              y="4"
              width="17"
              height="16"
              rx="4.2"
              stroke="#232833"
              strokeWidth="1.75"
            />
            <path
              d="M10.2 9.1L15.1 12L10.2 14.9V9.1Z"
              stroke="#232833"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          {/* 面型 */}
          <svg viewBox="0 0 24 24" fill="none" className={filledClass}>
            <rect x="3" y="3.5" width="18" height="17" rx="4.8" fill="#2856EB" />
            <path
              d="M10.15 8.85C9.68 8.58 9.1 8.92 9.1 9.46V14.54C9.1 15.08 9.68 15.42 10.15 15.15L14.62 12.61C15.09 12.34 15.09 11.66 14.62 11.39L10.15 8.85Z"
              fill="#FFFFFF"
            />
          </svg>
        </>
      )}

      {name === 'discover' && (
        <>
          {/* 线性 */}
          <svg viewBox="0 0 24 24" fill="none" className={outlineClass}>
            <circle cx="12" cy="12" r="8.6" stroke="#232833" strokeWidth="1.75" />
            <path
              d="M15.3 8.7L13.55 13.55L8.7 15.3L10.45 10.45L15.3 8.7Z"
              stroke="#232833"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          {/* 面型 */}
          <svg viewBox="0 0 24 24" fill="none" className={filledClass}>
            <circle cx="12" cy="12" r="9.2" fill="#2856EB" />
            <path
              d="M15.75 8.25L13.8 13.8L8.25 15.75L10.2 10.2L15.75 8.25Z"
              fill="#FFFFFF"
            />
            <circle cx="12" cy="12" r="1.25" fill="#2856EB" />
          </svg>
        </>
      )}

      {name === 'me' && (
        <>
          {/* 线性 */}
          <svg viewBox="0 0 24 24" fill="none" className={outlineClass}>
            <circle cx="12" cy="12" r="8.6" stroke="#232833" strokeWidth="1.75" />
            <circle cx="9.2" cy="10.2" r="1.15" fill="#232833" />
            <circle cx="14.8" cy="10.2" r="1.15" fill="#232833" />
            <path
              d="M8.8 14.3C9.6 15.55 10.75 16.2 12 16.2C13.25 16.2 14.4 15.55 15.2 14.3"
              stroke="#232833"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
          {/* 面型 */}
          <svg viewBox="0 0 24 24" fill="none" className={filledClass}>
            <circle cx="12" cy="12" r="9.2" fill="#2856EB" />
            <circle cx="9.1" cy="10.1" r="1.25" fill="#FFFFFF" />
            <circle cx="14.9" cy="10.1" r="1.25" fill="#FFFFFF" />
            <path
              d="M8.6 14.2C9.45 15.6 10.68 16.3 12 16.3C13.32 16.3 14.55 15.6 15.4 14.2"
              stroke="#FFFFFF"
              strokeWidth="1.95"
              strokeLinecap="round"
            />
          </svg>
        </>
      )}
    </span>
  );
};
