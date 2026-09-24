import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { routerEngine } from '../../services/routerEngine';
import { SessionInfo } from '../../types';
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  Trash2,
  Fingerprint,
  Lock,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const SessionSecurityManager: React.FC = () => {
  const { t, addToast } = useApp();
  const [sessions, setSessions] = useState<SessionInfo[]>(() => routerEngine.getSessions());

  const handleRevoke = (id: string) => {
    routerEngine.revokeSession(id);
    setSessions(routerEngine.getSessions());
    addToast('info', t('تم إنهاء الجلسة المحددة بنجاح', 'Session terminated successfully'));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('إدارة الجلسات وبصمة المتصفح والأمان (SessionRouter)', 'Active Sessions & Fingerprint Security')}</h2>
            <p className="text-xs text-slate-400">{t('كوكيز مشفرة بتوقيع HMAC-SHA256، كشف وتوثيق بصمة الجهاز، وإنهاء الجلسات عن بعد', 'Cryptographically signed HMAC cookies, browser fingerprinting & remote revocation')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {sessions.length} {t('جلسات نشطة', 'Active Sessions')}
          </span>
        </div>
      </div>

      {/* Security Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
            <Fingerprint className="w-4 h-4" />
            <span>{t('خوارزمية بصمة المتصفح', 'Fingerprint Engine')}</span>
          </div>
          <p className="text-sm font-bold text-slate-100">SHA-256 Multi-Component</p>
          <p className="text-[11px] text-slate-400">{t('Canvas, WebGL, Screen, Audio, Timezone', 'Hardware & browser characteristics')}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Lock className="w-4 h-4" />
            <span>{t('تشفير الكوكيز', 'Cookie Signature')}</span>
          </div>
          <p className="text-sm font-bold text-slate-100">HMAC-SHA256 Signed</p>
          <p className="text-[11px] text-slate-400">{t('HttpOnly, Secure, SameSite: Lax', 'Tamper-proof token validation')}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Clock className="w-4 h-4" />
            <span>{t('مدة صلاحية الجلسة', 'Session Lifetime')}</span>
          </div>
          <p className="text-sm font-bold text-slate-100">7 Days (Auto-rolling)</p>
          <p className="text-[11px] text-slate-400">{t('تجديد تلقائي عند النشاط المستمر', 'Automatic sliding window refresh')}</p>
        </div>
      </div>

      {/* Active Sessions List */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('الأجهزة والجلسات المتصلة حالياً', 'Connected Devices & Active Sessions')}</h3>
          <span className="text-xs text-slate-500 font-mono">Auto-sync: Active</span>
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.sessionId}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                sess.isCurrent
                  ? 'bg-slate-950 border-indigo-500/50 shadow-md shadow-indigo-600/5'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                  {sess.device.includes('iPhone') || sess.device.includes('Android') ? (
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Laptop className="w-5 h-5 text-indigo-400" />
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-100">{sess.device}</h4>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                        {t('الجلسة الحالية', 'Current Session')}
                      </span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                      {sess.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{sess.userName}</span> ({sess.userEmail})
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono flex-wrap">
                    <span>IP: {sess.ip}</span>
                    <span>·</span>
                    <span>{sess.browser} ({sess.os})</span>
                    <span>·</span>
                    <span className="text-indigo-400 font-mono">FP: {sess.fingerprint.slice(0, 16)}...</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {!sess.isCurrent ? (
                  <button
                    onClick={() => handleRevoke(sess.sessionId)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('إنهاء الجلسة', 'Revoke Session')}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('نشطة الآن', 'Active')}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
