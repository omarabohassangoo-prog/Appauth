import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { routerEngine } from '../../services/routerEngine';
import { User, UserRole } from '../../types';
import {
  Users,
  UserPlus,
  Shield,
  User as UserIcon,
  Search,
  MoreVertical,
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  X,
} from 'lucide-react';

export const UsersManager: React.FC = () => {
  const { t, addToast } = useApp();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(() => routerEngine.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+9665');
  const [newRole, setNewRole] = useState<UserRole>('user');

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleToggleRole = (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      addToast('error', t('لا يمكنك تغيير رتبة حسابك الحالي مباشرة', 'Cannot change your own role'));
      return;
    }

    const updatedRole: UserRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const updated: User = { ...targetUser, role: updatedRole };
    routerEngine.saveUser(updated);
    setUsers([...routerEngine.getUsers()]);
    addToast('success', t('تم تحديث صلاحية المستخدم', 'User role updated'), `${updated.name} -> ${updatedRole}`);
  };

  const handleToggleStatus = (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      addToast('error', t('لا يمكنك تجميد حسابك الحالي', 'Cannot suspend your own account'));
      return;
    }

    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    const updated: User = { ...targetUser, status: newStatus };
    routerEngine.saveUser(updated);
    setUsers([...routerEngine.getUsers()]);
    addToast('info', t('تم تعديل حالة الحساب', 'Account status updated'), `${updated.name} -> ${newStatus}`);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) {
      addToast('error', t('لا يمكنك حذف حسابك الحالي', 'Cannot delete your own account'));
      return;
    }

    routerEngine.deleteUser(id);
    setUsers([...routerEngine.getUsers()]);
    addToast('info', t('تم حذف المستخدم من النظام', 'User deleted'));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: newRole,
      createdAt: new Date().toISOString(),
      status: 'active',
      mfaEnabled: false,
      planId: 'plan-starter',
      balance: 100.0,
      company: 'Corporate Client',
    };

    routerEngine.saveUser(newUser);
    setUsers([...routerEngine.getUsers()]);
    setCreateModalOpen(false);
    setNewName('');
    setNewEmail('');
    addToast('success', t('تمت إضافة المستخدم الجديد بنجاح', 'User created successfully'), newUser.email);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('إدارة مستخدمي النظام والصلاحيات (RBAC)', 'User Management & Role Matrix')}</h2>
            <p className="text-xs text-slate-400">{t('التحكم في أدوار المشرفين والمستخدمين، تجميد الحسابات، وإعادة ضبط الأمان', 'Manage admins and users, account suspension, and authentication rules')}</p>
          </div>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{t('إضافة مستخدم جديد', 'Add New User')}</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('قائمة المستخدمين المسجلين', 'Registered Users')}</span>
            <span className="text-xs text-slate-500 font-mono">({users.length})</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute start-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('بحث بالاسم أو البريد...', 'Search user...')}
              className="bg-slate-950 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t('المستخدم', 'User')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('الرتبة والصلاحية', 'Role')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('الحالة', 'Status')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('رقم الجوال', 'Phone')}</th>
                <th className="px-4 py-3 text-start font-semibold">{t('الرصيد', 'Balance')}</th>
                <th className="px-4 py-3 text-end font-semibold">{t('الإجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.id === currentUser?.id && (
                            <span className="text-[10px] text-indigo-400 font-mono">({t('أنت', 'You')})</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleRole(u)}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all ${
                        u.role === 'admin'
                          ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title={t('اضغط لتغيير الرتبة', 'Click to toggle role')}
                    >
                      {u.role === 'admin' ? <Shield className="w-3 h-3 text-indigo-400" /> : <UserIcon className="w-3 h-3 text-slate-400" />}
                      <span className="uppercase">{u.role}</span>
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-all ${
                        u.status === 'active' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                      title={t('اضغط لتبديل الحالة', 'Click to toggle status')}
                    >
                      {u.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{u.status === 'active' ? t('نشط', 'Active') : t('مجمد', 'Suspended')}</span>
                    </button>
                  </td>

                  <td className="px-4 py-3 font-mono text-slate-300 tabular-nums">
                    {u.phone || '—'}
                  </td>

                  <td className="px-4 py-3 font-mono font-bold text-slate-100 tabular-nums">
                    ${(u.balance || 0).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === currentUser?.id}
                        className="p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-colors"
                        title={t('حذف المستخدم', 'Delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 end-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>{t('إضافة مستخدم جديد للنظام', 'Create New System User')}</span>
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('الاسم الكامل', 'Full Name')}</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: يوسف المطيري"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('البريد الإلكتروني', 'Email')}</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('رقم الجوال', 'Phone')}</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('الرتبة / الدور', 'Role')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('user')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                      newRole === 'user' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    User (مستخدم)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRole('admin')}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                      newRole === 'admin' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Admin (مدير نظام)
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
                  {t('إنشاء المستخدم', 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
