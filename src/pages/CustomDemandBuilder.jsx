import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/currency';
import { getCommodityVisual } from '../utils/commodityVisuals';

const CATALOG_ITEMS = [
  {
    id: 'prod_001',
    name: 'Sona Masoori Rice (25kg Bag)',
    category: 'Grains & Pulses',
    retailPrice: 1450,
    wholesalePrice: 1180,
    unit: 'Bag (25kg)',
    minQty: 1,
    defaultQty: 10,
    supplier: 'Deccan Wholesale Grains'
  },
  {
    id: 'prod_006',
    name: 'Freedom Sunflower Oil (15L Tin)',
    category: 'Oils & Dairy',
    retailPrice: 1950,
    wholesalePrice: 1620,
    unit: 'Tin (15L)',
    minQty: 1,
    defaultQty: 5,
    supplier: 'Telangana Oil Mills'
  },
  {
    id: 'prod_010',
    name: 'Guntur Red Chilli Powder (5kg Pack)',
    category: 'Spices & Condiments',
    retailPrice: 1750,
    wholesalePrice: 1390,
    unit: 'Pack (5kg)',
    minQty: 1,
    defaultQty: 4,
    supplier: 'South India Spice Hub'
  },
  {
    id: 'prod_014',
    name: 'Red Label Tea Master Carton (1kg x 12)',
    category: 'Beverages & Snacks',
    retailPrice: 4800,
    wholesalePrice: 3950,
    unit: 'Carton (12kg)',
    minQty: 1,
    defaultQty: 2,
    supplier: 'Hindustan Wholesale Depot'
  },
  {
    id: 'prod_018',
    name: 'Surf Excel Easy Wash Carton (1kg x 20)',
    category: 'Personal Care',
    retailPrice: 2800,
    wholesalePrice: 2250,
    unit: 'Carton (20kg)',
    minQty: 1,
    defaultQty: 3,
    supplier: 'FMCG Mega Distributors'
  },
  {
    id: 'prod_002',
    name: 'Royal Toor Dal Premium (10kg Bag)',
    category: 'Grains & Pulses',
    retailPrice: 1600,
    wholesalePrice: 1320,
    unit: 'Bag (10kg)',
    minQty: 1,
    defaultQty: 6,
    supplier: 'Deccan Wholesale Grains'
  }
];

