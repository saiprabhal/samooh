import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KPICard({ title, value, change, badge, isPositive = true, icon: Icon }) {
  const { theme } = useApp();

  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl relative border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-2xs flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {(badge || change) && (
          <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded border ${
            isPositive
              ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
              : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {badge || change}
          </span>
        )}
      </div>

      {/* Subtle, Solid Accent Line */}
      <div className="mt-3 w-full h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-700 dark:bg-emerald-600 w-2/3" />
      </div>
    </div>
  );
}
