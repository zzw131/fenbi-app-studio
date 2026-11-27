import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Menu,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  CHINA_PROVINCES,
  COURSE_TAG_ASSETS,
  COURSES,
  FEATURED_COURSE_COLLECTIONS,
  getCourseTeacherAvatars,
  INITIAL_SUBJECTS,
} from '../data/fenbiData';

interface SearchOverlayProps {
  onClose: () => void;
  onStartQuiz: (subjectId: string) => void;
}

type ActivePanel = null | 'region' | 'categories' | 'courseType' | 'deliveryMode' | 'price';

type DeliveryMode = '全部' | '线上授课' | '线下授课' | '线上+线下授课';
type PriceRange = '不限' | '100以下' | '100-1k' | '1k-5k' | '5k-1w' | '1万以上';

interface SearchCourseRecord {
  id: string;
  category: string;
  regions: '全国' | string[];
  badgeTag?: string;
  title: string;
  subtitle: string;
  dateRange: string;
  priceLabel: string;
  minPrice: number;
  maxPrice: number;
  buyersText: string;
  teachers: string[];
  syllabus: string[];
  deliveryMode: Exclude<DeliveryMode, '全部'>;
  courseTypes: string[];
  supportsTrial?: boolean;
}

const PRIMARY_CATEGORIES = ['公考笔试', '事业单位', '教师', '就业学院', '公考面试'] as const;

const ALL_CATEGORIES = [
  '全部分类',
  '公考笔试',
  '事业单位',
  '教师',
  '就业学院',
  '公考面试',
  '军队文职',
  '医疗卫生',
  '考研',
] as const;

const SEARCH_REGIONS: string[] = ['全部', ...CHINA_PROVINCES];

const COURSE_TYPE_OPTIONS: string[] = [
  '全部',
  '系统课',
  '全家桶',
  '精品班',
  'AI智学班',
  '冲刺班',
  '基地班',
  '全程班',
  '精讲班',
  '名师专项课',
  '模考大赛',
  '图书',
  '一对一',
  '特训营',
  '会员',
  '12.8特惠',
];

const DELIVERY_MODE_OPTIONS: DeliveryMode[] = [
  '全部',
  '线上授课',
  '线下授课',
  '线上+线下授课',
];

const PRICE_RANGE_OPTIONS: PriceRange[] = [
  '不限',
  '100以下',
  '100-1k',
  '1k-5k',
  '5k-1w',
  '1万以上',
];

function parsePriceBounds(priceLabel: string): { minPrice: number; maxPrice: number } {
  const nums = priceLabel.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [0];
  if (nums.length === 1) return { minPrice: nums[0], maxPrice: nums[0] };
  return { minPrice: Math.min(...nums), maxPrice: Math.max(...nums) };
}

function inferCourseTypes(title: string, badgeTag: string | undefined, tags: string[]): string[] {
  const text = `${title} ${badgeTag ?? ''} ${tags.join(' ')}`;
  const types = new Set<string>();
  if (text.includes('系统')) types.add('系统课');
  if (text.includes('全家桶')) types.add('全家桶');
  if (text.includes('精品')) types.add('精品班');
  if (text.includes('智学') || text.includes('AI')) types.add('AI智学班');
  if (text.includes('冲刺')) types.add('冲刺班');
  if (text.includes('基地')) types.add('基地班');
  if (text.includes('全程')) types.add('全程班');
  if (text.includes('精讲')) types.add('精讲班');
  if (text.includes('名师') || text.includes('专项')) types.add('名师专项课');
  if (text.includes('模考')) types.add('模考大赛');
  if (text.includes('图书') || text.includes('讲义') || text.includes('大礼包')) types.add('图书');
  if (text.includes('一对一') || text.includes('1对1')) types.add('一对一');
  if (text.includes('营') || text.includes('特训')) types.add('特训营');
  if (text.includes('会员')) types.add('会员');
  if (text.includes('12.8') || text.includes('特惠')) types.add('12.8特惠');
  if (types.size === 0) types.add('精讲班');
  return Array.from(types);
}

