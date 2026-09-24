import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { routerEngine } from '../../services/routerEngine';
import { SystemLogEntry } from '../../types';
import {
  Activity,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { t, addToast } = useApp();
  const [logs, setLogs] = useState<SystemLogEntry[]>(() => routerEngine.getLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [routerFilter, setRouterFilter] = useState('ALL');

  const routers = ['ALL', 'gateway', 'db', 'session', 'env', 'file', 'mail', 'whatsapp', 'sms', 'paypal', 'migration'];

  const filteredLogs = logs.filter((l) => {
    const matchesRouter = routerFilter === 'ALL' || l.router.toLowerCase() === routerFilter.toLowerCase();
    const matchesSearch =
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ip.includes(searchQuery);
    return matchesRouter && matchesSearch;
  });

  const handleClear = () => {
    routerEngine.clearLogs();
    setLogs([]);
    addToast('info', t('تم مسح سجلات التدقيق', 'Audit logs cleared'));
  };

  const handleRefresh = () => {
    setLogs(routerEngine.getLogs());
    addToast('info', t('تم تحديث السجلات', 'Logs refreshed'));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('سجل تدقيق وأحداث النظام (Audit Logs & Telemetry)', 'System Audit Logs & Telemetry')}</h2>
            <p className="text-xs text-slate-400">{t('تتبع استدعاءات البوابة، زمن التنفيذ، عناوين IP، واستجابات جميع الرواترات', 'Track gateway requests, latency, IP origins & status codes across all routers')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title={t('تحديث السجلات', 'Refresh')}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('مسح السجل', 'Clear Logs')}</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {routers.map((r) => (
              <button
                key={r}
                onClick={() => setRouterFilter(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap ${
                  routerFilter === r
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute start-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('بحث في السجل...', 'Search log stream...')}
              className="bg-slate-950 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-xs text-start font-mono">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-2.5 text-start font-semibold">{t('الوقت', 'Timestamp')}</th>
                <th className="px-4 py-2.5 text-start font-semibold">{t('الرواتر', 'Router')}</th>
                <th className="px-4 py-2.5 text-start font-semibold">{t('الإجراء / الدالة', 'Action')}</th>
                <th className="px-4 py-2.5 text-start font-semibold">{t('الرسالة والنتيجة', 'Details')}</th>
                <th className="px-4 py-2.5 text-start font-semibold">{t('زمن الاستجابة', 'Latency')}</th>
                <th className="px-4 py-2.5 text-end font-semibold">{t('الحالة', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-2 text-slate-400 whitespace-nowrap tabular-nums text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase font-bold text-[10px]">
                        {log.router}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-bold text-slate-200 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-4 py-2 text-slate-400 truncate max-w-xs">
                      {log.message}
                    </td>
                    <td className="px-4 py-2 text-slate-300 tabular-nums">
                      {log.duration}ms
                    </td>
                    <td className="px-4 py-2 text-end">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          log.status === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span className="uppercase">{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500 italic">
                    {t('لا توجد سجلات مطابقة', 'No matching logs')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
