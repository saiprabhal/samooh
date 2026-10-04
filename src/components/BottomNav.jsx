import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Sparkles, ShoppingBag, PackageCheck, 
  Menu, Tag, MapPin, Truck, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav({ onOpenMoreMenu }) {
  const { theme, t, userRole } = useApp();
  const location = useLocation();

  const isSupplier = userRole === 'supplier' || location.pathname.startsWith('/supplier');

  // Retailer Navigation Items for Bottom Bar (4 primary + More)
  const retailerTabs = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: LayoutDashboard,
      badge: null,
      exact: true
    },
    {
      id: 'deals',
      label: 'AI Deals',
      path: '/opportunities',
      icon: Sparkles,
      badge: 'AI',
      exact: false
    },
    {
      id: 'builder',
      label: 'Demand',
      path: '/builder',
      icon: ShoppingBag,
      badge: 'NEW',
      exact: false
    },
    {
      id: 'orders',
      label: 'Orders',
      path: '/orders',
      icon: PackageCheck,
      badge: null,
      exact: false
    }
  ];

  // Supplier Navigation Items for Bottom Bar (4 primary + More)
  const supplierTabs = [
    {
      id: 'supplier-home',
      label: 'Home',
      path: '/supplier',
      icon: LayoutDashboard,
      badge: null,
      exact: true
    },
    {
      id: 'supplier-orders',
      label: 'Orders',
      path: '/supplier/orders',
      icon: PackageCheck,
      badge: 'LIVE',
      exact: false
    },
    {
      id: 'supplier-products',
      label: 'Catalog',
      path: '/supplier/products',
      icon: Tag,
      badge: null,
      exact: false
    },
    {
      id: 'supplier-nearby',
      label: 'Nearby',
      path: '/supplier/nearby-retailers',
      icon: MapPin,
      badge: 'MAP',
      exact: false
    }
  ];

  const currentTabs = isSupplier ? supplierTabs : retailerTabs;

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto rounded-2xl glass-panel py-1.5 px-2 transition-all duration-300"
    >
      <div className="flex items-center justify-around">
        {currentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.exact 
            ? location.pathname === tab.path 
            : location.pathname.startsWith(tab.path);

          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 relative group ${
                isActive
                  ? isSupplier
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-emerald-800 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Tab Glow Pill */}
              {isActive && (
                <span 
                  className={`absolute -top-1.5 w-8 h-1 rounded-full transition-all duration-300 ${
                    isSupplier ? 'bg-emerald-600' : 'bg-emerald-700 dark:bg-emerald-400'
                  }`} 
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <div className={`p-1 rounded-lg transition-transform duration-150 active:scale-90 ${
                  isActive 
                    ? theme === 'light'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-emerald-950/60 text-emerald-400'
                    : ''
                }`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                {tab.badge && (
                  <span className={`absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold tracking-tight shadow-sm scale-90 ${
                    tab.badge === 'AI'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white'
                      : tab.badge === 'LIVE'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-amber-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[62px] leading-tight ${
                isActive ? 'font-bold' : 'font-medium'
              }`}>
                {tab.label}
              </span>
            </NavLink>
          );
        })}

        {/* 5th Tab: "More" Menu Trigger */}
        <button
          type="button"
          onClick={onOpenMoreMenu}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:scale-95`}
          aria-label="Open More Operations Menu"
        >
          <div className="p-1 rounded-lg">
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium leading-tight">
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
