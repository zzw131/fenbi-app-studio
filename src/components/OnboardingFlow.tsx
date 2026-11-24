import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  Gift,
  Sparkles,
  X,
  ArrowRight,
  Lock,
  Smartphone,
} from 'lucide-react';
import {
  EXAM_CATEGORIES,
  GUOKAO_TYPES,
  REGIONS,
  WELCOME_GIFTS,
} from '../data/fenbiData';
import { ExamProfile, OnboardingScreen } from '../types/app';
import { FenbiLogo, StatusBar } from './FenbiIcons';

interface OnboardingFlowProps {
  screen: OnboardingScreen;
  examProfile: ExamProfile;
  onNavigate: (screen: OnboardingScreen) => void;
  onUpdateProfile: (patch: Partial<ExamProfile>) => void;
  onLoginSuccess: (phone: string, nickname?: string) => void;
  onFinishOnboarding: (claimedGifts: string[], targetTab?: 'practice' | 'course') => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  screen,
  examProfile,
  onNavigate,
  onUpdateProfile,
  onLoginSuccess,
  onFinishOnboarding,
}) => {
  const [policyDoc, setPolicyDoc] = useState<null | 'user' | 'privacy' | 'brief'>(null);
  const [declinedNotice, setDeclinedNotice] = useState(false);
  const [agreedLogin, setAgreedLogin] = useState(true);
  const [agreementWarning, setAgreementWarning] = useState(false);

  // Login form states
  const [phone, setPhone] = useState('13800138000');
  const [smsCode, setSmsCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Slider captcha states
  const [sliderX, setSliderX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [captchaFailed, setCaptchaFailed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const TARGET_X = 176;
  const MAX_TRACK_X = 236;

  // Welcome gifts
  const [selectedGifts, setSelectedGifts] = useState<string[]>(['pack', 'vip', 'job']);

  const handleSliderMove = (clientX: number) => {
    if (!isDragging || captchaPassed || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const rawX = clientX - rect.left - 24;
    const clamped = Math.max(0, Math.min(MAX_TRACK_X, rawX));
    setSliderX(clamped);
  };

  const handleSliderEnd = () => {
    if (!isDragging || captchaPassed) return;
    setIsDragging(false);
    if (Math.abs(sliderX - TARGET_X) <= 16) {
      setSliderX(TARGET_X);
      setCaptchaPassed(true);
      setCaptchaFailed(false);
      setTimeout(() => {
        setCaptchaPassed(false);
        setSliderX(0);
        onNavigate('goal_exam');
      }, 650);
    } else {
      setCaptchaFailed(true);
      setTimeout(() => {
        setSliderX(0);
        setCaptchaFailed(false);
      }, 420);
    }
  };

  const handleSmsLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^1\d{10}$/.test(phone)) {
      setLoginError('请输入正确的 11 位手机号码');
      return;
    }
    if (smsCode.trim().length < 4) {
      setLoginError('请输入 4-6 位验证码（演示输入任意4位即可）');
      return;
    }
    setLoginError('');
    onLoginSuccess(phone, `粉笔学员_${phone.slice(-4)}`);
    onNavigate('goal_exam');
  };

  const handlePasswordLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 5 || password.trim().length < 4) {
      setLoginError('请输入账号与至少 4 位密码');
      return;
    }
    setLoginError('');
    onLoginSuccess(phone, `上岸考生_${phone.slice(-4)}`);
    onNavigate('goal_exam');
  };

  // Screen 01: 用户协议弹窗
  if (screen === 'agreement') {
    return (
      <div className="relative flex flex-col h-full bg-[#242629] text-slate-900 select-none">
        <StatusBar dark time="1:27" />

        {/* Dimmed splash background with Fenbi logo at bottom */}
        <div className="flex-1 flex flex-col items-center justify-end pb-10 px-6">
          <div className="flex items-center gap-2 opacity-35 mb-3">
            <FenbiLogo className="w-7 h-7 grayscale" />
            <span className="text-lg font-bold tracking-wide text-slate-400">粉笔</span>
          </div>
          <p className="text-[11px] text-slate-500">© 2012-2026 fenbi. All Rights Reserved.</p>
        </div>

        {/* Center Agreement Modal */}
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center px-6">
          <div className="w-full max-w-[310px] bg-white rounded-3xl px-6 pt-6 pb-5 shadow-2xl animate-fade-scale">
            <h2 className="text-[17px] font-bold text-center text-slate-900 mb-3.5">
              用户协议和隐私政策
            </h2>
            <div className="text-[13px] leading-[1.68] text-slate-600 space-y-2.5 max-h-[210px] overflow-y-auto pr-1">
              <p>
                亲爱的用户，感谢您信任并使用粉笔，我们依据相关法律制定了
                <button
                  type="button"
                  onClick={() => setPolicyDoc('user')}
                  className="text-[#3A7AFE] font-medium hover:underline mx-0.5"
                >
                  《用户协议》
                </button>
                和
                <button
                  type="button"
                  onClick={() => setPolicyDoc('privacy')}
                  className="text-[#3A7AFE] font-medium hover:underline mx-0.5"
                >
                  《隐私政策》
                </button>
                ，请您在点击同意之前仔细阅读并充分理解相关条款。
              </p>
              <p>
                我们深知个人信息安全与隐私保护非常重要，您可以通过点击阅读
                <button
                  type="button"
                  onClick={() => setPolicyDoc('brief')}
                  className="text-[#3A7AFE] font-medium hover:underline mx-0.5"
                >
                  《隐私条款简版》
                </button>
                简单地了解我们是如何收集、处理使用个人信息的。
              </p>
            </div>

            {declinedNotice && (
              <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[12px] text-amber-800">
                需同意《用户协议》和《隐私政策》后方可进入粉笔教育题库与课程服务。
              </div>
            )}

            <div className="mt-5 flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setDeclinedNotice(false);
                  onNavigate('login');
                }}
                className="w-full h-11 rounded-full bg-gradient-to-r from-[#4285FF] to-[#2F6BFF] text-white text-[15px] font-semibold shadow-md shadow-[#3A7AFE]/30 active:scale-[0.98] transition-transform cursor-pointer"
              >
                同意并继续
              </button>
              <button
                type="button"
                onClick={() => setDeclinedNotice(true)}
                className="py-1.5 px-4 text-[13px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                不同意
              </button>
            </div>
          </div>
        </div>

        {/* Policy Document Viewer */}
        {policyDoc && (
          <div className="absolute inset-0 bg-black/50 flex items-end z-30">
            <div className="w-full bg-white rounded-t-3xl p-5 max-h-[75%] flex flex-col animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-[15px] font-bold text-slate-900">
                  {policyDoc === 'user'
                    ? '粉笔教育《用户协议》'
                    : policyDoc === 'privacy'
                    ? '粉笔教育《隐私政策》'
                    : '《隐私条款简版》'}
                </h3>
                <button
                  type="button"
                  onClick={() => setPolicyDoc(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="py-3 overflow-y-auto text-[12.5px] leading-relaxed text-slate-600 space-y-2.5">
                <p>1. 我们仅收集提供刷题练习、课程学习、选岗匹配所必需的账号与学习记录信息。</p>
                <p>2. 您的做题正确率、笔记与收藏仅用于个性化智能练题推荐与备考统计。</p>
                <p>3. 您可以随时在「我 - 设置」中管理授权权限或注销账号。</p>
              </div>
              <button
                type="button"
                onClick={() => setPolicyDoc(null)}
                className="mt-2 w-full h-10 rounded-full bg-[#3A7AFE] text-white text-sm font-medium cursor-pointer"
              >
                我已了解
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Screen 02: 登录选择页
  if (screen === 'login') {
    return (
      <div className="relative flex flex-col h-full bg-gradient-to-b from-[#F8FAFF] via-white to-white overflow-hidden">
        <StatusBar time="2:10" />

        {/* Subtle geometric background */}
        <div className="absolute -right-12 top-16 w-44 h-44 rounded-3xl bg-[#3A7AFE]/[0.04] rotate-12 pointer-events-none" />
        <div className="absolute -left-16 top-40 w-40 h-40 rounded-3xl bg-[#3A7AFE]/[0.04] -rotate-12 pointer-events-none" />

        {/* Top-right guest link */}
        <div className="flex justify-end px-5 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('captcha')}
            className="inline-flex items-center gap-0.5 text-[14px] text-slate-500 hover:text-slate-800 py-1.5 px-2 cursor-pointer"
          >
            <span>随便逛逛</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
          <div className="mb-20 flex flex-col items-center">
            <div className="drop-shadow-[0_12px_20px_rgba(58,122,254,0.22)]">
              <FenbiLogo className="w-16 h-16" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!agreedLogin) {
                setAgreementWarning(true);
                return;
              }
              onNavigate('sms_login');
            }}
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#4285FF] to-[#2F6BFF] text-white text-[15px] font-semibold shadow-lg shadow-[#3A7AFE]/25 active:scale-[0.98] transition-transform cursor-pointer"
          >
            短信验证码登录
          </button>

          <button
            type="button"
            onClick={() => {
              if (!agreedLogin) {
                setAgreementWarning(true);
                return;
              }
              onNavigate('password_login');
            }}
            className="mt-5 text-[14px] text-slate-500 hover:text-slate-800 py-1.5 px-4 cursor-pointer"
          >
            账号密码登录
          </button>

          {agreementWarning && !agreedLogin && (
            <p className="mt-3 text-[12px] text-rose-500">请先勾选下方用户协议与隐私政策</p>
          )}
        </div>

        {/* Bottom agreement checkbox */}
        <div className="px-6 pb-8 flex items-center justify-center">
          <label className="flex items-center gap-2 text-[12px] text-slate-400 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => {
                setAgreedLogin(!agreedLogin);
                setAgreementWarning(false);
              }}
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                agreedLogin
                  ? 'bg-[#3A7AFE] border-[#3A7AFE] text-white'
                  : 'border-slate-300 bg-white'
              }`}
              aria-label="同意用户协议"
            >
              {agreedLogin && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </button>
            <span>
              我已阅读<span className="text-[#3A7AFE]">用户协议</span>、
              <span className="text-[#3A7AFE]">隐私政策</span>，并同意协议内容
            </span>
          </label>
        </div>
      </div>
    );
  }

  // Sub-page: 短信验证码登录 & 账号密码登录
  if (screen === 'sms_login' || screen === 'password_login') {
    const isSms = screen === 'sms_login';
    return (
      <div className="flex flex-col h-full bg-white">
        <StatusBar time="2:11" />
        <div className="px-4 py-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setLoginError('');
              onNavigate('login');
            }}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('captcha')}
            className="text-[13px] text-slate-500 hover:text-slate-800 px-2 py-1 cursor-pointer"
          >
            随便逛逛 &gt;
          </button>
        </div>

        <div className="px-7 pt-6 flex-1">
          <h1 className="text-[22px] font-bold text-slate-900">
            {isSms ? '短信验证码登录' : '账号密码登录'}
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            {isSms ? '未注册的手机号验证后将自动创建粉笔账号' : '使用粉笔注册手机号或邮箱登录'}
          </p>

          <form
            onSubmit={isSms ? handleSmsLoginSubmit : handlePasswordLoginSubmit}
            className="mt-8 space-y-4"
          >
            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-2.5 focus-within:border-[#3A7AFE]">
              <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-[14px] font-medium text-slate-700 pr-2 border-r border-slate-200">
                +86
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="flex-1 text-[15px] text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
              />
            </div>

            {isSms ? (
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 focus-within:border-[#3A7AFE]">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  placeholder="请输入验证码（如 8888）"
                  className="flex-1 text-[15px] text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(true);
                    setSmsCode('8866');
                  }}
                  className="text-[13px] font-medium text-[#3A7AFE] hover:text-[#2864EB] whitespace-nowrap cursor-pointer"
                >
                  {codeSent ? '已填入演示码' : '获取验证码'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 focus-within:border-[#3A7AFE]">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入登录密码"
                  className="flex-1 text-[15px] text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
                />
              </div>
            )}

            {loginError && <p className="text-[12px] text-rose-500">{loginError}</p>}

            <button
              type="submit"
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#4285FF] to-[#2F6BFF] text-white text-[15px] font-semibold shadow-md shadow-[#3A7AFE]/25 mt-6 cursor-pointer active:scale-[0.98] transition-transform"
            >
              登录并进入
            </button>
          </form>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setLoginError('');
                onNavigate(isSms ? 'password_login' : 'sms_login');
              }}
              className="text-[13px] text-slate-500 hover:text-[#3A7AFE] cursor-pointer"
            >
              {isSms ? '切换账号密码登录' : '切换短信验证码登录'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: 安全验证（滑块拼图）
  if (screen === 'captcha') {
    return (
      <div
        className="relative flex flex-col h-full bg-slate-900/60 select-none"
        onMouseMove={(e) => handleSliderMove(e.clientX)}
        onMouseUp={handleSliderEnd}
        onMouseLeave={handleSliderEnd}
        onTouchMove={(e) => {
          if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
        }}
        onTouchEnd={handleSliderEnd}
      >
        <StatusBar dark time="2:11" />
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="w-full max-w-[310px] bg-white rounded-2xl p-4 shadow-2xl animate-fade-scale">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3A7AFE]" />
                <span className="text-[14px] font-semibold text-slate-900">安全验证</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSliderX(0);
                  onNavigate('login');
                }}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Puzzle canvas */}
            <div className="relative h-36 rounded-xl overflow-hidden bg-gradient-to-br from-[#2B62E1] via-[#4C8BFF] to-[#7CC0FF] mb-3.5">
              {/* Geometric decorative hills */}
              <div className="absolute -bottom-8 -left-4 w-44 h-28 rounded-full bg-white/15" />
              <div className="absolute -bottom-10 right-2 w-48 h-32 rounded-full bg-[#1C48B8]/25" />
              <div className="absolute top-4 left-6 text-white/90 text-[13px] font-semibold">
                粉笔安全中心
              </div>
              <div className="absolute top-9 left-6 text-white/75 text-[11px]">
                请拖动下方滑块完成拼图验证
              </div>

              {/* Target slot */}
              <div
                style={{ left: `${TARGET_X}px` }}
                className="absolute top-12 w-11 h-11 rounded-lg bg-slate-900/45 border-2 border-dashed border-white/80 shadow-inner"
              />

              {/* Movable puzzle block */}
              <div
                style={{ left: `${sliderX}px` }}
                className={`absolute top-12 w-11 h-11 rounded-lg shadow-lg flex items-center justify-center border-2 transition-colors ${
                  captchaPassed
                    ? 'bg-emerald-400 border-white text-white'
                    : captchaFailed
                    ? 'bg-rose-400 border-white text-white'
                    : 'bg-white/95 border-[#3A7AFE] text-[#3A7AFE]'
                }`}
              >
                {captchaPassed ? <Check className="w-5 h-5 stroke-[3]" /> : <FenbiLogo className="w-6 h-6" />}
              </div>
            </div>

            {/* Slider track */}
            <div
              ref={trackRef}
              className={`relative h-11 rounded-full border flex items-center justify-center text-[12px] transition-colors ${
                captchaPassed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : captchaFailed
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              <span>
                {captchaPassed
                  ? '验证通过，正在进入...'
                  : captchaFailed
                  ? '未对齐缺口，请重试'
                  : '向右拖动滑块填充拼图'}
              </span>

              {/* Fill progress */}
              <div
                style={{ width: `${sliderX + 24}px` }}
                className={`absolute left-0 top-0 bottom-0 rounded-l-full pointer-events-none ${
                  captchaPassed ? 'bg-emerald-400/20' : 'bg-[#3A7AFE]/15'
                }`}
              />

              {/* Knob */}
              <button
                type="button"
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
                style={{ left: `${sliderX}px` }}
                className={`absolute top-0.5 w-10 h-10 rounded-full shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
                  captchaPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-[#3A7AFE] border border-slate-200'
                }`}
                aria-label="拖动滑块"
              >
                {captchaPassed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>也可点击快捷模拟通过</span>
              <button
                type="button"
                onClick={() => {
                  setSliderX(TARGET_X);
                  setCaptchaPassed(true);
                  setTimeout(() => {
                    setCaptchaPassed(false);
                    setSliderX(0);
                    onNavigate('goal_exam');
                  }, 400);
                }}
                className="text-[#3A7AFE] font-medium hover:underline cursor-pointer"
              >
                一键完成验证
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 03: 目标考试选择页
  if (screen === 'goal_exam') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-[#F4F7FC] via-[#F7F9FD] to-white">
        <StatusBar time="2:12" />
        <div className="px-5 pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onFinishOnboarding([])}
            className="text-[14px] text-slate-400 hover:text-slate-600 py-1 cursor-pointer"
          >
            跳过
          </button>
        </div>

        <div className="text-center px-6 pt-3 pb-5">
          <h1 className="text-[21px] font-bold text-slate-800 tracking-tight">你的目标考试是？</h1>
          <p className="text-[12px] text-slate-400 mt-1.5">填写完成将为你定制你的个性化题库</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
          <div className="grid grid-cols-3 gap-2.5">
            {EXAM_CATEGORIES.map((exam) => {
              const selected = examProfile.examName === exam;
              return (
                <button
                  key={exam}
                  type="button"
                  onClick={() => {
                    onUpdateProfile({ examName: exam });
                    onNavigate('goal_stage');
                  }}
                  className={`h-10 px-3 rounded-full bg-white flex items-center justify-between text-[12.5px] font-medium shadow-[0_2px_8px_rgba(15,23,42,0.04)] border transition-all active:scale-[0.97] cursor-pointer ${
                    selected
                      ? 'border-[#3A7AFE] text-[#3A7AFE]'
                      : 'border-slate-100 text-slate-700 hover:border-[#3A7AFE]/40'
                  }`}
                >
                  <span className="truncate">{exam}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="py-4 text-center text-[12px] text-slate-400 shrink-0">
          该信息可随时在首页更改
        </div>
      </div>
    );
  }

  // Screen 04: 公务员考试二级选择（笔试/面试）
  if (screen === 'goal_stage') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-[#F4F7FC] via-[#F7F9FD] to-white">
        <StatusBar time="2:13" />
        <div className="px-5 pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onFinishOnboarding([])}
            className="text-[14px] text-slate-400 hover:text-slate-600 py-1 cursor-pointer"
          >
            跳过
          </button>
        </div>

        <div className="text-center px-6 pt-3 pb-6">
          <h1 className="text-[21px] font-bold text-slate-800 tracking-tight">你的目标考试是？</h1>
          <p className="text-[12px] text-slate-400 mt-1.5">填写完成将为你定制你的个性化题库</p>
        </div>

        <div className="px-6 flex-1">
          <button
            type="button"
            onClick={() => onNavigate('goal_exam')}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white text-[#3A7AFE] text-[13px] font-medium shadow-sm border border-slate-100 mb-6 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{examProfile.examName}</span>
          </button>

          <div className="space-y-4 max-w-[270px] mx-auto mt-2">
            <button
              type="button"
              onClick={() => {
                onUpdateProfile({ stage: '笔试' });
                onNavigate('goal_region');
              }}
              className="w-full h-13 px-6 rounded-full bg-white flex items-center justify-between text-[15px] font-semibold text-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.05)] border border-slate-100 hover:border-[#3A7AFE]/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="flex-1 text-center pl-4">笔试</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                onUpdateProfile({ stage: '面试' });
                onFinishOnboarding([], 'course');
              }}
              className="w-full h-13 px-6 rounded-full bg-white flex items-center justify-between text-[15px] font-semibold text-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.05)] border border-slate-100 hover:border-[#3A7AFE]/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="flex-1 text-center pl-4">面试</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <p className="text-center text-[11px] text-slate-400 mt-5">
            选择「笔试」定制地区与考试类别；选择「面试」直达面试课程
          </p>
        </div>

        <div className="py-4 text-center text-[12px] text-slate-400 shrink-0">
          该信息可随时在首页更改
        </div>
      </div>
    );
  }

  // Screen 05: 地区选择页
  if (screen === 'goal_region') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-[#F4F7FC] via-[#F7F9FD] to-white">
        <StatusBar time="2:13" />
        <div className="px-5 pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onFinishOnboarding([])}
            className="text-[14px] text-slate-400 hover:text-slate-600 py-1 cursor-pointer"
          >
            跳过
          </button>
        </div>

        <div className="text-center px-6 pt-2 pb-4">
          <h1 className="text-[21px] font-bold text-slate-800 tracking-tight">你的目标考试是？</h1>
          <p className="text-[12px] text-slate-400 mt-1.5">填写完成将为你定制你的个性化题库</p>
        </div>

        <div className="px-4 mb-3">
          <button
            type="button"
            onClick={() => onNavigate('goal_stage')}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white text-[#3A7AFE] text-[13px] font-medium shadow-sm border border-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{examProfile.stage}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
          <div className="grid grid-cols-3 gap-2.5">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => {
                  onUpdateProfile({ region });
                  onNavigate('goal_type');
                }}
                className="h-10 px-3.5 rounded-full bg-white flex items-center justify-between text-[13px] font-medium text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-slate-100 hover:border-[#3A7AFE]/50 active:scale-[0.97] transition-all cursor-pointer"
              >
                <span className="truncate">{region}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="py-4 text-center text-[12px] text-slate-400 shrink-0">
          该信息可随时在首页更改
        </div>
      </div>
    );
  }

  // Screen 06: 考试类别选择页
  if (screen === 'goal_type') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-[#F4F7FC] via-[#F7F9FD] to-white">
        <StatusBar time="2:14" />
        <div className="px-5 pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onFinishOnboarding([])}
            className="text-[14px] text-slate-400 hover:text-slate-600 py-1 cursor-pointer"
          >
            跳过
          </button>
        </div>

        <div className="text-center px-6 pt-3 pb-6">
          <h1 className="text-[21px] font-bold text-slate-800 tracking-tight">你的目标考试是？</h1>
          <p className="text-[12px] text-slate-400 mt-1.5">填写完成将为你定制你的个性化题库</p>
        </div>

        <div className="px-6 flex-1">
          <button
            type="button"
            onClick={() => onNavigate('goal_region')}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white text-[#3A7AFE] text-[13px] font-medium shadow-sm border border-slate-100 mb-6 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{examProfile.region}</span>
          </button>

          <div className="space-y-3.5 max-w-[270px] mx-auto">
            {GUOKAO_TYPES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onUpdateProfile({ categoryType: item.label });
                  onNavigate('welcome_gift');
                }}
                className="w-full h-13 px-6 rounded-full bg-white flex items-center justify-center text-[15px] font-semibold text-slate-800 shadow-[0_4px_14px_rgba(15,23,42,0.05)] border border-slate-100 hover:border-[#3A7AFE] hover:text-[#3A7AFE] active:scale-[0.98] transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-4 text-center text-[12px] text-slate-400 shrink-0">
          该信息可随时在首页更改
        </div>
      </div>
    );
  }

  // Screen 07: 新人福利选择页
  return (
    <div className="relative flex flex-col h-full bg-gradient-to-b from-[#EDF4FF] via-[#F7FAFF] to-white">
      <StatusBar time="2:15" />

      <div className="px-5 pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('goal_type')}
          className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-600 shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onFinishOnboarding([])}
          className="text-[13px] text-slate-400 hover:text-slate-600 py-1 px-2 cursor-pointer"
        >
          放弃福利
        </button>
      </div>

      <div className="px-6 pt-4 pb-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A7AFE]/10 text-[#3A7AFE] text-[12px] font-medium mb-2.5">
          <Gift className="w-3.5 h-3.5" />
          <span>已定制：{examProfile.region} · {examProfile.categoryType}</span>
        </div>
        <h1 className="text-[22px] font-bold text-slate-900">新人专属备考福利</h1>
        <p className="text-[12.5px] text-slate-500 mt-1">为你匹配上岸起步权益，可多选免费领取</p>
      </div>

      <div className="flex-1 px-5 space-y-3 overflow-y-auto no-scrollbar">
        {WELCOME_GIFTS.map((gift) => {
          const checked = selectedGifts.includes(gift.id);
          return (
            <button
              key={gift.id}
              type="button"
              onClick={() =>
                setSelectedGifts((prev) =>
                  prev.includes(gift.id) ? prev.filter((i) => i !== gift.id) : [...prev, gift.id]
                )
              }
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                checked
                  ? 'bg-white border-[#3A7AFE] shadow-[0_6px_18px_rgba(58,122,254,0.12)]'
                  : 'bg-white/80 border-slate-100 text-slate-500'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-slate-900">{gift.title}</span>
                  <span className="text-[11px] font-medium text-[#3A7AFE] bg-[#EEF4FF] px-1.5 py-0.5 rounded">
                    {gift.tag}
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 mt-1">{gift.subtitle}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  checked ? 'bg-[#3A7AFE] text-white' : 'border border-slate-300 bg-slate-50'
                }`}
              >
                {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 pt-3 pb-7 space-y-2.5 bg-gradient-to-t from-white via-white to-transparent">
        <button
          type="button"
          onClick={() => onFinishOnboarding(WELCOME_GIFTS.map((g) => g.id))}
          className="w-full h-12 rounded-full bg-gradient-to-r from-[#4285FF] to-[#2F6BFF] text-white text-[15px] font-semibold shadow-lg shadow-[#3A7AFE]/25 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>全部都要 · 立即开启备考</span>
        </button>
        {selectedGifts.length > 0 && selectedGifts.length < WELCOME_GIFTS.length && (
          <button
            type="button"
            onClick={() => onFinishOnboarding(selectedGifts)}
            className="w-full h-10 rounded-full border border-[#3A7AFE]/40 text-[#3A7AFE] text-[13.5px] font-medium cursor-pointer"
          >
            仅领取已选 {selectedGifts.length} 项
          </button>
        )}
      </div>
    </div>
  );
};
