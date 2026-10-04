import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Sparkles, Store, LineChart, Layers, 
  ShieldCheck, ShoppingBag, FileText, PackageCheck, X, 
  Truck, Building2, Tag, MapPin, HelpCircle, 
  ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import RetailerHelpSupportModal from './RetailerHelpSupportModal';
import SupplierHelpSupportModal from './SupplierHelpSupportModal';

export default function Sidebar({ 
  mobileOpen = false, 
  onCloseMobile, 
  isCollapsed = true, 
  onToggleCollapse 
}) {
  const { theme, t, userRole, currentSupplier } = useApp();
  const location = useLocation();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSupplierHelpOpen, setIsSupplierHelpOpen] = useState(false);
  const isSupplier = userRole === 'supplier' || location.pathname.startsWith('/supplier');

  // Retailer Navigation Items
  const retailerNavItems = [
    { labelKey: 'dashboard', path: '/', icon: LayoutDashboard },
    { labelKey: 'opportunities', path: '/opportunities', icon: Sparkles, badge: 'AI' },
    { labelKey: 'customDemand', path: '/builder', icon: ShoppingBag, badge: 'NEW' },
    { labelKey: 'previousOrdersNav', path: '/orders', icon: PackageCheck },
    { labelKey: 'savingsBill', path: '/invoice', icon: FileText },
    { labelKey: 'insights', path: '/insights', icon: Store },
    { labelKey: 'impact', path: '/impact', icon: LineChart },
  ];

  // Supplier Portal Navigation Items
  const supplierNavItems = [
    { labelKey: 'supplierDashboard', path: '/supplier', icon: LayoutDashboard },
    { labelKey: 'supplierOrders', path: '/supplier/orders', icon: PackageCheck, badge: 'LIVE' },
    { labelKey: 'supplierProducts', path: '/supplier/products', icon: Tag },
    { labelKey: 'supplierPricing', path: '/supplier/pricing', icon: FileText, badge: 'MOQ' },
    { labelKey: 'supplierAnalytics', path: '/supplier/analytics', icon: LineChart },
    { labelKey: 'supplierProfile', path: '/supplier/profile', icon: Building2 },
    { labelKey: 'supplierNearbyRetailers', label: 'Nearby Retailers', path: '/supplier/nearby-retailers', icon: MapPin, badge: 'MAP' },
  ];

  const currentNavItems = isSupplier ? supplierNavItems : retailerNavItems;

  // Desktop Collapsed Sidebar Content (Thin Line / Rail)
  const collapsedDesktopContent = (
    <aside className="glass-panel fixed top-0 left-0 bottom-0 h-screen w-14 flex flex-col justify-between items-center py-3 z-30 transition-all duration-300 border-r-2.5 border-black dark:border-white">
      {/* Top: Clean Expand Button (Aligned with TopNav) */}
      <div className="flex flex-col items-center w-full">
        <div className="h-10 flex items-center justify-center w-full mb-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-xl border-2 border-black dark:border-white bg-[#FAF7EE] dark:bg-[#18181F] text-black dark:text-white hover:bg-[#FFDE59] dark:hover:bg-[#252530] transition shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none group relative cursor-pointer"
            title="Expand Navigation Menu"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            <span className="absolute left-12 text-black dark:text-white bg-[#FAF7EE] dark:bg-[#18181F] border-2 border-black dark:border-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition z-50">
              Expand Menu
            </span>
          </button>
        </div>

        {/* Icon-Only Navigation Links */}
        <nav className="flex flex-col items-center space-y-2 w-full px-1.5 mt-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const labelText = item.label || t(item.labelKey) || 'Item';
            const isActive = item.path === '/' || item.path === '/supplier'
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/supplier'}
                className={({ isActive: active }) =>
                  `w-10 h-10 rounded-xl flex items-center justify-center transition relative group ${
                    active
                      ? 'glass-nav-active text-black font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-[#FFDE59]/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
                
                {/* Active Indicator dot */}
                {isActive && (
                  <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-black dark:bg-white border border-black" />
                )}

                {/* Tooltip on Hover */}
                <span className="absolute left-12 text-black dark:text-white bg-[#FAF7EE] dark:bg-[#18181F] border-2 border-black dark:border-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition z-50">
                  {labelText}
                  {item.badge && ` (${item.badge})`}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Help Trigger */}
      <div className="flex flex-col items-center space-y-2 w-full">
        <button
          type="button"
          onClick={() => isSupplier ? setIsSupplierHelpOpen(true) : setIsHelpOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-black dark:text-white hover:bg-[#FFDE59] transition relative group border border-transparent hover:border-2 hover:border-black cursor-pointer"
          title="Help & Support"
        >
          <HelpCircle className="w-4 h-4 stroke-[2.2]" />
          <span className="absolute left-12 text-black dark:text-white bg-[#FAF7EE] dark:bg-[#18181F] border-2 border-black dark:border-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition z-50">
            Help & Support
          </span>
        </button>
      </div>
    </aside>
  );

  // Desktop Expanded & Mobile Drawer Sidebar Content (Full Width)
  const expandedSidebarContent = (
    <aside className="glass-panel w-full md:w-60 flex flex-col justify-between p-3.5 pb-10 md:pb-3.5 flex-shrink-0 h-screen overflow-y-auto border-r-2.5 border-black dark:border-white">
      <div>
        {/* Navigation Header & Collapse/Close Button */}
        <div className="flex items-center justify-between px-2 py-2 mb-3 border-b-2 border-black dark:border-white pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Navigation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md font-black border-2 border-black bg-[#FFDE59] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
              {isSupplier ? 'SUPPLIER' : 'RETAIL'}
            </span>
          </div>

          {/* Desktop Collapse Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-xl border-2 border-black dark:border-white bg-[#FAF7EE] dark:bg-[#18181F] text-black dark:text-white hover:bg-[#FFDE59] transition shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              title="Collapse to thin line"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-xl border-2 border-black text-black hover:bg-[#FF70A6] shadow-[2px_2px_0px_0px_#000]"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 mt-2">
          <div className="px-2.5 text-[10px] font-semibold uppercase tracking-wider mb-2 text-slate-400 dark:text-slate-500">
            {isSupplier ? 'Wholesale Operations' : 'Procurement'}
          </div>
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/supplier'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'glass-nav-active text-black font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-[#FFDE59]/40 font-bold'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                  <span>{item.label || t(item.labelKey) || 'Nearby Retailers'}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase border-2 border-black bg-[#FFDE59] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2.5">
        {/* Help & Support Trigger Option */}
        <div className="pt-2 border-t-2 border-black dark:border-white">
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              isSupplier ? setIsSupplierHelpOpen(true) : setIsHelpOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-[#FFDE59]/40 transition border border-transparent hover:border-black cursor-pointer"
            title="Help & Support"
          >
            <div className="flex items-center space-x-2.5">
              <HelpCircle className="w-4 h-4 stroke-[2.2]" />
              <span>{t('helpSupport') || 'Help & Support'}</span>
            </div>
          </button>
        </div>

        {/* System Status Footer Card */}
        <div className="p-3 rounded-xl text-xs border-2 border-black dark:border-white bg-[#FAF7EE] dark:bg-[#18181F] shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]">
          <div className="flex items-center space-x-2 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-black dark:text-white stroke-[2.5]" />
            <span className="text-xs font-black text-black dark:text-white">
              {isSupplier ? 'Verified Supplier' : 'Samooh Network'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-normal">
            {isSupplier ? 'Wholesale bulk orders protected with escrow guarantees.' : t('clusterStatusText')}
          </p>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Fixed Side Navigation (Does NOT move while scrolling) */}
      <div className="hidden md:block">
        {isCollapsed ? (
          collapsedDesktopContent
        ) : (
          <div className="fixed top-0 left-0 bottom-0 h-screen z-30 shadow-lg">
            {expandedSidebarContent}
          </div>
        )}
      </div>

      {/* Mobile Slide-Over Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
            onClick={onCloseMobile}
          />
          {/* Drawer Sidebar */}
          <div className="relative flex-1 max-w-[280px] w-full h-full shadow-2xl z-50 overflow-y-auto">
            {expandedSidebarContent}
          </div>
        </div>
      )}

      {/* Retailer Help & Support Modal */}
      {!isSupplier && (
        <RetailerHelpSupportModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />
      )}

      {/* Supplier Help & Support Modal */}
      {isSupplier && (
        <SupplierHelpSupportModal
          isOpen={isSupplierHelpOpen}
          onClose={() => setIsSupplierHelpOpen(false)}
        />
      )}
    </>
  );
}
