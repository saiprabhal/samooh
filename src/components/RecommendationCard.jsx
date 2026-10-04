import React from 'react';
import { 
  Store, MapPin, Check, X, ArrowUpRight, Truck, 
  IndianRupee, Package, Users 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { getCommodityVisual } from '../utils/commodityVisuals';

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

  const visual = getCommodityVisual(product_name, category, recommendation.image || recommendation.image_url);
  const progressPct = Math.min(100, Math.round((current_pool_quantity / threshold_quantity) * 100));
  const isAchieved = threshold_status === 'ACHIEVED' || progressPct >= 100;

  // Wholesale and retail pricing
  const retailPrice = unit_retail_price || Math.round((unit_wholesale_price || 1180) * 1.22);
  const wholesalePrice = unit_wholesale_price || Math.round(retailPrice * (1 - (estimated_savings_percentage || 18.5) / 100));

  return (
    <div className="soft-card rounded-2.5xl flex flex-col justify-between relative group hover:shadow-soft-lg transition-all duration-250 border border-slate-200/70 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-soft">
      <div>
        {/* Top Photographic Commodity Strip */}
        <div className="relative h-28 w-full overflow-hidden bg-slate-950 select-none">
          <img 
            src={visual.image} 
            alt={product_name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
            loading="lazy"
          />
          {/* Gentle vignette for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />

          {/* Overlaid Badges on Image */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
              {visual.categoryName}
            </span>

            {isAchieved ? (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-800 text-white flex items-center space-x-1 shadow-sm">
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>Threshold Met</span>
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-700 text-white flex items-center space-x-1 shadow-sm">
                <span>{progressPct}% Reached</span>
              </span>
            )}
          </div>

          {/* Overlaid Commodity Sub-Label */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow-sm">
            <span className="text-[11px] font-medium text-white/90 truncate">
              {visual.commodityType}
            </span>
            <span className="text-[10px] font-normal text-white/70">
              {visual.defaultUnit}
            </span>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-4 sm:p-5 pt-3.5 space-y-3">
          {/* Product Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">
            {product_name}
          </h3>

          {/* Commercial Price & Margin Inset Box */}
          <div className="soft-inset p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                ₹{wholesalePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through font-normal">
                ₹{retailPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                / unit
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-white tracking-tight">
                SAVE {estimated_savings_percentage}%
              </span>
              <span className="text-[10px] font-medium text-emerald-800 dark:text-emerald-400 mt-0.5">
                +{formatINR(estimated_total_savings)} group
              </span>
            </div>
          </div>

          {/* Visual Fill Progress Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">
                Group Volume: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{current_pool_quantity} / {threshold_quantity} units</strong>
              </span>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                {progressPct}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isAchieved ? 'bg-emerald-700 dark:bg-emerald-500' : 'bg-amber-600 dark:bg-amber-500'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* 3 Glanceable Micro-Pills */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="soft-inset p-1.5 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-normal">Stores</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1 mt-0.5">
                <Users className="w-3 h-3 text-slate-400" />
                <span>{retailer_names ? retailer_names.length : 4} Stores</span>
              </span>
            </div>

            <div className="soft-inset p-1.5 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-normal">Distance</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{average_cluster_distance_km || 1.8} km</span>
              </span>
            </div>

            <div className="soft-inset p-1.5 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-normal">Freight</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1 mt-0.5 truncate max-w-[85px]">
                <Truck className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{recommendation.transport?.vehicle_type || 'MGV'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Soft & Tactile */}
      <div className="p-4 sm:p-5 pt-0 flex items-center space-x-2">
        <button 
          type="button"
          onClick={() => onReject(recommendation.id)}
          className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <button 
          type="button"
          onClick={() => onViewDetails && onViewDetails(recommendation)}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center space-x-1 cursor-pointer"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button 
          type="button"
          onClick={() => onAccept(recommendation)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-soft transition flex items-center justify-center space-x-1.5 cursor-pointer active:scale-98"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Join Pool</span>
        </button>
      </div>
    </div>
  );
}
