import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { routerEngine } from '../../services/routerEngine';
import {
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock,
  ShieldCheck,
  Terminal,
  Database,
  Key,
  FolderArchive,
  Mail,
  MessageSquare,
  Smartphone,
  CreditCard,
  GitPullRequest,
  Network,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Network: <Network className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Key: <Key className="w-4 h-4" />,
  FolderArchive: <FolderArchive className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  GitPullRequest: <GitPullRequest className="w-4 h-4" />,
};

export const GatewayOverview: React.FC = () => {
  const { t, addToast } = useApp();
  const routers = routerEngine.getRoutersInfo();

  const [selectedRouter, setSelectedRouter] = useState('db');
  const [selectedAction, setSelectedAction] = useState('QUERY');
  const [payload, setPayload] = useState('{\n  "sql": "SELECT * FROM users LIMIT 5",\n  "params": []\n}');
  const [executing, setExecuting] = useState(false);
  const [responseJson, setResponseJson] = useState<any>(null);

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      try {
        let parsed = {};
        try {
          parsed = JSON.parse(payload);
        } catch {}

        if (selectedRouter === 'db') {
          const sql = (parsed as any).sql || 'SELECT * FROM users';
          const res = routerEngine.executeSql(sql);
          setResponseJson({
            success: res.success,
            router: 'db',
            action: selectedAction,
            data: res.rows || { count: res.count },
            duration: `${res.duration}ms`,
            timestamp: new Date().toISOString(),
          });
        } else if (selectedRouter === 'env') {
          const vars = routerEngine.getEnvVars();
          setResponseJson({
            success: true,
            router: 'env',
            action: selectedAction,
            data: vars.slice(0, 4),
            count: vars.length,
            duration: '6ms',
            timestamp: new Date().toISOString(),
          });
        } else if (selectedRouter === 'mail') {
          const sent = routerEngine.sendMessage('mail', 'client@example.com', 'Test email dispatched from gateway runner', 'Gateway Test');
          setResponseJson({
            success: true,
            router: 'mail',
            action: 'SEND_TEXT',
            data: sent,
            duration: '72ms',
            timestamp: new Date().toISOString(),
          });
        } else {
          routerEngine.addLog(selectedRouter, selectedAction, 'success', 24, `Executed test payload for ${selectedRouter}`);
          setResponseJson({
            success: true,
            router: selectedRouter,
            action: selectedAction,
            message: `Executed action successfully on ${selectedRouter}`,
            timestamp: new Date().toISOString(),
          });
        }

        addToast('success', t('تم تنفيذ العملية عبر البوابة بنجاح', 'Executed gateway request successfully'));
      } catch (err: any) {
        setResponseJson({ success: false, error: err.message });
      }
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t('إجمالي الاستدعاءات', 'Total Gateway Calls')}</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tabular-nums">48,270</p>
          <p className="text-[11px] text-emerald-400 mt-1 font-mono">+14.2% {t('هذا الأسبوع', 'this week')}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t('متوسط زمن الاستجابة', 'Avg Latency')}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tabular-nums">24ms</p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">P99: 86ms</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t('نسبة النجاح العامة', 'Success Rate')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tabular-nums">99.8%</p>
          <p className="text-[11px] text-slate-400 mt-1">{t('خالٍ من الأخطاء الحرجة', '0 critical errors')}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{t('الرواترات النشطة', 'Active Routers')}</span>
            <Zap className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100 tabular-nums">9 / 9</p>
          <p className="text-[11px] text-emerald-400 mt-1">{t('جميع الخدمات تعمل بكفاءة', 'All nodes healthy')}</p>
        </div>
      </div>

      {/* Routers Health Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200">{t('حالة الرواترات والخدمات التابعة', 'Routers Fleet & Operational Health')}</h3>
          <span className="text-xs text-slate-400 font-mono">Real-time Heartbeat: 5000ms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {routers.map((r) => (
            <div
              key={r.name}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    {iconMap[r.icon] || <Zap className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{t(r.labelAr, r.label)}</h4>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{r.name}</span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {r.healthy ? t('يعمل', 'Healthy') : t('تحذير', 'Degraded')}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {t(r.descriptionAr, r.description)}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{t('الاستجابة:', 'Latency:')} <strong className="text-slate-200">{r.latency}ms</strong></span>
                <span>{t('النداءات:', 'Calls:')} <strong className="text-slate-200 tabular-nums">{r.totalCalls.toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Gateway Runner Console */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">{t('وحدة اختبار وتنفيذ الرواترات المباشرة', 'Interactive Gateway Test Runner')}</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">POST /api/gateway?router={selectedRouter}&action={selectedAction}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('الرواتر المستهدف', 'Target Router')}</label>
                <select
                  value={selectedRouter}
                  onChange={(e) => {
                    const r = e.target.value;
                    setSelectedRouter(r);
                    if (r === 'db') {
                      setSelectedAction('QUERY');
                      setPayload('{\n  "sql": "SELECT * FROM users LIMIT 5",\n  "params": []\n}');
                    } else if (r === 'env') {
                      setSelectedAction('GET');
                      setPayload('{}');
                    } else if (r === 'mail') {
                      setSelectedAction('SEND_TEXT');
                      setPayload('{\n  "to": "user@example.com",\n  "subject": "مرحباً",\n  "text": "رسالة تجريبية"\n}');
                    } else {
                      setSelectedAction('PING');
                      setPayload('{}');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  {routers.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name} ({r.label})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('الدالة المطلوبة', 'Action / Method')}</label>
                <input
                  type="text"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">{t('حزمة البيانات JSON Payload', 'JSON Payload')}</label>
              <textarea
                rows={6}
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              onClick={handleExecute}
              disabled={executing}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{executing ? t('جاري الإرسال والمعالجة...', 'Executing...') : t('تنفيذ الاستدعاء الآن', 'Execute via Gateway')}</span>
            </button>
          </div>

          {/* Response Output */}
          <div className="lg:col-span-7 flex flex-col">
            <label className="block text-xs text-slate-400 mb-1">{t('استجابة البوابة المباشرة (Live Response)', 'Live Response Output')}</label>
            <div className="flex-1 min-h-[220px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono overflow-auto max-h-72">
              {responseJson ? (
                <pre className="text-emerald-400 leading-relaxed whitespace-pre-wrap">
                  {JSON.stringify(responseJson, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                  {t('اضغط على "تنفيذ الاستدعاء الآن" لمعاينة استجابة الرواتر', 'Click "Execute via Gateway" to inspect real-time router response')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
