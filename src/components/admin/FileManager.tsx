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
  FileCode,
  FileSpreadsheet,
  Download,
  Trash2,
  ExternalLink,
  Search,
  Check,
  Eye,
  X,
  HardDrive,
} from 'lucide-react';

export const FileManager: React.FC = () => {
  const { t, addToast } = useApp();
  const { user } = useAuth();
  const [files, setFiles] = useState<StoredFile[]>(() => routerEngine.getFiles());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [previewFile, setPreviewFile] = useState<StoredFile | null>(null);

  // Upload state
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState('application/pdf');

  const getFileIcon = (mime: string) => {
    if (mime.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-indigo-400" />;
    if (mime.includes('sheet') || mime.includes('excel')) return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    if (mime.includes('pdf')) return <FileText className="w-5 h-5 text-rose-400" />;
    return <FileCode className="w-5 h-5 text-amber-400" />;
  };

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === 'all' ||
      (filterType === 'image' && f.mimeType.startsWith('image/')) ||
      (filterType === 'document' && !f.mimeType.startsWith('image/'));
    return matchesSearch && matchesType;
  });

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    const ext = uploadType === 'image/png' ? '.png' : uploadType === 'application/pdf' ? '.pdf' : '.xlsx';
    const newFile: StoredFile = {
      id: `f-${Date.now()}`,
      name: `${uploadName.trim().replace(/\s+/g, '_').toLowerCase()}${ext}`,
      originalName: `${uploadName.trim()}${ext}`,
      size: Math.floor(Math.random() * 3000000) + 150000,
      mimeType: uploadType,
      extension: ext,
      url: `https://storage.omnirouter.io/vault/${Date.now()}${ext}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user ? user.id : 'usr-admin-01',
      tags: ['manual-upload'],
    };

    routerEngine.addFile(newFile);
    setFiles(routerEngine.getFiles());
    setUploadName('');
    addToast('success', t('تم رفع الملف بنجاح إلى التخزين السحابي', 'File uploaded to S3 storage successfully'), newFile.originalName);
  };

  const handleDelete = (id: string) => {
    routerEngine.deleteFile(id);
    setFiles(routerEngine.getFiles());
    addToast('info', t('تم حذف الملف', 'File deleted'));
  };

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <FolderArchive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('إدارة التخزين السحابي والملفات (FileRouter)', 'File Storage & Asset Vault')}</h2>
            <p className="text-xs text-slate-400">{t('رفع وتنزيل متعدد، أرشيف مضغوط، معاينة فورية، ودعم S3 و Cloudinary', 'Multi-provider uploads (S3, Local, Cloudinary) with chunking & zip downloads')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>{t('المساحة:', 'Used:')} <strong className="text-slate-200">{(totalBytes / 1024 / 1024).toFixed(2)} MB</strong></span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold">AWS S3 (eu-west-1)</span>
        </div>
      </div>

      {/* Upload Zone */}
      <form onSubmit={handleSimulatedUpload} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-200">{t('رفع ملف جديد إلى الخادم', 'Upload New Asset to Vault')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              required
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder={t('اسم الملف (مثال: تقرير_الأداء_المؤسسي)', 'File title (e.g. system_audit_2026)')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="application/pdf">PDF Document (application/pdf)</option>
              <option value="image/png">PNG Image (image/png)</option>
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

      {/* Files Grid and Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('جميع الملفات', 'All Files')} ({files.length})
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                filterType === 'image'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('الصور', 'Images')}
            </button>
            <button
              onClick={() => setFilterType('document')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                filterType === 'document'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t('المستندات', 'Documents')}
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute start-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('بحث عن ملف...', 'Search files...')}
              className="bg-slate-950 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Files List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  {getFileIcon(file.mimeType)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-100 truncate" title={file.originalName}>
                    {file.originalName}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    {file.name}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{(file.size / 1024).toFixed(1)} KB</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-1 hover:text-indigo-400 transition-colors"
                    title={t('معاينة', 'Preview')}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => addToast('info', t('جاري تحميل الملف...', 'Downloading file...'), file.originalName)}
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

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 end-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                {getFileIcon(previewFile.mimeType)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-100 truncate">{previewFile.originalName}</h3>
                <p className="text-xs text-slate-400 font-mono">{previewFile.mimeType} · {(previewFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>

            <div className="h-48 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 text-center">
              <div className="space-y-2">
                <FileText className="w-10 h-10 text-indigo-400 mx-auto opacity-70" />
                <p className="text-xs text-slate-300 font-medium">{t('معاينة الملف المشفر في التخزين الآمن', 'Secure Encrypted Document Preview')}</p>
                <p className="text-[11px] text-slate-500 font-mono">{previewFile.url}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                {t('إغلاق', 'Close')}
              </button>
              <button
                onClick={() => {
                  addToast('success', t('تم بدء التنزيل', 'Download started'));
                  setPreviewFile(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('تنزيل الملف الأصلي', 'Download File')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
