import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  User,
  Database,
  Key,
  FolderArchive,
  Send,
  CreditCard,
  GitPullRequest,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
} from 'lucide-react';

interface LandingHeroProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onOpenLogin, onOpenRegister }) => {
  const { t, isRtl } = useApp();
  const { switchRole } = useAuth();

  const handleQuickEnter = (role: 'admin' | 'user') => {
    switchRole(role);
  };

  const featureCards = [
    { titleAr: 'بوابة الرواترات الموحدة', titleEn: 'Unified Gateway Router', descAr: 'تنسيق وإدارة كافة الاستدعاءات والخدمات في منفذ واحد.', descEn: 'Orchestrate all system routers with rate-limiting & telemetry.' },
    { titleAr: 'قواعد البيانات متعددة المحركات', titleEn: 'Multi-Driver Database Router', descAr: 'استعلامات ومعاملات PostgreSQL و MySQL و SQLite.', descEn: 'High-speed SQL, CRUD, Transactions & Schema management.' },
    { titleAr: 'التخزين السحابي والأصول', titleEn: 'Cloud File Storage Router', descAr: 'رفع وتنزيل وضغط الملفات عبر S3 والتخزين المحلي.', descEn: 'Direct chunked uploads, image previews, and ZIP archives.' },
    { titleAr: 'المراسلات الذكية', titleEn: 'Multi-Channel Communications', descAr: 'إرسال البريد الإلكتروني، SMS، و WhatsApp بقوالب ذكية.', descEn: 'Automated email, SMS, and WhatsApp dispatch pipelines.' },
    { titleAr: 'بوابة مدفوعات PayPal', titleEn: 'PayPal Billing & Subscriptions', descAr: 'إدارة الطلبات، الاشتراكات الشهرية، واسترداد الفواتير.', descEn: 'Orders, monthly subscription billing, and webhooks.' },
    { titleAr: 'الأمان المتقدم وبصمة المتصفح', titleEn: 'Sessions & Device Fingerprint', descAr: 'كوكيز مشفرة بـ HMAC، وتوثيق بصمة الأجهزة والـ 2FA.', descEn: 'HMAC signed tokens, fingerprint auth & session controls.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{t('منظومة الرواترات الموحدة الشاملة مع نظام المصادقة', 'Unified Enterprise Router Suite with RBAC Auth')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight font-display">
          {t('إدارة شاملة لجميع الرواترات والخدمات من مكان واحد', 'Master Every Router & Service from One Unified Control Hub')}
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          {t(
            'نظام متكامل يجمع قواعد البيانات، التخزين السحابي، البريد، الـ SMS، الواتساب، مدفوعات PayPal، إدارة متغيرات البيئة، وهجرات الهيكل مع لوحة تحكم مخصصة للمدير ولوحة للمستخدم.',
            'A unified architecture integrating DbRouter, FileRouter, MailRouter, SmsRouter, WhatsAppRouter, PayPalRouter, EnvRouter, and MigrationRouter with role-based dashboards.'
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => handleQuickEnter('admin')}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>{t('الدخول المباشر: لوحة تحكم مدير النظام', 'Explore Admin Dashboard')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleQuickEnter('user')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span>{t('الدخول المباشر: لوحة تحكم المستخدم', 'Explore User Dashboard')}</span>
          </button>
        </div>
      </div>

      {/* Feature Bento Grid */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl font-bold text-slate-100">{t('الخدمات والرواترات المدمجة في المنظومة', 'Built-in Core Engine Services')}</h2>
          <p className="text-xs text-slate-400 mt-1">{t('بنية برمجية فائقة السرعة ومتوافقة مع أعلى معايير الأمان', 'Production-grade architecture ready for scale')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">{t(feat.titleAr, feat.titleEn)}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {t(feat.descAr, feat.descEn)}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{t('مفعل ومتاح للاختبار', 'Ready & Tested')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
