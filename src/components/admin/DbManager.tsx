import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { routerEngine } from '../../services/routerEngine';
import { DatabaseTable } from '../../types';
import {
  Database,
  Play,
  Table as TableIcon,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Layers,
  Code2,
  CheckCircle2,
} from 'lucide-react';

export const DbManager: React.FC = () => {
  const { t, addToast } = useApp();
  const [tables, setTables] = useState<DatabaseTable[]>(() => routerEngine.getTables());
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM users LIMIT 10;');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [executing, setExecuting] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const currentTable = tables.find((t) => t.name === selectedTable) || tables[0];

  const handleRunSql = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      const res = routerEngine.executeSql(sqlQuery);
      setQueryResult(res);
      setTables([...routerEngine.getTables()]);
      if (res.success) {
        addToast('success', t('تم تنفيذ الاستعلام بنجاح', 'Query executed successfully'), `${res.duration}ms`);
      } else {
        addToast('error', t('فشل تنفيذ الاستعلام', 'Query execution error'), res.error);
      }
    }, 250);
  };

  const setSqlSample = (sample: string) => {
    setSqlQuery(sample);
  };

  const filteredRows = (currentTable?.data || []).filter((row) => {
    if (!searchFilter) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header & Quick Driver Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('إدارة قواعد البيانات والاستعلامات (DbRouter)', 'Database Router & Query Hub')}</h2>
            <p className="text-xs text-slate-400">{t('محرك موحد يدعم PostgreSQL و MySQL و SQLite مع المعاملات والـ Schema', 'Unified multi-driver engine with CRUD, Schema & Transactions')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Driver:</span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
            PostgreSQL 16 (SSL)
          </span>
        </div>
      </div>

      {/* SQL Query Editor & Samples */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>{t('محرر استعلامات SQL المباشر', 'Live SQL Query Console')}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSqlSample('SELECT * FROM users;')}
              className="px-2 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              SELECT users
            </button>
            <button
              onClick={() => setSqlSample('SELECT * FROM orders WHERE status = "COMPLETED";')}
              className="px-2 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              SELECT orders
            </button>
            <button
              onClick={() => setSqlSample('INSERT INTO users (id, name, email, role) VALUES ("usr-new", "خالد العامر", "khaled@domain.com", "user");')}
              className="px-2 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
            >
              INSERT user
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {t('يدعم Transactions و Aggregations و Joins', 'Supports Transactions, Joins & Aggregations')}
          </span>
          <button
            onClick={handleRunSql}
            disabled={executing || !sqlQuery.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{executing ? t('جاري التنفيذ...', 'Executing...') : t('تنفيذ الاستعلام', 'Run SQL')}</span>
          </button>
        </div>

        {/* Query Result Preview if executed */}
        {queryResult && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono overflow-auto max-h-48">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1 mb-2">
              <span className="text-emerald-400 font-bold">{t('النتيجة:', 'Result:')} {queryResult.count || queryResult.rows?.length || 0} {t('صفوف', 'rows')}</span>
              <span>{queryResult.duration}ms</span>
            </div>
            {queryResult.rows ? (
              <pre className="text-slate-200 whitespace-pre-wrap">
                {JSON.stringify(queryResult.rows, null, 2)}
              </pre>
            ) : (
              <p className="text-emerald-400">{queryResult.error || t('تم التنفيذ بنجاح.', 'Executed successfully.')}</p>
            )}
          </div>
        )}
      </div>

      {/* Tables Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Selector List */}
        <div className="lg:col-span-3 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t('الجداول المتاحة', 'Tables')}</h3>
            <span className="text-xs text-slate-500 font-mono">{tables.length}</span>
          </div>

          <div className="space-y-1.5">
            {tables.map((tItem) => (
              <button
                key={tItem.name}
                onClick={() => {
                  setSelectedTable(tItem.name);
                  setSqlQuery(`SELECT * FROM ${tItem.name} LIMIT 10;`);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono transition-all text-start ${
                  selectedTable === tItem.name
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="font-bold">{tItem.name}</span>
                </div>
                <span className="text-[10px] text-slate-500">{tItem.data?.length || 0} {t('صفوف', 'rows')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Table Data & Columns Grid */}
        <div className="lg:col-span-9 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100 font-mono">{currentTable?.name}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ({currentTable?.columns.length} {t('أعمدة', 'columns')} · {currentTable?.data.length} {t('سجلات', 'records')})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute start-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={t('بحث في البيانات...', 'Filter rows...')}
                    className="bg-slate-950 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Columns schema chips */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">{t('هيكل الأعمدة:', 'Schema:')}</span>
              {currentTable?.columns.map((col) => (
                <span key={col.name} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px]">
                  {col.name} <span className="text-indigo-400">({col.type})</span>
                  {col.primaryKey && <span className="text-amber-400 ms-1">PK</span>}
                </span>
              ))}
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    {currentTable?.columns.map((col) => (
                      <th key={col.name} className="px-3.5 py-2.5 text-start font-semibold whitespace-nowrap">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        {currentTable?.columns.map((col) => (
                          <td key={col.name} className="px-3.5 py-2 text-slate-300 whitespace-nowrap tabular-nums">
                            {row[col.name] !== undefined ? String(row[col.name]) : <span className="text-slate-600">NULL</span>}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={currentTable?.columns.length || 1} className="px-4 py-6 text-center text-slate-500 italic">
                        {t('لا توجد بيانات مطابقة', 'No matching records found')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
