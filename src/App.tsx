import React, { useState } from 'react';
import {
  Home,
  PlaySquare,
  BriefcaseBusiness,
  Compass,
  Smile,
} from 'lucide-react';
import { INITIAL_SUBJECTS } from './data/fenbiData';
import {
  ActiveModal,
  AppView,
  ExamProfile,
  JobPreferences,
  MainTabId,
  SubjectItem,
  UserState,
} from './types/app';
import { StatusBar } from './components/FenbiIcons';
import { OnboardingFlow } from './components/OnboardingFlow';
import { PracticeTab } from './components/tabs/PracticeTab';
import { CourseTab } from './components/tabs/CourseTab';
import { JobMatchTab } from './components/tabs/JobMatchTab';
import { DiscoverTab } from './components/tabs/DiscoverTab';
import { MeTab } from './components/tabs/MeTab';
import { QuizFlow } from './components/QuizFlow';
import { GlobalModals } from './components/GlobalModals';
import { StructureExplorer } from './components/StructureExplorer';

const MAIN_TABS: { id: MainTabId; label: string; icon: typeof Home; badge?: string }[] = [
  { id: 'practice', label: '练习', icon: Home },
  { id: 'course', label: '课程', icon: PlaySquare },
  { id: 'jobmatch', label: '选岗', icon: BriefcaseBusiness },
  { id: 'discover', label: '发现', icon: Compass },
  { id: 'me', label: '我', icon: Smile, badge: '有课' },
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
  const [jobPrefs, setJobPrefs] = useState<JobPreferences>({
    examTypes: ['全部'],
    region: '全国',
    education: '本科',
    major: '计算机科学与技术',
    politicalStatus: '共青团员',
    graduateStatus: '2027应届生',
  });

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [featureTitle, setFeatureTitle] = useState('');

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
      docId === 'jobmatch' ||
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
        <main className="relative w-full h-screen lg:w-[390px] lg:h-[820px] lg:rounded-[40px] lg:border-[8px] lg:border-slate-900 bg-white lg:shadow-[0_24px_60px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col shrink-0">
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
              <StatusBar
                time={
                  view.tab === 'practice'
                    ? '2:25'
                    : view.tab === 'course'
                    ? '2:23'
                    : view.tab === 'jobmatch'
                    ? '2:22'
                    : '2:24'
                }
              />

              {view.tab === 'practice' && (
                <PracticeTab
                  examProfile={examProfile}
                  subjects={subjects}
                  onStartQuiz={(subjectId) => setView({ kind: 'quiz', subjectId })}
                  onChangeGoal={() => setView({ kind: 'onboarding', screen: 'goal_exam' })}
                  onOpenSearch={() => setActiveModal('search')}
                  onOpenMoreGrid={() => setActiveModal('more_grid')}
                  onOpenFeature={handleOpenFeature}
                  onOpenAiTeacher={() => setActiveModal('ai_teacher')}
                />
              )}

              {view.tab === 'course' && (
                <CourseTab
                  initialCategory={examProfile.stage === '面试' ? '公考面试' : '公考笔试'}
                  onOpenSearch={() => setActiveModal('search')}
                  onOpenFeature={handleOpenFeature}
                />
              )}

              {view.tab === 'jobmatch' && (
                <JobMatchTab
                  preferences={jobPrefs}
                  onUpdatePreferences={(patch) =>
                    setJobPrefs((prev) => ({ ...prev, ...patch }))
                  }
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

              {/* Fixed Bottom 5-Tab Navigation Bar */}
              <nav className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-100 h-[62px] grid grid-cols-5 items-center px-1">
                {MAIN_TABS.map((t) => {
                  const Icon = t.icon;
                  const active = view.tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setView({ kind: 'main', tab: t.id })}
                      className="relative flex flex-col items-center justify-center gap-0.5 h-full cursor-pointer"
                    >
                      {t.badge && (
                        <span className="absolute top-1 right-2 px-1.5 py-0.2 rounded-full bg-[#3A7AFE] text-white text-[9px] font-bold leading-tight">
                          {t.badge}
                        </span>
                      )}
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          active ? 'text-[#3A7AFE] stroke-[2.4]' : 'text-slate-500 stroke-[1.8]'
                        }`}
                      />
                      <span
                        className={`text-[10.5px] leading-tight whitespace-nowrap ${
                          active ? 'text-[#3A7AFE] font-semibold' : 'text-slate-500 font-medium'
                        }`}
                      >
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Global Modals (Search, More Grid, AI Teacher, Feature Preview) */}
              <GlobalModals
                modal={activeModal}
                featureTitle={featureTitle}
                onClose={() => setActiveModal(null)}
                onJumpTab={(tab) => setView({ kind: 'main', tab })}
                onStartQuiz={(subjectId) => setView({ kind: 'quiz', subjectId })}
              />
            </>
          )}
        </main>

        {/* Desktop Companion Panel: Interactive 17-Screen Architecture Explorer */}
        <StructureExplorer
          currentView={view}
          examProfile={examProfile}
          onJumpToDocScreen={handleJumpToDocScreen}
          onRestartOnboarding={() => setView({ kind: 'onboarding', screen: 'agreement' })}
        />
      </div>
    </div>
  );
}

export default App;
