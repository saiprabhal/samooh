import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KPICard({ title, value, change, badge, isPositive = true, icon: Icon }) {
  const { theme } = useApp();

  return (
    <div className="soft-card p-4 sm:p-5 rounded-2.5xl relative border border-slate-200/70 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-soft transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl soft-inset flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Icon className="w-4 h-4 stroke-[1.8]" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {(badge || change) && (
          <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            isPositive
              ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60'
              : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/60'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1 stroke-[2]" /> : <TrendingDown className="w-3 h-3 mr-1 stroke-[2]" />}
            {badge || change}
          </span>
        )}
      </div>

      {/* Modern Minimalist Accent Line */}
      <div className="mt-3.5 w-full h-1 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-700/90 dark:bg-emerald-500 w-2/3" />
      </div>
    </div>
  );
}
