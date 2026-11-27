import React, { useState } from 'react';
import {
  ScanLine,
  Settings,
  ChevronRight,
  Calendar,
  PlayCircle,
  History,
  Download,
  Star,
  ReceiptText,
  Wallet,
  Ticket,
  MessageSquareMore,
  Headphones,
  PhoneCall,
  X,
} from 'lucide-react';
import { AI_TEACHER_AVATAR } from '../../data/fenbiData';
import { UserState } from '../../types/app';
import { FenbiMascotAvatar } from '../FenbiIcons';

interface MeTabProps {
  user: UserState;
  onTriggerLogin: () => void;
  onLogout: () => void;
  onOpenAiTeacher: () => void;
}

export const MeTab: React.FC<MeTabProps> = ({
  user,
  onTriggerLogin,
  onLogout,
  onOpenAiTeacher,
}) => {
  const [drawerTitle, setDrawerTitle] = useState<string | null>(null);

  const renderDrawerBody = () => {
    switch (drawerTitle) {
      case '会员中心':
        return (
          <div className="space-y-3 text-[13px] text-slate-600">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF4DC] to-[#FFE7BA] text-amber-950">
              <div className="font-bold text-[15px]">粉笔刷题 VIP 会员</div>
              <p className="text-[12px] mt-1">含智能刷题解析、AI 申论批改、历年模考报告导出</p>
            </div>
            <p>当前状态：{user.isMember ? '体验会员生效中' : '未开通（可在新人福利免费领 7 天体验）'}</p>
          </div>
        );
      case '我的钱包':
        return (
          <div className="space-y-3 text-[13px] text-slate-600">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50">
                <div className="text-[11.5px] text-slate-400">账户余额</div>
                <div className="text-[18px] font-bold text-slate-900 mt-1 tabular-nums">¥ 0.00</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50">
                <div className="text-[11.5px] text-amber-700">粉币余额</div>
                <div className="text-[18px] font-bold text-amber-600 mt-1 tabular-nums">{user.coins}</div>
              </div>
            </div>
          </div>
        );
      case '电话客服':
        return (
          <div className="space-y-3 text-[13px] text-slate-600">
            <p>官方客服热线：<strong className="text-slate-900 tabular-nums">400 853 6100</strong></p>
            <p>服务时间：每日 08:30 - 22:00（全年无休）</p>
          </div>
        );
      default:
        return (
          <div className="space-y-2.5 text-[13px] text-slate-600">
            <p>当前为「{drawerTitle}」页面预览（原仓库标注：未采集深层子页）。</p>
            <p className="text-[12px] text-slate-400">
              账号状态：{user.isLoggedIn ? `${user.nickname}（已登录）` : '游客浏览模式'}
            </p>
            {user.isLoggedIn && drawerTitle === '设置' && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setDrawerTitle(null);
                }}
                className="mt-2 w-full h-10 rounded-full bg-rose-50 text-rose-600 font-semibold cursor-pointer"
              >
                退出当前账号
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="relative flex-1 overflow-y-auto bg-gradient-to-b from-[#E8F1FD] via-[#F5F7FA] to-[#F5F7FA] pb-24 no-scrollbar">
      {/* Top Icons */}
      <div className="px-4 pt-3 flex items-center justify-end gap-3 text-slate-700">
        <button
          type="button"
          onClick={() => setDrawerTitle('扫一扫')}
          className="w-8 h-8 rounded-full hover:bg-white/60 flex items-center justify-center cursor-pointer"
          aria-label="扫一扫"
        >
          <ScanLine className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setDrawerTitle('设置')}
          className="w-8 h-8 rounded-full hover:bg-white/60 flex items-center justify-center cursor-pointer"
          aria-label="设置"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Login Header */}
      <div className="px-4 pt-2 pb-4">
        <button
          type="button"
          onClick={() => (user.isLoggedIn ? setDrawerTitle('账号信息') : onTriggerLogin())}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
              <FenbiMascotAvatar className="w-full h-full" />
            </div>
            <div>
              <div className="text-[19px] font-bold text-slate-900 group-hover:text-[#3A7AFE] transition-colors">
                {user.isLoggedIn ? user.nickname : '登录/注册'}
              </div>
              <div className="text-[12.5px] text-slate-500 mt-0.5">
                {user.isLoggedIn
                  ? `粉币 ${user.coins} · 已领 ${user.claimedGifts.length} 项新人礼`
                  : '在粉笔，遇见不一样的自己'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

        {/* Dual Banner Cards */}
        <div className="mt-4 grid grid-cols-12 gap-2.5">
          <button
            type="button"
            onClick={() => setDrawerTitle('会员中心')}
            className="col-span-7 rounded-2xl bg-gradient-to-r from-[#FFF1DC] to-[#FFE4BD] p-3 text-left flex items-center justify-between shadow-2xs cursor-pointer"
          >
            <div>
              <div className="text-[14px] font-bold text-[#6E4212]">会员中心</div>
              <div className="text-[11px] text-[#9A6324] mt-0.5">粉笔 AI 带你学申论 &gt;</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-900/10 flex items-center justify-center text-[#6E4212] font-bold">
              V
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenAiTeacher}
            className="col-span-5 rounded-2xl bg-gradient-to-r from-[#DCEBFF] to-[#EDF4FF] p-3 text-left flex items-center justify-between shadow-2xs cursor-pointer"
          >
            <div className="min-w-0">
              <div className="text-[13.5px] font-bold text-slate-900 truncate">备考规划师</div>
              <div className="text-[10.5px] text-[#3A7AFE] mt-0.5 truncate">本地备考班群 &gt;</div>
            </div>
            <img
              src={AI_TEACHER_AVATAR}
              alt="规划师"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-white shrink-0"
            />
          </button>
        </div>
      </div>

      {/* Main Content Cards */}
      <div className="px-3.5 space-y-3">
        {/* Course Calendar */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDrawerTitle('课程日历')}
              className="flex items-center gap-2 text-[15px] font-bold text-slate-900 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#3A7AFE]" />
              <span>课程日历</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => setDrawerTitle('全部课程')}
              className="text-[12.5px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer"
            >
              <span>全部课程</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-4 py-4 rounded-xl bg-[#F7F9FC] text-center text-[12.5px] text-slate-400 tracking-widest">
            今 日 暂 无 课 程
          </div>
        </div>

        {/* 4 Quick Actions */}
        <div className="bg-white rounded-2xl py-4 px-2 grid grid-cols-4 gap-1 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          {[
            { label: '公开课 · 56', icon: PlayCircle },
            { label: '观看历史', icon: History },
            { label: '缓存下载', icon: Download },
            { label: '课程收藏', icon: Star },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setDrawerTitle(item.label)}
                className="flex flex-col items-center gap-2 py-1 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#3A7AFE] text-white flex items-center justify-center shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[12px] font-medium text-slate-700 whitespace-nowrap tabular-nums">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Menu Group 1 */}
        <div className="bg-white rounded-2xl divide-y divide-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          {[
            { label: '我的订单', icon: ReceiptText, badge: null },
            { label: '我的钱包', icon: Wallet, badge: 'NEW' },
            { label: '优惠券', icon: Ticket, badge: null },
          ].map((row) => {
            const Icon = row.icon;
            return (
              <button
                key={row.label}
                type="button"
                onClick={() => setDrawerTitle(row.label)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 first:rounded-t-2xl last:rounded-b-2xl cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-700" />
                  <span className="text-[14.5px] font-medium text-slate-900">{row.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {row.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {row.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Menu Group 2 */}
        <div className="bg-white rounded-2xl divide-y divide-slate-100 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          {[
            { label: '我的消息', icon: MessageSquareMore, rightText: null },
            { label: '在线客服', icon: Headphones, rightText: null },
            { label: '电话客服', icon: PhoneCall, rightText: '400 853 6100' },
          ].map((row) => {
            const Icon = row.icon;
            return (
              <button
                key={row.label}
                type="button"
                onClick={() => setDrawerTitle(row.label)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 first:rounded-t-2xl last:rounded-b-2xl cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-700" />
                  <span className="text-[14.5px] font-medium text-slate-900">{row.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {row.rightText && (
                    <span className="text-[13px] text-slate-400 tabular-nums">{row.rightText}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-page Drawer */}
      {drawerTitle && (
        <div className="absolute inset-0 bg-black/45 z-30 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-[16px] font-bold text-slate-900">{drawerTitle}</h3>
              <button
                type="button"
                onClick={() => setDrawerTitle(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4">{renderDrawerBody()}</div>
            <button
              type="button"
              onClick={() => setDrawerTitle(null)}
              className="w-full h-10 rounded-full bg-[#3A7AFE] text-white text-[14px] font-medium cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
