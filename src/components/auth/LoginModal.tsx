import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, Shield, User, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister,
  onOpenForgotPassword,
}) => {
  const { login, switchRole } = useAuth();
  const { t, addToast } = useApp();

  const [email, setEmail] = useState('admin@omnirouter.io');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.requiresOtp) {
        addToast('info', t('تم إرسال رمز التحقق', 'OTP code sent'), t('أدخل الرمز 884210 للتأكيد', 'Enter code 884210 to confirm'));
      } else {
        addToast('success', t('تم تسجيل الدخول بنجاح', 'Logged in successfully'));
        onClose();
      }
    } else {
      setError(res.error || t('بيانات الدخول غير صحيحة', 'Invalid credentials'));
    }
  };

  const handleQuickDemo = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setEmail('admin@omnirouter.io');
      setPassword('admin123');
      switchRole('admin');
      addToast('success', t('تم الدخول كمدير نظام (Admin)', 'Signed in as System Admin'));
      onClose();
    } else {
      setEmail('user@omnirouter.io');
      setPassword('user123');
      switchRole('user');
      addToast('success', t('تم الدخول كمستخدم (User)', 'Signed in as User'));
      onClose();
    }
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
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t('تسجيل الدخول للنظام', 'Sign In to OmniRouter')}</h2>
            <p className="text-xs text-slate-400">{t('أدخل بريدك الإلكتروني للمتابعة', 'Enter your email to continue')}</p>
          </div>
        </div>

        {/* Quick Demo Accounts */}
        <div className="mb-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('دخول تجريبي سريع بضغطة واحدة:', 'Instant 1-Click Demo Login:')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('مدير النظام (Admin)', 'System Admin')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('مستخدم عادي (User)', 'Standard User')}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {t('البريد الإلكتروني', 'Email Address')}
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">{t('كلمة المرور', 'Password')}</label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenForgotPassword();
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                {t('نسيت كلمة المرور؟', 'Forgot password?')}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20"
          >
            {loading ? t('جاري المصادقة...', 'Authenticating...') : t('تسجيل الدخول', 'Sign In')}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <span>{t('ليس لديك حساب بعد؟', "Don't have an account?")} </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="text-indigo-400 font-semibold hover:underline"
          >
            {t('إنشاء حساب جديد', 'Create account')}
          </button>
        </div>
      </div>
    </div>
  );
};
