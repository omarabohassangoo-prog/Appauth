import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { routerEngine } from '../../services/routerEngine';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { t, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      routerEngine.sendMessage(
        'mail',
        email,
        `عزيزي العميل، اضغط على الرابط التالي لإعادة تعيين كلمة المرور: https://omnirouter.io/reset-password?token=sample_token_8899`,
        'إعادة تعيين كلمة المرور'
      );
      addToast('success', t('تم إرسال رابط إعادة التعيين', 'Reset link sent'), t('تحقق من بريدك الإلكتروني', 'Check your inbox'));
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t('استعادة كلمة المرور', 'Recover Password')}</h2>
            <p className="text-xs text-slate-400">{t('سنرسل لك رابطاً آمناً لتعيين كلمة مرور جديدة', 'We will send a secure link to reset your password')}</p>
          </div>
        </div>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-emerald-300">
              {t('تم إرسال تعليمات إعادة التعيين بنجاح!', 'Reset instructions sent!')}
            </p>
            <p className="text-xs text-slate-400">
              {t('يرجى التحقق من الرسائل الواردة لـ ', 'Please check inbox for ')}
              <span className="text-slate-200 font-mono">{email}</span>
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="mt-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg transition-colors"
            >
              {t('العودة لتسجيل الدخول', 'Back to Sign In')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t('البريد الإلكتروني المسجل', 'Registered Email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              {loading ? t('جاري الإرسال...', 'Sending...') : t('إرسال رابط الاستعادة', 'Send Reset Link')}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="text-indigo-400 font-semibold hover:underline"
          >
            {t('تذكرت كلمة المرور؟ تسجيل الدخول', 'Remember password? Sign In')}
          </button>
        </div>
      </div>
    </div>
  );
};
