import React from 'react';

export const FenbiLogo: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-label="粉笔教育 Logo">
    <path
      d="M16 58V30C16 20.0589 24.0589 12 34 12H44C47.3137 12 50 14.6863 50 18C50 21.3137 47.3137 24 44 24H34C30.6863 24 28 26.6863 28 30V33H39C42.3137 33 45 35.6863 45 39C45 42.3137 42.3137 45 39 45H28V58C28 61.3137 25.3137 64 22 64C18.6863 64 16 61.3137 16 58Z"
      fill="#3A7AFE"
    />
    <path
      d="M46 29C46 25.6863 48.6863 23 52 23C55.3137 23 58 25.6863 58 29V34.5C59.8 33.8 61.8 33.5 63.8 33.8C70.6 34.8 75.2 41.2 74.2 48C73.2 54.8 66.8 59.4 60 58.4C52.1 57.2 46 50.4 46 42.4V29ZM60.2 46.8C62.8 46.8 64.9 44.7 64.9 42.1C64.9 39.5 62.8 37.4 60.2 37.4C57.6 37.4 55.5 39.5 55.5 42.1C55.5 44.7 57.6 46.8 60.2 46.8Z"
      fill="#2663EB"
    />
  </svg>
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
