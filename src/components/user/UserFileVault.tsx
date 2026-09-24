import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { routerEngine } from '../../services/routerEngine';
import { StoredFile } from '../../types';
import {
  FolderArchive,
  Upload,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Download,
  Trash2,
  Eye,
  X,
  Search,
} from 'lucide-react';

export const UserFileVault: React.FC = () => {
  const { t, addToast } = useApp();
  const { user } = useAuth();
  const [files, setFiles] = useState<StoredFile[]>(() =>
    routerEngine.getFiles().filter((f) => f.uploadedBy === user?.id || user?.role === 'admin')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadMime, setUploadMime] = useState('application/pdf');
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const ext = uploadMime.includes('pdf') ? '.pdf' : uploadMime.includes('png') ? '.png' : '.xlsx';
    const newFile: StoredFile = {
      id: `user-f-${Date.now()}`,
      name: `${uploadTitle.trim().replace(/\s+/g, '_').toLowerCase()}${ext}`,
      originalName: `${uploadTitle.trim()}${ext}`,
      size: Math.floor(Math.random() * 2000000) + 120000,
      mimeType: uploadMime,
      extension: ext,
      url: `https://vault.omnirouter.io/files/${Date.now()}${ext}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user ? user.id : 'usr-demo-02',
      tags: ['personal-vault'],
    };

    routerEngine.addFile(newFile);
    setFiles(routerEngine.getFiles().filter((f) => f.uploadedBy === user?.id || user?.role === 'admin'));
    setUploadTitle('');
    addToast('success', t('تم رفع الملف بنجاح إلى خزنتك السحابية', 'File uploaded successfully'));
  };

  const handleDelete = (id: string) => {
    routerEngine.deleteFile(id);
    setFiles(routerEngine.getFiles().filter((f) => f.uploadedBy === user?.id || user?.role === 'admin'));
    addToast('info', t('تم حذف الملف', 'File deleted'));
  };

  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('خزنة المستندات والملفات الشخصية (Vault)', 'Personal File Vault')}</h2>
            <p className="text-xs text-slate-400">{t('تخزين مشفر وآمن لجميع مستنداتك وعقودك ومشاريعك السحابية', 'End-to-end encrypted personal storage')}</p>
          </div>
        </div>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleUpload} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200">{t('رفع مستند جديد إلى خزنتك', 'Upload New Asset')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder={t('اسم المستند أو التقرير...', 'Document title...')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={uploadMime}
              onChange={(e) => setUploadMime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="application/pdf">PDF Document (.pdf)</option>
              <option value="image/png">PNG Image (.png)</option>
              <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel Sheet (.xlsx)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t('رفع الملف', 'Upload')}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Files Grid */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('الملفات المحفوظة', 'Saved Files')} ({filtered.length})</span>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute start-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('بحث في ملفاتك...', 'Search files...')}
              className="bg-slate-950 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((file) => (
            <div
              key={file.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {file.mimeType.startsWith('image/') ? (
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                  ) : file.mimeType.includes('pdf') ? (
                    <FileText className="w-5 h-5 text-rose-400" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-100 truncate" title={file.originalName}>
                    {file.originalName}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    {(file.size / 1024).toFixed(1)} KB · {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[10px] text-slate-500">Encrypted</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-1 hover:text-indigo-400 transition-colors"
                    title={t('معاينة', 'Preview')}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => addToast('info', t('جاري تحميل الملف...', 'Downloading...'), file.originalName)}
                    className="p-1 hover:text-emerald-400 transition-colors"
                    title={t('تنزيل', 'Download')}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1 hover:text-rose-400 transition-colors"
                    title={t('حذف', 'Delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
