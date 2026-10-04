import React, { useState, useMemo } from 'react';
import { X, MapPin, CheckCircle2, ShieldCheck, Info, Navigation } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PooledInventorySection from './PooledInventorySection';
import RetailerSupplierRouteMap from './RetailerSupplierRouteMap';
import ExplainableRecommendation from './ExplainableRecommendation';
import { useApp, DEMO_SUPPLIERS } from '../context/AppContext';
import { SAMPLE_WAREHOUSE } from '../data/sampleNetworkLocations';
import { formatINR } from '../utils/currency';
import { getCommodityVisual } from '../utils/commodityVisuals';

export default function PoolDetailModal({ pool, onClose, onAccept }) {
  const { t, user, userProfile } = useApp();
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  if (!pool) return null;

  const unitRetail = pool.unit_retail_price || 1450.0;
  const unitWholesale = pool.unit_wholesale_price || 1180.0;

  // Resolve currently active supplier for route display
  const activeSupplier = useMemo(() => {
    const targetId = selectedSupplierId || pool.supplier_evaluation?.selected_supplier_id || pool.supplier_id || 'sup_01';
    const foundDemo = Object.values(DEMO_SUPPLIERS || {}).find(
      s => s.id === targetId || s.name === pool.supplier_evaluation?.selected_supplier_name
    );
    if (foundDemo) return foundDemo;

    return {
      id: targetId,
      name: pool.supplier_evaluation?.selected_supplier_name || 'Wholesale Supplier',
      businessLocation: {
        latitude: SAMPLE_WAREHOUSE.latitude,
        longitude: SAMPLE_WAREHOUSE.longitude,
        locality: SAMPLE_WAREHOUSE.locality,
        city: SAMPLE_WAREHOUSE.city,
        state: SAMPLE_WAREHOUSE.state,
        address: SAMPLE_WAREHOUSE.address,
        pincode: SAMPLE_WAREHOUSE.pincode
      }
    };
  }, [selectedSupplierId, pool]);

    const visual = getCommodityVisual(pool.product_name, pool.category);

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in">
      <div className="border-3 border-black dark:border-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFF] bg-[#FAF7EE] dark:bg-[#18181F] text-black dark:text-white">
        {/* Top Commodity Image Strip */}
        <div className="relative h-32 w-full overflow-hidden bg-black flex-shrink-0 border-b-2.5 border-black dark:border-white">
          <img 
            src={visual.image} 
            alt={pool.product_name} 
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />

          {/* Overlaid Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FFDE59] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              {visual.categoryName}
            </span>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg bg-[#FF70A6] text-black border-2 border-black hover:bg-[#FF70A6]/80 transition cursor-pointer shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Overlaid Title & Commodity Sub-Label */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white drop-shadow-sm">
            <div>
              <div className="text-[11px] font-bold text-white/90">
                {visual.commodityType} • {visual.defaultUnit}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                {pool.product_name}
              </h2>
            </div>
            <StatusBadge status={pool.threshold_status} />
          </div>
        </div>

        {/* Subheader bar with cluster info */}
        <div className="px-4 py-2 border-b-2 border-black dark:border-white bg-[#FFDE59]/20 flex items-center justify-between text-xs font-bold text-black dark:text-white">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-black dark:text-white stroke-[2.5]" />
            {t('avgRadius')}: <strong className="ml-1 text-black dark:text-white font-black">{pool.average_cluster_distance_km} km</strong>
          </span>
          <span className="text-[11px] font-mono font-bold">
            Pool ID: <span>{pool.id || pool.pool_id}</span>
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Explainable Procurement Engine Section */}
          <ExplainableRecommendation recommendation={pool} mode="modal" defaultExpanded={true} />

          {/* Pricing & Progress Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black/30 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">{t('unitRetailPrice')}</span>
              <div className="text-base font-black text-slate-700 dark:text-slate-300 mt-0.5">₹{unitRetail.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black/30 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
              <span className="text-[11px] font-bold text-black dark:text-white block">{t('unitWholesalePrice')}</span>
              <div className="text-base font-black text-black dark:text-white mt-0.5">₹{unitWholesale.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl border-2 border-black dark:border-white bg-[#22C55E]/30 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
              <span className="text-[11px] font-black text-black dark:text-white uppercase block">{t('totalGroupSavings')}</span>
              <div className="text-base font-black text-black dark:text-white mt-0.5">₹{pool.estimated_total_savings.toLocaleString()}</div>
              <span className="text-[10px] font-black uppercase text-black dark:text-white">({pool.estimated_savings_percentage}% margin)</span>
            </div>
          </div>

          {/* Pooled Inventory & Transport Recommendation Section */}
          <PooledInventorySection pool={pool} interactive={true} />

          {/* Supplier Selection & Multi-Supplier Feasibility */}
          {pool.supplier_evaluation && (
            <div className="p-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-semibold text-xs tracking-tight">
                  <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  <span>Wholesale Supplier Evaluation</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                  {pool.supplier_evaluation.is_feasible ? 'Supplier Matched' : 'Constraint Notice'}
                </span>
              </div>

              {/* Selected Supplier Highlight */}
              <div className="p-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Allocated Wholesale Partner</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {pool.supplier_evaluation.selected_supplier_name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Rate</div>
                  <div className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
                    {formatINR(pool.supplier_evaluation.unit_price)}/{pool.product_obj?.unit_of_measure || 'unit'}
                  </div>
                </div>
              </div>

              {/* Explicit Selection Rationale List */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-slate-500 block">
                  Evaluation Criteria:
                </span>
                <div className="space-y-1 text-xs">
                  {pool.supplier_evaluation.selection_reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evaluated Alternative Suppliers Table */}
              {pool.supplier_evaluation.evaluated_suppliers && pool.supplier_evaluation.evaluated_suppliers.length > 1 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="text-[11px] font-medium text-slate-500 block">
                    Evaluated Wholesale Suppliers:
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="p-1.5">Supplier</th>
                          <th className="p-1.5 text-center">MOQ</th>
                          <th className="p-1.5 text-center">Stock</th>
                          <th className="p-1.5 text-center">Radius</th>
                          <th className="p-1.5 text-right">Price</th>
                          <th className="p-1.5 text-center">Status</th>
                          <th className="p-1.5">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {pool.supplier_evaluation.evaluated_suppliers.map((cand, idx) => {
                          const isSelected = (selectedSupplierId || pool.supplier_evaluation.selected_supplier_id) === cand.supplier_id;
                          return (
                            <tr
                              key={cand.supplier_id || idx}
                              onClick={() => setSelectedSupplierId(cand.supplier_id)}
                              className={`py-1 cursor-pointer transition ${
                                isSelected ? 'bg-blue-50/80 dark:bg-blue-950/40 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                              }`}
                            >
                              <td className="p-1.5 text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-0.5" />}
                                <span>{cand.supplier_name}</span>
                              </td>
                              <td className="p-1.5 text-center">{cand.moq}</td>
                              <td className="p-1.5 text-center">{cand.available_stock}</td>
                              <td className="p-1.5 text-center">{cand.service_radius_km} km</td>
                              <td className="p-1.5 text-right font-semibold text-slate-900 dark:text-white">{formatINR(cand.unit_price)}</td>
                              <td className="p-1.5 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  cand.is_feasible ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'
                                }`}>
                                  {cand.is_feasible ? 'Feasible' : 'Rejected'}
                                </span>
                              </td>
                              <td className="p-1.5 text-slate-500 text-[10px]">
                                {cand.is_feasible 
                                  ? 'Meets constraints' 
                                  : cand.rejection_reasons?.join(', ')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Retailer Shop to Supplier Warehouse Route Map */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Retailer Shop → Supplier Warehouse Route</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Destination: {activeSupplier?.name}
                  </span>
                </div>

                <RetailerSupplierRouteMap
                  retailer={user}
                  userProfile={userProfile}
                  supplier={activeSupplier}
                  height="250px"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-3.5 border-t-2 border-black dark:border-white flex items-center justify-end space-x-2.5 bg-[#FAF7EE] dark:bg-[#18181F]">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl border-2 border-black dark:border-white text-xs font-black uppercase text-black dark:text-white bg-white dark:bg-black/30 hover:bg-[#FF70A6] hover:text-black transition shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#FFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            Close
          </button>
          <button 
            onClick={() => {
              onAccept(pool);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#22C55E] text-black border-2 border-black flex items-center space-x-2 transition shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] hover:bg-[#22C55E]/85 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            <span>{t('acceptPoolBtn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
