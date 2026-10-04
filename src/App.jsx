import React, { useState, lazy, Suspense, Component } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';

// Class-based Error Boundary to catch any render errors and prevent white screens
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Samooh App Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B1020] text-white text-center">
          <div className="max-w-md p-8 rounded-3xl border border-slate-800 bg-[#131A2A] space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold">Samooh Platform Ready</h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || "Application initialized. Please reload to restore state."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Route-based code-splitting for instant initial page render
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const Insights = lazy(() => import('./pages/Insights'));
const Impact = lazy(() => import('./pages/Impact'));
const CustomDemandBuilder = lazy(() => import('./pages/CustomDemandBuilder'));
const SavingsBill = lazy(() => import('./pages/SavingsBill'));
const OrderProcessing = lazy(() => import('./pages/OrderProcessing'));
const Login = lazy(() => import('./pages/Login'));
const PreviousOrders = lazy(() => import('./pages/PreviousOrders'));
const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'));
const Profile = lazy(() => import('./pages/Profile'));

// Supplier Portal Pages
const SupplierDashboard = lazy(() => import('./pages/supplier/SupplierDashboard'));
const SupplierOrders = lazy(() => import('./pages/supplier/SupplierOrders'));
const SupplierProducts = lazy(() => import('./pages/supplier/SupplierProducts'));
const SupplierPricing = lazy(() => import('./pages/supplier/SupplierPricing'));
const SupplierAnalytics = lazy(() => import('./pages/supplier/SupplierAnalytics'));
const SupplierProfile = lazy(() => import('./pages/supplier/SupplierProfile'));
const SupplierNearbyRetailers = lazy(() => import('./pages/supplier/SupplierNearbyRetailers'));

function PageLoader() {
  const { theme } = useApp();
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
        <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          Loading Samooh...
        </span>
      </div>
    </div>
  );
}

