import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { routerEngine, PAYPAL_PLANS } from '../../services/routerEngine';
import {
  User,
  CreditCard,
  HardDrive,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

export const UserOverview: React.FC = () => {
  const { t, setActiveView } = useApp();
  const { user } = useAuth();

  const userFiles = routerEngine.getFiles().filter((f) => f.uploadedBy === user?.id || user?.role === 'admin');
  const userOrders = routerEngine.getOrders().filter((o) => o.userId === user?.id || user?.role === 'admin');
  const userPlan = PAYPAL_PLANS.find((p) => p.id === user?.planId) || PAYPAL_PLANS[1];

  const totalSpent = userOrders.reduce((acc, o) => acc + o.amount, 0);
  const totalFileSize = userFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || '/src/assets/images/user_avatar_1790269144483.jpg'}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">{t('أهلاً بك،', 'Welcome,')} {user?.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                {t('حساب موثق', 'Verified Account')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user?.company || 'Apex Cloud Logistics'} · {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('services')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t('ترقية الباقة', 'Upgrade Plan')}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t('الباقة الحالية', 'Current Plan')}</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg font-bold text-slate-100">{t(userPlan.nameAr, userPlan.name)}</p>
          <p className="text-[11px] text-indigo-400 font-mono mt-1">${userPlan.price} / {t('شهر', 'mo')}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t('الرصيد المتاح', 'Account Balance')}</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">${(user?.balance || 850.5).toFixed(2)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{t('شحن رصيد الخدمات', 'Auto-refill enabled')}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t('الملفات المخزنة', 'Stored Files')}</span>
            <HardDrive className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tabular-nums">{userFiles.length}</p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">{(totalFileSize / 1024 / 1024).toFixed(1)} MB {t('مستخدمة', 'used')}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t('حالة الأمان', 'Security Health')}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-slate-100">{t('محمي بـ 2FA', '2FA Active')}</p>
          <p className="text-[11px] text-emerald-400 mt-1">{t('بصمة المتصفح موثقة', 'Fingerprint bound')}</p>
        </div>
      </div>

      {/* Two columns: Recent Orders & Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Invoices / Orders */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('آخر المعاملات والفواتير', 'Recent Invoices & Transactions')}</h3>
            <button
              onClick={() => setActiveView('billing')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>{t('عرض الكل', 'View All')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {userOrders.slice(0, 3).map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{ord.orderNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ord.description}</p>
                </div>
                <div className="text-end">
                  <span className="text-sm font-bold text-slate-100 tabular-nums">${ord.amount.toFixed(2)}</span>
                  <p className="text-[10px] text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Service Status */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">{t('الخدمات المفعلة بحسابك', 'Active Service Quotas')}</h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{t('استدعاءات الـ API', 'API Calls')}</span>
                <span className="font-mono tabular-nums">142,500 / 500,000</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-indigo-600 h-full rounded-full w-[28%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{t('المساحة السحابية', 'S3 Cloud Storage')}</span>
                <span className="font-mono tabular-nums">3.8 GB / 50 GB</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-violet-600 h-full rounded-full w-[8%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{t('رسائل البريد والـ SMS', 'Mail & SMS Messages')}</span>
                <span className="font-mono tabular-nums">840 / 5,000</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-emerald-600 h-full rounded-full w-[17%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
