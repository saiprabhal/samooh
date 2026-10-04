import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, Truck, ShieldCheck, ChevronRight, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TopNav({ 
  onToggleMobileMenu, 
  isDesktopCollapsed, 
  onToggleDesktopSidebar 
}) {
  const { theme, t, user, userRole, currentSupplier } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const isSupplier = userRole === 'supplier' || location.pathname.startsWith('/supplier');

  return (
    <header className={`h-14 border-b px-3 sm:px-5 flex items-center justify-between sticky top-0 z-20 transition-colors ${
      theme === 'light'
        ? 'bg-white border-slate-200 text-slate-900'
        : 'bg-[#1E293B] border-slate-700/80 text-white'
    }`}>
      {/* Left: Mobile/Desktop Toggle + Logo & Brand Name + Search Bar */}
      <div className="flex items-center space-x-2.5 sm:space-x-4 flex-1 min-w-0 pr-3">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0"
          aria-label="Toggle mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Fixed Sidebar Open/Collapse Button */}
        <button
          type="button"
          onClick={onToggleDesktopSidebar}
          className="hidden md:flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex-shrink-0"
          title={isDesktopCollapsed ? "Open sidebar menu" : "Collapse sidebar menu"}
          aria-label="Toggle desktop sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Brand Logo & Name */}
        <div 
          onClick={() => navigate(isSupplier ? '/supplier' : '/')}
          className="flex items-center space-x-2 cursor-pointer select-none flex-shrink-0"
          title="Go to Samooh Home"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm transition ${
            isSupplier ? 'bg-emerald-800' : 'bg-emerald-700'
          }`}>
            {isSupplier ? <Truck className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
          </div>
          <div className="flex items-center space-x-1.5">
            <span className={`text-base font-bold tracking-tight ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {t('brandName') || 'Samooh'}
            </span>
            <span className={`hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
              isSupplier 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800' 
                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}>
              {isSupplier ? 'Supplier' : 'Retail'}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
            theme === 'light' ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <input 
            type="text"
            placeholder={t('searchPlaceholder') || "Search catalog, commodities, pools..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm transition focus:outline-none ${
              theme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:bg-white'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-slate-600'
            }`}
          />
        </div>
      </div>

      {/* Right Header: Profile Access Button */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm text-left focus:outline-none"
          title="Open Profile, Theme, Language & Notification Settings"
          aria-label="User Profile and Settings"
        >
          {isSupplier ? (
            <div className="w-7 h-7 rounded-md bg-emerald-800 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              <Truck className="w-3.5 h-3.5" />
            </div>
          ) : user?.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="w-7 h-7 rounded-md border border-slate-300 object-cover shadow-sm" />
          ) : (
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center font-bold text-xs text-white shadow-sm">
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
