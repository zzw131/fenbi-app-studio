import React, { useState } from 'react';
import {
  Search,
  X,
  Send,
  Sparkles,
  BookOpen,
  Trophy,
  FileText,
  Briefcase,
  Target,
  Clock,
} from 'lucide-react';
import { AI_TEACHER_AVATAR, COURSES, INITIAL_SUBJECTS, JOB_ANNOUNCEMENTS } from '../data/fenbiData';
import { ActiveModal, MainTabId } from '../types/app';

interface GlobalModalsProps {
  modal: ActiveModal;
  featureTitle: string;
  onClose: () => void;
  onJumpTab: (tab: MainTabId) => void;
  onStartQuiz: (subjectId: string) => void;
}

export const GlobalModals: React.FC<GlobalModalsProps> = ({
  modal,
  featureTitle,
  onClose,
  onJumpTab,
  onStartQuiz,
}) => {
  const [query, setQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    {
      role: 'ai',
      text: '你好！我是粉笔 AI 备考规划师。你可以问我国省考时间节点、行测提分重点，或让我为你推荐专项题库。',
    },
  ]);

  if (!modal) return null;

  // Global Search Page (未采集子页的完整交互实现)
  if (modal === 'search') {
    const q = query.trim();
    const matchedSubjects = INITIAL_SUBJECTS.filter((s) => !q || s.name.includes(q));
    const matchedCourses = COURSES.filter((c) => !q || c.title.includes(q));
    const matchedJobs = JOB_ANNOUNCEMENTS.filter((j) => !q || j.title.includes(q));

    return (
      <div className="absolute inset-0 bg-[#F5F7FA] z-40 flex flex-col animate-fade-scale">
        <div className="bg-white px-4 py-3 flex items-center gap-2.5 border-b border-slate-100">
          <div className="flex-1 h-9 rounded-full bg-slate-100 px-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索科目、课程、招考公告..."
              className="flex-1 text-[13.5px] bg-transparent outline-none text-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[14px] text-slate-600 font-medium px-1 cursor-pointer"
          >
            取消
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!q && (
            <div>
              <div className="text-[12.5px] font-bold text-slate-500 mb-2">热门搜索</div>
              <div className="flex flex-wrap gap-2">
                {['政治理论', '申论一类文', '系统班', '北京公务员', '南通辅警'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-white text-[12.5px] text-slate-700 border border-slate-200/70 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedSubjects.length > 0 && (
            <div className="space-y-2">
              <div className="text-[12.5px] font-bold text-slate-500">练习科目</div>
              {matchedSubjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartQuiz(s.id);
                  }}
                  className="w-full bg-white rounded-xl p-3 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-[14px] font-semibold text-slate-900">{s.name}</span>
                  <span className="text-[12px] text-[#3A7AFE]">进入刷题 →</span>
                </button>
              ))}
            </div>
          )}

          {matchedCourses.length > 0 && (
            <div className="space-y-2">
              <div className="text-[12.5px] font-bold text-slate-500">相关课程</div>
              {matchedCourses.slice(0, 3).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onJumpTab('course');
                  }}
                  className="w-full bg-white rounded-xl p-3 text-left cursor-pointer"
                >
                  <div className="text-[13.5px] font-semibold text-slate-900 line-clamp-1">
                    {c.title}
                  </div>
                  <div className="text-[12px] text-[#EA580C] font-semibold mt-1">{c.priceLabel}</div>
                </button>
              ))}
            </div>
          )}

          {matchedJobs.length > 0 && (
            <div className="space-y-2">
              <div className="text-[12.5px] font-bold text-slate-500">招考公告</div>
              {matchedJobs.slice(0, 2).map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onJumpTab('jobmatch');
                  }}
                  className="w-full bg-white rounded-xl p-3 text-left cursor-pointer"
                >
                  <div className="text-[13.5px] font-semibold text-slate-900 line-clamp-1">
                    {j.title}
                  </div>
                  <div className="text-[11.5px] text-slate-400 mt-1">
                    {j.region} · {j.status}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // More Grid Menu (我的练习相关功能)
  if (modal === 'more_grid') {
    const tools = [
      { label: '错题本', desc: '高频错题智能重练', icon: BookOpen, action: () => onStartQuiz('politics') },
      { label: '收藏夹', desc: '已标记的重点好题', icon: Target, action: () => onStartQuiz('common') },
      { label: '练习历史', desc: '近期做题记录与报告', icon: Clock, action: () => onStartQuiz('politics') },
      { label: '模考大赛', desc: '全真考场定时排位', icon: Trophy, action: () => onJumpTab('practice') },
      { label: '申论批改', desc: 'AI智能逐段点评', icon: FileText, action: () => onJumpTab('course') },
      { label: '选岗匹配', desc: '按专业学历精准筛选', icon: Briefcase, action: () => onJumpTab('jobmatch') },
    ];
    return (
      <div className="absolute inset-0 bg-black/50 z-40 flex items-end">
        <div className="w-full bg-white rounded-t-3xl p-5 animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-[16px] font-bold text-slate-900">我的练习 · 全部工具</h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="py-4 grid grid-cols-3 gap-3">
            {tools.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    onClose();
                    item.action();
                  }}
                  className="p-3 rounded-2xl bg-[#F5F7FA] hover:bg-[#EEF4FF] flex flex-col items-center text-center gap-1.5 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-white text-[#3A7AFE] flex items-center justify-center shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-[13px] font-semibold text-slate-900">{item.label}</div>
                  <div className="text-[10.5px] text-slate-400 leading-tight">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
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
          text: `收到你的问题「${userMsg}」：建议每天保持 1 组政治理论（15题）+ 2 篇资料分析计时练习，并结合「选岗助手」提前核对岗位专业要求。点击下方快捷按钮可直接开始刷题！`,
        },
      ]);
    };

    return (
      <div className="absolute inset-0 bg-black/50 z-40 flex items-end">
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
                onJumpTab('jobmatch');
              }}
              className="px-3 py-1 rounded-full bg-[#EEF4FF] text-[#3A7AFE] text-[11.5px] font-medium whitespace-nowrap cursor-pointer"
            >
              打开选岗助手
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
    <div className="absolute inset-0 bg-black/50 z-40 flex items-center justify-center px-6">
      <div className="w-full max-w-[310px] bg-white rounded-3xl p-5 shadow-2xl animate-fade-scale">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#3A7AFE] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-[15.5px] font-bold text-slate-900">{featureTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[13px] text-slate-600 leading-relaxed">
          「{featureTitle}」属于粉笔教育专项拓展子页。你可以直接体验核心的专项智能刷题或选岗匹配功能。
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
