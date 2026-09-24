import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { routerEngine } from '../../services/routerEngine';
import { SentMessage } from '../../types';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';

export const UserNotifications: React.FC = () => {
  const { t, addToast } = useApp();
  const { user } = useAuth();
  const [messages, setMessages] = useState<SentMessage[]>(() => routerEngine.getSentMessages());

  const handleTestNotification = (channel: 'mail' | 'whatsapp' | 'sms') => {
    const target = channel === 'mail' ? (user?.email || 'user@omnirouter.io') : (user?.phone || '+966559876543');
    const msg = routerEngine.sendMessage(
      channel,
      target,
      `إشعار أمني تجريبي: تم تسجيل دخول جديد لحسابك في OmniRouter بنجاح.`,
      'إشعار أمني'
    );
    setMessages([...routerEngine.getSentMessages()]);
    addToast('success', t(`تم إرسال إشعار ${channel.toUpperCase()} تجريبي`, `Test ${channel.toUpperCase()} sent`), target);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('مركز الإشعارات والمراسلات الواردة', 'Notification & Messaging Hub')}</h2>
            <p className="text-xs text-slate-400">{t('تفضيلات التنبيهات، رسائل التحقق، وإشعارات النظام الفورية', 'Security alerts, transactional notifications & dispatch testing')}</p>
          </div>
        </div>
      </div>

      {/* Quick Test Trigger Buttons */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200">{t('إرسال إشعار تجريبي فوري لحسابك', 'Trigger Live Test Notification to Your Devices')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleTestNotification('mail')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center gap-3 text-start group"
          >
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{t('إرسال بريد تجريبي', 'Send Test Email')}</p>
              <p className="text-[10px] text-slate-500 font-mono">{user?.email}</p>
            </div>
          </button>

          <button
            onClick={() => handleTestNotification('whatsapp')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center gap-3 text-start group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{t('إرسال واتساب تجريبي', 'Send Test WhatsApp')}</p>
              <p className="text-[10px] text-slate-500 font-mono">{user?.phone}</p>
            </div>
          </button>

          <button
            onClick={() => handleTestNotification('sms')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center gap-3 text-start group"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{t('إرسال SMS تجريبي', 'Send Test SMS')}</p>
              <p className="text-[10px] text-slate-500 font-mono">{user?.phone}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('سجل التنبيهات والرسائل', 'Notification Feed')}</h3>

        <div className="space-y-2.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                {msg.type === 'mail' ? (
                  <Mail className="w-4 h-4 text-indigo-400" />
                ) : msg.type === 'whatsapp' ? (
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Smartphone className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 font-mono uppercase">{msg.type}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      {msg.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(msg.at).toLocaleTimeString()}</span>
                </div>

                {msg.subject && (
                  <p className="text-xs font-semibold text-slate-100 mb-1">{msg.subject}</p>
                )}
                <p className="text-xs text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
