import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { routerEngine } from '../../services/routerEngine';
import { MigrationItem } from '../../types';
import {
  GitPullRequest,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Plus,
  Code2,
  X,
  FileCode,
} from 'lucide-react';

export const MigrationsManager: React.FC = () => {
  const { t, addToast } = useApp();
  const [migrations, setMigrations] = useState<MigrationItem[]>(() => routerEngine.getMigrations());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newMigName, setNewMigName] = useState('');
  const [newMigUp, setNewMigUp] = useState('CREATE TABLE sample_table (\n  id VARCHAR(36) PRIMARY KEY,\n  title VARCHAR(255) NOT NULL\n);');
  const [newMigDown, setNewMigDown] = useState('DROP TABLE IF EXISTS sample_table;');

  const handleApply = (id: string) => {
    routerEngine.runMigration(id);
    setMigrations([...routerEngine.getMigrations()]);
    addToast('success', t('تم تطبيق الهجرة بنجاح', 'Migration applied successfully'));
  };

  const handleRollback = (id: string) => {
    routerEngine.rollbackMigration(id);
    setMigrations([...routerEngine.getMigrations()]);
    addToast('info', t('تم التراجع عن الهجرة', 'Migration rolled back'));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMigName.trim()) return;

    const newMig: MigrationItem = {
      id: `mig-${Date.now()}`,
      name: `${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}_${newMigName.trim().replace(/\s+/g, '_').toLowerCase()}`,
      batch: 4,
      applied: false,
      upSql: newMigUp,
      downSql: newMigDown,
    };

    const current = routerEngine.getMigrations();
    current.push(newMig);
    localStorage.setItem('omni_migrations', JSON.stringify(current));
    setMigrations([...current]);
    setCreateModalOpen(false);
    setNewMigName('');
    addToast('success', t('تم إنشاء ملف الهجرة الجديد', 'Migration file created'));
  };

  const appliedCount = migrations.filter((m) => m.applied).length;
  const pendingCount = migrations.length - appliedCount;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('إدارة هجرات وهيكل قاعدة البيانات (MigrationRouter)', 'Database Schema & Migrations Engine')}</h2>
            <p className="text-xs text-slate-400">{t('إصدارات الهيكل، تطبيق التعديلات التلقائية، التراجع عن الدفعات، واللقطات', 'Schema version control, batch migrations, rollbacks & snapshot generation')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('إنشاء ملف هجرة جديد', 'New Migration')}</span>
          </button>
        </div>
      </div>

      {/* Migration Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">{t('إجمالي الهجرات', 'Total Migrations')}</span>
          <p className="text-xl font-bold font-mono text-slate-100 tabular-nums">{migrations.length}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">{t('المطبقة حالياً', 'Applied')}</span>
          <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums">{appliedCount}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">{t('المعلقة', 'Pending')}</span>
          <p className="text-xl font-bold font-mono text-amber-400 tabular-nums">{pendingCount}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">{t('جدول التتبع', 'Meta Table')}</span>
          <p className="text-xs font-bold font-mono text-indigo-300 mt-1">_migrations (Active)</p>
        </div>
      </div>

      {/* Migrations Timeline List */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('سجل ملفات الهجرة والتسلسل الزمني', 'Migration Files Timeline')}</h3>

        <div className="space-y-3">
          {migrations.map((mig) => (
            <div
              key={mig.id}
              className={`p-4 rounded-xl border transition-all ${
                mig.applied ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-900 border-amber-500/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${mig.applied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {mig.applied ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 font-mono">{mig.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Batch #{mig.batch} {mig.appliedAt && `· Applied at ${new Date(mig.appliedAt).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!mig.applied ? (
                    <button
                      onClick={() => handleApply(mig.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{t('تطبيق الهجرة (Migrate)', 'Apply Migration')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRollback(mig.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('تراجع (Rollback)', 'Rollback')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SQL Code Block */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{t('-- كود الترقية (UP)', '-- UP SQL')}</div>
                <div className="text-emerald-400 whitespace-pre-wrap">{mig.upSql}</div>
                {mig.downSql && (
                  <>
                    <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mt-2">{t('-- كود التراجع (DOWN)', '-- DOWN SQL')}</div>
                    <div className="text-slate-400 whitespace-pre-wrap">{mig.downSql}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 end-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>{t('إنشاء ملف هجرة جديد', 'Create New Schema Migration')}</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('اسم الهجرة (مثال: add_notifications_table)', 'Migration Name')}</label>
                <input
                  type="text"
                  required
                  value={newMigName}
                  onChange={(e) => setNewMigName(e.target.value)}
                  placeholder="create_notifications_table"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('أمر الترقية UP SQL', 'UP SQL')}</label>
                <textarea
                  rows={4}
                  required
                  value={newMigUp}
                  onChange={(e) => setNewMigUp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('أمر التراجع DOWN SQL', 'DOWN SQL')}</label>
                <textarea
                  rows={2}
                  required
                  value={newMigDown}
                  onChange={(e) => setNewMigDown(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-rose-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                >
                  {t('إلغاء', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  {t('حفظ ملف الهجرة', 'Create Migration')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
