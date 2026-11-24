import React, { useState } from 'react';
import {
  Search,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  Trophy,
  Award,
  Inbox,
  Crown,
  Sparkles,
  BookOpen,
  Users,
  FileText,
  X,
} from 'lucide-react';
import { AI_TEACHER_AVATAR, ESSAY_BANNER_IMAGE } from '../../data/fenbiData';
import { ExamProfile, SubjectItem } from '../../types/app';

interface PracticeTabProps {
  examProfile: ExamProfile;
  subjects: SubjectItem[];
  onStartQuiz: (subjectId: string) => void;
  onChangeGoal: () => void;
  onOpenSearch: () => void;
  onOpenMoreGrid: () => void;
  onOpenFeature: (featureTitle: string) => void;
  onOpenAiTeacher: () => void;
}

const BANNERS = [
  {
    id: 1,
    title: '国考申论 一类模版文章',
    bullets: ['国考作文保二类争一类', '龙哥带你快速破局'],
    lecturer: '张小龙',
    badge: '1/8',
  },
  {
    id: 2,
    title: '第 16 季模考大赛 冲刺排位',
    bullets: ['万人同台智能估分', '考前精准查漏补缺'],
    lecturer: '粉笔教研',
    badge: '2/8',
  },
];

export const PracticeTab: React.FC<PracticeTabProps> = ({
  examProfile,
  subjects,
  onStartQuiz,
  onChangeGoal,
  onOpenSearch,
  onOpenMoreGrid,
  onOpenFeature,
  onOpenAiTeacher,
}) => {
  const [subTab, setSubTab] = useState<'行测' | '申论'>('行测');
  const [bannerIdx, setBannerIdx] = useState(0);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [showAiBubble, setShowAiBubble] = useState(true);

  const activeBanner = BANNERS[bannerIdx];

  return (
    <div className="relative flex-1 overflow-y-auto bg-gradient-to-b from-[#EDF3FC] via-[#F7F9FC] to-[#F7F9FC] pb-20 no-scrollbar">
      {/* Top sticky header */}
      <div className="sticky top-0 z-20 bg-[#EDF3FC]/95 backdrop-blur-md px-4 pt-2 pb-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onChangeGoal}
              className="flex items-center gap-1 min-w-0 cursor-pointer group"
            >
              <span className="text-[17px] font-bold text-slate-900 whitespace-nowrap">
                公考{examProfile.stage}
              </span>
              <span className="text-[12px] text-slate-500 truncate max-w-[82px]">
                {examProfile.region}·{subTab}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 shrink-0 group-hover:text-[#3A7AFE]" />
            </button>

            <div className="flex items-center gap-4 ml-2">
              {(['行测', '申论'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSubTab(t)}
                  className={`relative py-1 text-[15px] transition-colors cursor-pointer whitespace-nowrap ${
                    subTab === t ? 'font-bold text-slate-900' : 'font-medium text-slate-500'
                  }`}
                >
                  {t}
                  {subTab === t && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-4 h-[3px] rounded-full bg-[#3A7AFE]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-700 hover:text-[#3A7AFE] shadow-2xs cursor-pointer"
              aria-label="搜索"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenMoreGrid}
              className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-700 hover:text-[#3A7AFE] shadow-2xs cursor-pointer"
              aria-label="更多功能"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main White Card Container */}
      <div className="px-3.5 space-y-3">
        {/* Banner + 5 quick entries + 学习中心 */}
        <div className="bg-white rounded-2xl p-3 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          {/* Carousel Banner */}
          <div
            onClick={() => onOpenFeature(activeBanner.title)}
            className="relative h-[108px] rounded-xl overflow-hidden cursor-pointer select-none group"
          >
            <img
              src={ESSAY_BANNER_IMAGE}
              alt={activeBanner.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A6CF0]/85 via-[#2E82FF]/50 to-transparent" />
            <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
              <div className="max-w-[68%]">
                <div className="text-[16px] font-extrabold text-white drop-shadow-xs leading-tight">
                  {activeBanner.title}
                </div>
                <div className="mt-2 inline-flex flex-wrap items-center gap-2 bg-white/95 rounded-full px-2.5 py-1 text-[10px] text-slate-700 font-medium shadow-xs">
                  {activeBanner.bullets.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3A7AFE]" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBannerIdx((prev) => (prev + 1) % BANNERS.length);
                  }}
                  className="text-[10px] text-white/85 bg-black/25 px-2 py-0.5 rounded-full cursor-pointer"
                >
                  切换海报 →
                </button>
                <span className="text-[10px] text-white bg-black/35 px-2 py-0.5 rounded-full tabular-nums">
                  {activeBanner.badge}
                </span>
              </div>
            </div>
          </div>

          {/* 5 Quick Function Icons */}
          <div className="grid grid-cols-5 gap-1 pt-4 pb-3">
            {[
              { label: '模考大赛', icon: Trophy, tag: null },
              { label: '模考奖学金争霸', icon: Award, tag: null },
              { label: '免费资料', icon: Inbox, tag: null },
              { label: '会员中心', icon: Crown, tag: '冲刺' },
              { label: '精品服务', icon: Sparkles, tag: null },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onOpenFeature(item.label)}
                  className="relative flex flex-col items-center gap-1.5 py-1 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  {item.tag && (
                    <span className="absolute -top-0.5 right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                      {item.tag}
                    </span>
                  )}
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#2864EB] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-slate-700 font-medium text-center leading-tight line-clamp-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 学习中心 Strip */}
          <button
            type="button"
            onClick={() => onOpenFeature('学习中心')}
            className="w-full rounded-xl bg-[#F5F7FA] px-3 py-2.5 flex items-center justify-between text-left hover:bg-[#EEF2F8] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1 h-3.5 rounded-full bg-[#3A7AFE] shrink-0" />
              <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">学习中心</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[12px] text-slate-500 truncate border-l border-slate-200 pl-2">
                开启你的上岸之旅
              </span>
            </div>
          </button>
        </div>

        {/* 3 Learning Tools */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { title: '笔试系统班', sub: '系统学习层层递进', icon: BookOpen, color: 'bg-emerald-50 text-emerald-600' },
            { title: '模考争霸赛', sub: '最高赢99奖学金', icon: FileText, color: 'bg-blue-50 text-[#3A7AFE]' },
            { title: '组队打卡', sub: '一起刷题瓜分奖励', icon: Users, color: 'bg-amber-50 text-amber-600' },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.title}
                type="button"
                onClick={() => onOpenFeature(tool.title)}
                className="bg-white rounded-xl p-2.5 flex items-center gap-2 text-left shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:border-[#3A7AFE]/30 border border-transparent transition-all cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-slate-900 truncate">{tool.title}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{tool.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Subject List (行测 vs 申论) */}
        {subTab === '行测' ? (
          <div className="bg-white rounded-2xl divide-y divide-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
            {subjects.map((subject) => {
              const isOpen = expandedSubject === subject.id;
              return (
                <div key={subject.id} className="px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedSubject(isOpen ? null : subject.id)}
                      className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-[#2E6BF6] text-white flex items-center justify-center shrink-0">
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-bold text-slate-900">{subject.name}</div>
                        <div className="mt-1.5 flex items-center gap-2">
                          {/* Crescent/progress dots matching screenshot 08 */}
                          <div className="flex items-center gap-1">
                            {[0, 1, 2, 3, 4].map((dot) => {
                              const lit = subject.doneCount > dot * 3;
                              return (
                                <span
                                  key={dot}
                                  className={`w-3 h-2 rounded-full transition-colors ${
                                    lit ? 'bg-[#3A7AFE]' : 'bg-slate-200'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-[11.5px] text-slate-400 tabular-nums">
                            {subject.doneCount}/{subject.totalCount}
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartQuiz(subject.id)}
                      className="px-3 py-1.5 rounded-full bg-[#EEF4FF] hover:bg-[#3A7AFE] text-[#3A7AFE] hover:text-white text-[12px] font-medium flex items-center gap-0.5 transition-colors shrink-0 cursor-pointer"
                    >
                      <span>刷题</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-3 pl-8 grid grid-cols-2 gap-2">
                      {subject.subTopics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => onStartQuiz(subject.id)}
                          className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#EEF4FF] text-[12px] text-slate-700 hover:text-[#3A7AFE] transition-colors cursor-pointer"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 space-y-3 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">国省考申论 · 专项练习</h3>
              <span className="text-[12px] text-[#3A7AFE]">含AI智能批改</span>
            </div>
            {[
              { title: '归纳概括题 · 高频真题精选', count: '共 48 题 · 已练 3 题', tag: '基础必练' },
              { title: '提出对策与贯彻执行（公文写作）', count: '共 36 题 · 已练 1 题', tag: '高频提分' },
              { title: '申论大作文 · 一类文立意与结构精训', count: '共 24 篇 · AI 批改', tag: '冲刺模版' },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => onOpenFeature(item.title)}
                className="w-full p-3.5 rounded-xl bg-[#F7F9FC] hover:bg-[#EEF4FF] flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-[14px] font-semibold text-slate-900">{item.title}</div>
                  <div className="text-[12px] text-slate-400 mt-1">
                    {item.count} · {item.tag}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating AI Teacher Bubble matching Screenshot 08 */}
      {showAiBubble && (
        <div className="fixed lg:absolute bottom-20 right-4 z-20 flex items-center">
          <button
            type="button"
            onClick={onOpenAiTeacher}
            className="relative w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden bg-blue-100 cursor-pointer hover:scale-105 transition-transform"
            aria-label="咨询 AI 老师"
          >
            <img
              src={AI_TEACHER_AVATAR}
              alt="AI老师"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
          <button
            type="button"
            onClick={() => setShowAiBubble(false)}
            className="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-slate-500/80 text-white flex items-center justify-center cursor-pointer"
            aria-label="关闭悬浮球"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      )}
    </div>
  );
};
