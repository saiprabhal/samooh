import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, User, Truck, Layers, MapPin, ChevronDown, 
  RotateCw, EyeOff, Eye, Navigation, CheckCircle2, 
  AlertCircle, Loader2, Check, X, ArrowRight, Tag,
  ArrowLeft, Sparkles, Box
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

// Rotating animated search prompts
const SEARCH_PROMPTS = [
  "Search 'Sona Masoori Rice'...",
  "Search 'Freedom Sunflower Oil'...",
  "Search 'Guntur Red Chilli'...",
  "Search 'Toor Dal 50kg'...",
  "Search 'Sugar M-30 Grade'...",
  "Search 'Surf Excel Carton'...",
  "Search nearby Kirana pools...",
  "Search wholesale mandi deals..."
];

// Rich searchable catalog & actions
const SEARCH_ITEMS = [
  { id: 'p1', type: 'product', title: 'Sona Masoori Rice (25kg Bag)', subtitle: 'Grains • Kukatpally Mandi Hub', badge: '18.6% OFF', link: '/opportunities?search=Sona%20Masoori%20Rice' },
  { id: 'p2', type: 'product', title: 'Freedom Refined Sunflower Oil (15L)', subtitle: 'Oils • 3 Nearby Stores Joined', badge: '14.2% OFF', link: '/opportunities?search=Freedom%20Sunflower%20Oil' },
  { id: 'p3', type: 'product', title: 'Guntur Red Chilli Powder (5kg)', subtitle: 'Spices • Direct Guntur AP Hub', badge: '21.0% OFF', link: '/opportunities?search=Guntur%20Red%20Chilli' },
  { id: 'p4', type: 'product', title: 'Toor Dal Premium Desi (50kg)', subtitle: 'Pulses • High Demand Pool', badge: '16.5% OFF', link: '/opportunities?search=Toor%20Dal' },
  { id: 'p5', type: 'product', title: 'Sugar M-30 Grade (50kg Bag)', subtitle: 'Essentials • Bulk Sugar Mandi', badge: '12.0% OFF', link: '/opportunities?search=Sugar' },
  { id: 'p6', type: 'product', title: 'Aashirvaad Superior MP Atta (10kg)', subtitle: 'Grains • Fresh Stock', badge: '15.0% OFF', link: '/opportunities?search=Aashirvaad' },
  { id: 'p7', type: 'product', title: 'Surf Excel Easy Wash Carton (20kg)', subtitle: 'FMCG • 20 Units x 1kg', badge: '17.5% OFF', link: '/opportunities?search=Surf%20Excel' },
  { id: 'p8', type: 'product', title: 'Tata Salt (1kg Pack x 25)', subtitle: 'Essentials • Fast Moving', badge: '10.0% OFF', link: '/opportunities?search=Tata%20Salt' },
  { id: 'pl1', type: 'pool', title: 'Kukatpally Kirana Pool #1', subtitle: '4 Stores Active • Sona Masoori Rice', badge: 'Threshold Met', link: '/opportunities?search=Sona%20Masoori%20Rice' },
  { id: 'pl2', type: 'pool', title: 'Secunderabad Oil Cluster', subtitle: '3 Stores Joined • Freedom Sunflower', badge: 'Filling Fast', link: '/opportunities?search=Freedom%20Sunflower' },
  { id: 'pl3', type: 'pool', title: 'Begum Bazaar Spices Hub', subtitle: '5 Stores Active • Guntur Red Chilli', badge: '21% Discount', link: '/opportunities?search=Guntur' },
  { id: 'pg1', type: 'action', title: 'Procurement Opportunities & Pools', subtitle: 'Explore active group discounts & join pools', badge: 'Deals', link: '/opportunities' },
  { id: 'pg2', type: 'action', title: 'Custom Demand Builder', subtitle: 'Create custom pools & invite neighbor stores', badge: 'Build', link: '/builder' },
  { id: 'pg3', type: 'action', title: 'Savings Bill & Invoices', subtitle: 'Inspect consolidated wholesale bills & margins', badge: 'Bills', link: '/invoice' },
  { id: 'pg4', type: 'action', title: 'Order History & Dispatch Tracking', subtitle: 'Track pooled shipments & delivery vehicles', badge: 'Orders', link: '/orders' },
  { id: 'pg5', type: 'action', title: 'Procurement Insights', subtitle: 'AI price arbitrage & seasonal forecasts', badge: 'AI', link: '/insights' }
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

  // Search State & References
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Animated Typewriter State
  const [promptIndex, setPromptIndex] = useState(0);
  const [animatedPrompt, setAnimatedPrompt] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isSupplier = userRole === 'supplier' || location.pathname.startsWith('/supplier');

  // Typewriter Loop Effect
  useEffect(() => {
    if (searchTerm) return; // Halt animation when user types

    const currentPrompt = SEARCH_PROMPTS[promptIndex];
    let timer;

    if (!isDeleting) {
      if (animatedPrompt.length < currentPrompt.length) {
        timer = setTimeout(() => {
          setAnimatedPrompt(currentPrompt.slice(0, animatedPrompt.length + 1));
        }, 70);
      } else {
        // Pause at completion
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (animatedPrompt.length > 0) {
        timer = setTimeout(() => {
          setAnimatedPrompt(currentPrompt.slice(0, animatedPrompt.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % SEARCH_PROMPTS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [animatedPrompt, isDeleting, promptIndex, searchTerm]);

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

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Search Items
  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return SEARCH_ITEMS.slice(0, 6);
    }
    return SEARCH_ITEMS.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  }, [searchTerm]);

  // Execute Search
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      navigate(`/opportunities?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/opportunities');
    }
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const handleSelectItem = (item) => {
    navigate(item.link);
    setSearchTerm('');
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const handleClearSearch = (e) => {
    e.stopPropagation();
    setSearchTerm('');
    if (inputRef.current) inputRef.current.focus();
    if (mobileInputRef.current) mobileInputRef.current.focus();
  };

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
    <header className="glass-panel h-14 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 relative">
      {/* Left Group: Brand Logo + Location Dropdown + Search Bar */}
      <div className="flex items-center space-x-2.5 sm:space-x-4 flex-1 min-w-0 pr-2 sm:pr-3">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => navigate(isSupplier ? '/supplier' : '/')}
          className="flex items-center space-x-2 cursor-pointer select-none flex-shrink-0 group"
          title="Go to Samooh Home"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white bg-emerald-800 shadow-xs border border-white/20 transition-transform duration-200 group-hover:scale-105">
            {isSupplier ? <Truck className="w-4 h-4 text-white" /> : <Layers className="w-4 h-4 text-white" />}
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`text-base font-bold tracking-tight ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {t('brandName') || 'Samooh'}
            </span>
            <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
              {isSupplier ? 'Supplier' : 'Retail'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Location Dropdown Pill */}
        <div className="relative" ref={locationRef}>
          <button
            type="button"
            onClick={() => setIsLocationOpen(prev => !prev)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
            title="Click to view & configure store location"
            aria-label="Store Location & Pooling Hub"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              storeLocation.sharingEnabled 
                ? 'bg-emerald-700 dark:bg-emerald-500' 
                : 'bg-amber-600'
            }`} />
            <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
            <span className="truncate max-w-[80px] sm:max-w-[130px] md:max-w-[160px] text-xs">
              {storeLocation.areaName || 'Kukatpally, Hyderabad'}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              isLocationOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Frosted Glass Dropdown Popover */}
          {isLocationOpen && (
            <div className="glass-panel p-4 rounded-2xl w-80 sm:w-96 shadow-xl absolute top-12 left-0 z-50 animate-fade-in border border-slate-200 dark:border-slate-800 space-y-3.5">
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Store Pooling Hub</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Determines shared freight & discounts</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  storeLocation.sharingEnabled 
                    ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' 
                    : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                }`}>
                  {storeLocation.sharingEnabled ? 'Location Shared' : 'Paused'}
                </span>
              </div>

              {/* Notice Alert */}
              {locationNotice && (
                <div className={`p-2.5 rounded-xl text-[11px] font-medium flex items-center space-x-1.5 ${
                  locationNotice.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  {locationNotice.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
                  )}
                  <span>{locationNotice.text}</span>
                </div>
              )}

              {/* Current Active Location Info */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
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
                  className="py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-60 cursor-pointer"
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
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  {storeLocation.sharingEnabled ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pause Sharing</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                      <span>Resume Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Wholesale Hub Selector */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200/80 dark:border-slate-800">
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
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{cl.name}</span>
                        {isCurrent && <Check className="w-3 h-3 text-emerald-800 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Search Bar with Clean Solid Styling & Typewriter Animation */}
        <div 
          className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md hidden sm:block" 
          ref={searchContainerRef}
        >
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            {/* Clean Slate Magnifier Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-400" />
            </div>

            {/* Input Field */}
            <input 
              ref={inputRef}
              type="text"
              value={searchTerm}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSearchFocused(false);
              }}
              className="glass-input w-full rounded-xl pl-9 pr-8 py-1.5 text-xs sm:text-sm font-medium focus:outline-none transition-all duration-200 border border-slate-200 dark:border-slate-800"
            />

            {/* Dynamic Typewriter Text with Neutral Blinking Cursor */}
            {!searchTerm && (
              <div 
                onClick={() => inputRef.current?.focus()}
                className="absolute left-9 right-8 top-1/2 -translate-y-1/2 pointer-events-none flex items-center select-none text-xs sm:text-sm text-slate-400 dark:text-slate-400/90 truncate font-normal"
              >
                <span>{animatedPrompt}</span>
                <span className="w-1.5 h-3.5 bg-slate-600 dark:bg-slate-300 ml-1 rounded-xs inline-block" />
              </div>
            )}

            {/* Clear Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Live Search Results Dropdown Popup */}
          {isSearchFocused && (
            <div className="glass-panel p-2.5 rounded-2xl w-full sm:w-[380px] md:w-[440px] shadow-xl absolute top-12 left-0 z-50 animate-fade-in border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b border-slate-200/80 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                  <Search className="w-3 h-3 text-slate-500" />
                  <span>{searchTerm.trim() ? 'Matching Deals' : 'Popular Kirana Pools'}</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {filteredItems.length} results
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                          {item.type === 'product' ? <Tag className="w-3.5 h-3.5" /> : item.type === 'pool' ? <Box className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 flex-shrink-0">
                        {item.badge}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center space-y-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">No direct item found for "{searchTerm}"</p>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
                    >
                      Search across all procurement opportunities →
                    </button>
                  </div>
                )}
              </div>

              {/* Enter Key Tip */}
              <div className="pt-1.5 px-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Press <strong className="font-semibold text-slate-600 dark:text-slate-300">↵ Enter</strong> to view full results</span>
                <span 
                  onClick={handleSearchSubmit}
                  className="font-bold text-emerald-800 dark:text-emerald-400 cursor-pointer hover:underline"
                >
                  View in Opportunities
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Search Button (Visible on screens < 640px) */}
        <button
          type="button"
          onClick={() => {
            setIsMobileSearchOpen(prev => !prev);
            setTimeout(() => {
              if (mobileInputRef.current) mobileInputRef.current.focus();
            }, 100);
          }}
          className={`sm:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer flex items-center justify-center ${
            isMobileSearchOpen 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white' 
              : 'bg-white/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
          title="Search products and pools"
          aria-label="Open Mobile Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Right Header: Profile Access Button */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="glass-card flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl text-left focus:outline-none border border-slate-200 dark:border-slate-800"
          title="Open Profile, Theme, Language & Notification Settings"
          aria-label="User Profile and Settings"
        >
          {isSupplier ? (
            <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center font-bold text-xs text-white shadow-2xs border border-white/20">
              <Truck className="w-3.5 h-3.5" />
            </div>
          ) : user?.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 object-cover shadow-2xs" />
          ) : (
            <div className="w-7 h-7 rounded-lg bg-slate-800 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-white shadow-2xs border border-white/20">
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

      {/* Mobile Search Bar Drawer */}
      {isMobileSearchOpen && (
        <div className="sm:hidden absolute top-14 left-0 right-0 p-3 glass-panel border-b border-slate-200 dark:border-slate-800 z-40 shadow-xl space-y-2.5">
          <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center space-x-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                ref={mobileInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full rounded-xl pl-9 pr-8 py-2 text-xs font-medium focus:outline-none border border-slate-200 dark:border-slate-800"
              />
              {!searchTerm && (
                <div 
                  onClick={() => mobileInputRef.current?.focus()}
                  className="absolute left-9 right-8 top-1/2 -translate-y-1/2 pointer-events-none flex items-center select-none text-xs text-slate-400 dark:text-slate-400 truncate"
                >
                  <span>{animatedPrompt}</span>
                  <span className="w-1.5 h-3 bg-slate-600 dark:bg-slate-300 ml-0.5 rounded-xs inline-block" />
                </div>
              )}
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
          </form>

          {/* Quick Filter Tags on Mobile */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {['Rice', 'Oil', 'Chilli', 'Dal', 'Sugar', 'Pools'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchTerm(tag);
                  navigate(`/opportunities?search=${encodeURIComponent(tag)}`);
                  setIsMobileSearchOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 flex-shrink-0"
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Mobile Instant Results List */}
          <div className="max-h-56 overflow-y-auto space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60 pt-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectItem(item)}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 truncate pr-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <Tag className="w-3 h-3" />
                  </div>
                  <div className="truncate">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex-shrink-0">
                  {item.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
