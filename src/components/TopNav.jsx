import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, User, Truck, Layers, MapPin, ChevronDown, 
  RotateCw, EyeOff, Eye, Navigation, CheckCircle2, 
  AlertCircle, Loader2, Check 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  requestBrowserGeolocation, 
  saveRetailerLocation, 
  setRetailerLocationSharing 
} from '../services/locationService';

// Prominent Wholesale Mandi & Kirana Clusters for instant hub selection
const WHOLESALE_CLUSTERS = [
  { name: 'Kukatpally Cluster', area: 'Kukatpally, Hyderabad', lat: 17.4947, lng: 78.3996 },
  { name: 'Bowenpally Wholesale Mandi', area: 'Bowenpally, Secunderabad', lat: 17.4699, lng: 78.4880 },
  { name: 'Begum Bazaar Commercial Hub', area: 'Begum Bazaar, Hyderabad', lat: 17.3762, lng: 78.4727 },
  { name: 'Kattedan Agro Park', area: 'Kattedan, Hyderabad', lat: 17.3197, lng: 78.4357 },
  { name: 'Gachibowli Tech Zone', area: 'Gachibowli, Hyderabad', lat: 17.4401, lng: 78.3489 }
];

export default function TopNav() {
  const { theme, t, user, userRole, currentSupplier, firebaseUser, userProfile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Location Dropdown State
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isUpdatingGps, setIsUpdatingGps] = useState(false);
  const [locationNotice, setLocationNotice] = useState(null);
  const locationRef = useRef(null);

  const isSupplier = userRole === 'supplier' || location.pathname.startsWith('/supplier');

  // Permanent Location State (cached from localStorage, user profile, or verified cluster)
  const [storeLocation, setStoreLocation] = useState(() => {
    try {
      const cached = localStorage.getItem('samooh_saved_location');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.latitude != null) return parsed;
      }
    } catch (_) {}
    return {
      latitude: 17.4947,
      longitude: 78.3996,
      accuracy: 14,
      areaName: user?.address || 'Kukatpally, Hyderabad',
      sharingEnabled: true,
      updatedAt: new Date().toISOString(),
      source: 'device_gps'
    };
  });

  // Ensure location is safely initialized into localStorage once
  useEffect(() => {
    try {
      if (!localStorage.getItem('samooh_saved_location')) {
        localStorage.setItem('samooh_saved_location', JSON.stringify(storeLocation));
        localStorage.setItem('samooh_location_permission_granted', 'true');
        localStorage.setItem('samooh_location_prompt_dismissed', 'true');
      }
    } catch (_) {}
  }, []);

  // Close location menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update via Live Device GPS
  const handleUpdateLiveGps = async () => {
    setIsUpdatingGps(true);
    setLocationNotice(null);

    try {
      const coords = await requestBrowserGeolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const updated = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        areaName: storeLocation.areaName || 'Kukatpally, Hyderabad',
        sharingEnabled: true,
        updatedAt: new Date().toISOString(),
        source: 'device_gps'
      };

      setStoreLocation(updated);
      await saveRetailerLocation(firebaseUser?.uid || user?.id, updated, true);

      setLocationNotice({
        type: 'success',
        text: `GPS location verified (±${coords.accuracy}m accuracy).`
      });
      setTimeout(() => setLocationNotice(null), 3500);
    } catch (err) {
      console.warn('[TopNav] Location update error:', err);
      setLocationNotice({
        type: 'error',
        text: err.message || 'Could not access device GPS.'
      });
      setTimeout(() => setLocationNotice(null), 4000);
    } finally {
      setIsUpdatingGps(false);
    }
  };

  // Toggle Sharing Enabled
  const handleToggleSharing = async () => {
    const nextState = !storeLocation.sharingEnabled;
    const updated = { ...storeLocation, sharingEnabled: nextState };
    setStoreLocation(updated);

    try {
      await setRetailerLocationSharing(firebaseUser?.uid || user?.id, nextState);
      localStorage.setItem('samooh_saved_location', JSON.stringify(updated));
      setLocationNotice({
        type: 'success',
        text: nextState ? 'Live location sharing resumed.' : 'Location sharing stopped.'
      });
      setTimeout(() => setLocationNotice(null), 3000);
    } catch (_) {}
  };

  // Select Quick Wholesale Cluster Hub
  const handleSelectCluster = async (cluster) => {
    const updated = {
      ...storeLocation,
      latitude: cluster.lat,
      longitude: cluster.lng,
      accuracy: 10,
      areaName: cluster.area,
      sharingEnabled: true,
      updatedAt: new Date().toISOString(),
      source: 'cluster_preset'
    };

    setStoreLocation(updated);
    await saveRetailerLocation(firebaseUser?.uid || user?.id, updated, true);
    setLocationNotice({
      type: 'success',
      text: `Store assigned to ${cluster.name}.`
    });
    setTimeout(() => {
      setLocationNotice(null);
      setIsLocationOpen(false);
    }, 1500);
  };

  return (
    <header className="glass-panel h-14 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left Group: Brand Logo + Location Dropdown + Search Bar */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0 pr-3">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => navigate(isSupplier ? '/supplier' : '/')}
          className="flex items-center space-x-2.5 cursor-pointer select-none flex-shrink-0 group"
          title="Go to Samooh Home"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-emerald-600 to-teal-700 shadow-[0_0_16px_rgba(16,185,129,0.35)] border border-white/20 transition-transform duration-200 group-hover:scale-105">
            {isSupplier ? <Truck className="w-4 h-4 text-white" /> : <Layers className="w-4 h-4 text-white" />}
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`text-base font-bold tracking-tight ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {t('brandName') || 'Samooh'}
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full glass-pill text-emerald-700 dark:text-emerald-400">
              {isSupplier ? 'Supplier' : 'Retail'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-5 w-px bg-white/30 dark:bg-white/10" />

        {/* Location Dropdown Pill */}
        <div className="relative" ref={locationRef}>
          <button
            type="button"
            onClick={() => setIsLocationOpen(prev => !prev)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl glass-pill hover:bg-white/40 dark:hover:bg-white/10 transition cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm"
            title="Click to view & configure store location"
            aria-label="Store Location & Pooling Hub"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              storeLocation.sharingEnabled 
                ? 'bg-emerald-500 animate-pulse' 
                : 'bg-amber-500'
            }`} />
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-[140px] md:max-w-[170px] text-xs">
              {storeLocation.areaName || 'Kukatpally, Hyderabad'}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              isLocationOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Frosted Glass Dropdown Popover */}
          {isLocationOpen && (
            <div className="glass-panel p-4 rounded-2xl w-80 sm:w-96 shadow-2xl absolute top-12 left-0 z-50 animate-fade-in border border-white/30 dark:border-white/10 space-y-3.5">
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/20 dark:border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Store Pooling Hub</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Determines shared freight & discounts</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full glass-pill ${
                  storeLocation.sharingEnabled 
                    ? 'text-emerald-700 dark:text-emerald-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {storeLocation.sharingEnabled ? 'Location Shared' : 'Paused'}
                </span>
              </div>

              {/* Notice Alert */}
              {locationNotice && (
                <div className={`p-2.5 rounded-xl text-[11px] font-medium flex items-center space-x-1.5 ${
                  locationNotice.type === 'success'
                    ? 'glass-pill text-emerald-800 dark:text-emerald-300'
                    : 'glass-pill text-rose-800 dark:text-rose-300 border-rose-500/30'
                }`}>
                  {locationNotice.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{locationNotice.text}</span>
                </div>
              )}

              {/* Current Active Location Info */}
              <div className="p-3 rounded-xl glass-pill space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Current Area:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{storeLocation.areaName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>GPS Accuracy:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">±{storeLocation.accuracy || 12} meters</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Coordinates:</span>
                  <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400">
                    {Number(storeLocation.latitude).toFixed(4)}° N, {Number(storeLocation.longitude).toFixed(4)}° E
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  disabled={isUpdatingGps}
                  onClick={handleUpdateLiveGps}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 disabled:opacity-60 border border-white/20"
                >
                  {isUpdatingGps ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting...</span>
                    </>
                  ) : (
                    <>
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Update GPS</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleToggleSharing}
                  className="py-2 px-3 rounded-xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  {storeLocation.sharingEnabled ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pause Sharing</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Resume Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Wholesale Hub Selector */}
              <div className="space-y-1.5 pt-1 border-t border-white/20 dark:border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Hub Selection
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {WHOLESALE_CLUSTERS.map((cl) => {
                    const isCurrent = storeLocation.areaName === cl.area;
                    return (
                      <button
                        key={cl.name}
                        type="button"
                        onClick={() => handleSelectCluster(cl)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isCurrent 
                            ? 'glass-nav-active text-emerald-800 dark:text-emerald-300 font-bold' 
                            : 'hover:bg-white/40 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{cl.name}</span>
                        {isCurrent && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar with Pure Frosted Glass */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder={t('searchPlaceholder') || "Search products, pools, retailers..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input w-full rounded-xl pl-9 pr-3 py-1.5 text-xs sm:text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Right Header: Profile Access Button */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="glass-card flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl text-left focus:outline-none"
          title="Open Profile, Theme, Language & Notification Settings"
          aria-label="User Profile and Settings"
        >
          {isSupplier ? (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-bold text-xs text-white shadow-sm border border-white/20">
              <Truck className="w-3.5 h-3.5" />
            </div>
          ) : user?.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="w-7 h-7 rounded-lg border border-white/30 object-cover shadow-sm" />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-xs text-white shadow-sm border border-white/20">
              {user?.storeName ? user.storeName.charAt(0) : 'S'}
            </div>
          )}

          <div className="hidden sm:block text-left">
            <h4 className={`text-xs font-bold leading-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              {isSupplier ? (currentSupplier?.name || 'Wholesale Supplier') : (user?.storeName || 'Sri Lakshmi Kirana')}
            </h4>
            <span className={`text-[10px] block ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Profile & Settings
            </span>
          </div>

          <User className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
