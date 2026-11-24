import React, { useState } from 'react';
import {
  Search,
  UserRound,
  Clock,
  CalendarDays,
  TrendingUp,
  GraduationCap,
  BarChart3,
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  SlidersHorizontal,
  X,
  Check,
  Target,
  FileCheck2,
} from 'lucide-react';
import { JOB_ANNOUNCEMENTS, JOB_EXAM_TYPES, REGIONS } from '../../data/fenbiData';
import { JobAnnouncement, JobPreferences } from '../../types/app';

interface JobMatchTabProps {
  preferences: JobPreferences;
  onUpdatePreferences: (patch: Partial<JobPreferences>) => void;
  onOpenFeature: (title: string) => void;
}

export const JobMatchTab: React.FC<JobMatchTabProps> = ({
  preferences,
  onUpdatePreferences,
  onOpenFeature,
}) => {
  const [subTab, setSubTab] = useState<'公告' | '职位'>('公告');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBianzhi, setOnlyBianzhi] = useState(false);
  const [regionFilter, setRegionFilter] = useState('全部地区');

  // Modals matching screenshots 15, 16, 17
  const [showExamTypeModal, setShowExamTypeModal] = useState(false); // 15
  const [showProfileEdit, setShowProfileEdit] = useState(false); // 16
  const [showExamPicker, setShowExamPicker] = useState(false); // 17
  const [showRegionSheet, setShowRegionSheet] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<JobAnnouncement | null>(null);

  // Temp state inside Screenshot 15/17 modal
  const [draftTypes, setDraftTypes] = useState<string[]>(preferences.examTypes);

  const filteredAnnouncements = JOB_ANNOUNCEMENTS.filter((item) => {
    const matchText =
      !searchQuery.trim() ||
      item.title.includes(searchQuery.trim()) ||
      item.region.includes(searchQuery.trim()) ||
      item.examType.includes(searchQuery.trim());
    const matchBianzhi = !onlyBianzhi || item.hasBianzhi;
    const matchRegion = regionFilter === '全部地区' || item.region === regionFilter;
    const matchExam =
      preferences.examTypes.length === 0 ||
      preferences.examTypes.includes('全部') ||
      preferences.examTypes.includes(item.examType);
    return matchText && matchBianzhi && matchRegion && matchExam;
  });

  const allPositions = filteredAnnouncements.flatMap((a) =>
    a.positions.map((p) => ({ ...p, announcement: a }))
  );

  return (
    <div className="relative flex-1 overflow-y-auto bg-gradient-to-b from-[#EDF4FF] via-[#F7F9FC] to-[#F7F9FC] pb-20 no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#EDF4FF]/95 backdrop-blur-md px-4 pt-2.5 pb-2">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[19px] font-extrabold text-[#1E4FBD] whitespace-nowrap tracking-tight">
            选岗助手
          </h1>
          <div className="flex-1 h-8 rounded-full bg-white border border-slate-200/80 px-3 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索公告/岗位"
              className="w-full text-[12.5px] text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowProfileEdit(true)}
            className="w-8 h-8 rounded-full bg-white border border-slate-200/70 flex items-center justify-center text-slate-700 shrink-0 cursor-pointer"
            aria-label="完善信息"
          >
            <UserRound className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-3.5 space-y-3">
        {/* Top 5 Entries */}
        <div className="grid grid-cols-5 gap-1 py-2">
          {[
            { label: '历年大考', icon: Clock, badge: null, bg: 'bg-emerald-50 text-emerald-500' },
            { label: '国省考汇总', icon: CalendarDays, badge: '27', bg: 'bg-orange-50 text-orange-500' },
            { label: '职位捡漏榜', icon: TrendingUp, badge: '27国考', bg: 'bg-blue-50 text-[#3A7AFE]' },
            { label: '选岗教程', icon: GraduationCap, badge: '新', bg: 'bg-indigo-50 text-indigo-500' },
            { label: '报名大数据', icon: BarChart3, badge: null, bg: 'bg-sky-50 text-sky-500' },
          ].map((entry) => {
            const Icon = entry.icon;
            return (
              <button
                key={entry.label}
                type="button"
                onClick={() => onOpenFeature(entry.label)}
                className="relative flex flex-col items-center gap-1.5 py-1 cursor-pointer"
              >
                {entry.badge && (
                  <span className="absolute -top-0.5 right-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                    {entry.badge}
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs ${entry.bg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-700 text-center line-clamp-1">
                  {entry.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bento Feature Cards (Screenshot 10) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Left big blue card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#2B76FF] to-[#5EA6FF] p-3.5 text-white flex flex-col justify-between min-h-[176px] shadow-sm">
            <span className="absolute -top-1.5 left-2 px-1.5 py-0.5 rounded bg-amber-300 text-amber-950 text-[10px] font-bold">
              新
            </span>
            <div className="pt-1">
              <div className="text-[15.5px] font-bold leading-snug">27北京市考公告发布</div>
              <button
                type="button"
                onClick={() => {
                  setDraftTypes(preferences.examTypes);
                  setShowExamTypeModal(true);
                }}
                className="text-[11.5px] text-white/90 mt-1 hover:underline cursor-pointer"
              >
                点击免费选岗 →
              </button>
            </div>

            <div className="my-2 flex justify-center">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => onOpenFeature('学到考前选岗冲刺')}
                className="bg-white/95 text-slate-800 rounded-xl py-2 px-1.5 flex flex-col items-center gap-0.5 text-[11px] font-semibold cursor-pointer"
              >
                <Target className="w-4 h-4 text-[#3A7AFE]" />
                <span>学到考前</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(JOB_ANNOUNCEMENTS[2])}
                className="bg-white/95 text-slate-800 rounded-xl py-2 px-1.5 flex flex-col items-center gap-0.5 text-[11px] font-semibold cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-[#3A7AFE]" />
                <span>公告详情</span>
              </button>
            </div>
          </div>

          {/* Right stacked cards */}
          <div className="flex flex-col gap-2.5">
            <div className="relative flex-1 rounded-2xl bg-gradient-to-br from-[#C4DCFF] to-[#E9F2FF] p-3 flex flex-col justify-between">
              <span className="absolute -top-1.5 left-2 px-1.5 py-0.5 rounded bg-amber-300 text-amber-950 text-[10px] font-bold">
                新
              </span>
              <div>
                <div className="text-[14.5px] font-bold text-slate-900">国省考备考潜力</div>
                <div className="text-[11.5px] text-slate-600 mt-0.5">来看你的预测分！</div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileEdit(true)}
                className="mt-2 self-start inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[11.5px] font-semibold text-slate-800 shadow-2xs cursor-pointer"
              >
                <span>立即查看</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#C5F1F3] to-[#E6FBFB] p-3 flex flex-col justify-between">
              <div>
                <div className="text-[14.5px] font-bold text-slate-900">26选调生汇总</div>
                <div className="text-[11.5px] text-slate-600 mt-0.5 tabular-nums">招录174478人</div>
              </div>
              <button
                type="button"
                onClick={() => onOpenFeature('26选调生招录合集')}
                className="mt-2 self-start inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[11.5px] font-semibold text-slate-800 shadow-2xs cursor-pointer"
              >
                <span>合集详情</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 公告 / 职位 Tabs + 选岗偏好 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-5">
            {(['公告', '职位'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSubTab(t)}
                className={`relative pb-1.5 text-[16px] cursor-pointer transition-colors ${
                  subTab === t ? 'font-bold text-slate-900' : 'font-medium text-slate-400'
                }`}
              >
                {t}
                {subTab === t && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-5 h-[3px] rounded-full bg-[#3A7AFE]" />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setDraftTypes(preferences.examTypes);
              setShowExamTypeModal(true);
            }}
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-slate-600 hover:text-[#3A7AFE] cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>选岗偏好</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-t-2xl px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100">
          <button
            type="button"
            onClick={() => setOnlyBianzhi(!onlyBianzhi)}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-700 cursor-pointer"
          >
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                onlyBianzhi ? 'bg-[#3A7AFE] border-[#3A7AFE] text-white' : 'border-slate-300'
              }`}
            >
              {onlyBianzhi && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span>有编制</span>
          </button>

          <div className="flex items-center gap-3 text-[12.5px] text-slate-600">
            <button
              type="button"
              onClick={() => setShowRegionSheet(true)}
              className="inline-flex items-center gap-0.5 hover:text-[#3A7AFE] cursor-pointer"
            >
              <span>{regionFilter === '全部地区' ? '地区' : regionFilter}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftTypes(preferences.examTypes);
                setShowExamPicker(true);
              }}
              className="inline-flex items-center gap-0.5 hover:text-[#3A7AFE] cursor-pointer"
            >
              <span>考试</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowProfileEdit(true)}
              className="inline-flex items-center gap-0.5 hover:text-[#3A7AFE] cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>筛选</span>
            </button>
          </div>
        </div>

        {/* Floating Match Pill */}
        <div className="flex justify-center -mt-1">
          <button
            type="button"
            onClick={() => setShowProfileEdit(true)}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#3A7AFE] to-[#2F6BFF] text-white text-[12px] font-medium shadow-md shadow-[#3A7AFE]/20 cursor-pointer tabular-nums"
          >
            适合我的：当前筛选条件下共 {subTab === '公告' ? filteredAnnouncements.length : allPositions.length} 条
          </button>
        </div>

        {/* List Content */}
        {subTab === '公告' ? (
          <div className="space-y-2.5">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAnnouncement(item)}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:border-[#3A7AFE]/30 border border-transparent cursor-pointer transition-all"
              >
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug">{item.title}</h3>
                <div className="mt-2 flex items-center gap-2.5 text-[12.5px]">
                  <span
                    className={`font-medium ${
                      item.status === '正在报名' ? 'text-emerald-600' : 'text-[#3A7AFE]'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-slate-600 tabular-nums">
                    共招 <strong className="text-slate-900">{item.recruitCount}</strong> 人
                    {item.positionCount ? ` ${item.positionCount} 职位` : ''}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11.5px] text-slate-400">
                  <span>
                    {item.region} · {item.category}
                  </span>
                  <span className="tabular-nums">{item.publishDate}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {allPositions.map((pos) => (
              <div
                key={pos.id}
                onClick={() => setSelectedAnnouncement(pos.announcement)}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[14.5px] font-bold text-slate-900">{pos.role}</h3>
                    <p className="text-[12px] text-slate-500 mt-0.5">{pos.dept}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-[#3A7AFE] bg-[#EEF4FF] px-2 py-0.5 rounded tabular-nums shrink-0">
                    招 {pos.quota} 人
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11.5px] text-slate-400">
                  <span>
                    {pos.education} · {pos.major}
                  </span>
                  <span className="tabular-nums">已报 {pos.applicants} 人</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Screenshot 15 & 17: 请选择你的考试类型 弹窗 */}
      {(showExamTypeModal || showExamPicker) && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-end">
          <div className="w-full bg-white rounded-t-3xl overflow-hidden max-h-[88%] flex flex-col animate-slide-up">
            <div className="bg-gradient-to-r from-[#DCEBFF] via-[#EEF4FF] to-[#D7E6FF] px-4 py-3.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowExamTypeModal(false);
                  setShowExamPicker(false);
                }}
                className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-700 shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="text-[16px] font-bold text-slate-900">请选择你的考试类型</h3>
              <span className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <div className="text-[13px] font-bold text-slate-900 mb-2">为你推荐</div>
                <button
                  type="button"
                  onClick={() => setDraftTypes(['公务员'])}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer border ${
                    draftTypes.includes('公务员')
                      ? 'bg-[#EEF4FF] text-[#3A7AFE] border-[#3A7AFE]'
                      : 'bg-slate-100 text-slate-700 border-transparent'
                  }`}
                >
                  公务员
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2.5">
                {JOB_EXAM_TYPES.map((t) => {
                  const active = draftTypes.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        if (t === '全部') {
                          setDraftTypes(['全部']);
                        } else {
                          setDraftTypes((prev) => {
                            const cleaned = prev.filter((x) => x !== '全部');
                            return cleaned.includes(t)
                              ? cleaned.filter((x) => x !== t)
                              : [...cleaned, t];
                          });
                        }
                      }}
                      className={`min-h-[40px] px-2 py-1.5 rounded-xl text-[12px] font-medium flex items-center justify-center text-center transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#EEF4FF] text-[#3A7AFE] border border-[#3A7AFE]'
                          : 'bg-[#F4F6FA] text-slate-700 border border-transparent'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                type="button"
                disabled={draftTypes.length === 0}
                onClick={() => {
                  onUpdatePreferences({ examTypes: draftTypes });
                  const wasFlow15 = showExamTypeModal;
                  setShowExamTypeModal(false);
                  setShowExamPicker(false);
                  if (wasFlow15) {
                    setShowProfileEdit(true);
                  }
                }}
                className={`w-full h-11 rounded-full text-[15px] font-semibold transition-colors cursor-pointer ${
                  draftTypes.length > 0
                    ? 'bg-[#3A7AFE] text-white shadow-md shadow-[#3A7AFE]/25'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot 16: 完善信息·精准推荐 */}
      {showProfileEdit && (
        <div className="absolute inset-0 bg-[#F4F6FA] z-30 flex flex-col animate-slide-up">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
            <button
              type="button"
              onClick={() => setShowProfileEdit(false)}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-[16px] font-bold text-slate-900">完善信息 · 精准推荐</h3>
            <span className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="bg-[#EEF4FF] rounded-2xl p-3.5 text-[12.5px] text-[#2663EB]">
              完善个人学历、专业与报考意向后，选岗助手将自动匹配符合条件的职位并过滤不可报岗位。
            </div>

            <div className="bg-white rounded-2xl p-4 space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                  意向报考地区
                </label>
                <select
                  value={preferences.region}
                  onChange={(e) => onUpdatePreferences({ region: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] text-slate-800 outline-none"
                >
                  {['全国', ...REGIONS].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                  考试类型
                </label>
                <div className="flex flex-wrap gap-2">
                  {['公务员', '事业单位', '选调', '三支一扶', '招警'].map((t) => {
                    const active = preferences.examTypes.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          onUpdatePreferences({
                            examTypes: active
                              ? preferences.examTypes.filter((x) => x !== t)
                              : [...preferences.examTypes.filter((x) => x !== '全部'), t],
                          })
                        }
                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium cursor-pointer ${
                          active ? 'bg-[#3A7AFE] text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                  最高学历
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['大专', '本科', '硕士', '博士'].map((edu) => (
                    <button
                      key={edu}
                      type="button"
                      onClick={() => onUpdatePreferences({ education: edu })}
                      className={`py-2 rounded-xl text-[12.5px] font-medium cursor-pointer ${
                        preferences.education === edu
                          ? 'bg-[#EEF4FF] text-[#3A7AFE] border border-[#3A7AFE]'
                          : 'bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      {edu}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                  所学专业
                </label>
                <input
                  type="text"
                  value={preferences.major}
                  onChange={(e) => onUpdatePreferences({ major: e.target.value })}
                  placeholder="例如：计算机科学与技术 / 法学 / 汉语言文学"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] text-slate-800 outline-none focus:border-[#3A7AFE]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                  政治面貌与身份
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={preferences.politicalStatus}
                    onChange={(e) => onUpdatePreferences({ politicalStatus: e.target.value })}
                    className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-800 outline-none"
                  >
                    <option value="中共党员">中共党员</option>
                    <option value="共青团员">共青团员</option>
                    <option value="群众">群众</option>
                  </select>
                  <select
                    value={preferences.graduateStatus}
                    onChange={(e) => onUpdatePreferences({ graduateStatus: e.target.value })}
                    className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-800 outline-none"
                  >
                    <option value="2027应届生">2027应届生</option>
                    <option value="往届生">往届生</option>
                    <option value="基层工作满两年">基层工作满两年</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setRegionFilter(
                  preferences.region === '全国' || preferences.region === '国考'
                    ? '全部地区'
                    : preferences.region
                );
                setShowProfileEdit(false);
              }}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#4285FF] to-[#2F6BFF] text-white text-[15px] font-semibold shadow-md shadow-[#3A7AFE]/25 cursor-pointer"
            >
              保存并精准匹配职位
            </button>
          </div>
        </div>
      )}

      {/* Region Sheet */}
      {showRegionSheet && (
        <div className="absolute inset-0 bg-black/45 z-30 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 max-h-[65%] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[15px] font-bold text-slate-900">选择公告地区</span>
              <button
                type="button"
                onClick={() => setShowRegionSheet(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-3 grid grid-cols-3 gap-2 overflow-y-auto">
              {['全部地区', '北京', '江苏', '安徽', '新疆', '浙江', '广东', '山东'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRegionFilter(r);
                    setShowRegionSheet(false);
                  }}
                  className={`py-2 rounded-xl text-[12.5px] font-medium cursor-pointer ${
                    regionFilter === r ? 'bg-[#3A7AFE] text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Announcement / Position Detail Sheet */}
      {selectedAnnouncement && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[85%] flex flex-col animate-slide-up">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11.5px] font-medium text-[#3A7AFE]">
                  {selectedAnnouncement.region} · {selectedAnnouncement.examType}
                </span>
                <h3 className="text-[15.5px] font-bold text-slate-900 mt-0.5 leading-snug">
                  {selectedAnnouncement.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              <div className="bg-slate-50 rounded-xl p-3 text-[12.5px] text-slate-600 leading-relaxed">
                <p>{selectedAnnouncement.summary}</p>
                <div className="mt-2 pt-2 border-t border-slate-200/70 flex justify-between text-[11.5px] text-slate-500 tabular-nums">
                  <span>报名截止：{selectedAnnouncement.deadline}</span>
                  <span>共招 {selectedAnnouncement.recruitCount} 人</span>
                </div>
              </div>

              <div className="text-[13.5px] font-bold text-slate-900">
                下属招录职位（{selectedAnnouncement.positions.length}）
              </div>
              {selectedAnnouncement.positions.map((pos) => (
                <div
                  key={pos.id}
                  className="p-3 rounded-xl border border-slate-100 bg-white space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-slate-900">{pos.role}</span>
                    <span className="text-[12px] font-semibold text-[#3A7AFE] tabular-nums">
                      招 {pos.quota} 人
                    </span>
                  </div>
                  <div className="text-[12px] text-slate-500">{pos.dept}</div>
                  <div className="text-[11.5px] text-slate-400 flex items-center justify-between">
                    <span>
                      {pos.education} · {pos.major}
                    </span>
                    <span className="tabular-nums">竞争比 {Math.round(pos.applicants / pos.quota)}:1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
