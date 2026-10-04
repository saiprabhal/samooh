import React, { useEffect, useState } from 'react';
import { MapPin, Star, Search, AlertCircle, RefreshCw, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getRetailers, getForecasts, generateForecasts, seedData } from '../services/api';
import { useApp } from '../context/AppContext';

export default function Insights() {
  const { theme, t } = useApp();
  const [retailers, setRetailers] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadInsightsData();
  }, []);

  async function loadInsightsData() {
    setLoading(true);
    setError(null);
    try {
      const [retRes, fcRes] = await Promise.all([
        getRetailers(),
        getForecasts()
      ]);
      const retList = retRes.data || [];
      const fcList = fcRes.data || [];
      setRetailers(retList);
      setForecasts(fcList);
      if (retList.length > 0) setSelectedRetailer(retList[0]);
    } catch (err) {
      setError(err.message || 'Failed to fetch retailer insights');
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateForecasts = async () => {
    setIsGenerating(true);
    try {
      await generateForecasts(30);
      await loadInsightsData();
    } catch (err) {
      setError('Forecast calculation failed: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSeed = async () => {
    setIsGenerating(true);
    try {
      await seedData();
      await loadInsightsData();
    } catch (err) {
      setError('Seeding failed: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRetailers = retailers.filter(r => {
    const matchesType = filterType === 'ALL' || r.store_type === filterType;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const retailerForecasts = selectedRetailer 
    ? forecasts.filter(f => f.retailer_id === selectedRetailer.id)
    : [];

  const mockDemandTrend = [
    { period: 'Week 1', demand: 18, baseline: 15 },
    { period: 'Week 2', demand: 26, baseline: 20 },
    { period: 'Week 3', demand: 34, baseline: 25 },
    { period: 'Week 4', demand: 42, baseline: 30 },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            {t('retailerInsightsForecasts')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('insightsDesc')}
          </p>
        </div>

        <button 
          onClick={handleGenerateForecasts}
          disabled={isGenerating}
          className="px-3.5 py-1.5 rounded-md bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium shadow-sm transition flex items-center space-x-1.5 w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? t('runningMl') : t('runForecasts')}</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-medium text-slate-500">
          Loading retailer profiles and demand forecasts...
        </div>
      ) : error ? (
        <div className="p-6 max-w-xl mx-auto text-center space-y-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Forecast Connection Notice</h3>
          <p className="text-xs text-slate-500">{error}</p>
          <button onClick={handleSeed} className="px-3.5 py-1.5 rounded-md bg-emerald-800 text-white text-xs font-medium shadow-sm">
            {t('seedAndGenerate')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Directory Column */}
          <div className="soft-card rounded-2.5xl p-5 border border-slate-200/80 dark:border-white/[0.08] shadow-soft space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-800 dark:text-white">
                {t('retailerDirectory')} ({filteredRetailers.length})
              </h3>
              
              {/* Search & Filter */}
              <div className="space-y-2.5 mb-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search store name or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="soft-input w-full rounded-full pl-9 pr-3 py-1.5 text-xs border border-slate-200/80 dark:border-white/[0.08]"
                  />
                </div>

                <div className="p-1 rounded-xl bg-slate-100/80 dark:bg-slate-850/80 border border-slate-200/70 dark:border-white/[0.06] flex items-center space-x-1 overflow-x-auto shadow-soft-inset">
                  {['ALL', 'Kirana', 'Supermarket', 'Wholesale'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                        filterType === type
                          ? 'bg-white dark:bg-[#111827] text-slate-900 dark:text-white shadow-soft-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Retailer Cards List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredRetailers.map((ret) => (
                  <div
                    key={ret.id}
                    onClick={() => setSelectedRetailer(ret)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all duration-200 ${
                      selectedRetailer?.id === ret.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-soft-sm font-medium'
                        : 'border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100/70 dark:hover:bg-slate-850/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                        {ret.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold soft-pill text-slate-700 dark:text-slate-300">
                        {ret.store_type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {ret.address || ret.city}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Retailer Forecast Details */}
          {selectedRetailer ? (
            <div className="lg:col-span-2 space-y-5">
              {/* Retailer Profile Card */}
              <div className="soft-card rounded-2.5xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold soft-pill text-slate-700 dark:text-slate-300">
                        {selectedRetailer.store_type}
                      </span>
                      <span className="flex items-center text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" /> {selectedRetailer.rating || 4.8}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold mt-1 text-slate-900 dark:text-white">
                      {selectedRetailer.name}
                    </h2>
                    <p className="text-xs mt-0.5 flex items-center text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {selectedRetailer.address}, {selectedRetailer.city} ({selectedRetailer.pincode})
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl soft-inset border border-slate-200/60 dark:border-white/[0.04] text-right">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t('monthlyBudget')}</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      ₹{(selectedRetailer.monthly_budget || 75000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Demand Trend Chart */}
              <div className="soft-card rounded-2.5xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                      {t('forecastedDemandTrend')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('forecastDesc')}
                    </p>
                  </div>
                  <span className="text-xs font-bold soft-pill text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full">
                    R²: 0.92
                  </span>
                </div>

                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockDemandTrend}>
                      <defs>
                        <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#166534" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#166534" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#F1F5F9' : '#1E293B'} />
                      <XAxis dataKey="period" stroke="#64748B" fontSize={11} />
                      <YAxis stroke="#64748B" fontSize={11} />
                      <Tooltip contentStyle={{ 
                        backgroundColor: theme === 'light' ? '#FFFFFF' : '#111827', 
                        borderColor: theme === 'light' ? '#E2E8F0' : '#374151', 
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.08)'
                      }} />
                      <Area type="monotone" dataKey="demand" stroke="#166534" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Forecast Outputs from Backend */}
              <div className="soft-card rounded-2.5xl p-6 border border-slate-200/80 dark:border-white/[0.08] shadow-soft">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400 mr-1.5" />
                  {t('liveForecastOutputs')} ({retailerForecasts.length})
                </h3>
                {retailerForecasts.length > 0 ? (
                  <div className="space-y-2.5">
                    {retailerForecasts.map((fc) => (
                      <div key={fc.id} className="p-3.5 rounded-2xl soft-inset border border-slate-200/60 dark:border-white/[0.04] flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{fc.product_name}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Model: {fc.model_used}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 dark:text-white">{fc.predicted_demand} units</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400">Confidence: {fc.confidence_score * 100}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No specific forecasts found. Click "{t('runForecasts')}" to evaluate demand patterns.
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
