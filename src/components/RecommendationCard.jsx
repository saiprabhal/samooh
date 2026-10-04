import React from 'react';
import { Store, MapPin, Check, X, ArrowUpRight, Truck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ExplainableRecommendation from './ExplainableRecommendation';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

export default function RecommendationCard({ recommendation, onAccept, onReject, onViewDetails }) {
  const { theme, t } = useApp();
  const {
    product_name,
    category,
    retailer_names,
    threshold_status,
    threshold_quantity,
    current_pool_quantity,
    estimated_total_savings,
    estimated_savings_percentage,
    average_cluster_distance_km
  } = recommendation;

  const progressPct = Math.min(100, Math.round((current_pool_quantity / threshold_quantity) * 100));

  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
      {/* Ambient background hover light */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full glass-pill text-emerald-800 dark:text-emerald-300">
            {category || "Procurement Pool"}
          </span>
          <StatusBadge status={threshold_status} />
        </div>

        {/* Product Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3 line-clamp-1">
          {product_name}
        </h3>

        {/* Retailers & Distance */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-white/20 dark:border-white/10 pb-2.5">
          <span className="flex items-center">
            <Store className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
            {retailer_names ? retailer_names.length : 0} {t('storesParticipating')}
          </span>
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
            ~{average_cluster_distance_km} km {t('avgRadius')}
          </span>
        </div>

        {/* Threshold Progress Bar */}
        <div className="mt-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {t('thresholdProgress')}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {current_pool_quantity} / {threshold_quantity} Units ({progressPct}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200/50 dark:bg-white/5 overflow-hidden border border-white/20 dark:border-white/5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Savings Box with Glass Sheen */}
        <div className="mt-3.5 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block tracking-wider">
              {t('totalGroupSavings')}
            </span>
            <div className="text-base font-bold text-emerald-950 dark:text-emerald-300">
              {formatINR(estimated_total_savings || 0)}
            </div>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-bold text-xs border border-emerald-500/30">
            {estimated_savings_percentage}% Margin
          </div>
        </div>

        {/* Transport Fleet Recommendation Pill */}
        <div className="mt-2.5 p-2 rounded-xl glass-pill flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 truncate">
            <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="truncate font-medium text-slate-800 dark:text-slate-200 text-[11px]">
              {recommendation.transport?.recommended_vehicle || 'Tata Ace (SCV)'}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {recommendation.transport?.total_load_kg ? `${Math.round(recommendation.transport.total_load_kg)} kg` : `${Math.round(current_pool_quantity * 25)} kg`}
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              {recommendation.transport?.capacity_utilization_pct || Math.round((current_pool_quantity * 25 / 1000) * 100)}% Load
            </span>
          </div>
        </div>

        {/* Explainable Procurement Engine Rationale */}
        <ExplainableRecommendation recommendation={recommendation} mode="card" />
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-white/20 dark:border-white/10 flex items-center space-x-2 relative z-10">
        <button 
          onClick={() => onReject(recommendation.id)}
          className="p-2 rounded-xl border border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/5 text-slate-400 hover:text-rose-500 transition"
          title="Dismiss Opportunity"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <button 
          onClick={() => onViewDetails && onViewDetails(recommendation)}
          className="flex-1 py-2 px-3 rounded-xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-white/15 transition flex items-center justify-center space-x-1.5 shadow-sm"
        >
          <span>Audit Logistics</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <button 
          onClick={() => onAccept(recommendation)}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition flex items-center justify-center space-x-1.5 border border-white/20"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Join Pool</span>
        </button>
      </div>
    </div>
  );
}
