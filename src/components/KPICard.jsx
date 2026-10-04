import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KPICard({ title, value, change, badge, isPositive = true, icon: Icon, color = 'emerald' }) {
  const { theme } = useApp();

  const colorStyles = {
    emerald: {
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      flare: 'bg-emerald-500/15',
      bar: 'from-emerald-500 to-teal-400',
      badge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
    },
    blue: {
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      flare: 'bg-blue-500/15',
      bar: 'from-blue-500 to-indigo-400',
      badge: 'text-blue-700 dark:text-blue-300 bg-blue-500/15 border-blue-500/30'
    },
    purple: {
      iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      flare: 'bg-purple-500/15',
      bar: 'from-purple-500 to-pink-400',
      badge: 'text-purple-700 dark:text-purple-300 bg-purple-500/15 border-purple-500/30'
    },
    amber: {
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      flare: 'bg-amber-500/15',
      bar: 'from-amber-500 to-orange-400',
      badge: 'text-amber-700 dark:text-amber-300 bg-amber-500/15 border-amber-500/30'
    }
  };

  const currentTheme = colorStyles[color] || colorStyles.emerald;

  return (
    <div className="glass-card p-4 sm:p-5 rounded-3xl relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-white/40 dark:border-white/10">
      {/* Ambient glowing flare */}
      <div className={`absolute -top-10 -right-10 w-28 h-28 ${currentTheme.flare} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${currentTheme.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110 flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2 relative z-10">
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {(badge || change) && (
          <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full border ${currentTheme.badge}`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {badge || change}
          </span>
        )}
      </div>

      {/* Mini Decorative Visual Indicator Line */}
      <div className="mt-3 w-full h-1 rounded-full bg-slate-200/50 dark:bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${currentTheme.bar} w-3/4`} />
      </div>
    </div>
  );
}
