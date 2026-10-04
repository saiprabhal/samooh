import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function KPICard({ title, value, change, badge, isPositive = true, icon: Icon }) {
  const { theme } = useApp();

  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl relative border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#FFF] transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl border-2 border-black dark:border-white bg-[#FFDE59] dark:bg-emerald-400 text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] flex items-center justify-center">
            <Icon className="w-4 h-4 stroke-[2.5]" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {(badge || change) && (
          <span className={`inline-flex items-center text-[10px] font-black uppercase px-2 py-0.5 rounded-md border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] ${
            isPositive
              ? 'text-black bg-[#86EFAC]'
              : 'text-black bg-[#FCA5A5]'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1 stroke-[3]" /> : <TrendingDown className="w-3 h-3 mr-1 stroke-[3]" />}
            {badge || change}
          </span>
        )}
      </div>

      {/* Solid Black/White Neo Accent Line */}
      <div className="mt-3.5 w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-black dark:border-white">
        <div className="h-full bg-black dark:bg-white w-2/3" />
      </div>
    </div>
  );
}
