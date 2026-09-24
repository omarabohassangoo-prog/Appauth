import React from 'react';
import { useApp } from '../../context/AppContext';
import { GatewayOverview } from './GatewayOverview';
import { DbManager } from './DbManager';
import { EnvManager } from './EnvManager';
import { FileManager } from './FileManager';
import { CommunicationsManager } from './CommunicationsManager';
import { PayPalManager } from './PayPalManager';
import { MigrationsManager } from './MigrationsManager';
import { SessionSecurityManager } from './SessionSecurityManager';
import { UsersManager } from './UsersManager';
import { AuditLogs } from './AuditLogs';
import {
  LayoutDashboard,
  Database,
  Key,
  FolderArchive,
  Send,
  CreditCard,
  GitPullRequest,
  ShieldCheck,
  Users,
  Activity,
  Terminal,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { activeView, setActiveView, t } = useApp();

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة على البوابة', labelEn: 'Gateway Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'database', label: 'قواعد البيانات (DbRouter)', labelEn: 'Database Router', icon: <Database className="w-4 h-4" /> },
    { id: 'env', label: 'متغيرات البيئة (.env)', labelEn: 'Environment (.env)', icon: <Key className="w-4 h-4" /> },
    { id: 'files', label: 'التخزين السحابي (Files)', labelEn: 'Storage & Files', icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'communications', label: 'المراسلات (Mail/SMS/WA)', labelEn: 'Communications Hub', icon: <Send className="w-4 h-4" /> },
    { id: 'paypal', label: 'مدفوعات PayPal', labelEn: 'PayPal Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'migrations', label: 'الهجرات والهيكل (Schema)', labelEn: 'Migrations & Schema', icon: <GitPullRequest className="w-4 h-4" /> },
    { id: 'security', label: 'الجلسات والأمان (Sessions)', labelEn: 'Sessions & Security', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'users', label: 'إدارة المستخدمين (RBAC)', labelEn: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
    { id: 'logs', label: 'سجل التدقيق (Telemetry)', labelEn: 'Audit Logs', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* View Title & Breadcrumb header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>OmniRouter</span>
            <span>/</span>
            <span className="text-indigo-400 font-semibold">{t('لوحة تحكم مدير النظام', 'System Admin Console')}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 font-display">
            {t('مركز التحكم الموحد بكافة الرواترات والخدمات', 'Unified Enterprise Router Control Hub')}
          </h1>
        </div>

        {/* View Segmented Tabs for quick navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === item.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{t(item.label, item.labelEn)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sidebar + View Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-3 space-y-1.5">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 block">
              {t('خدمات النظام والرواترات', 'System Core Services')}
            </span>

            {menuItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-start ${
                    isActive
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-1 rounded-lg ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
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
          {activeView === 'overview' && <GatewayOverview />}
          {activeView === 'database' && <DbManager />}
          {activeView === 'env' && <EnvManager />}
          {activeView === 'files' && <FileManager />}
          {activeView === 'communications' && <CommunicationsManager />}
          {activeView === 'paypal' && <PayPalManager />}
          {activeView === 'migrations' && <MigrationsManager />}
          {activeView === 'security' && <SessionSecurityManager />}
          {activeView === 'users' && <UsersManager />}
          {activeView === 'logs' && <AuditLogs />}
        </main>
      </div>
    </div>
  );
};
