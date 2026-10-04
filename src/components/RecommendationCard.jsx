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

  const visual = getCommodityVisual(product_name, category);
  const progressPct = Math.min(100, Math.round((current_pool_quantity / threshold_quantity) * 100));
  const isAchieved = threshold_status === 'ACHIEVED' || progressPct >= 100;

  // Wholesale and retail pricing
  const retailPrice = unit_retail_price || Math.round((unit_wholesale_price || 1180) * 1.22);
  const wholesalePrice = unit_wholesale_price || Math.round(retailPrice * (1 - (estimated_savings_percentage || 18.5) / 100));

  return (
    <div className="glass-card rounded-2xl flex flex-col justify-between relative group border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#FFF] overflow-hidden transition-all duration-200">
      <div>
        {/* Top Photographic Commodity Strip */}
        <div className="relative h-28 w-full overflow-hidden bg-slate-900 select-none border-b-2 border-black dark:border-white">
          <img 
            src={visual.image} 
            alt={product_name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
            loading="lazy"
          />
          {/* Subtle gradient for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/40" />

          {/* Overlaid Badges on Image */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              {visual.categoryName}
            </span>

            {isAchieved ? (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#22C55E] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center space-x-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Threshold Met</span>
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FFDE59] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center space-x-1">
                <span>{progressPct}% Reached</span>
              </span>
            )}
          </div>

          {/* Overlaid Commodity Sub-Label */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow-sm">
            <span className="text-[11px] font-bold text-white truncate">
              {visual.commodityType}
            </span>
            <span className="text-[10px] font-bold text-white/90">
              {visual.defaultUnit}
            </span>
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-4 sm:p-5 pt-3.5">
          {/* Product Title */}
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">
            {product_name}
          </h3>

          {/* Commercial Price Slash & Margin Banner */}
          <div className="mt-3 p-3 rounded-xl bg-[#FFDE59]/20 dark:bg-slate-900 border-2 border-black dark:border-white shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#FFF] flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                ₹{wholesalePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through font-bold">
                ₹{retailPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                / unit
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#22C55E] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] tracking-tight">
                SAVE {estimated_savings_percentage}%
              </span>
              <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 mt-1">
                +{formatINR(estimated_total_savings)} group
              </span>
            </div>
          </div>

          {/* Visual Fill Progress Meter */}
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-bold text-[11px]">
                Group Volume: <strong className="text-black dark:text-white font-black">{current_pool_quantity} / {threshold_quantity} units</strong>
              </span>
              <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                {progressPct}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-black dark:border-white overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isAchieved ? 'bg-[#22C55E]' : 'bg-[#FFDE59]'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* 3 Glanceable Micro-Pills */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
            <div className="p-1.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] flex flex-col items-center justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Stores</span>
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center space-x-1 mt-0.5">
                <Users className="w-3 h-3 stroke-[2.5]" />
                <span>{retailer_names ? retailer_names.length : 4} Stores</span>
              </span>
            </div>

            <div className="p-1.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] flex flex-col items-center justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Distance</span>
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 stroke-[2.5]" />
                <span>{average_cluster_distance_km || 1.8} km</span>
              </span>
            </div>

            <div className="p-1.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] flex flex-col items-center justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Freight</span>
              <span className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center space-x-1 mt-0.5 truncate max-w-[85px]">
                <Truck className="w-3 h-3 stroke-[2.5] flex-shrink-0" />
                <span className="truncate">{recommendation.transport?.vehicle_type || 'MGV'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Solid & Grounded */}
      <div className="p-4 sm:p-5 pt-0 flex items-center space-x-2">
        <button 
          type="button"
          onClick={() => onReject(recommendation.id)}
          className="p-2 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-100 hover:text-rose-700 shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <button 
          type="button"
          onClick={() => onViewDetails && onViewDetails(recommendation)}
          className="flex-1 py-2 px-3 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center space-x-1.5 shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        <button 
          type="button"
          onClick={() => onAccept(recommendation)}
          className="flex-1 py-2 px-3 rounded-xl border-2 border-black dark:border-white bg-[#22C55E] hover:bg-[#16A34A] text-black font-black text-xs shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Join Pool</span>
        </button>
      </div>
    </div>
  );
}
