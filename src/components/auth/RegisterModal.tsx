import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, User, Mail, Phone, Lock, Shield } from 'lucide-react';
import { UserRole } from '../../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const { register } = useAuth();
  const { t, addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await register({ name, email, phone, role });
    setLoading(false);

    if (res.success) {
      addToast('success', t('تم إنشاء الحساب بنجاح', 'Account created successfully'), t('مرحباً بك في المنصة!', 'Welcome aboard!'));
      onClose();
    } else {
      setError(res.error || t('فشل إنشاء الحساب', 'Registration failed'));
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
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t('إنشاء حساب جديد', 'Create New Account')}</h2>
            <p className="text-xs text-slate-400">{t('انضم إلى OmniRouter Suite للوصول إلى كافة الخدمات', 'Join OmniRouter Suite to access all services')}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('الاسم الكامل', 'Full Name')}</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: فهد الدوسري"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('البريد الإلكتروني', 'Email Address')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('رقم الجوال (للتحقق والإشعارات)', 'Phone Number')}</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966500000000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('كلمة المرور', 'Password')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t('نوع الحساب', 'Account Role')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'user'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('مستخدم عادي (User)', 'User')}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('مدير نظام (Admin)', 'Admin')}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 mt-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-600/20"
          >
            {loading ? t('جاري الإنشاء...', 'Creating...') : t('تأكيد وإنشاء الحساب', 'Complete Registration')}
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <span>{t('لديك حساب بالفعل؟', 'Already have an account?')} </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="text-indigo-400 font-semibold hover:underline"
          >
            {t('تسجيل الدخول', 'Sign In')}
          </button>
        </div>
      </div>
    </div>
  );
};
