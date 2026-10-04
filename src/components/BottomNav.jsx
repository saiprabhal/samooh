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
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto rounded-2xl py-1.5 px-2 transition-all duration-300 border-2.5 border-black dark:border-white bg-[#FAF7EE] dark:bg-[#18181F] shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF]"
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
                  ? 'text-black dark:text-white font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <div className={`p-1.5 rounded-lg transition-transform duration-150 active:scale-90 ${
                  isActive 
                    ? 'bg-[#FFDE59] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                    : ''
                }`}>
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                </div>

                {tab.badge && (
                  <span className={`absolute -top-1 -right-2 px-1 py-0.2 rounded-md text-[9px] font-black uppercase tracking-tight border border-black shadow-[1px_1px_0px_0px_#000] ${
                    tab.badge === 'AI'
                      ? 'bg-[#22C55E] text-black'
                      : tab.badge === 'LIVE'
                        ? 'bg-[#FF70A6] text-black animate-pulse'
                        : 'bg-[#FFDE59] text-black'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[62px] leading-tight ${
                isActive ? 'font-black' : 'font-semibold'
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
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 relative text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white active:scale-95 cursor-pointer`}
          aria-label="Open More Operations Menu"
        >
          <div className="p-1 rounded-lg">
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold leading-tight">
            More
          </span>
        </button>
      </div>
    </nav>
  );
}
