import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserOverview } from './UserOverview';
import { UserServices } from './UserServices';
import { UserFileVault } from './UserFileVault';
import { UserBilling } from './UserBilling';
import { UserNotifications } from './UserNotifications';
import { UserSecurity } from './UserSecurity';
import {
  LayoutDashboard,
  Zap,
  FolderArchive,
  CreditCard,
  Bell,
  ShieldCheck,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { activeView, setActiveView, t } = useApp();

  const menuItems = [
    { id: 'overview', label: 'لوحة التحكم', labelEn: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'services', label: 'باقاتي وخدماتي', labelEn: 'My Services', icon: <Zap className="w-4 h-4" /> },
    { id: 'files', label: 'خزنة الملفات', labelEn: 'My Vault', icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'billing', label: 'الفواتير والمدفوعات', labelEn: 'Billing & Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'مركز الإشعارات', labelEn: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'الأمان والجلسات', labelEn: 'Security & 2FA', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumbs */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>OmniRouter</span>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">{t('لوحة تحكم المستخدم', 'User Dashboard')}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 font-display">
            {t('بوابة خدماتك ومساحتك السحابية', 'Your Services & Personal Cloud Space')}
          </h1>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === item.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{t(item.label, item.labelEn)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-3 space-y-1.5">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
              {t('قائمة المستخدم', 'User Navigation')}
            </span>

            {menuItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-start ${
                    isActive
                      ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {item.icon}
                  </div>
                  <span className="truncate">{t(item.label, item.labelEn)}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Active View Content */}
        <main className="lg:col-span-9">
          {activeView === 'overview' && <UserOverview />}
          {activeView === 'services' && <UserServices />}
          {activeView === 'files' && <UserFileVault />}
          {activeView === 'billing' && <UserBilling />}
          {activeView === 'notifications' && <UserNotifications />}
          {activeView === 'security' && <UserSecurity />}
        </main>
      </div>
    </div>
  );
};
