import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { routerEngine } from '../../services/routerEngine';
import { PayPalOrder } from '../../types';
import {
  CreditCard,
  Plus,
  DollarSign,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const UserBilling: React.FC = () => {
  const { t, addToast } = useApp();
  const { user } = useAuth();
  const [orders, setOrders] = useState<PayPalOrder[]>(() =>
    routerEngine.getOrders().filter((o) => o.userId === user?.id || user?.role === 'admin')
  );
  const [rechargeAmount, setRechargeAmount] = useState('50.00');

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(rechargeAmount);
    if (isNaN(amt) || amt <= 0) return;

    const ord = routerEngine.createOrder(user?.id || 'usr-demo-02', amt, 'شحن رصيد محفظة الخدمات');
    setOrders(routerEngine.getOrders().filter((o) => o.userId === user?.id || user?.role === 'admin'));
    addToast('success', t('تم شحن الرصيد بنجاح عبر PayPal', 'Balance recharged successfully via PayPal'), `$${amt}`);
  };

  const handleRefund = (orderId: string) => {
    routerEngine.refundOrder(orderId);
    setOrders(routerEngine.getOrders().filter((o) => o.userId === user?.id || user?.role === 'admin'));
    addToast('info', t('تم تقديم طلب الاسترداد ومعالجته بنجاح', 'Refund processed successfully'));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">{t('الفواتير والاشتراكات والمدفوعات', 'Billing, Invoices & PayPal Payments')}</h2>
            <p className="text-xs text-slate-400">{t('إدارة رصيد الحساب، تحميل الفواتير الضريبية، وسجل عمليات الدفع الآمنة', 'Account balance, automated tax receipts and secure checkout')}</p>
          </div>
        </div>
      </div>

      {/* Balance & Recharge Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-4">
          <span className="text-xs text-slate-400 block font-medium">{t('الرصيد المتوفر في المحفظة', 'Current Available Balance')}</span>
          <p className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">${(user?.balance || 850.5).toFixed(2)}</p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('يستخدم الرصيد للاستدعاءات والخدمات الإضافية', 'Used for API overages & custom queues')}</span>
          </div>
        </div>

        <form onSubmit={handleRecharge} className="md:col-span-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-100">{t('شحن رصيد المحفظة الفوري عبر PayPal', 'Instant Wallet Refill via PayPal')}</h3>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <DollarSign className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="5"
                min="10"
                required
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-9 pe-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-indigo-500 tabular-nums"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t('شحن الرصيد الآن', 'Pay with PayPal')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <Lock className="w-3 h-3" />
            <span>{t('معالجة الدفع مشفرة ومؤمنة بنسبة 100% وفق بروتوكولات PCI-DSS', '256-bit SSL encrypted PCI-DSS compliant checkout')}</span>
          </div>
        </form>
      </div>

      {/* Orders Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('سجل الفواتير والمعاملات الخاصة بك', 'Your Invoice & Payment History')}</h3>

        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {orders.map((ord) => (
            <div key={ord.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
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
                <p className="text-[11px] text-slate-400 mt-0.5">{ord.description}</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <span className="text-sm font-bold text-slate-100 tabular-nums">${ord.amount.toFixed(2)}</span>
                <button
                  onClick={() => addToast('info', t('جاري تحميل الفاتورة الضريبية...', 'Generating invoice PDF...'), ord.orderNumber)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title={t('تحميل الفاتورة PDF', 'Download Invoice')}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                {ord.status === 'COMPLETED' && (
                  <button
                    onClick={() => handleRefund(ord.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
                    title={t('طلب استرداد', 'Request Refund')}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
