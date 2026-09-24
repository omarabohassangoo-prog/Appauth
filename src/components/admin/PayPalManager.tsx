import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { routerEngine, PAYPAL_PLANS } from '../../services/routerEngine';
import { PayPalOrder } from '../../types';
import {
  CreditCard,
  Plus,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const PayPalManager: React.FC = () => {
  const { t, addToast } = useApp();
  const { user } = useAuth();
  const [orders, setOrders] = useState<PayPalOrder[]>(() => routerEngine.getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [testAmount, setTestAmount] = useState('49.00');
  const [testDesc, setTestDesc] = useState('شراء باقة خدمات إضافية');

  const filteredOrders = orders.filter((o) => {
    return (
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalVolume = orders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((acc, o) => acc + o.amount, 0);

  const handleCreateTestOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(testAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const order = routerEngine.createOrder(user ? user.id : 'usr-admin-01', amountNum, testDesc);
    setOrders(routerEngine.getOrders());
    addToast('success', t('تم إنشاء وتأكيد طلب الدفع بنجاح', 'Captured PayPal order successfully'), `#${order.orderNumber} - $${order.amount}`);
  };

  const handleRefund = (id: string) => {
    routerEngine.refundOrder(id);
    setOrders(routerEngine.getOrders());
    addToast('info', t('تم استرداد مبلغ الطلب', 'Order refunded successfully'));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('إدارة مدفوعات واشتراكات PayPal (PayPalRouter)', 'PayPal Payments & Billing Engine')}</h2>
            <p className="text-xs text-slate-400">{t('إنشاء الطلبات، التأكيد التلقائي، الاشتراكات الدورية، واسترداد المبالغ', 'Orders, Captures, Subscriptions, Payouts, Refunds & Webhook triggers')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>{t('إجمالي المدفوعات:', 'Total Volume:')} <strong className="text-emerald-400 font-bold tabular-nums">${totalVolume.toFixed(2)}</strong></span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold">Live API v2</span>
        </div>
      </div>

      {/* Plans Showcase */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">{t('خطط وباقات الاشتراك الحالية', 'Active PayPal Subscription Plans')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYPAL_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between ${
                plan.popular ? 'border-indigo-500/80 shadow-lg shadow-indigo-600/10' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-100">{t(plan.nameAr, plan.name)}</h4>
                  {plan.popular && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                      {t('الأكثر طلباً', 'Popular')}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-2 font-mono">
                  <span className="text-2xl font-bold text-slate-100">${plan.price}</span>
                  <span className="text-xs text-slate-400">/ {t('شهرياً', 'month')}</span>
                </div>

                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {t(plan.descriptionAr, plan.description)}
                </p>

                <ul className="space-y-2 text-xs text-slate-300 mb-4">
                  {(t === undefined || useApp().language === 'ar' ? plan.featuresAr : plan.features).map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                <span>Plan ID: {plan.id}</span>
                <span className="text-emerald-400">{t('نشطة', 'Active')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Test Payment & Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Test Order Form */}
        <form onSubmit={handleCreateTestOrder} className="lg:col-span-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 h-fit">
          <h3 className="text-xs font-bold text-slate-200">{t('إنشاء وتأكيد طلب دفع تجريبي', 'Simulate PayPal Order')}</h3>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t('المبلغ بالدولار ($)', 'Amount (USD)')}</label>
            <input
              type="number"
              step="0.01"
              required
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t('وصف الطلب / الخدمة', 'Description')}</label>
            <input
              type="text"
              required
              value={testDesc}
              onChange={(e) => setTestDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('تأكيد الدفع عبر PayPal', 'Capture PayPal Order')}</span>
          </button>
        </form>

        {/* Orders List */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('سجل المعاملات والطلبات', 'Orders & Transaction Ledger')}</h3>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute start-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('بحث عن طلب...', 'Search order...')}
                className="bg-slate-950 border border-slate-800 rounded-lg ps-8 pe-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-950/40 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{ord.orderNumber}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          ord.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : ord.status === 'REFUNDED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{ord.description} · {ord.userName}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span className="text-sm font-bold text-slate-100 tabular-nums">${ord.amount.toFixed(2)}</span>

                    {ord.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleRefund(ord.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors flex items-center gap-1"
                        title={t('استرداد المبلغ', 'Refund')}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{t('استرداد', 'Refund')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs italic">
                {t('لا توجد معاملات مطابقة للبحث', 'No matching transactions')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
