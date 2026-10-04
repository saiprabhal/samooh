import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IndianRupee, 
  Users, 
  Layers, 
  Percent, 
  AlertCircle,
  RefreshCw,
  Database,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import KPICard from '../components/KPICard';
import RecommendationCard from '../components/RecommendationCard';
import PoolDetailModal from '../components/PoolDetailModal';
import LocationPermissionPrompt from '../components/LocationPermissionPrompt';
import { getDashboard, getRecommendations, seedData } from '../services/api';
import { MOCK_DASHBOARD, MOCK_RECOMMENDATIONS } from '../api/mockData';
import { formatINR } from '../utils/currency';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const { theme, t, setActiveInvoice, user, addOrderToHistory, firebaseUser, userProfile, onboardingCompleted } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPool, setSelectedPool] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Retailer Location Permission Flow State - Never show if already granted, onboarded, or previously dismissed
  const [showLocationPrompt, setShowLocationPrompt] = useState(() => {
    try {
      const isDismissed = localStorage.getItem('samooh_location_prompt_dismissed') === 'true' || 
                          sessionStorage.getItem('samooh_location_prompt_dismissed') === 'true';
      const isGranted = localStorage.getItem('samooh_location_permission_granted') === 'true' ||
                        Boolean(userProfile?.location?.permissionGranted) ||
                        Boolean(userProfile?.businessLocation?.permissionGranted);
      const isOnboarded = Boolean(onboardingCompleted) ||
                          Boolean(userProfile?.onboardingCompleted) ||
                          localStorage.getItem('samooh_onboarding_completed') === 'true';
      const hasCoords = Boolean(
        userProfile?.businessLocation?.latitude != null ||
        userProfile?.location?.latitude != null ||
        user?.businessLocation?.latitude != null ||
        user?.location?.latitude != null ||
        userProfile?.businessLocation != null ||
        user?.businessLocation != null
      );

      // If user has coords, is granted, is onboarded, or previously dismissed, DO NOT show prompt
      if (isDismissed || isGranted || isOnboarded || hasCoords) {
        return false;
      }
      return false; // Default to never intrusively auto-pop up on dashboard
    } catch {
      return false;
    }
  });

  // Permanently suppress prompt if location or onboarding is detected
  useEffect(() => {
    try {
      const isOnboarded = Boolean(onboardingCompleted) ||
                          Boolean(userProfile?.onboardingCompleted) ||
                          localStorage.getItem('samooh_onboarding_completed') === 'true';
      const hasCoords = Boolean(
        userProfile?.businessLocation?.latitude != null ||
        userProfile?.location?.latitude != null ||
        user?.businessLocation?.latitude != null ||
        user?.location?.latitude != null
      );
      if (isOnboarded || hasCoords) {
        localStorage.setItem('samooh_location_prompt_dismissed', 'true');
        localStorage.setItem('samooh_location_permission_granted', 'true');
        setShowLocationPrompt(false);
      }
    } catch (_) {}
  }, [userProfile, user, onboardingCompleted]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, recRes] = await Promise.all([
        getDashboard(),
        getRecommendations()
      ]);
      setData(dashRes || MOCK_DASHBOARD);
      const recsList = Array.isArray(recRes) ? recRes : (recRes?.data || MOCK_RECOMMENDATIONS);
      setRecommendations(recsList);
    } catch (err) {
      console.warn("FastAPI offline, serving mock dashboard data:", err);
      setData(MOCK_DASHBOARD);
      setRecommendations(MOCK_RECOMMENDATIONS);
    } finally {
      setLoading(false);
    }
  }

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedData();
      await loadDashboardData();
    } catch (err) {
      setError('Seeding failed: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAccept = (poolOrId) => {
    let pool = null;
    if (typeof poolOrId === 'object' && poolOrId !== null) {
      pool = poolOrId;
    } else if (Array.isArray(recommendations)) {
      pool = recommendations.find(r => r.id === poolOrId || String(r.id) === String(poolOrId) || r.pool_id === poolOrId);
    }
    if (!pool && MOCK_RECOMMENDATIONS.length > 0) {
      pool = MOCK_RECOMMENDATIONS[0];
    }

    if (pool) {
      const unitRetail = pool.unit_retail_price || 1450;
      const unitWholesale = pool.unit_wholesale_price || 1180;
      const qty = Math.round(pool.current_pool_quantity / (pool.retailer_names ? pool.retailer_names.length : 4)) || 10;
      const totalRetail = unitRetail * qty;
      const totalWholesale = unitWholesale * qty;
      const savings = totalRetail - totalWholesale;

      const invoicePayload = {
        invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        storeName: user?.storeName || 'Sri Lakshmi Kirana & General Store',
        storeAddress: user?.address || 'Door No 42, Road No 12, Banjara Hills, Hyderabad (500034)',
        clusterHub: user?.clusterHub || `Hyderabad Cluster (Radius: ~${pool.average_cluster_distance_km || 1.8} km)`,
        items: [
          {
            id: pool.product_id || 'prod_001',
            name: pool.product_name,
            category: pool.category || 'Grains & Pulses',
            retailPrice: unitRetail,
            wholesalePrice: unitWholesale,
            qty: qty,
            lineRetail: totalRetail,
            lineWholesale: totalWholesale,
            lineSavings: savings
          }
        ],
        totalRetailCost: totalRetail,
        totalWholesaleCost: totalWholesale,
        totalSavings: savings,
        overallSavingsPct: pool.estimated_savings_percentage || '18.5',
        totalItemsCount: qty,
        taxGst: Math.round(totalWholesale * 0.05),
        finalPayable: Math.round(totalWholesale * 1.05)
      };

      setActiveInvoice(invoicePayload);
      addOrderToHistory(invoicePayload);
      navigate('/processing');
    }
  };

  const handleReject = (id) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-7 rounded-md w-1/4 bg-slate-200 dark:bg-slate-700"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
          <div className="h-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 my-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('backendUnreachable')}</h3>
        <p className="text-xs text-slate-500">
          Could not fetch real data from backend.
        </p>
        <div className="flex items-center justify-center space-x-2 pt-2">
          <button 
            onClick={loadDashboardData}
            className="px-3.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('retryConnection')}</span>
          </button>
          <button 
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-3.5 py-1.5 rounded-md bg-emerald-800 text-white text-xs font-medium hover:bg-emerald-900 transition flex items-center space-x-1.5 shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSeeding ? t('seeding') : t('seedBackendStart')}</span>
          </button>
        </div>
      </div>
    );
  }

  const categoryBreakdown = data?.category_breakdown || {};
  const totalSavings = data?.metrics?.total_community_savings_inr || 84520;
  const pieColors = ['#22C55E', '#FFDE59', '#FF70A6', '#60A5FA', '#FB923C'];
  const pieData = Object.keys(categoryBreakdown).map((cat, idx) => ({
    name: cat,
    value: categoryBreakdown[cat],
    color: pieColors[idx % pieColors.length]
  }));

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black dark:border-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#22C55E] flex items-center justify-center text-black border-2 border-black dark:border-white shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#FFF] flex-shrink-0">
            <Layers className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-black dark:text-white">
                Live Wholesale Pools
              </h1>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border-2 border-black text-black bg-[#FFDE59] shadow-[1.5px_1.5px_0px_0px_#000]">
                {user?.storeName || 'Sri Lakshmi Kirana'}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Nearby Kirana group orders unlocking wholesale tier rates
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-3.5 py-1.5 rounded-xl border-2 border-black dark:border-white bg-[#FAF7EE] dark:bg-[#18181F] text-black dark:text-white text-xs font-black uppercase hover:bg-[#FFDE59] transition flex items-center space-x-1.5 shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#FFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
            title="Refresh active mandi pool prices"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[2.5] ${isSeeding ? 'animate-spin' : ''}`} />
            <span>Sync Deals</span>
          </button>
        </div>
      </div>

      {/* Geolocation Consent Modal Flow (One-time on login/dashboard if not yet requested) */}
      {showLocationPrompt && (
        <LocationPermissionPrompt
          retailerId={firebaseUser?.uid || user?.id}
          onComplete={(coords) => {
            setShowLocationPrompt(false);
            try {
              localStorage.setItem('samooh_location_permission_granted', 'true');
              localStorage.setItem('samooh_location_prompt_dismissed', 'true');
            } catch {}
          }}
          onDismiss={() => {
            setShowLocationPrompt(false);
            try {
              localStorage.setItem('samooh_location_prompt_dismissed', 'true');
              sessionStorage.setItem('samooh_location_prompt_dismissed', 'true');
            } catch {}
          }}
        />
      )}

      {/* Top Urgent Recommendations & Pools (Placed at TOP) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-black text-black dark:text-white flex items-center space-x-2">
              <span>High-Discount Pools</span>
            </h2>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border-2 border-black bg-[#22C55E] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Live Mandi
            </span>
          </div>
          {recommendations.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/opportunities')}
              className="text-xs font-black text-black dark:text-white underline cursor-pointer"
            >
              View all ({recommendations.length}) →
            </button>
          )}
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {recommendations.slice(0, 3).map((rec) => (
              <RecommendationCard
                key={rec.id || rec.pool_id || Math.random()}
                recommendation={rec}
                onAccept={handleAccept}
                onReject={handleReject}
                onViewDetails={setSelectedPool}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl glass-card">
            <p className="text-slate-500 text-xs">{t('noPools') || 'No active pools currently match your store location.'}</p>
          </div>
        )}
      </div>

      {/* Performance & Community Savings Metrics (Placed at BOTTOM) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Cluster Impact & Savings
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">
            Kukatpally Zone
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title={t('estimatedSavings')}
            value={formatINR(data?.metrics?.total_community_savings_inr || 84520)}
            badge="+24.5%"
            icon={IndianRupee}
          />
          <KPICard
            title={t('retailersBenefited')}
            value={data?.metrics?.total_retailers || 30}
            badge="Joined"
            icon={Users}
          />
          <KPICard
            title={t('procurementPools')}
            value={data?.metrics?.total_active_pools || 12}
            badge={`${data?.metrics?.pools_achieved_threshold || 9} Met`}
            icon={Layers}
          />
          <KPICard
            title={t('avgSavingsPct')}
            value={`${data?.metrics?.average_savings_percentage || 18.5}%`}
            badge="Wholesale"
            icon={Percent}
          />
        </div>
      </div>

      {/* Charts Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Monthly Savings Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl glass-card p-5 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Savings Growth
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40">
              ₹84.5k Total Saved
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthly_savings_trend || MOCK_DASHBOARD.monthly_savings_trend}>
                <defs>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803D" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#15803D" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)', 
                    borderColor: theme === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [formatINR(val), 'Group Savings']}
                />
                <Area type="monotone" dataKey="savings" stroke="#15803D" strokeWidth={2} fillOpacity={1} fill="url(#savingsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="rounded-2xl glass-card p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/20 dark:border-white/10 mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Commodity Volume
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                Categories
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1E293B', 
                      borderColor: '#CBD5E1',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center space-x-1.5 p-1 rounded-lg glass-pill">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-bold truncate text-slate-700 dark:text-slate-300 text-[11px]">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pool Detail Modal */}
      {selectedPool && (
        <PoolDetailModal
          pool={selectedPool}
          onClose={() => setSelectedPool(null)}
          onAccept={(p) => {
            setSelectedPool(null);
            handleAccept(p);
          }}
        />
      )}
    </div>
  );
}
