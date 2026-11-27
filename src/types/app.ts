export type OnboardingScreen =
  | 'agreement'
  | 'login'
  | 'sms_login'
  | 'password_login'
  | 'captcha'
  | 'goal_exam'
  | 'goal_stage'
  | 'goal_region'
  | 'goal_type'
  | 'welcome_gift';

export type MainTabId = 'practice' | 'course' | 'discover' | 'me';

export type ActiveModal =
  | null
  | 'search'
  | 'more_grid'
  | 'ai_teacher'
  | 'exam_type_modal'
  | 'course_region_picker'
  | 'feature_preview';

export type AppView =
  | { kind: 'onboarding'; screen: OnboardingScreen }
  | { kind: 'main'; tab: MainTabId }
  | { kind: 'quiz'; subjectId: string; showSheet?: boolean; submitted?: boolean };

export interface ExamProfile {
  examName: string;
  stage: '笔试' | '面试';
  region: string;
  categoryType: string;
}

export interface UserState {
  isLoggedIn: boolean;
  phone?: string;
  nickname: string;
  coins: number;
  checkedInToday: boolean;
  claimedGifts: string[];
  isMember: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  totalCount: number;
  doneCount: number;
  subTopics: string[];
}

export interface QuizQuestion {
  id: number;
  type: '单选题' | '多选题';
  subjectId: string;
  stem: string;
  statements?: string[];
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  analysis: string;
  knowledgePoint: string;
  accuracyRate: string;
}

export interface CourseItem {
  id: string;
  category: '公考笔试' | '事业单位' | '就业学院' | '公考面试';
  region: string;
  badgeTag?: string;
  title: string;
  subtitle: string;
  dateRange: string;
  tags: string[];
  priceLabel: string;
  buyersText: string;
  teachers: string[];
  syllabus: string[];
}

export interface FeaturedCourseSlide extends CourseItem {
  valueNote: string;
  statusText: string;
}

export interface FeaturedCourseCollection {
  id: string;
  category: CourseItem['category'];
  badgeTag: string;
  headerTitle: string;
  insertIndex: number;
  slides: FeaturedCourseSlide[];
}

export interface FeedPost {
  id: string;
  author: string;
  authorType: 'official' | 'ai' | 'user';
  avatarUrl?: string;
  timeOrTag: string;
  isPinned?: boolean;
  title?: string;
  content: string;
  category: '推荐' | '圈子' | '干货' | '备考经验' | '关注';
  views: number;
  comments: number;
  likes: number;
  liked?: boolean;
  followed?: boolean;
  hasImagePlaceholder?: boolean;
}

export interface ScreenDocNode {
  id: string;
  screenshotNo: string;
  title: string;
  subtitle: string;
  elements: string[];
  actions: { trigger: string; target: string }[];
}
