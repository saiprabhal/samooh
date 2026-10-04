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
    <header className="glass-panel h-14 px-3 sm:px-5 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile/Desktop Toggle + Logo & Brand Name + Search Bar */}
      <div className="flex items-center space-x-2.5 sm:space-x-4 flex-1 min-w-0 pr-3">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-white/15 transition flex-shrink-0"
          aria-label="Toggle mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Fixed Sidebar Open/Collapse Button */}
        <button
          type="button"
          onClick={onToggleDesktopSidebar}
          className="hidden md:flex p-1.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition flex-shrink-0 shadow-sm"
          title={isDesktopCollapsed ? "Open sidebar menu" : "Collapse sidebar menu"}
          aria-label="Toggle desktop sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

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

        {/* Search Bar with Pure Frosted Glass */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
            theme === 'light' ? 'text-slate-400' : 'text-slate-400'
          }`} />
          <input 
            type="text"
            placeholder={t('searchPlaceholder') || "Search catalog, commodities, pools..."}
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