export default function CustomDemandBuilder() {
  const { theme, t, setActiveInvoice, user, addOrderToHistory } = useApp();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState({
    prod_001: 10,
    prod_006: 5,
    prod_010: 4,
    prod_014: 2
  });

  const updateQuantity = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  let totalRetailCost = 0;
  let totalWholesaleCost = 0;
  let totalItemsCount = 0;

  const selectedLineItems = CATALOG_ITEMS.filter(item => (quantities[item.id] || 0) > 0).map(item => {
    const qty = quantities[item.id];
    const lineRetail = item.retailPrice * qty;
    const lineWholesale = item.wholesalePrice * qty;
    const lineSavings = lineRetail - lineWholesale;

    totalRetailCost += lineRetail;
    totalWholesaleCost += lineWholesale;
    totalItemsCount += qty;

    return {
      ...item,
      qty,
      lineRetail,
      lineWholesale,
      lineSavings
    };
  });

  const totalSavings = totalRetailCost - totalWholesaleCost;
  const overallSavingsPct = totalRetailCost > 0 ? ((totalSavings / totalRetailCost) * 100).toFixed(1) : '0.0';

  const handleGenerateInvoice = () => {
    if (selectedLineItems.length === 0) {
      alert('Please select at least 1 item to build an order.');
      return;
    }

    const invoicePayload = {
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      storeName: user?.storeName || 'Sri Lakshmi Kirana & General Store',
      storeAddress: user?.address || 'Door No 42, Road No 12, Banjara Hills, Hyderabad (500034)',
      clusterHub: user?.clusterHub || 'Hyderabad South-West Wholesale Cluster #4',
      items: selectedLineItems,
      totalRetailCost,
      totalWholesaleCost,
      totalSavings,
      overallSavingsPct,
      totalItemsCount,
      taxGst: Math.round(totalWholesaleCost * 0.05),
      finalPayable: Math.round(totalWholesaleCost * 1.05)
    };

    setActiveInvoice(invoicePayload);
    addOrderToHistory(invoicePayload);
    navigate('/processing');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            <ShoppingBag className="w-5 h-5 text-emerald-800 dark:text-emerald-400 mr-2" />
            {t('builderTitle')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('builderDesc')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Product Catalog Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {t('selectQuantity')} ({CATALOG_ITEMS.length} Wholesale Items)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATALOG_ITEMS.map((item) => {
              const qty = quantities[item.id] || 0;
              const unitDiscountPct = Math.round(((item.retailPrice - item.wholesalePrice) / item.retailPrice) * 100);
              const visual = getCommodityVisual(item.name, item.category);

              return (
                <div 
                  key={item.id}
                  className={`rounded-2xl transition-all duration-200 overflow-hidden flex flex-col justify-between group border-2.5 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] ${
                    qty > 0
                      ? 'bg-[#FAF7EE] dark:bg-[#1C1C24] ring-2 ring-[#22C55E]'
                      : 'bg-white dark:bg-[#18181F] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#FFF]'
                  }`}
                >
                  {/* Top Commodity Image Strip */}
                  <div className="relative h-28 w-full overflow-hidden bg-black flex-shrink-0 border-b-2.5 border-black dark:border-white">
                    <img 
                      src={visual.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                    {/* Overlaid Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF7EE] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#22C55E] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                        {unitDiscountPct}% Bulk Margin
                      </span>
                    </div>

                    {/* Overlaid Commodity Sub-Label */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white drop-shadow-sm">
                      <span className="text-[11px] font-bold text-white truncate">
                        {visual.commodityType}
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-black/70 text-white border border-white/20">
                        {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="text-sm font-black text-black dark:text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                        Supplier: {item.supplier}
                      </p>

                      {/* Price Comparison */}
                      <div className="mt-2.5 grid grid-cols-2 gap-2 p-2.5 rounded-xl border-2 border-black dark:border-white bg-[#FFDE59]/20 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">Retail Benchmark</span>
                          <span className="text-slate-500 line-through font-bold">{formatINR(item.retailPrice)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-black dark:text-white font-bold block">Wholesale Rate</span>
                          <span className="text-black dark:text-white font-black text-sm">{formatINR(item.wholesalePrice)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper Control */}
                    <div className="mt-3 pt-2.5 border-t-2 border-black dark:border-white flex items-center justify-between">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                        {t('unitMeasure')}: <strong className="text-black dark:text-white font-black">{item.unit}</strong>
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg border-2 border-black dark:border-white bg-[#FAF7EE] dark:bg-[#18181F] text-black dark:text-white hover:bg-[#FF70A6] flex items-center justify-center transition cursor-pointer shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-black dark:text-white">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg border-2 border-black dark:border-white bg-[#22C55E] text-black flex items-center justify-center hover:bg-[#22C55E]/80 transition shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Column: Financial Summary Box */}
        <div className="space-y-6">
          <div className="rounded-2xl border-2.5 border-black dark:border-white bg-[#FAF7EE] dark:bg-[#18181F] p-5 shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#FFF] sticky top-20 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-white">
              <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white flex items-center">
                <Tag className="w-4 h-4 text-black dark:text-white mr-1.5 stroke-[2.5]" />
                Order Summary
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase border-2 border-black bg-[#FFDE59] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                {totalItemsCount} Units
              </span>
            </div>

            {/* Selected Items Mini List */}
            <div className="py-2 space-y-2 max-h-52 overflow-y-auto border-b-2 border-black dark:border-white">
              {selectedLineItems.length > 0 ? (
                selectedLineItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black/30">
                    <div className="truncate pr-2">
                      <span className="font-bold text-black dark:text-white">{item.name}</span>
                      <span className="block text-[10px] text-slate-500 font-semibold">{item.qty} × {formatINR(item.wholesalePrice)}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-black text-black dark:text-white">{formatINR(item.lineWholesale)}</span>
                      <span className="block text-[10px] font-bold text-[#22C55E]">Save {formatINR(item.lineSavings)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-bold text-center py-4 text-slate-500">
                  No items selected yet. Adjust quantities to add items.
                </p>
              )}
            </div>

            {/* Totals Calculation */}
            <div className="py-2 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 font-bold">
                <span>{t('singleStoreRetailTotal')}</span>
                <span className="line-through">{formatINR(totalRetailCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-black dark:text-white">
                <span>{t('samoohGroupWholesaleTotal')}</span>
                <span className="font-black text-sm">{formatINR(totalWholesaleCost)}</span>
              </div>
              <div className="pt-2 border-t-2 border-black dark:border-white flex justify-between items-center">
                <span className="font-black text-black dark:text-white uppercase text-xs">
                  {t('yourInstantSavings')}
                </span>
                <div className="text-right">
                  <span className="text-lg font-black text-black dark:text-white block">
                    {formatINR(totalSavings)}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black bg-[#22C55E] text-black shadow-[1px_1px_0px_0px_#000]">
                    {overallSavingsPct}% TOTAL SAVINGS
                  </span>
                </div>
              </div>
            </div>

            {/* Bulk Tier Snippet */}
            <div className="p-2.5 rounded-xl border-2 border-black bg-[#FFDE59]/30 text-[11px] flex items-start space-x-2 text-black font-bold shadow-[2px_2px_0px_0px_#000]">
              <ShieldCheck className="w-4 h-4 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <span>{t('bulkTierUnlocked')} Wholesale price tiers unlocked via cluster pooling.</span>
            </div>

            {/* Action Submit Button */}
            <button
              onClick={handleGenerateInvoice}
              disabled={selectedLineItems.length === 0}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-black bg-[#22C55E] hover:bg-[#22C55E]/80 text-black font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] transition flex items-center justify-center space-x-2 disabled:opacity-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
            >
              <span>{t('createGroupOrderBtn')}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
