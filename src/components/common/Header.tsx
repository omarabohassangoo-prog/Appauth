import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Sun,
  Moon,
  LogOut,
  Shield,
  User as UserIcon,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenRegister }) => {
  const { user, isAuthenticated, isAdmin, logout, switchRole } = useAuth();
  const { language, toggleLanguage, theme, toggleTheme, activeView, setActiveView, t } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark with minimal icon */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100 font-display">
            OmniRouter<span className="text-indigo-400">Hub</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links / Sub-dashboard quick tabs */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-400">
          {isAuthenticated ? (
            isAdmin ? (
              <>
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'overview' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('نظرة عامة', 'Overview')}
                </button>
                <button
                  onClick={() => setActiveView('database')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'database' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('قواعد البيانات', 'Database')}
                </button>
                <button
                  onClick={() => setActiveView('env')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'env' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('المتغيرات .env', 'Env Vars')}
                </button>
                <button
                  onClick={() => setActiveView('files')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'files' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('التخزين', 'Storage')}
                </button>
                <button
                  onClick={() => setActiveView('communications')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'communications' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('المراسلات', 'Communications')}
                </button>
                <button
                  onClick={() => setActiveView('paypal')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'paypal' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('المدفوعات', 'Payments')}
                </button>
                <button
                  onClick={() => setActiveView('users')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'users' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('المستخدمين', 'Users')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'overview' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('لوحتي', 'My Overview')}
                </button>
                <button
                  onClick={() => setActiveView('services')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'services' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('خدماتي والباقات', 'My Services')}
                </button>
                <button
                  onClick={() => setActiveView('files')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'files' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('ملفاتي', 'My Files')}
                </button>
                <button
                  onClick={() => setActiveView('billing')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'billing' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('الفواتير والدفع', 'Billing')}
                </button>
                <button
                  onClick={() => setActiveView('security')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    activeView === 'security' ? 'bg-slate-800 text-slate-100' : 'hover:text-slate-200'
                  }`}
                >
                  {t('الأمان والجلسات', 'Security')}
                </button>
              </>
            )
          ) : (
            <div className="flex items-center gap-6 text-sm">
              <span className="text-slate-400">{t('بوابة الرواترات الشاملة الموحدة', 'Unified High-Performance Router Engine')}</span>
            </div>
          )}
        </nav>

        {/* Zone 3: Actions + Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Role Switcher Button */}
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  switchRole('admin');
                  setActiveView('overview');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isAdmin
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={t('التبديل إلى لوحة تحكم مدير النظام', 'Switch to Admin Dashboard')}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('لوحة المدير', 'Admin')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  switchRole('user');
                  setActiveView('overview');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  !isAdmin
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={t('التبديل إلى لوحة تحكم المستخدم', 'Switch to User Dashboard')}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('لوحة المستخدم', 'User')}</span>
              </button>
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            title={t('تغيير اللغة', 'Toggle Language')}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono">{language === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 transition-colors"
            title={t('تغيير المظهر', 'Toggle Theme')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Auth Button or User Menu */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pe-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition-colors"
              >
                <img
                  src={user.avatar || (isAdmin ? '/src/assets/images/admin_avatar_1790269133181.jpg' : '/src/assets/images/user_avatar_1790269144483.jpg')}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/30"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute end-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 text-slate-200 z-50 animate-in fade-in"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                    <p className="text-xs font-bold text-slate-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      switchRole(isAdmin ? 'user' : 'admin');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-300 transition-colors text-start"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isAdmin ? t('الانتقال لحساب المستخدم', 'Switch to User View') : t('الانتقال للوحة المدير', 'Switch to Admin View')}</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors text-start mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('تسجيل الخروج', 'Sign Out')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                {t('دخول', 'Sign In')}
              </button>
              <button
                onClick={onOpenRegister}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
              >
                {t('تسجيل جديد', 'Register')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
