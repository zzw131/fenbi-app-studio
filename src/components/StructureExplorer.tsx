import React from 'react';
import { RotateCcw, ArrowRight, Layers, Compass, Smartphone } from 'lucide-react';
import { SCREEN_DOCS } from '../data/fenbiData';
import { AppView, ExamProfile } from '../types/app';

interface StructureExplorerProps {
  currentView: AppView;
  examProfile: ExamProfile;
  onJumpToDocScreen: (docId: string) => void;
  onRestartOnboarding: () => void;
}

export const StructureExplorer: React.FC<StructureExplorerProps> = ({
  currentView,
  examProfile,
  onJumpToDocScreen,
  onRestartOnboarding,
}) => {
  const activeDocId =
    currentView.kind === 'onboarding'
      ? currentView.screen === 'sms_login' || currentView.screen === 'password_login'
        ? 'login'
        : currentView.screen
      : currentView.kind === 'quiz'
      ? 'quiz'
      : currentView.tab;

  const activeDoc = SCREEN_DOCS.find((d) => d.id === activeDocId) || SCREEN_DOCS[0];

  return (
    <aside className="hidden lg:flex flex-col w-[460px] xl:w-[520px] bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)] overflow-hidden max-h-[820px]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-[#F7FAFF] to-white">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#3A7AFE]" />
            <h2 className="text-[16px] font-bold text-slate-900">粉笔教育 App 界面结构导航</h2>
          </div>
          <p className="text-[12px] text-slate-500 mt-1">
            目标：{examProfile.examName} · {examProfile.stage} · {examProfile.region} · {examProfile.categoryType}
          </p>
        </div>

        <button
          type="button"
          onClick={onRestartOnboarding}
          className="px-3 py-1.5 rounded-lg bg-[#EEF4FF] hover:bg-[#DCEBFF] text-[#3A7AFE] text-[12px] font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>重走启动流程</span>
        </button>
      </div>

      {/* Active Screen Inspector */}
      <div className="px-6 py-4 bg-[#FAFCFF] border-b border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] font-semibold text-[#3A7AFE] tabular-nums">
            当前界面 · 截图 #{activeDoc.screenshotNo}
          </span>
          <span className="text-[11.5px] text-slate-400">com.fenbi.android.servant</span>
        </div>
        <h3 className="text-[17px] font-bold text-slate-900 mt-1">{activeDoc.title}</h3>
        <p className="text-[12.5px] text-slate-500 mt-0.5">{activeDoc.subtitle}</p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-slate-700 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-[#3A7AFE]" />
              <span>核心界面元素</span>
            </div>
            <ul className="space-y-1 text-[11.5px] text-slate-600">
              {activeDoc.elements.map((el) => (
                <li key={el} className="leading-snug">
                  · {el}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-slate-700 mb-1.5">
              <Compass className="w-3.5 h-3.5 text-[#3A7AFE]" />
              <span>交互跳转规则</span>
            </div>
            <ul className="space-y-1.5 text-[11.5px] text-slate-600">
              {activeDoc.actions.map((act) => (
                <li key={act.trigger} className="leading-snug">
                  <div className="font-medium text-slate-800">{act.trigger}</div>
                  <div className="text-[#3A7AFE] flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span>{act.target}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 17-Screen Quick Jump Map */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        <div className="text-[12px] font-bold text-slate-500 mb-2">
          全流程界面直达（点击任意节点在左侧预览）
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SCREEN_DOCS.map((doc) => {
            const isActive = doc.id === activeDocId;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => onJumpToDocScreen(doc.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#EEF4FF] border-[#3A7AFE] shadow-xs'
                    : 'bg-white border-slate-100 hover:border-[#3A7AFE]/40 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[11px] font-semibold tabular-nums ${
                      isActive ? 'text-[#3A7AFE]' : 'text-slate-400'
                    }`}
                  >
                    #{doc.screenshotNo}
                  </span>
                </div>
                <div
                  className={`text-[13px] font-bold mt-0.5 truncate ${
                    isActive ? 'text-[#1E4FBD]' : 'text-slate-800'
                  }`}
                >
                  {doc.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{doc.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
