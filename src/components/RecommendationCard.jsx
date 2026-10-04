import React from 'react';
import { 
  Store, MapPin, Check, X, ArrowUpRight, Truck, 
  IndianRupee, Package, Droplets, Flame, ShoppingBag, 
  Sparkles, Users, TrendingDown 
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

const CATEGORY_THEMES = {
  Grains: {
    badge: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
    avatar: 'bg-gradient-to-br from-amber-500 to-orange-600',
    icon: Package,
    tag: '🌾 Grains'
  },
  Oils: {
    badge: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/30',
    avatar: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    icon: Droplets,
    tag: '🌻 Oils'
  },
  Spices: {
    badge: 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30',
    avatar: 'bg-gradient-to-br from-rose-500 to-red-600',
    icon: Flame,
    tag: '🌶️ Spices'
  },
  Essentials: {
    badge: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
    avatar: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    icon: ShoppingBag,
    tag: '🧂 Essentials'
  }
};

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
    average_cluster_distance_km,
    unit_retail_price,
    unit_wholesale_price
  } = recommendation;

  const themeInfo = CATEGORY_THEMES[category] || {
    badge: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
    avatar: 'bg-gradient-to-br from-emerald-600 to-teal-700',
    icon: Package,
    tag: category || '📦 Bulk Pool'
  };

  const IconComponent = themeInfo.icon;
  const progressPct = Math.min(100, Math.round((current_pool_quantity / threshold_quantity) * 100));
  const isAchieved = threshold_status === 'ACHIEVED' || progressPct >= 100;

  // Fallback prices if not directly provided
  const retailPrice = unit_retail_price || Math.round((unit_wholesale_price || 1180) * 1.22);
  const wholesalePrice = unit_wholesale_price || Math.round(retailPrice * (1 - (estimated_savings_percentage || 18.5) / 100));

  return (
    <div className="glass-card p-4 sm:p-5 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-white/40 dark:border-white/10">
      {/* Ambient background hover flare */}
      <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div>
        {/* Top Header: Visual Avatar + Category Pill + Status Pill */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className={`w-10 h-10 rounded-2xl ${themeInfo.avatar} flex items-center justify-center text-white shadow-md shadow-black/10 border border-white/30 flex-shrink-0 group-hover:rotate-6 transition-transform duration-300`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${themeInfo.badge}`}>
                {themeInfo.tag}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {isAchieved ? (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Unlocked</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                <span>{progressPct}% Met</span>
              </span>
            )}
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {product_name}
        </h3>

        {/* High-Contrast Price Slash & Savings Banner */}
        <div className="mt-3 p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{wholesalePrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-semibold">
              ₹{retailPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              / unit
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 tracking-tight">
              SAVE {estimated_savings_percentage}%
            </span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
              +{formatINR(estimated_total_savings)} group
            </span>
          </div>
        </div>

        {/* Visual Fill Progress Meter */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] flex items-center space-x-1">
              <span>Pool Volume:</span>
              <strong className="text-slate-800 dark:text-slate-200">{current_pool_quantity} / {threshold_quantity} units</strong>
            </span>
            <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
              {progressPct}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200/60 dark:bg-white/5 overflow-hidden p-0.5 border border-white/30 dark:border-white/5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isAchieved 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]' 
                  : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 4 Glanceable Micro-Pill Badges (Zero Walls of Text) */}
        <div className="mt-3.5 grid grid-cols-3 gap-1.5 text-center">
          <div className="p-1.5 rounded-xl glass-pill flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-medium">Joined</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mt-0.5">
              <Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{retailer_names ? retailer_names.length : 4} Stores</span>
            </span>
          </div>

          <div className="p-1.5 rounded-xl glass-pill flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-medium">Radius</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{average_cluster_distance_km || 1.8} km</span>
            </span>
          </div>

          <div className="p-1.5 rounded-xl glass-pill flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-medium">Vehicle</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mt-0.5 truncate max-w-[85px]">
              <Truck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="truncate">{recommendation.transport?.vehicle_type || 'MGV'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Clean & Direct */}
      <div className="mt-4 pt-3 border-t border-white/20 dark:border-white/10 flex items-center space-x-2">
        <button 
          type="button"
          onClick={() => onReject(recommendation.id)}
          className="p-2.5 rounded-xl border border-white/30 dark:border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-500 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <button 
          type="button"
          onClick={() => onViewDetails && onViewDetails(recommendation)}
          className="flex-1 py-2.5 px-3 rounded-xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/70 dark:hover:bg-white/15 transition flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
        >
          <span>Audit Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button 
          type="button"
          onClick={() => onAccept(recommendation)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-600/30 transition flex items-center justify-center space-x-1.5 border border-white/20 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Join Pool</span>
        </button>
      </div>
    </div>
  );
}
