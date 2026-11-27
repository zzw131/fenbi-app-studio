import React, { useState } from 'react';
import {
  Search,
  Eye,
  MessageSquare,
  ThumbsUp,
  Flame,
  CalendarCheck2,
  PenSquare,
  X,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_FEED_POSTS } from '../../data/fenbiData';
import { FeedPost } from '../../types/app';
import { FenbiLogo, FenbiMascotAvatar } from '../FenbiIcons';

interface DiscoverTabProps {
  coins: number;
  checkedInToday: boolean;
  onCheckIn: () => void;
  onOpenSearch: () => void;
  onOpenAiTeacher: () => void;
}

const DISCOVER_TABS: FeedPost['category'][] = ['推荐', '圈子', '干货', '备考经验', '关注'];

export const DiscoverTab: React.FC<DiscoverTabProps> = ({
  coins,
  checkedInToday,
  onCheckIn,
  onOpenSearch,
  onOpenAiTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<FeedPost['category']>('推荐');
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const visiblePosts = posts.filter((p) => {
    if (activeTab === '推荐') return true;
    if (activeTab === '关注') return p.followed;
    return p.category === activeTab;
  });

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const toggleFollow = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, followed: !p.followed } : p))
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const post: FeedPost = {
      id: `user_${Date.now()}`,
      author: '上岸备考同学',
      authorType: 'user',
      timeOrTag: '刚刚',
      title: newTitle.trim() || undefined,
      content: newContent.trim(),
      category: activeTab === '推荐' || activeTab === '关注' ? '圈子' : activeTab,
      views: 1,
      comments: 0,
      likes: 0,
      liked: false,
      followed: true,
    };
    setPosts((prev) => [post, ...prev]);
    setNewTitle('');
    setNewContent('');
    setShowComposer(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentingPostId || !commentText.trim()) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === commentingPostId ? { ...p, comments: p.comments + 1 } : p))
    );
    setCommentText('');
    setCommentingPostId(null);
  };

  return (
    <div className="relative flex-1 overflow-y-auto bg-[#F5F7FA] pb-24 no-scrollbar">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="px-4 pt-2.5 pb-2 flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-slate-900">发现</h1>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
              aria-label="搜索发现内容"
            >
              <Search className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
              <FenbiMascotAvatar className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="px-4 flex items-center justify-between">
          {DISCOVER_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`relative py-2.5 text-[14px] whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === t ? 'font-bold text-slate-900' : 'font-medium text-slate-500'
              }`}
            >
              {t}
              {activeTab === t && (
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-4 h-[3px] rounded-full bg-[#3A7AFE]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Hot search + Daily check-in bar */}
      <div className="px-3.5 pt-3 space-y-2.5">
        <div className="grid grid-cols-12 gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="col-span-8 bg-gradient-to-r from-[#FFF5F5] to-[#FFF9F2] rounded-xl px-3 py-2 flex items-center gap-2 text-left border border-rose-100/70 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-[12px] font-bold text-slate-900 shrink-0">热搜榜</span>
            <span className="text-[12px] text-rose-600 truncate">特训营挑战赢奖励</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCheckInModal(true)}
            className="col-span-4 relative bg-gradient-to-r from-[#FFFBEB] to-[#FFF7E0] rounded-xl px-2.5 py-2 flex items-center justify-center gap-1.5 border border-amber-100 cursor-pointer"
          >
            <span className="absolute -top-1.5 right-1 px-1.5 py-0.2 rounded-full bg-rose-400 text-white text-[9px] font-bold">
              {checkedInToday ? '已领' : '领粉币'}
            </span>
            <CalendarCheck2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-[12px] font-semibold text-slate-800 whitespace-nowrap">每日签到</span>
          </button>
        </div>

        {/* Feed Cards */}
        {visiblePosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {post.avatarUrl ? (
                  <img
                    src={post.avatarUrl}
                    alt={post.author}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-[13px] shrink-0">
                    {post.author.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-slate-900 truncate">
                    {post.author}
                  </div>
                  <div className="text-[11px] text-slate-400">{post.timeOrTag}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFollow(post.id)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors cursor-pointer shrink-0 ${
                  post.followed
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-[#EEF4FF] text-[#3A7AFE] hover:bg-[#DCEBFF]'
                }`}
              >
                {post.followed ? '已关注' : '+ 关注'}
              </button>
            </div>

            {post.title && (
              <div className="mt-3 flex items-center gap-1.5">
                {post.isPinned && (
                  <span className="px-1.5 py-0.5 rounded bg-[#3A7AFE] text-white text-[10px] font-bold shrink-0">
                    顶
                  </span>
                )}
                <h2 className="text-[15.5px] font-bold text-slate-900 leading-snug">
                  {post.title}
                </h2>
              </div>
            )}

            <p className="mt-2 text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {post.hasImagePlaceholder && (
              <div
                onClick={onOpenAiTeacher}
                className="mt-3 w-36 h-36 rounded-xl bg-slate-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#EEF4FF] transition-colors"
              >
                <FenbiLogo className="w-10 h-10 opacity-30" />
                <span className="text-[11px] text-slate-400">点击咨询 AI 老师</span>
              </div>
            )}

            {/* Post metrics */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-50 flex items-center justify-between text-[12px] text-slate-400 tabular-nums">
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views}</span>
              </span>
              <button
                type="button"
                onClick={() => setCommentingPostId(post.id)}
                className="inline-flex items-center gap-1 hover:text-slate-700 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.comments}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={`inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  post.liked ? 'text-[#3A7AFE] font-semibold' : 'hover:text-slate-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.likes}</span>
              </button>
            </div>
          </article>
        ))}

        {visiblePosts.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-[13.5px] text-slate-400">
            暂无关注动态，去「推荐」逛逛并关注感兴趣的老师吧
          </div>
        )}
      </div>

      {/* Floating Compose Button (Screenshot 11) */}
      <button
        type="button"
        onClick={() => setShowComposer(true)}
        className="fixed lg:absolute bottom-[88px] right-4 z-20 w-12 h-12 rounded-full bg-gradient-to-br from-[#4285FF] to-[#2663EB] text-white shadow-lg shadow-[#3A7AFE]/35 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        aria-label="发布动态"
      >
        <PenSquare className="w-5 h-5" />
      </button>

      {/* Check-in Modal */}
      {showCheckInModal && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center px-6">
          <div className="w-full max-w-[300px] bg-white rounded-3xl p-5 text-center shadow-2xl animate-fade-scale">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-[17px] font-bold text-slate-900">每日备考签到</h3>
            <p className="text-[12.5px] text-slate-500 mt-1 tabular-nums">
              当前粉币余额：<strong className="text-amber-600">{coins}</strong> 粉币
            </p>
            <div className="mt-4">
              {checkedInToday ? (
                <div className="py-2.5 rounded-full bg-emerald-50 text-emerald-700 text-[13px] font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>今日已签到（+20 粉币）</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onCheckIn}
                  className="w-full h-10 rounded-full bg-[#3A7AFE] text-white text-[14px] font-semibold cursor-pointer"
                >
                  立即签到领 +20 粉币
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowCheckInModal(false)}
              className="mt-3 text-[12.5px] text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Composer Modal */}
      {showComposer && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-end">
          <form
            onSubmit={handlePublish}
            className="w-full bg-white rounded-t-3xl p-5 space-y-3 animate-slide-up"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[15.5px] font-bold text-slate-900">发布备考动态</h3>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="标题（选填）"
              className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] outline-none focus:border-[#3A7AFE]"
            />
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="分享今天的刷题心得、笔记或备考疑问..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-[13.5px] outline-none focus:border-[#3A7AFE] resize-none"
            />
            <button
              type="submit"
              className="w-full h-11 rounded-full bg-[#3A7AFE] text-white text-[14.5px] font-semibold cursor-pointer"
            >
              立即发布
            </button>
          </form>
        </div>
      )}

      {/* Quick Comment Modal */}
      {commentingPostId && (
        <div className="absolute inset-0 bg-black/45 z-30 flex items-end">
          <form
            onSubmit={handleAddComment}
            className="w-full bg-white rounded-t-2xl p-4 flex items-center gap-2 animate-slide-up"
          >
            <input
              type="text"
              autoFocus
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下你的评论..."
              className="flex-1 h-10 px-3 rounded-full bg-slate-100 text-[13.5px] outline-none"
            />
            <button
              type="submit"
              className="px-4 h-10 rounded-full bg-[#3A7AFE] text-white text-[13px] font-semibold cursor-pointer"
            >
              发送
            </button>
            <button
              type="button"
              onClick={() => setCommentingPostId(null)}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
