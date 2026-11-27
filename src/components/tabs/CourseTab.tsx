import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  X,
  CheckCircle2,
  MapPin,
  Users,
} from 'lucide-react';
import {
  CHINA_PROVINCES,
  COURSE_TAG_ASSETS,
  COURSES,
  FEATURED_COURSE_COLLECTIONS,
  getCourseTeacherAvatars,
} from '../../data/fenbiData';
import { CourseItem, FeaturedCourseCollection } from '../../types/app';

interface CourseTabProps {
  initialCategory?: CourseItem['category'];
  onOpenSearch: () => void;
  onOpenFeature: (title: string) => void;
}

const CATEGORIES: CourseItem['category'][] = ['公考笔试', '事业单位', '就业学院', '公考面试'];

interface FeaturedCollectionCardProps {
  collection: FeaturedCourseCollection;
  enrolledIds: string[];
  onSelectCourse: (course: CourseItem) => void;
}

const FeaturedCollectionCard: React.FC<FeaturedCollectionCardProps> = ({
  collection,
  enrolledIds,
  onSelectCourse,
}) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const dragStateRef = useRef<{
    isDown: boolean;
    startX: number;
    startY: number;
    startScrollLeft: number;
    startSlideIdx: number;
    axisLocked: 'none' | 'x' | 'y';
    moved: boolean;
  }>({
    isDown: false,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startSlideIdx: 0,
    axisLocked: 'none',
    moved: false,
  });
  const suppressClickRef = useRef(false);

  const tagAsset = COURSE_TAG_ASSETS[collection.badgeTag];

  const cancelScrollAnimation = () => {
    if (animFrameRef.current !== null) {
      window.cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  useEffect(() => {
    return () => cancelScrollAnimation();
  }, []);

  const animateScrollTo = (targetIdx: number) => {
    const total = collection.slides.length;
    const clamped = ((targetIdx % total) + total) % total;
    setSlideIdx(clamped);

    const el = scrollerRef.current;
    if (!el) return;

    cancelScrollAnimation();
    const startLeft = el.scrollLeft;
    const endLeft = clamped * el.clientWidth;
    const distance = endLeft - startLeft;

    if (Math.abs(distance) < 0.5) {
      el.scrollLeft = endLeft;
      return;
    }

    const duration = 320;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic-out deceleration matching native iOS/mobile swipe feel
      const eased = 1 - Math.pow(1 - progress, 3);
      el.scrollLeft = startLeft + distance * eased;

      if (progress < 1) {
        animFrameRef.current = window.requestAnimationFrame(step);
      } else {
        el.scrollLeft = endLeft;
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = window.requestAnimationFrame(step);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    animateScrollTo(slideIdx + 1);
  };

  const beginDrag = (clientX: number, clientY: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    cancelScrollAnimation();
    dragStateRef.current = {
      isDown: true,
      startX: clientX,
      startY: clientY,
      startScrollLeft: el.scrollLeft,
      startSlideIdx: slideIdx,
      axisLocked: 'none',
      moved: false,
    };
    suppressClickRef.current = false;
  };

  const moveDrag = (clientX: number, clientY: number, isTouch: boolean) => {
    const el = scrollerRef.current;
    const drag = dragStateRef.current;
    if (!el || !drag.isDown) return;

    const dx = clientX - drag.startX;
    const dy = clientY - drag.startY;

    if (drag.axisLocked === 'none' && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      if (isTouch && Math.abs(dy) > Math.abs(dx)) {
        drag.axisLocked = 'y';
        return;
      }
      drag.axisLocked = 'x';
    }

    if (drag.axisLocked === 'y') return;

    if (Math.abs(dx) > 6) {
      drag.moved = true;
      suppressClickRef.current = true;
    }

    const maxScroll = Math.max(0, (collection.slides.length - 1) * el.clientWidth);
    const nextLeft = Math.max(0, Math.min(maxScroll, drag.startScrollLeft - dx));
    el.scrollLeft = nextLeft;
  };

  const finishDrag = (clientX: number) => {
    const el = scrollerRef.current;
    const drag = dragStateRef.current;
    if (!el || !drag.isDown) return;
    drag.isDown = false;

    if (drag.axisLocked === 'y') return;

    const dx = clientX - drag.startX;
    const originIdx = drag.startSlideIdx;
    const lastIdx = collection.slides.length - 1;

    if (drag.moved) {
      if (dx < -32 && originIdx < lastIdx) {
        animateScrollTo(originIdx + 1);
      } else if (dx > 32 && originIdx > 0) {
        animateScrollTo(originIdx - 1);
      } else {
        animateScrollTo(originIdx);
      }
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 60);
    }
  };

  return (
    <div className="rounded-[18px] bg-gradient-to-b from-[#FCE1BE] via-[#FFF4E6] to-white overflow-hidden">
      {/* Top Collection Header */}
      <div className="px-3.5 pt-3 pb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {tagAsset && (
            <img
              src={tagAsset.src}
              alt={collection.badgeTag}
              draggable={false}
              referrerPolicy="no-referrer"
              className="h-[21px] w-auto max-w-none object-contain shrink-0 select-none"
            />
          )}
          <h2 className="text-[15.5px] font-bold text-[#221A14] tracking-[-0.01em] truncate">
            {collection.headerTitle}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="切换合集课程"
          className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center shrink-0 text-[#E2692C] cursor-pointer active:scale-95 transition-transform"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Swipeable / Draggable Inner White Course Cards */}
      <div
        ref={scrollerRef}
        onMouseDown={(e) => beginDrag(e.clientX, e.clientY)}
        onMouseMove={(e) => moveDrag(e.clientX, e.clientY, false)}
        onMouseUp={(e) => finishDrag(e.clientX)}
        onMouseLeave={(e) => finishDrag(e.clientX)}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (touch) beginDrag(touch.clientX, touch.clientY);
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (touch) moveDrag(touch.clientX, touch.clientY, true);
        }}
        onTouchEnd={(e) => {
          const touch = e.changedTouches[0];
          if (touch) finishDrag(touch.clientX);
        }}
        className="flex overflow-x-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing"
      >
        {collection.slides.map((slide) => {
          const teacherAvatars = getCourseTeacherAvatars(slide.id, slide.teachers);
          const isEnrolled = enrolledIds.includes(slide.id);
          const numericPrice = slide.priceLabel.replace(/^¥\s*/, '');
          return (
            <div key={slide.id} className="w-full shrink-0 px-2.5">
              <div
                onClick={() => {
                  if (suppressClickRef.current) return;
                  onSelectCourse(slide);
                }}
                className="bg-white rounded-[14px] border border-[#F5A863]/35 px-3.5 pt-3.5 pb-3 cursor-pointer active:scale-[0.995] transition-transform"
              >
                <h3 className="text-[15px] font-bold text-[#1A1D24] leading-snug">
                  {slide.title}
                </h3>
                <p className="text-[12px] text-[#7B8392] mt-1 leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Highlight Chips */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {slide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#F1F6FF] text-[#4C78D4] px-2 py-0.5 rounded-[4px] text-[11px] font-medium whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Teacher Avatars aligned with Price + Floating Speech Bubble above Price */}
                <div className="mt-5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 shrink-0">
                    {teacherAvatars.map((avatarSrc, idx) => {
                      const teacherName = slide.teachers[idx] ?? '';
                      return (
                        <div
                          key={`${slide.id}-${teacherName}-${idx}`}
                          title={teacherName}
                          className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-[#EDF3FC] shrink-0"
                        >
                          <img
                            src={avatarSrc}
                            alt={teacherName}
                            draggable={false}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative text-right shrink-0">
                    {/* Right-aligned floating speech bubble above price */}
                    <div className="pointer-events-none absolute -top-[22px] right-0 flex flex-col items-end">
                      <span className="inline-flex items-center px-2 py-[3px] rounded-full bg-gradient-to-r from-[#FF9048] to-[#F5652A] text-white text-[10px] font-semibold leading-none whitespace-nowrap">
                        {slide.valueNote}
                      </span>
                      <svg
                        width="8"
                        height="4"
                        viewBox="0 0 8 4"
                        fill="none"
                        aria-hidden="true"
                        className="mr-2 -mt-[0.5px]"
                      >
                        <path d="M0 0L4 4L8 0H0Z" fill="#F87233" />
                      </svg>
                    </div>

                    <div className="text-[#F06433] tabular-nums whitespace-nowrap leading-none">
                      <span className="text-[12px] font-semibold mr-0.5">¥</span>
                      <span className="text-[20px] font-bold tracking-tight">{numericPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Hairline Divider + Trial Play & Sale Status */}
                <div className="mt-3 pt-2.5 border-t border-[#F1F3F6] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#3A7AFE] whitespace-nowrap">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                        className="shrink-0"
                      >
                        <rect x="1.5" y="1.5" width="17" height="17" rx="4.2" fill="#3A7AFE" />
                        <path
                          d="M8.35 6.85C7.92 6.6 7.4 6.91 7.4 7.4V12.6C7.4 13.09 7.92 13.4 8.35 13.15L12.85 10.55C13.28 10.3 13.28 9.7 12.85 9.45L8.35 6.85Z"
                          fill="#FFFFFF"
                        />
                      </svg>
                      <span>支持试听</span>
                    </span>
                    {isEnrolled && (
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded whitespace-nowrap">
                        已报名
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[12px] text-[#8E95A2] whitespace-nowrap">
                    {slide.statusText.includes('火热') && (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        className="shrink-0"
                      >
                        <path
                          d="M8.55 1.4C8.92 3.45 7.45 4.78 6.52 5.72C5.6 6.65 5.15 7.52 5.22 8.7C4.55 8.15 4.28 7.28 4.42 6.32C3.15 7.42 2.4 8.95 2.4 10.45C2.4 13.3 4.78 15.1 7.95 15.1C11.22 15.1 13.6 12.92 13.6 9.85C13.6 6.45 11.45 3.15 8.55 1.4Z"
                          fill="#FF6A2B"
                        />
                        <path
                          d="M8.2 8.35C8.38 9.48 7.42 10.18 7.05 10.95C6.72 11.65 7.12 12.85 8.22 12.85C9.48 12.85 10.32 11.88 10.32 10.55C10.32 9.42 9.45 8.75 8.2 8.35Z"
                          fill="#FFD699"
                        />
                      </svg>
                    )}
                    <span>{slide.statusText}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Slide Pagination Dots */}
      <div className="py-2.5 flex items-center justify-center gap-1.5">
        {collection.slides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`切换到第 ${idx + 1} 门精选课程`}
            onClick={(e) => {
              e.stopPropagation();
              animateScrollTo(idx);
            }}
            className={`h-[4.5px] rounded-full transition-all duration-200 cursor-pointer ${
              idx === slideIdx ? 'w-[14px] bg-[#F0682A]' : 'w-[5px] bg-[#E8CBB8]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export const CourseTab: React.FC<CourseTabProps> = ({
  initialCategory = '公考笔试',
  onOpenSearch,
  onOpenFeature,
}) => {
  const [region, setRegion] = useState('北京');
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

  const matchingCollections = FEATURED_COURSE_COLLECTIONS.filter((col) => {
    const matchCat = col.category === category;
    const matchChip =
      filterChip === '全部' ||
      col.badgeTag.includes(filterChip) ||
      col.headerTitle.includes(filterChip) ||
      col.slides.some(
        (s) => s.title.includes(filterChip) || s.tags.some((t) => t.includes(filterChip))
      );
    return matchCat && matchChip;
  });

  const topCollections = matchingCollections.filter((col) => col.insertIndex === 0);
  const trailingCollections = matchingCollections.filter(
    (col) => col.insertIndex > filteredCourses.length
  );

  return (
    <div className="relative flex-1 min-h-0 flex flex-col bg-[#F4F6FA] overflow-hidden">
      {/* Top Bar (stays above top dropdown drawer, matching PracticeTab header) */}
      <div className="relative z-50 shrink-0 bg-white px-4 pt-2.5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[20px] font-bold text-slate-900">课程</h1>
          <button
            type="button"
            onClick={() => setShowRegionModal((prev) => !prev)}
            aria-expanded={showRegionModal}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12.5px] font-medium transition-colors cursor-pointer ${
              showRegionModal
                ? 'bg-[#EEF4FF] text-[#3A7AFE]'
                : 'bg-slate-100 hover:bg-[#EEF4FF] text-slate-700 hover:text-[#3A7AFE]'
            }`}
          >
            <span>{region}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                showRegionModal ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowRegionModal(false);
              onOpenSearch();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
            aria-label="搜索课程"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setShowRegionModal(false);
              onOpenFeature('课程表与开课日历');
            }}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
            aria-label="课程日历"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category tabs & Filter Chips */}
      <div className="relative z-10 shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-100">
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
            onClick={() => setShowRegionModal((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[12px] text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>筛选</span>
          </button>
        </div>
      </div>

      {/* Course Cards */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 pb-24 no-scrollbar">
        {/* First Featured Collection Card (首屏第一张) */}
        {topCollections.map((collection) => (
          <FeaturedCollectionCard
            key={collection.id}
            collection={collection}
            enrolledIds={enrolledIds}
            onSelectCourse={setSelectedCourse}
          />
        ))}

        {filteredCourses.map((course, courseIdx) => {
          const isEnrolled = enrolledIds.includes(course.id);
          const tagAsset = course.badgeTag ? COURSE_TAG_ASSETS[course.badgeTag] : undefined;
          const teacherAvatars = getCourseTeacherAvatars(course.id, course.teachers);
          const inlineCollections = matchingCollections.filter(
            (col) => col.insertIndex === courseIdx + 1
          );
          return (
            <React.Fragment key={course.id}>
              <div
                onClick={() => setSelectedCourse(course)}
                className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-[0_6px_18px_rgba(58,122,254,0.08)] border border-transparent hover:border-[#3A7AFE]/25 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-[15.5px] font-bold text-slate-900 leading-[1.45]">
                    {tagAsset && (
                      <img
                        src={tagAsset.src}
                        alt={course.badgeTag}
                        draggable={false}
                        referrerPolicy="no-referrer"
                        className="inline-block h-[20px] w-auto max-w-none object-contain align-[-4px] mr-1.5 select-none"
                      />
                    )}
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
                <div className="mt-4 pt-2.5 border-t border-slate-50 flex items-end justify-between gap-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex items-center -space-x-1.5 shrink-0">
                      {teacherAvatars.map((avatarSrc, idx) => {
                        const teacherName = course.teachers[idx] ?? '';
                        return (
                          <div
                            key={`${course.id}-${teacherName}-${idx}`}
                            title={teacherName}
                            className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shrink-0"
                          >
                            <img
                              src={avatarSrc}
                              alt={teacherName}
                              draggable={false}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <span className="pl-2.5 text-[11.5px] text-slate-400 truncate">
                      {course.teachers.join(' · ')}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[17px] font-bold text-[#EA580C] tabular-nums whitespace-nowrap">
                      {course.priceLabel}
                    </div>
                    <div className="text-[11px] text-slate-400 tabular-nums whitespace-nowrap">
                      {course.buyersText}
                    </div>
                  </div>
                </div>
              </div>

              {inlineCollections.map((collection) => (
                <FeaturedCollectionCard
                  key={collection.id}
                  collection={collection}
                  enrolledIds={enrolledIds}
                  onSelectCourse={setSelectedCourse}
                />
              ))}
            </React.Fragment>
          );
        })}

        {trailingCollections.map((collection) => (
          <FeaturedCollectionCard
            key={collection.id}
            collection={collection}
            enrolledIds={enrolledIds}
            onSelectCourse={setSelectedCourse}
          />
        ))}

        {filteredCourses.length === 0 && matchingCollections.length === 0 && (
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

      {/* Region Selector Top Dropdown Drawer (matching PracticeMoreDrawer pattern) */}
      <div
        aria-hidden={!showRegionModal}
        onClick={() => setShowRegionModal(false)}
        className={`absolute inset-0 z-40 flex items-start transition-colors duration-300 ${
          showRegionModal ? 'bg-black/48 pointer-events-auto' : 'bg-black/0 pointer-events-none'
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full bg-white rounded-b-[20px] pt-[58px] pb-6 px-4 shadow-[0_12px_32px_rgba(15,23,42,0.14)] transition-all duration-320 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showRegionModal
              ? 'translate-y-0 opacity-100'
              : '-translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-[#3A7AFE]" />
              <span>切换课程考区</span>
            </div>
            <span className="text-[11.5px] text-slate-400">当前：{region}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-[340px] overflow-y-auto no-scrollbar pb-1">
            {['全国', ...CHINA_PROVINCES].map((r) => (
              <button
                key={r}
                type="button"
                tabIndex={showRegionModal ? 0 : -1}
                onClick={() => {
                  setRegion(r);
                  setShowRegionModal(false);
                }}
                className={`py-2 px-1.5 rounded-xl text-[12.5px] transition-colors cursor-pointer whitespace-nowrap ${
                  region === r
                    ? 'bg-[#EEF4FF] text-[#3A7AFE] font-semibold ring-1 ring-[#3A7AFE]/25'
                    : 'bg-[#F6F8FB] text-[#4E5969] font-normal hover:bg-[#EEF4FF] hover:text-[#3A7AFE]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Detail Drawer */}
      {selectedCourse && (
        <div className="absolute inset-0 bg-black/50 z-[60] flex items-end">
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
