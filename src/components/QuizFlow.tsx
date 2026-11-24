import React, { useEffect, useState } from 'react';
import {
  X,
  AlarmClock,
  Pin,
  Download,
  PenLine,
  FileSpreadsheet,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_SUBJECTS, QUIZ_QUESTIONS } from '../data/fenbiData';
import { StatusBar } from './FenbiIcons';

interface QuizFlowProps {
  subjectId: string;
  initialShowSheet?: boolean;
  onClose: (answeredCount: number) => void;
}

export const QuizFlow: React.FC<QuizFlowProps> = ({
  subjectId,
  initialShowSheet = false,
  onClose,
}) => {
  const questions = QUIZ_QUESTIONS[subjectId] || QUIZ_QUESTIONS.politics;
  const subjectName = INITIAL_SUBJECTS.find((s) => s.id === subjectId)?.name || '政治理论';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showSheet, setShowSheet] = useState(initialShowSheet);
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);

  const formatTime = (sec: number) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const currentQ = questions[currentIndex];
  const selectedKey = answers[currentQ.id];
  const isPinned = pinnedIds.includes(currentQ.id);
  const answeredCount = Object.keys(answers).length;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 1600);
  };

  const correctCount = questions.filter((q) => answers[q.id] === q.correctKey).length;

  // Post-submit Report View
  if (submitted) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="flex flex-col h-full bg-[#F5F7FA]">
        <StatusBar time="2:28" />
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <button
            type="button"
            onClick={() => onClose(answeredCount)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-[16px] font-bold text-slate-900">练习报告 · {subjectName}</h2>
          <span className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* Summary Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#3A7AFE] to-[#2459D8] p-5 text-white shadow-lg shadow-[#3A7AFE]/25">
            <div className="text-[12.5px] text-white/80">专项智能练习已完成</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[40px] font-extrabold leading-none tabular-nums">
                {accuracy}%
              </span>
              <span className="text-[13px] text-white/85">正确率</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-3 text-center">
              <div>
                <div className="text-[16px] font-bold tabular-nums">
                  {correctCount}/{questions.length}
                </div>
                <div className="text-[11px] text-white/75 mt-0.5">答对题数</div>
              </div>
              <div>
                <div className="text-[16px] font-bold tabular-nums">{answeredCount}</div>
                <div className="text-[11px] text-white/75 mt-0.5">已作答</div>
              </div>
              <div>
                <div className="text-[16px] font-bold tabular-nums">{formatTime(seconds)}</div>
                <div className="text-[11px] text-white/75 mt-0.5">总用时</div>
              </div>
            </div>
          </div>

          {/* Question Status Grid */}
          <div className="bg-white rounded-2xl p-4">
            <div className="text-[14px] font-bold text-slate-900 mb-3">
              答题情况（点击题号查看解析）
            </div>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isRight = ans === q.correctKey;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setSubmitted(false);
                    }}
                    className={`w-10 h-10 mx-auto rounded-full text-[13.5px] font-semibold tabular-nums flex items-center justify-center cursor-pointer ${
                      !ans
                        ? 'bg-slate-100 text-slate-400'
                        : isRight
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setCurrentIndex(0);
              setSeconds(0);
              setSubmitted(false);
            }}
            className="h-11 rounded-full border border-slate-200 text-slate-700 text-[14px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>再刷一组</span>
          </button>
          <button
            type="button"
            onClick={() => onClose(answeredCount)}
            className="h-11 rounded-full bg-[#3A7AFE] text-white text-[14px] font-semibold cursor-pointer"
          >
            返回练习首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-white select-none">
      <StatusBar time="2:26" />

      {/* Top Toolbar matching Screenshot 13 */}
      <div className="px-3.5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onClose(answeredCount)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-800 cursor-pointer"
            aria-label="关闭答题"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-[14px] font-medium text-slate-700 tabular-nums">
            <AlarmClock className="w-4 h-4 text-slate-600" />
            <span>{formatTime(seconds)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-700">
          <button
            type="button"
            onClick={() => {
              setPinnedIds((prev) =>
                prev.includes(currentQ.id)
                  ? prev.filter((id) => id !== currentQ.id)
                  : [...prev, currentQ.id]
              );
              triggerToast(isPinned ? '已取消标记' : '已标记收藏本题');
            }}
            className={`w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer ${
              isPinned ? 'text-[#3A7AFE]' : 'text-slate-700'
            }`}
            aria-label="标记收藏"
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => triggerToast('本组题目已缓存至离线题库')}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            aria-label="下载题目"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowNoteModal(true)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            aria-label="记笔记"
          >
            <PenLine className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowSheet(true)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#3A7AFE] cursor-pointer"
            aria-label="答题卡"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowSheet(true)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            aria-label="更多"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-header */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[13px]">
        <span className="text-slate-500">专项智能练习（{subjectName}）</span>
        <span className="tabular-nums text-slate-400">
          <strong className="text-[15px] text-slate-800">{currentIndex + 1}</strong>/
          {questions.length}
        </span>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-full bg-slate-900/85 text-white text-[12px] shadow-md">
          {toastMsg}
        </div>
      )}

      {/* Question Body */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 no-scrollbar">
        <span className="inline-block px-2 py-0.5 rounded bg-[#EEF4FF] text-[#3A7AFE] text-[12px] font-medium mb-3">
          {currentQ.type}
        </span>

        <div className="text-[15.5px] leading-[1.72] text-slate-900 font-normal">
          <p>{currentQ.stem}</p>
          {currentQ.statements && (
            <div className="mt-2 space-y-1">
              {currentQ.statements.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}
        </div>

        {/* Options */}
        <div className="mt-6 space-y-4">
          {currentQ.options.map((opt) => {
            const isSelected = selectedKey === opt.key;
            const isCorrect = opt.key === currentQ.correctKey;
            const showResult = Boolean(selectedKey);

            let circleClass = 'border-slate-200 text-slate-600 bg-white';
            let rowTextClass = 'text-slate-800';
            if (showResult) {
              if (isCorrect) {
                circleClass = 'border-emerald-500 bg-emerald-500 text-white';
                rowTextClass = 'text-emerald-700 font-medium';
              } else if (isSelected) {
                circleClass = 'border-rose-500 bg-rose-500 text-white';
                rowTextClass = 'text-rose-600 font-medium';
              }
            }

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQ.id]: opt.key,
                  }))
                }
                className="w-full flex items-center gap-3.5 text-left py-1.5 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <span
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-[14px] font-medium shrink-0 transition-colors ${circleClass}`}
                >
                  {opt.key}
                </span>
                <span className={`text-[15px] leading-snug ${rowTextClass}`}>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Instant Explanation after selection */}
        {selectedKey && (
          <div className="mt-6 rounded-2xl bg-[#F7F9FC] border border-slate-100 p-4 space-y-2.5 animate-fade-scale">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {selectedKey === currentQ.correctKey ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-[14px] font-bold text-emerald-700">回答正确</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-[14px] font-bold text-rose-600">
                      回答错误，你的答案：{selectedKey}
                    </span>
                  </>
                )}
              </div>
              <span className="text-[13px] font-bold text-emerald-700">
                正确答案：{currentQ.correctKey}
              </span>
            </div>

            <div className="text-[12px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span>考点：{currentQ.knowledgePoint}</span>
              <span className="tabular-nums">全站正确率 {currentQ.accuracyRate}</span>
            </div>

            <div className="text-[13px] leading-relaxed text-slate-700">
              <strong className="text-slate-900">【解析】</strong>
              {currentQ.analysis}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Next/Prev/Sheet Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-2.5 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          className="px-3.5 h-9 rounded-full bg-slate-100 text-slate-700 text-[13px] font-medium flex items-center gap-1 disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>上一题</span>
        </button>

        <button
          type="button"
          onClick={() => setShowSheet(true)}
          className="px-4 h-9 rounded-full bg-[#EEF4FF] text-[#3A7AFE] text-[13px] font-semibold cursor-pointer tabular-nums"
        >
          答题卡 ({answeredCount}/{questions.length})
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="px-3.5 h-9 rounded-full bg-[#3A7AFE] text-white text-[13px] font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>下一题</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="px-4 h-9 rounded-full bg-emerald-600 text-white text-[13px] font-semibold cursor-pointer"
          >
            交卷
          </button>
        )}
      </div>

      {/* Screenshot 14: 答题卡弹窗 */}
      {showSheet && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-end">
          <div className="w-full bg-white rounded-t-3xl px-5 pt-4 pb-6 animate-slide-up">
            <div className="relative flex items-center justify-center pb-5">
              <h3 className="text-[16px] font-bold text-slate-900">答题卡</h3>
              <button
                type="button"
                onClick={() => setShowSheet(false)}
                className="absolute right-0 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                aria-label="关闭答题卡"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-y-4 gap-x-2 pb-7">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isCurrent = idx === currentIndex;
                let btnStyle = 'bg-[#F5F7FA] text-slate-600';
                if (ans) {
                  btnStyle =
                    ans === q.correctKey
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-rose-50 text-rose-600 border border-rose-300';
                }
                if (isCurrent) {
                  btnStyle = `${btnStyle} ring-2 ring-[#3A7AFE] ring-offset-1`;
                }
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowSheet(false);
                    }}
                    className={`w-10 h-10 mx-auto rounded-full text-[14px] font-medium tabular-nums flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSheet(false);
                setSubmitted(true);
              }}
              className="w-full h-11 rounded-full bg-gradient-to-r from-[#4285FF] to-[#2F6BFF] text-white text-[15px] font-semibold shadow-md shadow-[#3A7AFE]/25 active:scale-[0.98] transition-transform cursor-pointer"
            >
              交卷
            </button>
          </div>
        </div>
      )}

      {/* Note Scratchpad Modal */}
      {showNoteModal && (
        <div className="absolute inset-0 bg-black/45 z-30 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">第 {currentIndex + 1} 题笔记</h3>
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={4}
              value={notes[currentQ.id] || ''}
              onChange={(e) => setNotes((prev) => ({ ...prev, [currentQ.id]: e.target.value }))}
              placeholder="记录易错考点、记忆口诀或解题思路..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] outline-none focus:border-[#3A7AFE] resize-none"
            />
            <button
              type="button"
              onClick={() => {
                setShowNoteModal(false);
                triggerToast('笔记已保存');
              }}
              className="w-full h-10 rounded-full bg-[#3A7AFE] text-white text-[14px] font-semibold cursor-pointer"
            >
              保存笔记
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
