import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { routerEngine } from '../../services/routerEngine';
import { CommTemplate, SentMessage } from '../../types';
import {
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const CommunicationsManager: React.FC = () => {
  const { t, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'mail' | 'whatsapp' | 'sms'>('mail');
  const [templates, setTemplates] = useState<CommTemplate[]>(() => routerEngine.getTemplates());
  const [messages, setMessages] = useState<SentMessage[]>(() => routerEngine.getSentMessages());

  // Dispatch state
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const filteredTemplates = templates.filter((tpl) => tpl.type === activeTab);
  const filteredMessages = messages.filter((msg) => msg.type === activeTab);

  const handleSelectTemplate = (tpl: CommTemplate) => {
    setContent(tpl.content);
    if (tpl.subject) setSubject(tpl.subject);
    addToast('info', t('تم تحميل القالب في المحرر', 'Template loaded into editor'), tpl.name);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !content.trim()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      const msg = routerEngine.sendMessage(activeTab, recipient.trim(), content.trim(), subject ? subject.trim() : undefined);
      setMessages(routerEngine.getSentMessages());
      setRecipient('');
      setContent('');
      setSubject('');
      addToast('success', t('تم إرسال الرسالة بنجاح عبر الرواتر', 'Message dispatched successfully'), `${activeTab.toUpperCase()} -> ${msg.to}`);
    }, 350);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('مركز المراسلات الموحد (Mail, SMS & WhatsApp)', 'Unified Communications Hub')}</h2>
            <p className="text-xs text-slate-400">{t('إرسال البريد الإلكتروني، رسائل SMS السريعة، ورسائل WhatsApp الرسمية مع القوالب الذكية', 'Multi-channel messaging with template variables and automated retries')}</p>
          </div>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('mail')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'mail' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t('البريد (Mail)', 'Email')}</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t('واتساب (WhatsApp)', 'WhatsApp')}</span>
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sms' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t('رسائل نصية (SMS)', 'SMS')}</span>
          </button>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Test Dispatcher */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleSend} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>{t(`إرسال رسالة ${activeTab.toUpperCase()} تجريبية`, `Dispatch Test ${activeTab.toUpperCase()}`)}</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Provider: {activeTab === 'mail' ? 'Resend' : activeTab === 'whatsapp' ? 'Meta Cloud API' : 'Twilio'}</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {activeTab === 'mail' ? t('البريد الإلكتروني للمستلم', 'Recipient Email') : t('رقم هاتف المستلم (مع رمز الدولة)', 'Recipient Phone (E.164)')}
              </label>
              <input
                type={activeTab === 'mail' ? 'email' : 'tel'}
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={activeTab === 'mail' ? 'customer@example.com' : '+966501234567'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {activeTab === 'mail' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('موضوع الرسالة', 'Subject Line')}</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t('موضوع الإشعار أو التنبيه...', 'Subject...')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">{t('نص الرسالة / المحتوى', 'Message Body')}</label>
                <span className="text-[10px] text-slate-500 font-mono">{content.length} {t('حرف', 'chars')}</span>
              </div>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('اكتب نص الرسالة هنا أو اختر قالباً جاهزاً من القائمة المجاورة...', 'Write message content or pick a template from the right...')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`w-full py-2.5 px-4 font-semibold rounded-xl text-xs text-white transition-colors flex items-center justify-center gap-2 shadow-lg ${
                activeTab === 'mail'
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                  : activeTab === 'whatsapp'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? t('جاري الإرسال عبر البوابة...', 'Dispatching...') : t('إرسال الرسالة الآن', 'Dispatch Message')}</span>
            </button>
          </form>

          {/* Sent History for this tab */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-200">{t('سجل الرسائل المرسلة مؤخراً', 'Recent Sent Messages')}</h4>
            <div className="divide-y divide-slate-800/60 text-xs font-mono">
              {filteredMessages.length > 0 ? (
                filteredMessages.slice(0, 5).map((msg) => (
                  <div key={msg.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 font-bold truncate">{msg.to}</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{new Date(msg.at).toLocaleTimeString()}</span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-slate-500 text-xs italic">
                  {t('لا توجد رسائل مرسلة بعد في هذه القناة', 'No messages sent in this channel yet')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Form: Templates list */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('القوالب الجاهزة', 'Templates')}</h3>
            <span className="text-[11px] text-slate-500 font-mono">{filteredTemplates.length}</span>
          </div>

          <div className="space-y-2.5">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{tpl.title}</h4>
                  <button
                    onClick={() => handleSelectTemplate(tpl)}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    {t('استخدام القالب', 'Use')}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed font-mono">
                  {tpl.content}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500">{t('المتغيرات:', 'Variables:')}</span>
                  {tpl.variables.map((v) => (
                    <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 font-mono text-indigo-300">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