const SUPPLEMENTAL_COURSES: SearchCourseRecord[] = [
  {
    id: 'sc-base-bj',
    category: '公考笔试',
    regions: ['北京', '天津', '河北', '山东', '江苏', '安徽', '四川', '广东'],
    badgeTag: '精品班',
    title: '2027国省考封闭基地班【吃住学一体·全科冲刺】',
    subtitle: '线下沉浸式封闭集训，班主任早晚自习全程盯学与全真模考',
    dateRange: '2026.11.01 - 2027.03.15',
    priceLabel: '¥12800',
    minPrice: 12800,
    maxPrice: 12800,
    buyersText: '3180人报名',
    teachers: ['张小龙', '李梦娇', '高照'],
    syllabus: [
      '01. 线下封闭方法精讲与每日限时刷题打卡',
      '02. 申论手写卷面一对一当面精批拔高',
      '03. 考前全真考场还原模考与排名诊断',
    ],
    deliveryMode: '线下授课',
    courseTypes: ['基地班', '精品班', '全程班', '冲刺班'],
    supportsTrial: false,
  },
  {
    id: 'sc-hybrid-vip',
    category: '公考笔试',
    regions: '全国',
    badgeTag: '系统班',
    title: '2027国省考笔试双师全程班【线上直播+线下集训】',
    subtitle: '前期线上灵活系统打基础，考前线下封闭刷题提速冲刺',
    dateRange: '2026.10.15 - 2027.03.20',
    priceLabel: '¥6800-8800',
    minPrice: 6800,
    maxPrice: 8800,
    buyersText: '5420人报名',
    teachers: ['袁东', '聂佳', '唐宋'],
    syllabus: [
      '01. 线上全科方法精讲与AI错题图谱追踪',
      '02. 线下21天高强度真题密训与面对面答疑',
      '03. 考前全套预测密卷精讲与临场策略指导',
    ],
    deliveryMode: '线上+线下授课',
    courseTypes: ['全程班', '系统课', '基地班', '精品班'],
    supportsTrial: true,
  },
  {
    id: 'sc-family-pack',
    category: '公考笔试',
    regions: '全国',
    badgeTag: '系统班',
    title: '2027公考上岸全家桶【行测+申论+图书+会员全年通享】',
    subtitle: '一站式配齐系统课、刷题班、纸质教材礼盒与题库年度会员',
    dateRange: '2026.09.01 - 2027.06.30',
    priceLabel: '¥1480',
    minPrice: 1480,
    maxPrice: 1480,
    buyersText: '28940人购买',
    teachers: ['粉笔行测组', '粉笔申论组', 'AI助教'],
    syllabus: [
      '01. 全套《行测的思维》《申论的规矩》纸质图书包邮',
      '02. 2027国省考系统课+5000题刷题实战班全含',
      '03. 赠送365天粉笔题库尊享会员与模考精讲',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['全家桶', '系统课', '图书', '会员'],
    supportsTrial: true,
  },
  {
    id: 'sc-mock-vip',
    category: '公考笔试',
    regions: '全国',
    badgeTag: '刷题班',
    title: '2027国省考万人模考大赛全年解析+会员权益包',
    subtitle: '每周日全真在线模考，即时出分排名与名师直播逐题精讲',
    dateRange: '2026.09.01 - 2027.05.30',
    priceLabel: '¥68',
    minPrice: 68,
    maxPrice: 68,
    buyersText: '186500人参与',
    teachers: ['高照', '聂佳'],
    syllabus: [
      '01. 40期高仿真国省考万人模考大赛套卷',
      '02. 每期赛后名师直播精讲与易错题榜单复盘',
      '03. 含90天题库会员智能组卷与无限错题重练',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['模考大赛', '会员', '12.8特惠'],
    supportsTrial: true,
  },
  {
    id: 'sc-book-kit',
    category: '公考笔试',
    regions: '全国',
    badgeTag: '基础',
    title: '2027粉笔公考决战行测5000题+申论100题纸质图书套装',
    subtitle: '历年国省考精选真题分册排版，扫码即看名师逐题视频精讲',
    dateRange: '现货速发 · 赠视频解析',
    priceLabel: '¥89',
    minPrice: 89,
    maxPrice: 89,
    buyersText: '243100人购买',
    teachers: ['粉笔教研中心'],
    syllabus: [
      '01. 行测五大模块真题+解析共10册装订',
      '02. 申论单一题/公文/大作文范文精解全套',
      '03. 配套线上错题本扫码录入与名师视频课',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['图书', '精讲班'],
    supportsTrial: false,
  },
  {
    id: 'sc-teacher-1',
    category: '教师',
    regions: '全国',
    badgeTag: '精品班',
    title: '2027上教资笔试精品系统班【中学/小学/幼儿全科】',
    subtitle: '紧扣教资新考纲，综合素质作文模板+教育知识简答口诀带背',
    dateRange: '2026.11.15 - 2027.03.10',
    priceLabel: '¥580-980',
    minPrice: 580,
    maxPrice: 980,
    buyersText: '36420人购买',
    teachers: ['李梦娇', '教师教研组'],
    syllabus: [
      '01. 综合素质职业理念与材料分析高分答题模版',
      '02. 教育教学知识与能力高频简答口诀速记',
      '03. 考前全真模考与主观题人工逐卷批改',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['精品班', '系统课', '全程班', '精讲班'],
    supportsTrial: true,
  },
  {
    id: 'sc-teacher-2',
    category: '教师',
    regions: ['北京', '上海', '江苏', '浙江', '山东', '广东', '安徽'],
    badgeTag: '冲刺班',
    title: '2027教师招聘编内笔面试一体化线下特训营',
    subtitle: '教综考点精讲+无生试讲与说课面对面磨课点评',
    dateRange: '2026.12.01 - 2027.04.15',
    priceLabel: '¥5980',
    minPrice: 5980,
    maxPrice: 5980,
    buyersText: '4120人报名',
    teachers: ['教师面试主考团', '李梦娇'],
    syllabus: [
      '01. 教育综合知识高频考点系统精讲与刷题',
      '02. 线下小班逐人试讲录像回放与板书精修',
      '03. 考官视角结构化答辩与全真考场模拟',
    ],
    deliveryMode: '线上+线下授课',
    courseTypes: ['特训营', '冲刺班', '基地班', '一对一'],
    supportsTrial: true,
  },
  {
    id: 'sc-teacher-3',
    category: '教师',
    regions: '全国',
    badgeTag: '名师带学',
    title: '教资面试试讲与答辩1对1定制特训课',
    subtitle: '分学段分学科匹配一线名师，一对一打磨教案设计与试讲仪态',
    dateRange: '随报随约 · 灵活排课',
    priceLabel: '¥1680-3200',
    minPrice: 1680,
    maxPrice: 3200,
    buyersText: '9850人购买',
    teachers: ['教师教研名师团'],
    syllabus: [
      '01. 20分钟快速写教案结构化框架训练',
      '02. 1对1模拟试讲实时打断纠偏与亮点击破',
      '03. 常见考官追问答辩高情商应对策略',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['一对一', '名师专项课', '特训营'],
    supportsTrial: true,
  },
  {
    id: 'sc-sydw-2',
    category: '事业单位',
    regions: ['北京', '山东', '江苏', '安徽', '四川', '湖北', '湖南'],
    badgeTag: '精品班',
    title: '2027全国事业单位联考ABCDE类线下+线上双师基地班',
    subtitle: '分岗位定向精讲职测与综应，考前封闭模考冲刺高分进面',
    dateRange: '2026.11.10 - 2027.04.20',
    priceLabel: '¥7980',
    minPrice: 7980,
    maxPrice: 7980,
    buyersText: '6190人报名',
    teachers: ['陈老师', '王老师', '袁东'],
    syllabus: [
      '01. 职测五大模块解题提速与套题训练',
      '02. 综应A/B/C/D/E类分岗写作与实务精批',
      '03. 线下全真模考与班主任一对一督学复盘',
    ],
    deliveryMode: '线上+线下授课',
    courseTypes: ['基地班', '精品班', '全程班', '系统课'],
    supportsTrial: true,
  },
  {
    id: 'sc-interview-2',
    category: '公考面试',
    regions: ['北京', '上海', '广东', '江苏', '浙江', '安徽', '山东'],
    badgeTag: '精品班',
    title: '2027国省考结构化+无领导面试线下封闭特训基地班',
    subtitle: '8人小班全真考场演练，考官级师资逐题点评脱稿表达',
    dateRange: '2027.01.10 - 2027.03.30',
    priceLabel: '¥11800',
    minPrice: 11800,
    maxPrice: 11800,
    buyersText: '2840人报名',
    teachers: ['面试主考官教研组', '张小龙'],
    syllabus: [
      '01. 综合分析/应急应变/人际沟通反模板高分破题',
      '02. 无领导小组讨论破冰、控场与总结陈词实战',
      '03. 每天3轮全真模拟录像回看与一对一精修',
    ],
    deliveryMode: '线下授课',
    courseTypes: ['基地班', '特训营', '精品班', '一对一'],
    supportsTrial: false,
  },
  {
    id: 'sc-job-2',
    category: '就业学院',
    regions: '全国',
    badgeTag: 'AI助学',
    title: '2027银行/国家电网/烟草校招AI智学全程系统班',
    subtitle: '行测+EPI+专业课+AI模拟面试一站式覆盖，含网申简历精修',
    dateRange: '2026.09.20 - 2027.04.30',
    priceLabel: '¥1280',
    minPrice: 1280,
    maxPrice: 1280,
    buyersText: '11540人购买',
    teachers: ['就业规划导师团', 'AI助教'],
    syllabus: [
      '01. 央国企网申筛选逻辑与1对1简历精修',
      '02. EPI行测与行业特色专业知识系统精讲',
      '03. AI全真半结构化/无领导模拟面试演练',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['AI智学班', '系统课', '全程班', '精品班'],
    supportsTrial: true,
  },
  {
    id: 'sc-military-1',
    category: '军队文职',
    regions: '全国',
    badgeTag: '系统班',
    title: '2027军队文职公共科目+专业课全程系统班',
    subtitle: '覆盖国防军队常识与岗位能力精讲，赠纸质真题大礼包',
    dateRange: '2026.10.01 - 2027.02.28',
    priceLabel: '¥880',
    minPrice: 880,
    maxPrice: 880,
    buyersText: '14920人购买',
    teachers: ['文职教研组', '郭熙'],
    syllabus: [
      '01. 公共科目基本知识+国防军队高频考点精讲',
      '02. 岗位能力言语/判断/资料/数量提速训练',
      '03. 考前全真套卷模考与热点密押串讲',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['系统课', '全程班', '图书'],
    supportsTrial: true,
  },
  {
    id: 'sc-medical-1',
    category: '医疗卫生',
    regions: '全国',
    badgeTag: '精讲班',
    title: '2027医疗卫生E类《职测+综应+医学基础》全程精讲班',
    subtitle: '分临床/护理/药学/检验方向精讲病例分析与高频考点',
    dateRange: '2026.10.15 - 2027.04.10',
    priceLabel: '¥699',
    minPrice: 699,
    maxPrice: 699,
    buyersText: '8730人购买',
    teachers: ['医疗教研导师团'],
    syllabus: [
      '01. 医学基础知识核心考点图谱梳理',
      '02. E类综应病例分析与实务答题规范训练',
      '03. 历年医疗编招考真题刷题带练',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['精讲班', '全程班', '系统课'],
    supportsTrial: true,
  },
  {
    id: 'sc-kaoyan-1',
    category: '考研',
    regions: '全国',
    badgeTag: '精品班',
    title: '2027考研英语+政治+数学全科VIP伴学全程班',
    subtitle: '名师精讲+阶段模考+专属学管一对一复盘备考节奏',
    dateRange: '2026.09.01 - 2026.12.25',
    priceLabel: '¥2980',
    minPrice: 2980,
    maxPrice: 2980,
    buyersText: '12680人购买',
    teachers: ['考研教研组', '专属学管师'],
    syllabus: [
      '01. 英语阅读长难句与大小作文模板精修',
      '02. 政治马原/毛中特/史纲核心考点带背',
      '03. 考前全真模拟与1对1弱项靶向答疑',
    ],
    deliveryMode: '线上授课',
    courseTypes: ['精品班', '全程班', '一对一'],
    supportsTrial: true,
  },
];

function buildSearchCatalog(): SearchCourseRecord[] {
  const fromFeatured: SearchCourseRecord[] = FEATURED_COURSE_COLLECTIONS.flatMap((col) =>
    col.slides.map((slide) => {
      const { minPrice, maxPrice } = parsePriceBounds(slide.priceLabel);
      return {
        id: slide.id,
        category: slide.category,
        regions: '全国',
        badgeTag: slide.badgeTag,
        title: slide.title,
        subtitle: slide.subtitle,
        dateRange: slide.dateRange,
        priceLabel: slide.priceLabel,
        minPrice,
        maxPrice,
        buyersText: slide.buyersText,
        teachers: slide.teachers,
        syllabus: slide.syllabus,
        deliveryMode: slide.id === 'fc1-s1' ? '线上+线下授课' : '线上授课',
        courseTypes: inferCourseTypes(slide.title, slide.badgeTag, slide.tags),
        supportsTrial: true,
      };
    }),
  );

  const fromCourses: SearchCourseRecord[] = COURSES.map((course) => {
    const { minPrice, maxPrice } = parsePriceBounds(course.priceLabel);
    const deliveryMode: Exclude<DeliveryMode, '全部'> =
      course.id === 'c6' ? '线上+线下授课' : '线上授课';
    return {
      id: course.id,
      category: course.category,
      regions: '全国',
      badgeTag: course.badgeTag,
      title: course.title,
      subtitle: course.subtitle,
      dateRange: course.dateRange,
      priceLabel: course.priceLabel,
      minPrice,
      maxPrice,
      buyersText: course.buyersText,
      teachers: course.teachers,
      syllabus: course.syllabus,
      deliveryMode,
      courseTypes: inferCourseTypes(course.title, course.badgeTag, course.tags),
      supportsTrial: minPrice >= 199,
    };
  });

  return [...fromFeatured, ...SUPPLEMENTAL_COURSES, ...fromCourses];
}

function matchesPriceRange(course: SearchCourseRecord, range: PriceRange): boolean {
  if (range === '不限') return true;
  if (range === '100以下') return course.minPrice < 100;
  if (range === '100-1k') return course.maxPrice >= 100 && course.minPrice <= 1000;
  if (range === '1k-5k') return course.maxPrice >= 1000 && course.minPrice <= 5000;
  if (range === '5k-1w') return course.maxPrice >= 5000 && course.minPrice <= 10000;
  return course.maxPrice > 10000;
}

function renderHighlightedText(text: string, keyword: string): React.ReactNode {
  const trimmed = keyword.trim();
  if (!trimmed) return text;
  const idx = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + trimmed.length);
  const after = text.slice(idx + trimmed.length);
  return (
    <>
      {before}
      <span className="text-[#2856EB]">{match}</span>
      {after}
    </>
  );
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onStartQuiz }) => {
  const catalog = useMemo(() => buildSearchCatalog(), []);

  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<string>('北京');
  const [category, setCategory] = useState<string>('公考笔试');
  const [courseType, setCourseType] = useState<string>('全部');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('全部');
  const [priceRange, setPriceRange] = useState<PriceRange>('不限');

  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [draftCourseType, setDraftCourseType] = useState<string>('全部');
  const [draftDeliveryMode, setDraftDeliveryMode] = useState<DeliveryMode>('全部');
  const [draftPriceRange, setDraftPriceRange] = useState<PriceRange>('不限');

  const [selectedCourse, setSelectedCourse] = useState<SearchCourseRecord | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  const togglePanel = (panel: Exclude<ActivePanel, null>) => {
    if (activePanel === panel) {
      setActivePanel(null);
      return;
    }
    if (panel === 'courseType') setDraftCourseType(courseType);
    if (panel === 'deliveryMode') setDraftDeliveryMode(deliveryMode);
    if (panel === 'price') setDraftPriceRange(priceRange);
    setActivePanel(panel);
  };

  const handleConfirmFilter = () => {
    if (activePanel === 'courseType') setCourseType(draftCourseType);
    if (activePanel === 'deliveryMode') setDeliveryMode(draftDeliveryMode);
    if (activePanel === 'price') setPriceRange(draftPriceRange);
    setActivePanel(null);
  };

  const handleResetDraft = () => {
    if (activePanel === 'courseType') setDraftCourseType('全部');
    if (activePanel === 'deliveryMode') setDraftDeliveryMode('全部');
    if (activePanel === 'price') setDraftPriceRange('不限');
  };

  const resetAllFilters = () => {
    setQuery('');
    setCourseType('全部');
    setDeliveryMode('全部');
    setPriceRange('不限');
    setActivePanel(null);
  };

  const hasActiveFilters =
    courseType !== '全部' || deliveryMode !== '全部' || priceRange !== '不限';

  const matchedSubjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return INITIAL_SUBJECTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.subTopics.some((topic) => topic.toLowerCase().includes(q)),
    );
  }, [query]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((item) => {
      if (category !== '全部分类' && item.category !== category) return false;
      if (region !== '全部' && item.regions !== '全国' && !item.regions.includes(region)) {
        return false;
      }
      if (courseType !== '全部' && !item.courseTypes.includes(courseType)) return false;
      if (deliveryMode !== '全部' && item.deliveryMode !== deliveryMode) return false;
      if (!matchesPriceRange(item, priceRange)) return false;

      if (!q) return true;
      const searchable = [
        item.title,
        item.subtitle,
        item.category,
        item.badgeTag ?? '',
        item.deliveryMode,
        ...item.courseTypes,
        ...item.teachers,
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [catalog, category, region, courseType, deliveryMode, priceRange, query]);

  const visibleTabs = useMemo(() => {
    const base: string[] = [...PRIMARY_CATEGORIES];
    if (category !== '全部分类' && !base.includes(category)) {
      return [category, ...base];
    }
    return base;
  }, [category]);

  return (
    <div className="absolute inset-0 bg-[#F5F7FA] z-[65] flex flex-col overflow-hidden animate-fade-scale">
      {/* Top Sticky Search Chrome (z-50 stays cleanly above all dropdown drawers) */}
      <div className="relative z-50 bg-white shrink-0 border-b border-slate-100/90">
        {/* Row 1: Integrated Region Selector + Search Input + Cancel */}
        <div className="px-3.5 pt-2.5 pb-2 flex items-center gap-2.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActivePanel(null);
            }}
            className="flex-1 h-[38px] rounded-full bg-[#F3F5F9] px-3 flex items-center gap-2 transition-all focus-within:bg-[#F1F5FF] focus-within:ring-1 focus-within:ring-[#2856EB]/25"
          >
            {/* Inline Region Trigger */}
            <button
              type="button"
              onClick={() => togglePanel('region')}
              className={`flex items-center gap-0.5 text-[13px] font-semibold shrink-0 cursor-pointer transition-colors ${
                activePanel === 'region' ? 'text-[#2856EB]' : 'text-[#1E2430]'
              }`}
              aria-expanded={activePanel === 'region'}
              aria-label="切换报考地区"
            >
              <span className="max-w-[44px] truncate">{region}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activePanel === 'region' ? 'rotate-180 text-[#2856EB]' : 'text-[#6B7280]'
                }`}
              />
            </button>

            <span className="h-3.5 w-px bg-slate-300/80 shrink-0" />

            <Search className="w-[15px] h-[15px] text-[#8E96A4] shrink-0" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (activePanel) setActivePanel(null);
              }}
              placeholder="精品系统班"
              className="flex-1 min-w-0 text-[13.5px] bg-transparent outline-none text-[#181C24] placeholder:text-[#9CA3AF]"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="w-4 h-4 rounded-full bg-slate-300/80 text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-transform"
                aria-label="清空搜索词"
              >
                <X className="w-2.5 h-2.5 stroke-[2.6]" />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={onClose}
            className="text-[14px] font-medium text-[#4B5563] px-1 shrink-0 cursor-pointer active:opacity-60 transition-opacity"
          >
            取消
          </button>
        </div>

        {/* Row 2: Category Tabs + All-Categories Menu Icon */}
        <div className="relative flex items-center border-b border-slate-100/80">
          <div className="flex-1 flex items-center gap-5 overflow-x-auto no-scrollbar pl-4 pr-11 h-[40px]">
            {visibleTabs.map((tab) => {
              const isActive = category === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setCategory(tab);
                    if (activePanel === 'categories') setActivePanel(null);
                  }}
                  className={`relative h-full flex items-center whitespace-nowrap text-[14px] shrink-0 cursor-pointer transition-colors ${
                    isActive
                      ? 'text-[#181C24] font-semibold'
                      : 'text-[#6B7280] font-normal active:text-[#181C24]'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[18px] h-[2.5px] rounded-full bg-[#2856EB]" />
                  )}
                </button>
              );
            })}
            {category === '全部分类' && (
              <span className="relative h-full flex items-center whitespace-nowrap text-[14px] font-semibold text-[#2856EB] shrink-0">
                全部分类
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[18px] h-[2.5px] rounded-full bg-[#2856EB]" />
              </span>
            )}
          </div>

          {/* Right Menu Button with Soft Fade Mask */}
          <div className="absolute right-0 top-0 bottom-0 flex items-center pl-4 pr-3 bg-gradient-to-l from-white via-white to-white/0">
            <button
              type="button"
              onClick={() => togglePanel('categories')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                activePanel === 'categories'
                  ? 'bg-[#EEF4FF] text-[#2856EB]'
                  : 'text-[#4B5563] active:bg-slate-100'
              }`}
              aria-label="展开全部分类"
              aria-expanded={activePanel === 'categories'}
            >
              <Menu className="w-[17px] h-[17px] stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Row 3: 3-Column Filter Bar (课程类型 / 授课方式 / 课程价格) */}
        <div className="grid grid-cols-3 h-[40px] px-2">
          {(
            [
              {
                id: 'courseType' as const,
                defaultLabel: '课程类型',
                activeValue: courseType !== '全部' ? courseType : null,
              },
              {
                id: 'deliveryMode' as const,
                defaultLabel: '授课方式',
                activeValue: deliveryMode !== '全部' ? deliveryMode : null,
              },
              {
                id: 'price' as const,
                defaultLabel: '课程价格',
                activeValue: priceRange !== '不限' ? priceRange : null,
              },
            ] as const
          ).map((filter) => {
            const isOpen = activePanel === filter.id;
            const isSelected = Boolean(filter.activeValue);
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => togglePanel(filter.id)}
                className={`flex items-center justify-center gap-1 px-2 text-[12.5px] cursor-pointer transition-colors ${
                  isOpen || isSelected
                    ? 'text-[#2856EB] font-semibold'
                    : 'text-[#4B5563] font-medium'
                }`}
                aria-expanded={isOpen}
              >
                <span className="truncate max-w-[84px]">
                  {filter.activeValue ?? filter.defaultLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#2856EB]' : isSelected ? 'text-[#2856EB]' : 'text-[#9CA3AF]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Container (Dropdown drawers overlay inside this region) */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        {/* Scrollable Search Results Area */}
        <div className="flex-1 overflow-y-auto px-3.5 pt-3 pb-7 space-y-3">
          {/* Result Summary & Active Filter Strip */}
          <div className="flex items-center justify-between px-0.5 pt-0.5">
            <div className="text-[12px] text-[#6B7280] tabular-nums">
              {category === '全部分类' ? '全部分类' : category}
              {region !== '全部' ? ` · ${region}` : ''}
              <span className="mx-1.5 text-slate-300">|</span>
              共 <span className="font-semibold text-[#181C24]">{filteredCourses.length}</span> 门好课
            </div>
            {(hasActiveFilters || query.trim()) && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex items-center gap-1 text-[12px] font-medium text-[#2856EB] cursor-pointer active:opacity-70"
              >
                <RotateCcw className="w-3 h-3" />
                重置筛选
              </button>
            )}
          </div>

          {/* Matching Practice Subjects Shortcut when query matches */}
          {matchedSubjects.length > 0 && (
            <div className="bg-white rounded-[16px] p-3 border border-slate-100/80 space-y-2">
              <div className="text-[12px] font-semibold text-[#6B7280]">相关题库练习</div>
              <div className="divide-y divide-slate-100">
                {matchedSubjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onStartQuiz(subject.id);
                    }}
                    className="w-full py-2 first:pt-0.5 last:pb-0.5 flex items-center justify-between text-left cursor-pointer active:opacity-70"
                  >
                    <div>
                      <div className="text-[13.5px] font-semibold text-[#181C24]">
                        {renderHighlightedText(subject.name, query)}
                      </div>
                      <div className="text-[11.5px] text-[#8E96A4] mt-0.5">
                        {subject.subTopics.slice(0, 3).join(' · ')}
                      </div>
                    </div>
                    <span className="text-[12px] font-semibold text-[#2856EB] shrink-0">
                      去刷题 →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Course Result Cards */}
          {filteredCourses.length > 0 ? (
            <div className="space-y-2.5">
              {filteredCourses.map((course) => {
                const tagAsset = course.badgeTag ? COURSE_TAG_ASSETS[course.badgeTag] : undefined;
                const avatars = getCourseTeacherAvatars(course.id, course.teachers);
                const isEnrolled = enrolledIds.includes(course.id);

                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className="w-full bg-white rounded-[16px] p-4 border border-slate-100/90 text-left cursor-pointer active:scale-[0.99] transition-transform"
                  >
                    {/* Title Row with Existing Official PNG Tag Asset */}
                    <div className="text-[14.5px] font-semibold text-[#181C24] leading-[1.45]">
                      {tagAsset && (
                        <img
                          src={tagAsset.src}
                          alt={course.badgeTag}
                          className="inline-block h-[18px] w-auto max-w-none object-contain mr-1.5 align-text-bottom"
                        />
                      )}
                      {renderHighlightedText(course.title, query)}
                    </div>

                    {/* Subtitle */}
                    <p className="mt-1.5 text-[12px] text-[#7D8594] leading-[1.45] line-clamp-1">
                      {course.subtitle}
                    </p>

                    {/* Clean Unboxed Metadata Line */}
                    <div className="mt-2 flex items-center flex-wrap gap-x-1.5 gap-y-0.5 text-[11.5px] text-[#6B7280]">
                      <span className="text-[#2856EB] font-medium">{course.deliveryMode}</span>
                      <span className="text-slate-300">·</span>
                      <span>
                        {course.regions === '全国'
                          ? region === '全部'
                            ? '全国通用'
                            : `适配${region}考情`
                          : `${region === '全部' ? '多省开班' : `${region}校区`}`}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="truncate max-w-[155px]">{course.dateRange}</span>
                    </div>

                    {/* Bottom Row: Teachers + Price */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex items-center -space-x-1.5 shrink-0">
                          {avatars.map((src, idx) => (
                            <img
                              key={idx}
                              src={src}
                              alt={course.teachers[idx] ?? '授课名师'}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full object-cover ring-[1.5px] ring-white"
                            />
                          ))}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11.5px] text-[#4B5563] truncate">
                            {course.teachers.join(' · ')}
                          </div>
                          {course.supportsTrial && (
                            <div className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] text-[#2856EB] font-medium">
                              <span className="w-[13px] h-[13px] rounded-[3.5px] bg-[#2856EB] text-white flex items-center justify-center">
                                <Play className="w-2 h-2 fill-current ml-[0.5px]" />
                              </span>
                              支持试听
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[16px] font-bold text-[#F05A28] tabular-nums leading-none">
                          {course.priceLabel}
                        </div>
                        <div className="mt-1 text-[11px] text-[#8E96A4] tabular-nums">
                          {isEnrolled ? (
                            <span className="text-[#2856EB] font-medium">已报名</span>
                          ) : (
                            course.buyersText
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-[18px] px-6 py-12 text-center border border-slate-100/90">
              <div className="w-11 h-11 rounded-2xl bg-[#EEF4FF] text-[#2856EB] mx-auto flex items-center justify-center mb-3">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="text-[14.5px] font-semibold text-[#181C24]">
                当前筛选条件下暂无匹配课程
              </div>
              <p className="text-[12px] text-[#8E96A4] mt-1.5 leading-relaxed">
                试试放宽课程类型、授课方式或价格区间，或切换至「全部分类」查看更多好课
              </p>
              <div className="mt-4 flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-4 h-9 rounded-full bg-[#2856EB] text-white text-[12.5px] font-semibold cursor-pointer active:opacity-90"
                >
                  重置全部筛选
                </button>
                {category !== '全部分类' && (
                  <button
                    type="button"
                    onClick={() => setCategory('全部分类')}
                    className="px-4 h-9 rounded-full bg-[#F3F5F9] text-[#374151] text-[12.5px] font-medium cursor-pointer active:bg-slate-200/70"
                  >
                    看全部分类
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Backdrop & Top-Sliding Dropdown Drawers */}
        <div
          aria-hidden={!activePanel}
          onClick={() => setActivePanel(null)}
          className={`absolute inset-0 z-40 transition-colors duration-250 ${
            activePanel ? 'bg-black/45 pointer-events-auto' : 'bg-black/0 pointer-events-none'
          }`}
        >
          {/* 1. Region Selector Drawer (32 provinces/municipalities) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute inset-x-0 top-0 bg-white rounded-b-[20px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activePanel === 'region'
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : '-translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-[#181C24]">选择报考地区</span>
              <span className="text-[11.5px] text-[#8E96A4]">当前：{region}</span>
            </div>
            <div className="max-h-[410px] overflow-y-auto px-4 pb-5 pt-1">
              <div className="grid grid-cols-3 gap-2">
                {SEARCH_REGIONS.map((item) => {
                  const selected = region === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setRegion(item);
                        setActivePanel(null);
                      }}
                      className={`h-[36px] rounded-[10px] text-[12.5px] cursor-pointer transition-all ${
                        selected
                          ? 'bg-[#EEF4FF] text-[#2856EB] font-semibold ring-1 ring-[#2856EB]/30'
                          : 'bg-[#F5F7FA] text-[#374151] font-normal active:bg-slate-200/70'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. All-Categories Menu Drawer (Triggered by ☰) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute inset-x-0 top-0 bg-white rounded-b-[20px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activePanel === 'categories'
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : '-translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-[#181C24]">全部考试分类</span>
              <span className="text-[11.5px] text-[#8E96A4]">切换精准筛选方向</span>
            </div>
            <div className="px-4 pb-5 pt-1 grid grid-cols-3 gap-2">
              {ALL_CATEGORIES.map((item) => {
                const selected = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setCategory(item);
                      setActivePanel(null);
                    }}
                    className={`h-[38px] rounded-[10px] text-[12.5px] cursor-pointer transition-all ${
                      selected
                        ? 'bg-[#EEF4FF] text-[#2856EB] font-semibold ring-1 ring-[#2856EB]/30'
                        : 'bg-[#F5F7FA] text-[#374151] font-normal active:bg-slate-200/70'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Course Type Filter Drawer (16 options + Reset/Confirm) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute inset-x-0 top-0 bg-white rounded-b-[20px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activePanel === 'courseType'
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : '-translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <div className="px-4 pt-4 pb-3 max-h-[360px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {COURSE_TYPE_OPTIONS.map((option) => {
                  const selected = draftCourseType === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setDraftCourseType(option)}
                      className={`h-[36px] px-2 rounded-[10px] text-[12.5px] truncate cursor-pointer transition-all ${
                        selected
                          ? 'bg-[#EEF4FF] text-[#2856EB] font-semibold ring-1 ring-[#2856EB]/30'
                          : 'bg-[#F5F7FA] text-[#374151] font-normal active:bg-slate-200/70'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="px-4 pt-2.5 pb-4 border-t border-slate-100 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetDraft}
                className="flex-1 h-[40px] rounded-full bg-[#F3F5F9] text-[#4B5563] text-[13.5px] font-medium cursor-pointer active:bg-slate-200/80 transition-colors"
              >
                重置
              </button>
              <button
                type="button"
                onClick={handleConfirmFilter}
                className="flex-1 h-[40px] rounded-full bg-[#2856EB] text-white text-[13.5px] font-semibold cursor-pointer active:opacity-90 transition-opacity"
              >
                确定
              </button>
            </div>
          </div>

          {/* 4. Delivery Mode Filter Drawer (4 options + Reset/Confirm) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute inset-x-0 top-0 bg-white rounded-b-[20px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activePanel === 'deliveryMode'
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : '-translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <div className="px-4 pt-4 pb-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                {DELIVERY_MODE_OPTIONS.map((option) => {
                  const selected = draftDeliveryMode === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setDraftDeliveryMode(option)}
                      className={`h-[40px] px-3 rounded-[10px] text-[13px] flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        selected
                          ? 'bg-[#EEF4FF] text-[#2856EB] font-semibold ring-1 ring-[#2856EB]/30'
                          : 'bg-[#F5F7FA] text-[#374151] font-normal active:bg-slate-200/70'
                      }`}
                    >
                      <span>{option}</span>
                      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="px-4 pt-2.5 pb-4 border-t border-slate-100 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetDraft}
                className="flex-1 h-[40px] rounded-full bg-[#F3F5F9] text-[#4B5563] text-[13.5px] font-medium cursor-pointer active:bg-slate-200/80 transition-colors"
              >
                重置
              </button>
              <button
                type="button"
                onClick={handleConfirmFilter}
                className="flex-1 h-[40px] rounded-full bg-[#2856EB] text-white text-[13.5px] font-semibold cursor-pointer active:opacity-90 transition-opacity"
              >
                确定
              </button>
            </div>
          </div>

          {/* 5. Price Range Filter Drawer (6 options + Reset/Confirm) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute inset-x-0 top-0 bg-white rounded-b-[20px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activePanel === 'price'
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : '-translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <div className="px-4 pt-4 pb-3.5">
              <div className="grid grid-cols-3 gap-2">
                {PRICE_RANGE_OPTIONS.map((option) => {
                  const selected = draftPriceRange === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setDraftPriceRange(option)}
                      className={`h-[38px] px-2 rounded-[10px] text-[12.5px] tabular-nums cursor-pointer transition-all ${
                        selected
                          ? 'bg-[#EEF4FF] text-[#2856EB] font-semibold ring-1 ring-[#2856EB]/30'
                          : 'bg-[#F5F7FA] text-[#374151] font-normal active:bg-slate-200/70'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="px-4 pt-2.5 pb-4 border-t border-slate-100 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetDraft}
                className="flex-1 h-[40px] rounded-full bg-[#F3F5F9] text-[#4B5563] text-[13.5px] font-medium cursor-pointer active:bg-slate-200/80 transition-colors"
              >
                重置
              </button>
              <button
                type="button"
                onClick={handleConfirmFilter}
                className="flex-1 h-[40px] rounded-full bg-[#2856EB] text-white text-[13.5px] font-semibold cursor-pointer active:opacity-90 transition-opacity"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Bottom Sheet */}
      {selectedCourse && (
        <div
          onClick={() => setSelectedCourse(null)}
          className="absolute inset-0 z-[70] bg-black/50 flex items-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-t-[24px] max-h-[82%] flex flex-col animate-slide-up overflow-hidden"
          >
            <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11.5px] font-medium text-[#2856EB]">
                  {selectedCourse.category} · {selectedCourse.deliveryMode}
                </div>
                <h3 className="mt-1 text-[15.5px] font-bold text-[#181C24] leading-snug">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="w-8 h-8 rounded-full bg-[#F3F5F9] text-[#6B7280] flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="关闭课程详情"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <p className="text-[13px] text-[#596170] leading-relaxed">
                {selectedCourse.subtitle}
              </p>

              <div className="rounded-[14px] bg-[#F7F9FC] p-3.5 space-y-2 text-[12.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#8E96A4]">授课周期</span>
                  <span className="text-[#181C24] font-medium tabular-nums">
                    {selectedCourse.dateRange}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E96A4]">主讲团队</span>
                  <span className="text-[#181C24] font-medium">
                    {selectedCourse.teachers.join(' · ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E96A4]">课程类型</span>
                  <span className="text-[#181C24] font-medium">
                    {selectedCourse.courseTypes.slice(0, 3).join(' / ')}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[13px] font-semibold text-[#181C24] mb-2">课程大纲</div>
                <div className="space-y-2">
                  {selectedCourse.syllabus.map((line, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2.5 text-[12.5px] text-[#4B5563] leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2856EB] mt-2 shrink-0" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
              <div>
                <div className="text-[18px] font-bold text-[#F05A28] tabular-nums leading-none">
                  {selectedCourse.priceLabel}
                </div>
                <div className="text-[11px] text-[#8E96A4] mt-1">{selectedCourse.buyersText}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEnrolledIds((prev) =>
                    prev.includes(selectedCourse.id)
                      ? prev
                      : [...prev, selectedCourse.id],
                  );
                }}
                className={`px-6 h-[42px] rounded-full text-[13.5px] font-semibold cursor-pointer transition-all ${
                  enrolledIds.includes(selectedCourse.id)
                    ? 'bg-[#EEF4FF] text-[#2856EB]'
                    : 'bg-[#2856EB] text-white active:opacity-90'
                }`}
              >
                {enrolledIds.includes(selectedCourse.id) ? '已加入我的课程' : '立即报名'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
