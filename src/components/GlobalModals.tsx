import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { AI_TEACHER_AVATAR } from '../data/fenbiData';
import { ActiveModal, MainTabId } from '../types/app';
import { SearchOverlay } from './SearchOverlay';

interface GlobalModalsProps {
  modal: ActiveModal;
  featureTitle: string;
  onClose: () => void;
  onJumpTab: (tab: MainTabId) => void;
  onStartQuiz: (subjectId: string) => void;
  onOpenFeature: (title: string) => void;
}

type PracticeMenuIconId =
  | 'report'
  | 'history'
  | 'wrong'
  | 'notes'
  | 'cache'
  | 'favorite'
  | 'weekly'
  | 'one_on_one'
  | 'system_course';

const PracticeMenuIcon: React.FC<{ id: PracticeMenuIconId }> = ({ id }) => {
  const sharedProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#5B687D',
    strokeWidth: 1.55,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'w-[26px] h-[26px]',
    'aria-hidden': true,
  };

  switch (id) {
    case 'report':
      return (
        <svg {...sharedProps}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="M3.5 9.2H20.5" />
          <path d="M7.5 4.5V6.6" />
          <path d="M12 4.5V6.6" />
          <path d="M16.5 4.5V6.6" />
          <path d="M6.8 15.8L10.1 12.9L13.1 14.7L17.2 11.6" />
        </svg>
      );
    case 'history':
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.4V12L15.1 13.7" />
        </svg>
      );
    case 'wrong':
      return (
        <svg {...sharedProps}>
          <path d="M5.8 4.8H18.2L20.4 13.8V18.3C20.4 19 19.8 19.6 19.1 19.6H4.9C4.2 19.6 3.6 19 3.6 18.3V13.8L5.8 4.8Z" />
          <path d="M3.6 13.8H8.7C9.1 15.5 10.4 16.6 12 16.6C13.6 16.6 14.9 15.5 15.3 13.8H20.4" />
          <path d="M10.4 8.2L13.6 11.4" />
          <path d="M13.6 8.2L10.4 11.4" />
        </svg>
      );
    case 'notes':
      return (
        <svg {...sharedProps}>
          <path d="M6.5 4.5H18.3C19.1 4.5 19.7 5.1 19.7 5.9V15.4L15.6 19.5H6.5C5.7 19.5 5.1 18.9 5.1 18.1V5.9C5.1 5.1 5.7 4.5 6.5 4.5Z" />
          <path d="M9.2 4.5V19.5" />
          <path d="M15.6 19.5V15.4H19.7" />
          <path d="M3.5 8.2H6.5" />
          <path d="M3.5 12H6.5" />
          <path d="M3.5 15.8H6.5" />
        </svg>
      );
    case 'cache':
      return (
        <svg {...sharedProps}>
          <path d="M5.8 4.8H18.2L20.4 13.8V18.3C20.4 19 19.8 19.6 19.1 19.6H4.9C4.2 19.6 3.6 19 3.6 18.3V13.8L5.8 4.8Z" />
          <path d="M3.6 13.8H8.7C9.1 15.5 10.4 16.6 12 16.6C13.6 16.6 14.9 15.5 15.3 13.8H20.4" />
          <path d="M12 7.3V12.5" />
          <path d="M9.6 10.3L12 12.7L14.4 10.3" />
        </svg>
      );
    case 'favorite':
      return (
        <svg {...sharedProps}>
          <path d="M12 4.1L14.45 9.06L19.92 9.86L15.96 13.72L16.9 19.17L12 16.6L7.1 19.17L8.04 13.72L4.08 9.86L9.55 9.06L12 4.1Z" />
        </svg>
      );
    case 'weekly':
      return (
        <svg {...sharedProps}>
          <path d="M18.9 13.3A7.4 7.4 0 1 1 10.7 5.1V13.3H18.9Z" />
          <path d="M13.4 4.1A6.6 6.6 0 0 1 19.9 10.6H13.4V4.1Z" />
        </svg>
      );
    case 'one_on_one':
      return (
        <svg {...sharedProps}>
          <circle cx="9.6" cy="9.4" r="2.9" />
          <path d="M4.2 19.2C4.2 16.3 6.6 14.4 9.6 14.4C12.6 14.4 15 16.3 15 19.2H4.2Z" />
          <path d="M13.6 6.2A2.6 2.6 0 1 1 16.6 10.4" />
          <path d="M14.7 13.2C17.3 13.4 19.4 15 19.8 17.4H16.2" />
        </svg>
      );
    case 'system_course':
      return (
        <svg {...sharedProps}>
          <path d="M8.5 8.5V5.8C8.5 5.1 9.1 4.5 9.8 4.5H19C19.7 4.5 20.3 5.1 20.3 5.8V14.2C20.3 14.9 19.7 15.5 19 15.5H14.2" />
          <path d="M12.2 8.2H17.4" />
          <path d="M14 11.3H17.4" />
          <circle cx="8.8" cy="11.2" r="2.6" />
          <path d="M4.1 19.3C4.1 16.7 6.2 14.9 8.8 14.9C11.4 14.9 13.5 16.7 13.5 19.3H4.1Z" />
        </svg>
      );
  }
};

interface PracticeMoreDrawerProps {
  open: boolean;
  onClose: () => void;
  onJumpTab: (tab: MainTabId) => void;
  onStartQuiz: (subjectId: string) => void;
  onOpenFeature: (title: string) => void;
}

