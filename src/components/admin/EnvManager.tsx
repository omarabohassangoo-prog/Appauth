import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { routerEngine } from '../../services/routerEngine';
import { EnvVariable } from '../../types';
import {
  Key,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Download,
  Copy,
  ShieldAlert,
  Search,
  Check,
  Save,
  RotateCcw,
} from 'lucide-react';

export const EnvManager: React.FC = () => {
  const { t, addToast } = useApp();
  const [vars, setVars] = useState<EnvVariable[]>(() => routerEngine.getEnvVars());
  const [showSecrets, setShowSecrets] = useState<boolean>(false);
  const [activeGroup, setActiveGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newKey, setNewKey] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [newGroup, setNewGroup] = useState<string>('GENERAL');
  const [newIsSecret, setNewIsSecret] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const groups = ['ALL', 'DATABASE', 'SECURITY', 'GATEWAY', 'STORAGE', 'COMMUNICATION', 'PAYMENT'];

  const filteredVars = vars.filter((v) => {
    const matchesGroup = activeGroup === 'ALL' || v.group === activeGroup;
    const matchesSearch =
      v.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.value.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;

    const formattedKey = newKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const newEntry: EnvVariable = {
      key: formattedKey,
      value: newValue.trim(),
      group: newGroup,
      isSecret: newIsSecret || /KEY|SECRET|TOKEN|PASS/i.test(formattedKey),
      updatedAt: new Date().toISOString().split('T')[0],
    };

    routerEngine.saveEnvVar(newEntry);
    setVars(routerEngine.getEnvVars());
    setNewKey('');
    setNewValue('');
    addToast('success', t('تمت إضافة المتغير بنجاح', 'Variable added successfully'), formattedKey);
  };

  const handleDelete = (key: string) => {
    routerEngine.deleteEnvVar(key);
    setVars(routerEngine.getEnvVars());
    addToast('info', t('تم حذف المتغير', 'Variable deleted'), key);
  };

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    addToast('info', t('تم النسخ إلى الحافظة', 'Copied to clipboard'));
  };

  const handleExport = () => {
    const content = vars.map((v) => `${v.key}=${v.value}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    addToast('success', t('تم تصدير ملف .env بنجاح', 'Exported .env file successfully'));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('إدارة ملف متغيرات البيئة (EnvRouter)', 'Environment Variables Router')}</h2>
            <p className="text-xs text-slate-400">{t('قراءة وتعديل متغيرات .env مع النسخ الاحتياطي وحجب الأسرار الحساسة', 'Read, write & backup .env with automatic secret masking')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSecrets(!showSecrets)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            {showSecrets ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showSecrets ? t('حجب الأسرار', 'Mask Secrets') : t('إظهار الأسرار', 'Reveal Secrets')}</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('تصدير .env', 'Export .env')}</span>
          </button>
        </div>
      </div>

      {/* Add Variable Form */}
      <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200">{t('إضافة أو تحديث متغير بيئة جديد', 'Add / Update Environment Variable')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <input
              type="text"
              required
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="KEY_NAME (e.g. S3_BUCKET_NAME)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 uppercase"
            />
          </div>

          <div className="sm:col-span-4">
            <input
              type="text"
              required
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              {groups.filter((g) => g !== 'ALL').map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('حفظ', 'Save')}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Filter and Variables List */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setActiveGroup(grp)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                  activeGroup === grp
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute start-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('بحث عن مفتاح أو قيمة...', 'Search variable...')}
              className="bg-slate-950 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Variables Table */}
        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {filteredVars.length > 0 ? (
            filteredVars.map((item) => (
              <div
                key={item.key}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-950/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 sm:w-1/3">
                  <span className="font-bold text-slate-100 truncate">{item.key}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.group}
                  </span>
                </div>

                <div className="flex-1 min-w-0 sm:px-4">
                  <span className="text-indigo-300 font-mono text-xs truncate block">
                    {item.isSecret && !showSecrets
                      ? '••••••••••••••••••••••••••••'
                      : item.value}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleCopy(item.value, item.key)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                    title={t('نسخ القيمة', 'Copy value')}
                  >
                    {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDelete(item.key)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title={t('حذف المتغير', 'Delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs italic">
              {t('لا توجد متغيرات مطابقة لمعايير البحث', 'No matching variables found')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
