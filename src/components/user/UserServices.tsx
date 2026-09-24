import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PAYPAL_PLANS } from '../../services/routerEngine';
import {
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const UserServices: React.FC = () => {
  const { t, addToast, setActiveView } = useApp();
  const { user, updateProfile } = useAuth();

  const handleSelectPlan = (planId: string) => {
    updateProfile({ planId });
    addToast('success', t('تم تحديث خطة اشتراكك بنجاح!', 'Plan updated successfully!'));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('باقات وخدمات OmniRouter المتاحة', 'Available Services & Subscription Plans')}</h2>
            <p className="text-xs text-slate-400">{t('اختر الخطة المناسبة لاحتياجات فريقك ومعدل الاستدعاءات المطلوب', 'Select the tier that fits your throughput and team requirements')}</p>
          </div>
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PAYPAL_PLANS.map((plan) => {
          const isCurrent = (user?.planId || 'plan-pro') === plan.id;

          return (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-xl shadow-emerald-500/5'
                  : plan.popular
                  ? 'border-indigo-500/70 shadow-lg shadow-indigo-600/10'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-100">{t(plan.nameAr, plan.name)}</h3>
                  {isCurrent ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                      {t('باقتك الحالية', 'Current Plan')}
                    </span>
                  ) : plan.popular ? (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                      {t('موصى بها', 'Recommended')}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-baseline gap-1.5 mb-3 font-mono">
                  <span className="text-3xl font-bold text-slate-100">${plan.price}</span>
                  <span className="text-xs text-slate-400">/ {t('شهرياً', 'month')}</span>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {t(plan.descriptionAr, plan.description)}
                </p>

                <ul className="space-y-3 text-xs text-slate-300 mb-6">
                  {(useApp().language === 'ar' ? plan.featuresAr : plan.features).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-emerald-600/20 text-emerald-400 font-semibold rounded-xl text-xs cursor-default flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('الخطة مفعلة بحسابك', 'Active on Your Account')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    {t('الترقية إلى هذه الباقة', 'Upgrade to this Tier')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
