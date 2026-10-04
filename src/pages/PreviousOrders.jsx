import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCheck, Calendar, Building, ArrowRight, Tag, Search, CheckCircle2, Truck, Clock, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

export default function PreviousOrders() {
  const { theme, t, user, orderHistory, setActiveInvoice } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const userOrders = orderHistory.filter(ord => 
    ord.userId === user?.id || ord.storeName === user?.storeName
  );

  const filteredOrders = userOrders.filter(ord => {
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    const matchesSearch = ord.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ord.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalOrdersCount = userOrders.length;
  const totalUserSavings = userOrders.reduce((sum, o) => sum + (o.totalSavings || 0), 0);
  const totalItemsProcured = userOrders.reduce((sum, o) => sum + (o.itemsCount || 0), 0);

  const handleViewInvoice = (order) => {
    setActiveInvoice(order);
    navigate('/invoice');
  };

  const handleExportAllCSV = () => {
    const headers = ["Order ID", "Invoice No", "Date", "Store Name", "Cluster Hub", "Status", "Items Count", "Total Retail Cost", "Total Wholesale Cost", "Total Savings (INR)", "Savings Pct", "Final Payable"];
    const rows = userOrders.map(o => [
      `"${o.id}"`,
      `"${o.invoiceNo}"`,
      `"${o.date}"`,
      `"${o.storeName}"`,
      `"${o.clusterHub}"`,
      `"${o.status}"`,
      o.itemsCount,
      o.totalRetailCost,
      o.totalWholesaleCost,
      o.totalSavings,
      `"${o.overallSavingsPct}%"`,
      o.finalPayable
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Samooh_Order_History_${user?.storeName || 'Store'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            <PackageCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400 mr-2 flex-shrink-0" />
            {t('previousOrders')}
            <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {totalOrdersCount} Orders
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('ordersDesc')}
          </p>
        </div>

        <button
          onClick={handleExportAllCSV}
          className="px-3.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 flex items-center space-x-1.5 shadow-sm w-fit"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Overview Stat Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="soft-card p-5 rounded-2.5xl border border-slate-200/80 dark:border-white/[0.08] shadow-soft hover:shadow-soft-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('totalOrders')}
            </span>
            <div className="w-8 h-8 rounded-2xl soft-inset flex items-center justify-center text-slate-500 dark:text-slate-400">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
            {totalOrdersCount}
          </p>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            Active Store Account
          </span>
        </div>

        <div className="soft-card p-5 rounded-2.5xl border border-slate-200/80 dark:border-white/[0.08] shadow-soft hover:shadow-soft-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('lifetimeSavings')}
            </span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2 text-emerald-800 dark:text-emerald-400">
            {formatINR(totalUserSavings)}
          </p>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            Unlocked via Wholesale Arbitrage
          </span>
        </div>

        <div className="soft-card p-5 rounded-2.5xl border border-slate-200/80 dark:border-white/[0.08] shadow-soft hover:shadow-soft-lg transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Items Procured
            </span>
            <div className="w-8 h-8 rounded-2xl soft-inset flex items-center justify-center text-slate-500 dark:text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
            {totalItemsProcured} Units
          </p>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            Consolidated Cluster Orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Badges Segmented Pill */}
        <div className="p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-850/80 border border-slate-200/70 dark:border-white/[0.06] flex items-center space-x-1.5 overflow-x-auto shadow-soft-inset">
          {['All', 'Delivered', 'In Transit', 'Processing'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-soft'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="soft-input w-full rounded-full pl-9 pr-3 py-1.5 text-xs border border-slate-200/80 dark:border-white/[0.08]"
          />
        </div>
      </div>

      {/* Orders List / Cards Grid */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const isDelivered = order.status === 'Delivered';
            const isInTransit = order.status === 'In Transit';

            return (
              <div
                key={order.id}
                className="soft-card rounded-2.5xl p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-soft hover:shadow-soft-lg transition-all space-y-3"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                  {/* Order ID & Date */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {order.invoiceNo}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center space-x-1 ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : isInTransit
                            ? 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600'
                            : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      }`}>
                        {isDelivered ? <CheckCircle2 className="w-3 h-3" /> : isInTransit ? <Truck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{order.status}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                        {order.date}
                      </span>
                      <span className="flex items-center">
                        <Building className="w-3 h-3 mr-1 text-slate-400" />
                        {order.clusterHub}
                      </span>
                    </div>
                  </div>

                  {/* Financial & Items Summary */}
                  <div className="flex items-center space-x-4 sm:space-x-6 text-xs soft-inset p-3 rounded-2xl border border-slate-200/60 dark:border-white/[0.04]">
                    <div>
                      <span className="block text-[10px] text-slate-400">Total Items</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{order.itemsCount} Units</span>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-400">Retail Ref</span>
                      <span className="line-through text-slate-400">{formatINR(order.totalRetailCost || 0)}</span>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-400">Wholesale Value</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatINR(order.totalWholesaleCost || 0)}</span>
                    </div>

                    <div className="p-1.5 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                      <span className="block text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase">Saved</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">{formatINR(order.totalSavings || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Items Preview Chips & View Invoice Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
                    {order.items && order.items.slice(0, 3).map((it, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08] whitespace-nowrap"
                      >
                        {it.name} ({it.qty}x)
                      </span>
                    ))}
                    {order.items && order.items.length > 3 && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleViewInvoice(order)}
                    className="soft-button-primary w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs shadow-soft transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>{t('viewInvoice')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-2.5xl soft-card border border-slate-200/80 dark:border-white/[0.08]">
            <p className="text-slate-400 text-xs">{t('noOrdersMatching')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
