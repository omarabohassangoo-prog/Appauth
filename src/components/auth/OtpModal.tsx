import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, KeyRound } from 'lucide-react';

export const OtpModal: React.FC = () => {
  const { pendingOtpEmail, verifyOtp, cancelOtp } = useAuth();
  const { t, addToast } = useApp();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!pendingOtpEmail) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await verifyOtp(otp);
    setLoading(false);

    if (success) {
      addToast('success', t('تم التحقق بنجاح', 'MFA verified successfully'), t('مرحباً بك مجدداً!', 'Welcome back!'));
    } else {
      setError(t('رمز التحقق غير صحيح، يرجى تجربة 884210', 'Invalid OTP code. Try 884210'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 text-center">
        <button
          onClick={cancelOtp}
          className="absolute top-4 end-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-bold mb-1">{t('التحقق بخطوتين (MFA)', 'Two-Factor Verification')}</h2>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          {t('تم إرسال رمز الأمان المكون من 6 أرقام إلى هاتفك المسجل لـ ', 'A 6-digit security code was sent for ')}
          <span className="text-indigo-400 font-mono">{pendingOtpEmail}</span>
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="884210"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-3 text-center text-lg tracking-widest text-slate-100 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
          </div>

          <div className="text-[11px] text-slate-500">
            {t('رمز الاختبار التجريبي: ', 'Demo test code: ')}
            <span className="font-mono text-indigo-400 font-bold">884210</span>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20"
          >
            {loading ? t('جاري التحقق...', 'Verifying...') : t('تأكيد الدخول', 'Verify & Sign In')}
          </button>
        </form>
      </div>
    </div>
  );
};
