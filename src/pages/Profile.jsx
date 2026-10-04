import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Store, Truck, Building2, MapPin, Mail, Phone, 
  ShieldCheck, Moon, Sun, Languages, Bell, BellRing, 
  LogOut, ArrowLeft, Check, Sparkles, AlertCircle, RefreshCw, 
  Wallet, Award, ExternalLink, Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { 
    theme, 
    toggleTheme, 
    lang, 
    setLang, 
    supportedLanguages, 
    t, 
    user, 
    userProfile, 
    firebaseUser, 
    logout, 
    userRole, 
    currentSupplier 
  } = useApp();
  
  const navigate = useNavigate();

  const isSupplier = userRole === 'supplier';

  // Notification Preferences State (in-app switches)
  const [notifications, setNotifications] = useState({
    poolAlerts: true,
    priceDrops: true,
    dispatchUpdates: true,
    marketingPromo: false,
  });

  const [saveMessage, setSaveMessage] = useState('');

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setSaveMessage('Preference updated');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login?logout=true');
  };

  // Derive comprehensive user profile info
  const displayName = isSupplier 
    ? (currentSupplier?.name || userProfile?.businessName || 'Wholesale Supplier')
    : (user?.storeName || userProfile?.storeName || 'Kirana Retail Store');

  const contactName = isSupplier
    ? (currentSupplier?.contactPerson || currentSupplier?.contact_person || userProfile?.contactPerson || firebaseUser?.displayName || 'Supplier Manager')
    : (user?.ownerName || userProfile?.ownerName || firebaseUser?.displayName || 'Store Owner');

  const email = firebaseUser?.email || user?.email || currentSupplier?.email || 'partner@samooh.in';
  const phone = currentSupplier?.phone || userProfile?.phone || userProfile?.contactPhone || '+91 98480 12345';
  
  const address = isSupplier
    ? (currentSupplier?.address || userProfile?.address || 'Wholesale Mandi Hub, Bowenpally, Secunderabad')
    : (user?.address || userProfile?.address || 'Shop #4, Main Bazaar Road, Kukatpally');

  const city = isSupplier
    ? (currentSupplier?.city || userProfile?.city || 'Hyderabad')
    : (user?.city || userProfile?.city || 'Hyderabad');

  const state = isSupplier
    ? (currentSupplier?.state || userProfile?.state || 'Telangana')
    : (user?.state || userProfile?.state || 'Telangana');

  const pincode = isSupplier
    ? (currentSupplier?.pincode || userProfile?.pincode || '500011')
    : (user?.pincode || userProfile?.pincode || '500072');

  const clusterHub = isSupplier
    ? 'North Telangana Logistics Grid #2'
    : (user?.clusterHub || `${city} South-West Cluster #4`);

  const budget = user?.monthlyBudget || '₹2,50,000';
  const totalSaved = user?.totalSaved || '₹18,450';
  const rating = isSupplier ? (currentSupplier?.rating || 4.8) : (user?.rating || 4.9);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Account & App Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your business profile, display theme, language, and alert preferences.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="py-1.5 px-3 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Grid: User Profile (Left) + Settings & Preferences (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Business & User Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm text-center relative overflow-hidden">
            {/* Top background accent */}
            <div className={`absolute top-0 left-0 right-0 h-16 ${
              isSupplier ? 'bg-gradient-to-r from-emerald-800 to-teal-800' : 'bg-gradient-to-r from-emerald-900 to-slate-900'
            }`} />

            {/* Avatar / Brand Icon */}
            <div className="relative pt-4 flex justify-center">
              <div className={`w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-md font-bold text-2xl text-white ${
                isSupplier ? 'bg-emerald-800' : 'bg-slate-900'
              }`}>
                {isSupplier ? (
                  <Truck className="w-10 h-10" />
                ) : user?.avatar ? (
                  <img src={user.avatar} alt="User Avatar" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <span>{displayName.charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {displayName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {contactName}
              </p>
              
              <div className="pt-2 flex items-center justify-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight border ${
                  isSupplier 
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                }`}>
                  {isSupplier ? 'WHOLESALE SUPPLIER' : 'VERIFIED KIRANA RETAILER'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>KYC Active</span>
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {isSupplier ? 'Fulfillment' : 'Total Savings'}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {isSupplier ? '98.5%' : totalSaved}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Platform Rating
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5 fill-current" />
                  <span>{rating} / 5.0</span>
                </span>
              </div>
            </div>
          </div>

          {/* Business Location & Cluster Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm space-y-3.5 text-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Location & Cluster Hub</span>
            </h3>

            <div className="space-y-2.5 text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{address}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">City / District</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{city}, {state}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pincode</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{pincode}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80">
                <span className="text-slate-400 block text-[11px]">Assigned Samooh Cluster</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400">{clusterHub}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Theme, Language, Notifications & Detail Specs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Appearance & Display Theme */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-emerald-400" />}
                  <span>Display Theme</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose between high-contrast day mode or battery-saving dark mode.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                className={`p-4 rounded-xl border text-left transition flex items-center space-x-3 ${
                  theme === 'light'
                    ? 'border-emerald-700 bg-emerald-50/50 ring-2 ring-emerald-700 text-slate-900'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-500 shadow-sm">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Light Mode</span>
                  <span className="text-[11px] text-slate-500">Daytime clarity</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={`p-4 rounded-xl border text-left transition flex items-center space-x-3 ${
                  theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500 text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-sm">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Dark Mode</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Night & OLED optimized</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Regional Language Switcher */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Languages className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Platform Language (भाषा / భాష)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your preferred native Indian language for invoices, bills, and wholesale pooling.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {(supportedLanguages || []).map((langItem) => {
                const isSelected = lang === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    type="button"
                    onClick={() => {
                      setLang(langItem.code);
                      setSaveMessage(`Language set to ${langItem.nativeName}`);
                      setTimeout(() => setSaveMessage(''), 2500);
                    }}
                    className={`p-3 rounded-lg border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold ring-1 ring-emerald-700 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{langItem.nativeName}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{langItem.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Notification Alerts Center */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <BellRing className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Procurement & Dispatch Notifications</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control WhatsApp, SMS, and in-app alerts for pooling thresholds and deliveries.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {[
                {
                  key: 'poolAlerts',
                  title: 'Nearby Pool Formation Alerts',
                  desc: 'Instant alert when nearby Kiranas start pooling an item you frequently buy'
                },
                {
                  key: 'priceDrops',
                  title: 'Supplier Wholesale Tier Drops',
                  desc: 'Notify when a bulk pool hits 80% volume threshold to unlock lower price slabs'
                },
                {
                  key: 'dispatchUpdates',
                  title: 'Dispatch & Delivery Tracking',
                  desc: 'Real-time updates when orders are packed, in transit, or out for cluster drop'
                },
                {
                  key: 'marketingPromo',
                  title: 'Seasonal Mandi Trends & Insights',
                  desc: 'Weekly demand forecasts and high-margin festival commodity recommendations'
                }
              ].map((item) => (
                <div 
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="pr-4">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleNotification(item.key)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                      notifications[item.key]
                        ? 'bg-emerald-700 justify-end'
                        : 'bg-slate-300 dark:bg-slate-600 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Contact & Verification Details */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6 shadow-sm space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Contact & Account Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Registered Email</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white block truncate">{email}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 space-y-1">
                <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp / Phone</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white block">{phone}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