function MainLayout() {
  const { theme, isAuthLoading, firebaseUser, onboardingCompleted, userRole } = useApp();
  const location = useLocation();
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);

  // Initial Firebase Session Resolution
  if (isAuthLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans ${
        theme === 'light' ? 'bg-[#F7F6F2] text-slate-900' : 'bg-[#0F172A] text-slate-100'
      }`}>
        <PageLoader />
      </div>
    );
  }

  // Standalone Full-Screen Login & Onboarding Views
  if (location.pathname === '/login' || location.pathname === '/onboarding') {
    if (location.pathname === '/login') {
      const isSwitching = new URLSearchParams(location.search).get('logout') === 'true' || new URLSearchParams(location.search).get('switch') === 'true';
      if (!isSwitching) {
        if (firebaseUser && onboardingCompleted) {
          return <Navigate to={userRole === 'supplier' ? '/supplier' : '/'} replace />;
        }
        if (firebaseUser && !onboardingCompleted) {
          return <Navigate to="/onboarding" replace />;
        }
      }
    }

    if (location.pathname === '/onboarding') {
      const isDemoAccess = new URLSearchParams(location.search).get('demo') === 'true' || localStorage.getItem('samooh_demo_onboarding') === 'true';
      if (!firebaseUser && !isDemoAccess) {
        return <Navigate to="/login" replace />;
      }
      if (onboardingCompleted && !isDemoAccess) {
        return <Navigate to={userRole === 'supplier' ? '/supplier' : '/'} replace />;
      }
    }

    return (
      <div className={`min-h-screen font-sans transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-[#F7F6F2] text-slate-900'
          : 'bg-[#0F172A] text-slate-100'
      }`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Routes>
        </Suspense>
      </div>
    );
  }

  // Protected Application Routes - Requires Google Auth
  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  // Requires Completed Onboarding Profile
  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 relative ${
      theme === 'light'
        ? 'bg-[#F4F7FB] text-slate-900'
        : 'bg-[#070B14] text-slate-100'
    }`}>
      {/* Ambient Glassmorphism Luminous Glow Backdrops */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-32 -left-32 w-96 h-96 sm:w-[520px] sm:h-[520px] rounded-full blur-[130px] transition-opacity duration-700 ${
          theme === 'light' ? 'bg-emerald-300/35' : 'bg-emerald-500/15'
        }`} />
        <div className={`absolute -bottom-32 -right-32 w-96 h-96 sm:w-[600px] sm:h-[600px] rounded-full blur-[140px] transition-opacity duration-700 ${
          theme === 'light' ? 'bg-teal-300/30' : 'bg-teal-500/14'
        }`} />
        <div className={`absolute top-1/4 right-[12%] w-80 h-80 sm:w-[460px] sm:h-[460px] rounded-full blur-[130px] transition-opacity duration-700 ${
          theme === 'light' ? 'bg-sky-300/25' : 'bg-indigo-600/15'
        }`} />
        <div className={`absolute bottom-1/4 left-[18%] w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full blur-[120px] transition-opacity duration-700 ${
          theme === 'light' ? 'bg-indigo-200/30' : 'bg-cyan-500/10'
        }`} />
      </div>

      {/* Left Sidebar Navigation (Fixed on Desktop, Collapsible Thin Line) */}
      <Sidebar 
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        isCollapsed={isDesktopCollapsed}
        onToggleCollapse={() => setIsDesktopCollapsed(prev => !prev)}
      />

      {/* Main Content Area - dynamically offsets for fixed desktop sidebar */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 ${
        isDesktopCollapsed ? 'md:ml-14' : 'md:ml-60'
      }`}>
        <TopNav />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Common Profile & App Settings Route */}
              <Route path="/profile" element={<Profile />} />

              {/* Retailer Routes */}
              <Route path="/" element={userRole === 'supplier' ? <Navigate to="/supplier" replace /> : <Dashboard />} />
              <Route path="/opportunities" element={userRole === 'supplier' ? <Navigate to="/supplier" replace /> : <Opportunities />} />
              <Route path="/builder" element={userRole === 'supplier' ? <Navigate to="/supplier" replace /> : <CustomDemandBuilder />} />
              <Route path="/orders" element={userRole === 'supplier' ? <Navigate to="/supplier" replace /> : <PreviousOrders />} />
              <Route path="/processing" element={userRole === 'supplier' ? <Navigate to="/supplier" replace /> : <OrderProcessing />} />
              <Route path="/invoice" element={userRole === 'supplier' ? <Navigate to="/supplier" replace /> : <SavingsBill />} />
              <Route path="/insights" element={userRole === 'supplier' ? <Navigate to="/supplier" replace /> : <Insights />} />
              <Route path="/impact" element={userRole === 'supplier' ? <Navigate to="/supplier" replace /> : <Impact />} />

              {/* Supplier Portal Routes */}
              <Route path="/supplier" element={userRole === 'retailer' ? <Navigate to="/" replace /> : <SupplierDashboard />} />
              <Route path="/supplier/orders" element={userRole === 'retailer' ? <Navigate to="/" replace /> : <SupplierOrders />} />
              <Route path="/supplier/products" element={userRole === 'retailer' ? <Navigate to="/" replace /> : <SupplierProducts />} />
              <Route path="/supplier/pricing" element={userRole === 'retailer' ? <Navigate to="/" replace /> : <SupplierPricing />} />
              <Route path="/supplier/analytics" element={userRole === 'retailer' ? <Navigate to="/" replace /> : <SupplierAnalytics />} />
              <Route path="/supplier/profile" element={userRole === 'retailer' ? <Navigate to="/" replace /> : <SupplierProfile />} />
              <Route path="/supplier/nearby-retailers" element={userRole === 'retailer' ? <Navigate to="/" replace /> : <SupplierNearbyRetailers />} />
            </Routes>
          </Suspense>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav onOpenMoreMenu={() => setMobileMenuOpen(true)} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}
