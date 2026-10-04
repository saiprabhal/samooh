import React from 'react';
import { 
  Store, MapPin, Check, X, ArrowUpRight, Truck, 
  IndianRupee, Package, Droplets, Flame, ShoppingBag, 
  Users 
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';

const CATEGORY_THEMES = {
  Grains: {
    badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    avatar: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    icon: Package,
    tag: 'Grains'
  },
  Oils: {
    badge: 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    avatar: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
    icon: Droplets,
    tag: 'Oils'
  },
  Spices: {
    badge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    avatar: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    icon: Flame,
    tag: 'Spices'
  },
  Essentials: {
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    avatar: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    icon: ShoppingBag,
    tag: 'Essentials'
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
    badge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    avatar: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    icon: Package,
    tag: category || 'Wholesale Pool'
  };

  const IconComponent = themeInfo.icon;
  const progressPct = Math.min(100, Math.round((current_pool_quantity / threshold_quantity) * 100));
  const isAchieved = threshold_status === 'ACHIEVED' || progressPct >= 100;

  // Wholesale and retail pricing
  const retailPrice = unit_retail_price || Math.round((unit_wholesale_price || 1180) * 1.22);
  const wholesalePrice = unit_wholesale_price || Math.round(retailPrice * (1 - (estimated_savings_percentage || 18.5) / 100));

  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between relative group hover:shadow-lg transition-all duration-200 border border-slate-200/80 dark:border-slate-800">
      <div>
        {/* Top Header: Category Tag + Status Pill */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl ${themeInfo.avatar} flex items-center justify-center border flex-shrink-0`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${themeInfo.badge}`}>
                {themeInfo.tag}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {isAchieved ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Threshold Met</span>
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
                <span>{progressPct}% Reached</span>
              </span>
            )}
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">
          {product_name}
        </h3>

        {/* Commercial Price Slash & Margin Banner */}
        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              ₹{wholesalePrice.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 line-through font-medium">
              ₹{retailPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              / unit
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-800 text-white tracking-tight">
              SAVE {estimated_savings_percentage}%
            </span>
            <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-400 mt-0.5">
              +{formatINR(estimated_total_savings)} group
            </span>
          </div>
        </div>

        {/* Visual Fill Progress Meter */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium text-[11px]">
              Group Volume: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{current_pool_quantity} / {threshold_quantity} units</strong>
            </span>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
              {progressPct}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isAchieved ? 'bg-emerald-700 dark:bg-emerald-600' : 'bg-amber-600 dark:bg-amber-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 3 Glanceable Micro-Pills */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
          <div className="p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-normal">Stores</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mt-0.5">
              <Users className="w-3 h-3 text-slate-500" />
              <span>{retailer_names ? retailer_names.length : 4} Stores</span>
            </span>
          </div>

          <div className="p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-normal">Distance</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{average_cluster_distance_km || 1.8} km</span>
            </span>
          </div>

          <div className="p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 font-normal">Freight</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mt-0.5 truncate max-w-[85px]">
              <Truck className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span className="truncate">{recommendation.transport?.vehicle_type || 'MGV'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Solid & Grounded */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center space-x-2">
        <button 
          type="button"
          onClick={() => onReject(recommendation.id)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <button 
          type="button"
          onClick={() => onViewDetails && onViewDetails(recommendation)}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button 
          type="button"
          onClick={() => onAccept(recommendation)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Join Pool</span>
        </button>
      </div>
    </div>
  );
}
