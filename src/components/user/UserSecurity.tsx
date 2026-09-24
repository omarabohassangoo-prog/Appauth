import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { routerEngine } from '../../services/routerEngine';
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  Trash2,
} from 'lucide-react';

export const UserSecurity: React.FC = () => {
  const { t, addToast } = useApp();
  const { user, updateProfile } = useAuth();
  const [sessions, setSessions] = useState(() =>
    routerEngine.getSessions().filter((s) => s.userId === user?.id || user?.role === 'admin')
  );

  const [mfa, setMfa] = useState(user?.mfaEnabled || false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleToggleMfa = () => {
    const next = !mfa;
    setMfa(next);
    updateProfile({ mfaEnabled: next });
    addToast('success', next ? t('تم تفعيل التحقق بخطوتين (MFA)', 'Two-factor authentication enabled') : t('تم تعطيل التحقق بخطوتين', 'MFA disabled'));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim() || newPass.length < 6) {
      addToast('error', t('كلمة المرور يجب ألا تقل عن 6 أحرف', 'Password must be at least 6 characters'));
      return;
    }
    setOldPass('');
    setNewPass('');
    addToast('success', t('تم تحديث كلمة المرور بنجاح!', 'Password updated successfully!'));
  };

  const handleRevoke = (sid: string) => {
    routerEngine.revokeSession(sid);
    setSessions(routerEngine.getSessions().filter((s) => s.userId === user?.id || user?.role === 'admin'));
    addToast('info', t('تم إنهاء الجلسة', 'Session revoked'));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('مركز الأمان وإعدادات الجلسات (Security)', 'Account Security & Active Credentials')}</h2>
            <p className="text-xs text-slate-400">{t('التحقق بخطوتين، بصمة الجهاز، تعديل كلمة المرور، وإدارة الأجهزة المتصلة', 'Two-factor auth, password management & connected devices')}</p>
          </div>
        </div>
      </div>

      {/* Grid: 2FA & Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2FA Toggle */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-100 mb-2">
              <Fingerprint className="w-4 h-4 text-indigo-400" />
              <span>{t('التحقق بخطوتين عبر الهاتف (2FA / OTP)', 'Two-Factor Authentication (MFA)')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t('عند تفعيل هذه الخاصية، سيُطلب منك إدخال رمز أمان يُرسل إلى هاتفك المسجل عند كل تسجيل دخول جديد.', 'Require an SMS verification code whenever signing in from a new device.')}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className={`text-xs font-bold ${mfa ? 'text-emerald-400' : 'text-slate-400'}`}>
              {mfa ? t('مفعل (نشط)', 'Enabled') : t('معطل', 'Disabled')}
            </span>
            <button
              onClick={handleToggleMfa}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                mfa
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
              }`}
            >
              {mfa ? t('تعطيل 2FA', 'Disable 2FA') : t('تفعيل 2FA الآن', 'Enable 2FA')}
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordChange} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-100 mb-1">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>{t('تغيير كلمة المرور', 'Change Password')}</span>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">{t('كلمة المرور الحالية', 'Current Password')}</label>
            <input
              type="password"
              required
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">{t('كلمة المرور الجديدة', 'New Password')}</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-xs transition-colors mt-2"
          >
            {t('تحديث كلمة المرور', 'Update Password')}
          </button>
        </form>
      </div>

      {/* Connected Devices */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('الأجهزة المتصلة بحسابك', 'Connected Devices')}</h3>

        <div className="space-y-2">
          {sessions.map((sess) => (
            <div
              key={sess.sessionId}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{sess.device}</span>
                  {sess.isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-600/20 text-indigo-300 font-bold">
                      {t('الجهاز الحالي', 'This Device')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  IP: {sess.ip} · {sess.browser} ({sess.os})
                </p>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleRevoke(sess.sessionId)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title={t('تسجيل الخروج من هذا الجهاز', 'Log out')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
