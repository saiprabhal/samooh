import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KPICard({ title, value, change, isPositive = true, icon: Icon, subtitle }) {
  const { theme } = useApp();

  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl relative overflow-hidden group">
      {/* Ambient background glow on hover */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 text-emerald-600 dark:text-emerald-400 shadow-sm transition-transform duration-300 group-hover:scale-110">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2 relative z-10">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {change && (
          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full glass-pill ${
            isPositive 
              ? 'text-emerald-700 dark:text-emerald-400' 
              : 'text-rose-700 dark:text-rose-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 relative z-10">
          {subtitle}
        </p>
      )}
    </div>
  );
}