export const PracticeMoreDrawer: React.FC<PracticeMoreDrawerProps> = ({
  open,
  onClose,
  onJumpTab,
  onStartQuiz,
  onOpenFeature,
}) => {
  const tools: { label: string; icon: PracticeMenuIconId; action: () => void }[] = [
    { label: '用户报告', icon: 'report', action: () => onOpenFeature('用户报告') },
    { label: '练习历史', icon: 'history', action: () => onStartQuiz('politics') },
    { label: '我的错题', icon: 'wrong', action: () => onStartQuiz('politics') },
    { label: '我的笔记', icon: 'notes', action: () => onOpenFeature('我的笔记') },
    { label: '资料缓存', icon: 'cache', action: () => onOpenFeature('资料缓存') },
    { label: '我的收藏', icon: 'favorite', action: () => onStartQuiz('common') },
    { label: '会员周报', icon: 'weekly', action: () => onOpenFeature('会员周报') },
    { label: '我的1对1', icon: 'one_on_one', action: () => onOpenFeature('我的1对1') },
    { label: '我的体系课', icon: 'system_course', action: () => onJumpTab('course') },
  ];

  return (
    <div
      aria-hidden={!open}
      onClick={onClose}
      className={`absolute inset-0 z-40 flex items-start transition-colors duration-300 ${
        open ? 'bg-black/48 pointer-events-auto' : 'bg-black/0 pointer-events-none'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full bg-white rounded-b-[20px] pt-[78px] pb-7 px-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)] transition-all duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* 4-Column Tool Grid (9 items: 4 + 4 + 1) */}
        <div className="grid grid-cols-4 gap-y-6">
          {tools.map((item) => (
            <button
              key={item.label}
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                onClose();
                item.action();
              }}
              className="flex flex-col items-center justify-center text-center cursor-pointer active:opacity-65 transition-opacity"
            >
              <span className="w-8 h-8 flex items-center justify-center">
                <PracticeMenuIcon id={item.icon} />
              </span>
              <span className="mt-2 text-[12px] font-normal text-[#596170] leading-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GlobalModals: React.FC<GlobalModalsProps> = ({
  modal,
  featureTitle,
  onClose,
  onJumpTab,
  onStartQuiz,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    {
      role: 'ai',
      text: '你好！我是粉笔 AI 备考规划师。你可以问我国省考时间节点、行测提分重点，或让我为你推荐专项题库。',
    },
  ]);

  if (!modal || modal === 'more_grid') return null;

  // Global Search Page
  if (modal === 'search') {
    return <SearchOverlay onClose={onClose} onStartQuiz={onStartQuiz} />;
  }

  // AI Teacher Drawer
  if (modal === 'ai_teacher') {
    const sendMsg = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      const userMsg = chatInput.trim();
      setChatInput('');
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: userMsg },
        {
          role: 'ai',
          text: `收到你的问题「${userMsg}」：建议每天保持 1 组政治理论（15题）+ 2 篇资料分析计时练习，并结合「系统班」课程查漏补缺。点击下方快捷按钮可直接开始刷题！`,
        },
      ]);
    };

    return (
      <div className="absolute inset-0 bg-black/50 z-[65] flex items-end">
        <div className="w-full bg-white rounded-t-3xl h-[78%] flex flex-col animate-slide-up">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={AI_TEACHER_AVATAR}
                alt="AI老师"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="text-[14.5px] font-bold text-slate-900">粉笔 AI 老师</div>
                <div className="text-[11px] text-slate-400">备考规划 · 刷题答疑</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F9FC]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#3A7AFE] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartQuiz('politics');
              }}
              className="px-3 py-1 rounded-full bg-[#EEF4FF] text-[#3A7AFE] text-[11.5px] font-medium whitespace-nowrap cursor-pointer"
            >
              立即刷政治理论
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onJumpTab('course');
              }}
              className="px-3 py-1 rounded-full bg-[#EEF4FF] text-[#3A7AFE] text-[11.5px] font-medium whitespace-nowrap cursor-pointer"
            >
              查看精品课程
            </button>
          </div>

          <form onSubmit={sendMsg} className="px-4 pb-5 pt-2 bg-white flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="输入你的备考疑问..."
              className="flex-1 h-10 px-3.5 rounded-full bg-slate-100 text-[13.5px] outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#3A7AFE] text-white flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="发送"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Generic Feature Preview Modal
  return (
    <div className="absolute inset-0 bg-black/50 z-[65] flex items-center justify-center px-6">
      <div className="w-full max-w-[310px] bg-white rounded-3xl p-5 shadow-2xl animate-fade-scale">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15.5px] font-bold text-slate-900">{featureTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[13px] text-slate-600 leading-relaxed">
          「{featureTitle}」属于粉笔教育专项拓展子页。你可以直接体验核心的专项智能刷题或精品课程学习功能。
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartQuiz('politics');
            }}
            className="w-full h-10 rounded-full bg-[#3A7AFE] text-white text-[13.5px] font-semibold cursor-pointer"
          >
            前往专项智能刷题
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full h-9 rounded-full bg-slate-100 text-slate-600 text-[13px] font-medium cursor-pointer"
          >
            返回当前页面
          </button>
        </div>
      </div>
    </div>
  );
};
