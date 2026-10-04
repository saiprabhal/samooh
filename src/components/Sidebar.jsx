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
    <aside className={`fixed top-0 left-0 bottom-0 h-screen w-14 border-r flex flex-col justify-between items-center py-3.5 z-30 transition-all duration-300 ${
      theme === 'light'
        ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
        : 'bg-[#1E293B] border-slate-700/80 text-white shadow-md'
    }`}>
      {/* Top: Logo & Expand Button */}
      <div className="flex flex-col items-center space-y-4 w-full">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition shadow-sm group relative ${
            isSupplier 
              ? 'bg-emerald-800 text-white hover:bg-emerald-900' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
          title="Open Navigation Menu"
        >
          {isSupplier ? <Truck className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
          
          {/* Tooltip */}
          <span className="absolute left-12 bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition z-50">
            Open Menu
          </span>
        </button>

        {/* Toggle Arrow Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1 rounded text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
          title="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Icon-Only Navigation Links */}
        <nav className="flex flex-col items-center space-y-2 w-full px-1.5 mt-2">
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
                  `w-10 h-10 rounded-lg flex items-center justify-center transition relative group ${
                    active
                      ? theme === 'light'
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-800'
                      : theme === 'light'
                        ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                
                {/* Active Indicator dot */}
                {isActive && (
                  <span className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}

                {/* Tooltip on Hover */}
                <span className="absolute left-12 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition z-50">
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
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative group"
          title="Help & Support"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="absolute left-12 bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition z-50">
            Help & Support
          </span>
        </button>
      </div>
    </aside>
  );

  // Desktop Expanded & Mobile Drawer Sidebar Content (Full Width)
  const expandedSidebarContent = (
    <aside className={`w-full md:w-60 border-r flex flex-col justify-between p-3.5 pb-10 md:pb-3.5 flex-shrink-0 h-screen overflow-y-auto transition-colors ${
      theme === 'light'
        ? 'bg-white border-slate-200 text-slate-900'
        : 'bg-[#1E293B] border-slate-700/80 text-white'
    }`}>
      <div>
        {/* Brand Logo Header & Collapse/Close Button */}
        <div className="flex items-center justify-between px-2 py-2 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold ${
              isSupplier ? 'bg-emerald-800' : 'bg-slate-900'
            }`}>
              {isSupplier ? (
                <Truck className="w-4 h-4 text-white" />
              ) : (
                <Layers className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`text-sm font-bold tracking-tight ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  {t('brandName')}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                  theme === 'light'
                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isSupplier ? 'SUPPLIER' : 'RETAIL'}
                </span>
              </div>
              <p className={`text-[11px] truncate max-w-[130px] ${
                theme === 'light' ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {isSupplier ? (currentSupplier?.name || 'Wholesale Portal') : t('brandSubtitle')}
              </p>
            </div>
          </div>

          {/* Desktop Collapse Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Collapse to thin line"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 mt-4">
          <div className={`px-2.5 text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${
            theme === 'light' ? 'text-slate-400' : 'text-slate-500'
          }`}>
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
                  `flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition ${
                    isActive
                      ? theme === 'light'
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'bg-slate-800 text-white font-semibold'
                      : theme === 'light'
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label || t(item.labelKey) || 'Nearby Retailers'}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                    item.badge === 'MAP'
                      ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                      : item.badge === 'AI'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : theme === 'light'
                          ? 'bg-slate-50 text-slate-600 border-slate-200'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2">
        {/* Help & Support Trigger Option */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              isSupplier ? setIsSupplierHelpOpen(true) : setIsHelpOpen(true);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition ${
              theme === 'light'
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
            title="Help & Support"
          >
            <div className="flex items-center space-x-2.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>{t('helpSupport') || 'Help & Support'}</span>
            </div>
          </button>
        </div>

        {/* System Status Footer Card */}
        <div className={`p-3 rounded-md border text-xs ${
          theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-800/60 border-slate-700 text-slate-300'
        }`}>
          <div className="flex items-center space-x-2 font-medium mb-1">
            <ShieldCheck className={`w-3.5 h-3.5 ${isSupplier ? 'text-emerald-700' : 'text-slate-700'}`} />
            <span className="text-xs font-semibold">
              {isSupplier ? 'Verified Supplier' : 'Samooh Network'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
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
