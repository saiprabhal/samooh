import React, { useState } from 'react';
import { Store, MapPin, Package, Check, X, AlertTriangle, Info, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { getCommodityVisual } from '../utils/commodityVisuals';

export default function ProcurementOpportunityCard({ opportunity, onFormPool }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!opportunity) return null;

  const {
    productName,
    canonicalProductId,
    category,
    sectorId,
    retailerCount,
    retailerNames,
    combinedQuantity,
    unit,
    supplierName,
    supplierMOQ,
    supplierAvailableQuantity,
    moqShortfall,
    estimatedUnitPrice,
    estimatedTotalValue,
    geographicDistanceKm,
    geographicFeasibility,
    status,
    opportunityScore,
    scoreLabel,
    reasons = [],
    constraints = [],
    isAlreadyInPool,
    existingPoolId,
    isDemo
  } = opportunity;

  const visual = getCommodityVisual(productName, category);

  // Status Styling & Badge
  const getStatusBadge = () => {
    switch (status) {
      case 'FEASIBLE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-800 text-white shadow-2xs">
            <Check className="w-3 h-3 mr-1 stroke-[2.5]" />
            FEASIBLE
          </span>
        );
      case 'BELOW_MOQ':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-700 text-white shadow-2xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            BELOW MOQ
          </span>
        );
      case 'INSUFFICIENT_STOCK':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-700 text-white shadow-2xs">
            <X className="w-3 h-3 mr-1" />
            LOW STOCK
          </span>
        );
      case 'ALREADY_IN_POOL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700 text-white shadow-2xs">
            <Layers className="w-3 h-3 mr-1" />
            IN POOL
          </span>
        );
      case 'LOCATION_REQUIRED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700 text-white shadow-2xs">
            <MapPin className="w-3 h-3 mr-1" />
            LOCATION NEEDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-700 text-white">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl flex flex-col justify-between relative overflow-hidden group border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-200">
      <div>
        {/* Top Photographic Commodity Strip */}
        <div className="relative h-28 w-full overflow-hidden bg-slate-900 select-none">
          <img 
            src={visual.image} 
            alt={productName}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/40" />

          {/* Overlaid Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md border border-white/20">
                {visual.categoryName}
              </span>
              {isDemo && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-800/80 text-white">
                  Demo
                </span>
              )}
            </div>
            {getStatusBadge()}
          </div>

          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow-sm">
            <span className="text-[11px] font-semibold text-white/90 truncate">
              {visual.commodityType}
            </span>
            <span className="text-[10px] font-medium text-white/70">
              {visual.defaultUnit}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 pt-3.5">
          {/* Product Title & Canonical ID */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
              {productName}
            </h3>
            {canonicalProductId && (
              <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                ID: {canonicalProductId}
              </p>
            )}
          </div>

        {/* Retailer Count & Distance */}
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-700/80 pb-2.5">
          <span className="flex items-center">
            <Store className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <strong>{retailerCount}</strong>&nbsp;compatible {retailerCount === 1 ? 'store' : 'stores'}
          </span>
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {geographicDistanceKm != null ? `~${geographicDistanceKm} km` : 'Location pending'}
          </span>
        </div>

        {/* Key Operational Metrics Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] text-slate-400 block">Combined Demand</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {combinedQuantity} <span className="text-xs font-normal text-slate-500">{unit}</span>
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Supplier MOQ</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {supplierMOQ != null ? `${supplierMOQ} ${unit}` : 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Available Stock</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {supplierAvailableQuantity != null ? `${supplierAvailableQuantity} ${unit}` : 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block">Wholesale Rate</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {estimatedUnitPrice ? `${formatINR(estimatedUnitPrice)}/${unit}` : 'Rate on quote'}
            </span>
          </div>
        </div>

        {/* Supplier Identity */}
        {supplierName && (
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="text-[11px]">Supplier:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
              {supplierName}
            </span>
          </div>
        )}

        {/* Below MOQ Needs Notice */}
        {status === 'BELOW_MOQ' && moqShortfall > 0 && (
          <div className="mt-2.5 p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
            <span className="font-medium">Needs:</span>
            <span className="font-bold">{moqShortfall} {unit} additional demand</span>
          </div>
        )}

        {/* Already In Pool Notice */}
        {isAlreadyInPool && existingPoolId && (
          <div className="mt-2.5 p-2 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-200 flex items-center justify-between">
            <span className="font-medium">Committed to active pool:</span>
            <span className="font-bold font-mono">{existingPoolId}</span>
          </div>
        )}

        {/* Explainability Accordion ("Why this opportunity exists") */}
        <div className="mt-3 border-t border-slate-100 dark:border-slate-700/80 pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400 transition"
          >
            <span>Why this opportunity exists ({reasons.length})</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-2 text-xs">
              {/* Reasons Checklist */}
              <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded border border-slate-100 dark:border-slate-800">
                {reasons.map((r, i) => (
                  <div key={i} className="flex items-start space-x-1.5 text-slate-600 dark:text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              {constraints.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Active Constraints:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Participating Stores List */}
              {retailerNames && retailerNames.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Participating Stores:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {retailerNames.map((name, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Footer: Deterministic Score & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Opportunity Score</span>
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {opportunityScore} / 100
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              ({scoreLabel})
            </span>
          </div>
        </div>

        {status === 'FEASIBLE' && !isAlreadyInPool && (
          <button
            type="button"
            onClick={() => onFormPool && onFormPool(opportunity)}
            className="px-3 py-1.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white font-semibold transition text-xs shadow-xs"
          >
            Form Procurement Pool
          </button>
        )}
      </div>
    </div>
  );
}
