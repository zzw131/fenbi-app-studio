import React, { useState } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  SlidersHorizontal,
  X,
  CheckCircle2,
  MapPin,
  Users,
} from 'lucide-react';
import { COURSES, REGIONS } from '../../data/fenbiData';
import { CourseItem } from '../../types/app';
import { FenbiMascotAvatar } from '../FenbiIcons';

interface CourseTabProps {
  initialCategory?: CourseItem['category'];
  onOpenSearch: () => void;
  onOpenFeature: (title: string) => void;
}

const CATEGORIES: CourseItem['category'][] = ['公考笔试', '事业单位', '就业学院', '公考面试'];

export const CourseTab: React.FC<CourseTabProps> = ({
  initialCategory = '公考笔试',
  onOpenSearch,
  onOpenFeature,
}) => {
  const [region, setRegion] = useState('安徽');
  const [category, setCategory] = useState<CourseItem['category']>(initialCategory);
  const [filterChip, setFilterChip] = useState<'全部' | '系统班' | '名师专项课'>('全部');
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  const filteredCourses = COURSES.filter((c) => {
    const matchCat = c.category === category;
    const matchChip =
      filterChip === '全部' ||
      c.title.includes(filterChip) ||
      c.tags.some((t) => t.includes(filterChip));
    return matchCat && matchChip;
  });

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#F4F6FA] pb-20 no-scrollbar">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 pt-2.5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[20px] font-bold text-slate-900">课程</h1>
            <button
              type="button"
              onClick={() => setShowRegionModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#EEF4FF] text-[12.5px] font-medium text-slate-700 hover:text-[#3A7AFE] transition-colors cursor-pointer"
            >
              <span>{region}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
              aria-label="搜索课程"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onOpenFeature('课程表与开课日历')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
              aria-label="课程日历"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-4 flex items-center gap-5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`relative py-2.5 text-[14.5px] whitespace-nowrap cursor-pointer transition-colors ${
                category === cat ? 'font-bold text-slate-900' : 'font-medium text-slate-500'
              }`}
            >
              {cat}
              {category === cat && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-5 h-[3px] rounded-full bg-[#3A7AFE]" />
              )}
            </button>
          ))}
        </div>

        {/* Filter Chips */}
        <div className="px-4 py-2 bg-[#F8FAFC] flex items-center justify-between gap-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {(['全部', '系统班', '名师专项课'] as const).map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setFilterChip(chip)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
                  filterChip === chip
                    ? 'bg-[#EEF4FF] text-[#3A7AFE]'
                    : 'bg-white text-slate-600 border border-slate-200/80'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowRegionModal(true)}
            className="inline-flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>筛选</span>
          </button>
        </div>
      </div>

      {/* Course Cards */}
      <div className="p-3.5 space-y-3">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.id);
          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-[0_6px_18px_rgba(58,122,254,0.08)] border border-transparent hover:border-[#3A7AFE]/25 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-[15.5px] font-bold text-slate-900 leading-snug">
                  {course.title}
                </h2>
                {isEnrolled && (
                  <span className="shrink-0 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    已报名
                  </span>
                )}
              </div>

              <p className="text-[12.5px] text-slate-500 mt-1.5 leading-relaxed">
                {course.subtitle}
              </p>

              {/* Tags */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      tag.includes('优惠')
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom Teachers + Price */}
              <div className="mt-4 pt-2.5 border-t border-slate-50 flex items-end justify-between">
                <div className="flex items-center -space-x-1.5">
                  {course.teachers.slice(0, 3).map((t) => (
                    <div
                      key={t}
                      title={t}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-blue-50"
                    >
                      <FenbiMascotAvatar className="w-full h-full" />
                    </div>
                  ))}
                  <span className="pl-3 text-[11.5px] text-slate-400">
                    {course.teachers.join(' · ')}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[17px] font-bold text-[#EA580C] tabular-nums">
                    {course.priceLabel}
                  </div>
                  <div className="text-[11px] text-slate-400 tabular-nums">{course.buyersText}</div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-[14px] text-slate-500">当前筛选条件下暂无匹配课程</p>
            <button
              type="button"
              onClick={() => setFilterChip('全部')}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#EEF4FF] text-[#3A7AFE] text-[12.5px] font-medium cursor-pointer"
            >
              查看全部{category}课程
            </button>
          </div>
        )}
      </div>

      {/* Region Selector Modal (matching Screenshot 09 popover) */}
      {showRegionModal && (
        <div className="absolute inset-0 bg-black/45 z-30 flex items-center justify-center px-5">
          <div className="w-full max-w-[320px] bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-scale">
            <div className="bg-gradient-to-br from-[#3A7AFE] to-[#639BFF] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[14px] font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>切换课程考区</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRegionModal(false)}
                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[12px] text-white/85 mt-1">点击定位进行切换，筛选对应地区课程</p>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto">
              {['全国', ...REGIONS.slice(1, 20)].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRegion(r);
                    setShowRegionModal(false);
                  }}
                  className={`py-2 px-2 rounded-xl text-[12.5px] font-medium transition-colors cursor-pointer ${
                    region === r
                      ? 'bg-[#3A7AFE] text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-[#EEF4FF]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Drawer */}
      {selectedCourse && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[85%] flex flex-col animate-slide-up">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="text-[11.5px] text-[#3A7AFE] font-medium">
                  {selectedCourse.category} · {region}考区
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mt-1 leading-snug">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              <div className="flex items-center justify-between bg-[#FFF7ED] rounded-xl px-3.5 py-2.5">
                <div>
                  <span className="text-[19px] font-bold text-[#EA580C] tabular-nums">
                    {selectedCourse.priceLabel}
                  </span>
                  <span className="ml-2 text-[11.5px] text-slate-500">
                    {selectedCourse.dateRange}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11.5px] text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>{selectedCourse.buyersText}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[13.5px] font-bold text-slate-900 mb-2">课程大纲</h4>
                <div className="space-y-2">
                  {selectedCourse.syllabus.map((line) => (
                    <div
                      key={line}
                      className="px-3 py-2.5 rounded-xl bg-slate-50 text-[12.5px] text-slate-700"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              {enrolledIds.includes(selectedCourse.id) ? (
                <div className="w-full h-11 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[14px] flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>已加入课程日历，可前往「我」查看</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEnrolledIds((prev) => [...prev, selectedCourse.id])}
                  className="w-full h-11 rounded-full bg-gradient-to-r from-[#4285FF] to-[#2F6BFF] text-white font-semibold text-[14.5px] shadow-md shadow-[#3A7AFE]/25 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  立即报名（演示体验）
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
