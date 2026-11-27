import React, { useRef, useState } from 'react';
import { INITIAL_SUBJECTS } from './data/fenbiData';
import {
  ActiveModal,
  AppView,
  ExamProfile,
  MainTabId,
  SubjectItem,
  UserState,
} from './types/app';
import { BottomTabIcon, StatusBar } from './components/FenbiIcons';
import { OnboardingFlow } from './components/OnboardingFlow';
import { PracticeTab } from './components/tabs/PracticeTab';
import { CourseTab } from './components/tabs/CourseTab';
import { DiscoverTab } from './components/tabs/DiscoverTab';
import { MeTab } from './components/tabs/MeTab';
import { QuizFlow } from './components/QuizFlow';
import { GlobalModals, PracticeMoreDrawer } from './components/GlobalModals';
import { PracticeGuideOverlay } from './components/PracticeGuideOverlay';
import { StructureExplorer } from './components/StructureExplorer';

const MAIN_TABS: { id: MainTabId; label: string; badge?: string }[] = [
  { id: 'practice', label: '练习' },
  { id: 'course', label: '课程' },
  { id: 'discover', label: '发现' },
  { id: 'me', label: '我', badge: '有课' },
];

export function App() {
  const [view, setView] = useState<AppView>({ kind: 'onboarding', screen: 'agreement' });
  const [examProfile, setExamProfile] = useState<ExamProfile>({
    examName: '公务员',
    stage: '笔试',
    region: '国考',
    categoryType: '行政执法类',
  });

  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    nickname: '粉笔同学',
    coins: 120,
    checkedInToday: false,
    claimedGifts: [],
    isMember: false,
  });

  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [featureTitle, setFeatureTitle] = useState('');
  const [showPracticeGuide, setShowPracticeGuide] = useState(true);
  const phoneFrameRef = useRef<HTMLElement>(null);

  const handleOpenFeature = (title: string) => {
    setFeatureTitle(title);
    setActiveModal('feature_preview');
  };

  const handleCloseQuiz = (subjectId: string, answeredCount: number) => {
    if (answeredCount > 0) {
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subjectId
            ? { ...s, doneCount: Math.max(s.doneCount, answeredCount) }
            : s
        )
      );
    }
    setView({ kind: 'main', tab: 'practice' });
  };

  const handleJumpToDocScreen = (docId: string) => {
    setActiveModal(null);
    if (
      docId === 'agreement' ||
      docId === 'login' ||
      docId === 'captcha' ||
      docId === 'goal_exam' ||
      docId === 'goal_stage' ||
      docId === 'goal_region' ||
      docId === 'goal_type' ||
      docId === 'welcome_gift'
    ) {
      setView({ kind: 'onboarding', screen: docId });
      return;
    }
    if (docId === 'quiz') {
      setView({ kind: 'quiz', subjectId: 'politics' });
      return;
    }
    if (
      docId === 'practice' ||
      docId === 'course' ||
      docId === 'discover' ||
      docId === 'me'
    ) {
      setView({ kind: 'main', tab: docId });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EEF2F7] lg:py-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-[1160px] flex items-center justify-center gap-8">
        {/* Interactive Mobile App Frame */}
        <main
          ref={phoneFrameRef}
          className="relative w-full h-screen lg:w-[390px] lg:h-[820px] lg:rounded-[40px] lg:border-[8px] lg:border-slate-900 bg-white lg:shadow-[0_24px_60px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col shrink-0"
        >
          {view.kind === 'onboarding' && (
            <OnboardingFlow
              screen={view.screen}
              examProfile={examProfile}
              onNavigate={(screen) => setView({ kind: 'onboarding', screen })}
              onUpdateProfile={(patch) =>
                setExamProfile((prev) => ({ ...prev, ...patch }))
              }
              onLoginSuccess={(phone, nickname) =>
                setUser((prev) => ({
                  ...prev,
                  isLoggedIn: true,
                  phone,
                  nickname: nickname || '粉笔学员',
                }))
              }
              onFinishOnboarding={(gifts, targetTab = 'practice') => {
                if (gifts.length > 0) {
                  setUser((prev) => ({
                    ...prev,
                    claimedGifts: gifts,
                    isMember: gifts.includes('vip') || prev.isMember,
                  }));
                }
                setView({ kind: 'main', tab: targetTab });
              }}
            />
          )}

          {view.kind === 'quiz' && (
            <QuizFlow
              subjectId={view.subjectId}
              initialShowSheet={view.showSheet}
              onClose={(answered) => handleCloseQuiz(view.subjectId, answered)}
            />
          )}

          {view.kind === 'main' && (
            <>
              <div
                className={`relative z-50 shrink-0 transition-colors duration-300 ${
                  activeModal === 'more_grid'
                    ? 'bg-white'
                    : view.tab === 'practice'
                    ? 'bg-[#F7F8FB]'
                    : view.tab === 'me'
                    ? 'bg-[#E8F1FD]'
                    : 'bg-white'
                }`}
              >
                <StatusBar
                  time={
                    view.tab === 'practice'
                      ? '2:25'
                      : view.tab === 'course'
                      ? '2:23'
                      : '2:24'
                  }
                />
              </div>

              {view.tab === 'practice' && (
                <>
                  <PracticeTab
                    examProfile={examProfile}
                    subjects={subjects}
                    isMoreMenuOpen={activeModal === 'more_grid'}
                    onStartQuiz={(subjectId) => setView({ kind: 'quiz', subjectId })}
                    onChangeGoal={() => setView({ kind: 'onboarding', screen: 'goal_exam' })}
                    onOpenSearch={() => setActiveModal('search')}
                    onToggleMoreGrid={() =>
                      setActiveModal((prev) => (prev === 'more_grid' ? null : 'more_grid'))
                    }
                    onOpenFeature={handleOpenFeature}
                    onOpenAiTeacher={() => setActiveModal('ai_teacher')}
                  />
                  <PracticeMoreDrawer
                    open={activeModal === 'more_grid'}
                    onClose={() => setActiveModal(null)}
                    onJumpTab={(tab) => setView({ kind: 'main', tab })}
                    onStartQuiz={(subjectId) => setView({ kind: 'quiz', subjectId })}
                    onOpenFeature={handleOpenFeature}
                  />
                </>
              )}

              {view.tab === 'course' && (
                <CourseTab
                  initialCategory={examProfile.stage === '面试' ? '公考面试' : '公考笔试'}
                  onOpenSearch={() => setActiveModal('search')}
                  onOpenFeature={handleOpenFeature}
                />
              )}

              {view.tab === 'discover' && (
                <DiscoverTab
                  coins={user.coins}
                  checkedInToday={user.checkedInToday}
                  onCheckIn={() =>
                    setUser((prev) =>
                      prev.checkedInToday
                        ? prev
                        : { ...prev, checkedInToday: true, coins: prev.coins + 20 }
                    )
                  }
                  onOpenSearch={() => setActiveModal('search')}
                  onOpenAiTeacher={() => setActiveModal('ai_teacher')}
                />
              )}

              {view.tab === 'me' && (
                <MeTab
                  user={user}
                  onTriggerLogin={() => setView({ kind: 'onboarding', screen: 'login' })}
                  onLogout={() =>
                    setUser((prev) => ({
                      ...prev,
                      isLoggedIn: false,
                      nickname: '粉笔同学',
                    }))
                  }
                  onOpenAiTeacher={() => setActiveModal('ai_teacher')}
                />
              )}

              {/* Floating Apple Liquid-Glass 4-Tab Navigation Bar */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-3 pt-4">
                <nav
                  aria-label="主导航"
                  className="pointer-events-auto relative h-[62px] rounded-full p-[4px] bg-white/24 backdrop-blur-[8px] backdrop-saturate-[2.1] backdrop-contrast-[1.06] backdrop-brightness-[1.04] border border-white/80 shadow-[0_12px_32px_rgba(15,23,42,0.13),0_3px_10px_rgba(15,23,42,0.06),0_0_0_0.5px_rgba(15,23,42,0.05),inset_0_1.5px_1px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.65),inset_0_0_12px_rgba(255,255,255,0.22)]"
                >
                  {/* Apple Liquid Glass curved optical specular reflection */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/50 via-white/[0.04] to-white/22"
                  />
                  {/* Razor-thin upper specular glint */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-5 top-[1px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/95 to-transparent"
                  />

                  <div className="relative z-10 h-full w-full grid grid-cols-4 items-center">
                    {/* Sliding active Apple glass lens capsule */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-0 bottom-0 left-0 w-1/4 rounded-full bg-gradient-to-b from-white/88 via-white/70 to-white/82 backdrop-blur-[4px] border border-white/95 shadow-[0_4px_14px_rgba(15,23,42,0.09),0_1px_3px_rgba(15,23,42,0.05),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(15,23,42,0.04)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        view.tab === 'practice'
                          ? 'translate-x-0'
                          : view.tab === 'course'
                          ? 'translate-x-full'
                          : view.tab === 'discover'
                          ? 'translate-x-[200%]'
                          : 'translate-x-[300%]'
                      }`}
                    />

                    {MAIN_TABS.map((t) => {
                      const active = view.tab === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setView({ kind: 'main', tab: t.id })}
                          className="relative z-10 flex flex-col items-center justify-center gap-[2px] h-full rounded-full cursor-pointer active:scale-95 transition-transform"
                        >
                          <span className="relative inline-flex items-center justify-center">
                            {t.badge && (
                              <span className="pointer-events-none absolute bottom-[calc(100%+1px)] left-[calc(50%-1px)] flex flex-col items-start">
                                <span className="px-[5.5px] py-[2px] rounded-full bg-[#2856EB] text-white text-[9px] font-semibold leading-[1.15] whitespace-nowrap shadow-[0_2px_5px_rgba(40,86,235,0.26)]">
                                  {t.badge}
                                </span>
                                <svg
                                  width="5"
                                  height="2.5"
                                  viewBox="0 0 5 2.5"
                                  fill="none"
                                  aria-hidden="true"
                                  className="ml-[5px] -mt-[0.5px]"
                                >
                                  <path d="M0.8 0L0 2.5L4.4 0H0.8Z" fill="#2856EB" />
                                </svg>
                              </span>
                            )}
                            <BottomTabIcon name={t.id} active={active} />
                          </span>
                          <span
                            className={`text-[10.5px] leading-tight whitespace-nowrap transition-colors duration-200 ${
                              active
                                ? 'text-[#2856EB] font-semibold'
                                : 'text-[#232833] font-medium'
                            }`}
                          >
                            {t.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </nav>
              </div>

              {/* First-visit Coachmark Overlay for "我的练习" */}
              <PracticeGuideOverlay
                visible={view.tab === 'practice' && showPracticeGuide && !activeModal}
                containerRef={phoneFrameRef}
                onDismiss={() => setShowPracticeGuide(false)}
                onClickTarget={() => {
                  setShowPracticeGuide(false);
                  setActiveModal('more_grid');
                }}
              />

              {/* Global Modals (Search, More Grid, AI Teacher, Feature Preview) */}
              <GlobalModals
                modal={activeModal}
                featureTitle={featureTitle}
                onClose={() => setActiveModal(null)}
                onJumpTab={(tab) => setView({ kind: 'main', tab })}
                onStartQuiz={(subjectId) => setView({ kind: 'quiz', subjectId })}
                onOpenFeature={handleOpenFeature}
              />
            </>
          )}
        </main>

        {/* Desktop Companion Panel: Interactive 17-Screen Architecture Explorer */}
        <StructureExplorer
          currentView={view}
          examProfile={examProfile}
          onJumpToDocScreen={handleJumpToDocScreen}
          onRestartOnboarding={() => {
            setShowPracticeGuide(true);
            setView({ kind: 'onboarding', screen: 'agreement' });
          }}
        />
      </div>
    </div>
  );
}

export default App;
