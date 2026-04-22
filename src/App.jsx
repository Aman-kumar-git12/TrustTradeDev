import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { WifiOff } from 'lucide-react'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import ScrollButtons from './components/ScrollButtons'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Marketplace from './pages/Marketplace'
import AssetDetails from './pages/AssetDetails'
import SellerPostAsset from './pages/SellerPostAsset'
import SellerDashboard from './pages/SellerDashboard'
import SellerLeads from './pages/SellerLeads'
import SellerListings from './pages/SellerListings'
import SellerAssetDetails from './pages/SellerAssetDetails'
import SellerAnalytics from './pages/SellerAnalytics'
import SellerProductAnalytics from './pages/SellerProductAnalytics'
import SellerAnalyticsOverview from './pages/SellerAnalyticsOverview'
import SellerAnalyticsProducts from './pages/SellerAnalyticsProducts'
import SellerAnalyticsCustomers from './pages/SellerAnalyticsCustomers'
import BuyerDashboard from './pages/BuyerDashboard'
import BuyingHub from './pages/BuyingHub'
import BuyerInterests from './pages/BuyerInterests'
import BuyerOrders from './pages/BuyerOrders'
import Profile from './pages/Profile'
import BuyerInsights from './pages/BuyerInsights'
import SellerSelectBusinessPost from './pages/SellerSelectBusinessPost'
import SellerSelectDashboardBusiness from './pages/SellerSelectDashboardBusiness'
import SellerDashboardRedirect from './pages/SellerDashboardRedirect'
import BuyerDashboardRedirect from './pages/BuyerDashboardRedirect'
import SellerMyBusinesses from './pages/SellerMyBusinesses'
import SellerBusinessDetails from './pages/SellerBusinessDetails'
import PublicBusinessDetails from './pages/PublicBusinessDetails'
import PublicBusinessListings from './pages/PublicBusinessListings'
import PublicUserProfile from './pages/PublicUserProfile'
import AIAgent from './pages/AIAgent'
import Checkout from './pages/checkout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'

import AdminSupport from './pages/admin/AdminSupport'
import AdminBusinesses from './pages/admin/AdminBusinesses'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import networkErrorImg from './assets/images/network-error.png'

function App() {
    const location = useLocation();
    const [isOffline, setIsOffline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine === false : false
    );

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Determine if Navbar should be hidden based on current path
    const shouldHideNavbar = () => {
        const path = location.pathname;

        // 1. Post Assets: /post-assets/:businessId
        if (path.startsWith('/post-assets/')) return true;

        // 2. Business Details (Public): /businessdetails/:businessId
        if (path.startsWith('/businessdetails/')) return true;

        // 3. Asset Details (Public): /assets/:id
        if (path.startsWith('/assets/')) return true;

        // 4. User Profile: /user/:userId
        if (path.startsWith('/user/')) return true;

        // 4. My Business Details (Manage Business): /my-businesses/:id
        // We want to hide it for specific businesses but SHOW it for the main list /my-businesses
        // And usually also show for /my-businesses/new if it's a separate creation page, but user asked for "Manage Business"
        // which usually implies an existing ID. Let's start with hiding for ID.
        if (path.startsWith('/my-businesses/') && path !== '/my-businesses/new') return true;

        // 5. Seller Dashboard specific deep routes
        if (path.includes('/dashboard/seller') && (path.includes('/listings/') || path.includes('/analytics/product/'))) {
            return true;
        }

        if (path.includes('/dashboard/intelligence')) {
            return true;
        }

        // 6. Admin Panel
        if (path.startsWith('/admin')) {
            return true;
        }

        return false;
    };

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-black bluish:bg-[#0a0f1d] text-gray-900 dark:text-gray-200 transition-colors duration-300 relative overflow-x-hidden ${(!shouldHideNavbar() && location.pathname !== '/profile') ? 'pt-16' : ''}`}>
            {/* Global Dotted Background */}
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>

            {isOffline && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-white p-4 dark:bg-black bluish:bg-[#0a0f1d]">
                    <div className="w-full max-w-4xl overflow-hidden rounded-[32px] border border-red-500/30 bg-white shadow-2xl dark:bg-zinc-950 bluish:bg-[#09111f]">
                        <div className="grid md:grid-cols-[360px_1fr]">
                            <div className="relative min-h-[280px] border-b border-red-500/20 md:min-h-full md:border-b-0 md:border-r">
                                <div className="absolute inset-0 bg-red-500/5" />
                                <img
                                    src={networkErrorImg}
                                    alt="Network disconnected"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
                                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-red-500">
                                    <WifiOff className="h-5 w-5" />
                                    Network Disconnected
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight text-slate-900 bluish:text-white dark:text-white">
                                        You are offline right now
                                    </h1>
                                    <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 bluish:text-slate-300 dark:text-zinc-300">
                                        Your internet connection is unavailable, so TrustTrade cannot load live data or send requests.
                                        Reconnect to the network and the app will continue working automatically.
                                    </p>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="rounded-xl bg-red-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:bg-red-600 active:scale-95"
                                    >
                                        Try Reconnecting
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!shouldHideNavbar() && <Navbar />}
            <ScrollToTop />
            <ScrollButtons />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/filter" element={<Marketplace />} />
                <Route path="/assets/:id" element={<AssetDetails />} />
                <Route path="/businessdetails/:businessId" element={<PublicBusinessDetails />} />
                <Route path="/businessdetails/:businessId/listings" element={<PublicBusinessListings />} />
                <Route path="/user/:userId" element={<PublicUserProfile />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/agent" element={
                    <ProtectedRoute>
                        <AIAgent />
                    </ProtectedRoute>
                } />
                <Route path="/my-businesses" element={
                    <ProtectedRoute role="seller">
                        <SellerMyBusinesses />
                    </ProtectedRoute>
                } />
                <Route path="/my-businesses/:id" element={
                    <ProtectedRoute role="seller">
                        <SellerBusinessDetails />
                    </ProtectedRoute>
                } />

                {/* Protected Routes */}
                <Route path="/post-asset" element={
                    <ProtectedRoute role="seller">
                        <SellerSelectBusinessPost />
                    </ProtectedRoute>
                } />
                <Route path="/post-assets/:businessId" element={
                    <ProtectedRoute role="seller">
                        <SellerPostAsset />
                    </ProtectedRoute>
                } />
                {/* Unified Dashboard System */}
                <Route path="/dashboard">
                    <Route index element={<Dashboard />} />
                    
                    {/* Unified Activity Hub (Common for both Buyers and Sellers) */}
                    <Route path="buyer" element={
                        <ProtectedRoute role={['buyer', 'seller']}>
                            <BuyerDashboardRedirect />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="buyer/:userId" element={
                        <ProtectedRoute role={['buyer', 'seller']}>
                            <BuyingHub />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="orders" replace />} />
                        <Route path="interest" element={<BuyerInterests />} />
                        <Route path="orders" element={<BuyerOrders />} />
                        <Route path="intelligence" element={<BuyerInsights />} />
                    </Route>

                    {/* Legacy Redirects */}
                    <Route path="interests" element={<Navigate to="/dashboard/buyer" replace />} />
                    <Route path="orders" element={<Navigate to="/dashboard/buyer" replace />} />
                    <Route path="intelligence" element={<Navigate to="/dashboard/buyer" replace />} />

                    {/* Seller Specialized Tools */}
                    <Route path="seller" element={
                        <ProtectedRoute role="seller">
                            <SellerDashboardRedirect />
                        </ProtectedRoute>
                    } />
                    <Route path="seller/select" element={
                        <ProtectedRoute role="seller">
                            <SellerSelectDashboardBusiness />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="seller/:businessId" element={
                        <ProtectedRoute role="seller">
                            <SellerDashboard />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="leads" replace />} />
                        <Route path="leads" element={<SellerLeads />} />
                        <Route path="leads/filter" element={<SellerLeads />} />
                        <Route path="listings" element={<SellerListings />} />
                        <Route path="listings/filter" element={<SellerListings />} />

                        {/* Analytics Routes */}
                        <Route path="analytics" element={<SellerAnalytics />}>
                            <Route index element={<Navigate to="overview/1m" replace />} />
                            <Route path="overview" element={<Navigate to="1m" replace />} />
                            <Route path="overview/:range" element={<SellerAnalyticsOverview />} />
                            <Route path="products" element={<SellerAnalyticsProducts />} />
                            <Route path="product/:assetId/:range?" element={<SellerProductAnalytics />} />
                            <Route path="customers" element={<SellerAnalyticsCustomers />} />
                        </Route>
                    </Route>

                    {/* Specific Asset Details Route (Standalone within Dashboard) */}
                    <Route path="seller/:businessId/listings/:id" element={
                        <ProtectedRoute role="seller">
                            <SellerAssetDetails />
                        </ProtectedRoute>
                    } />

                    {/* Legacy Aliases for Backward Compatibility */}
                    <Route path="buyer/:userId" element={
                        <ProtectedRoute role={['buyer', 'seller']}>
                            <Navigate to="/dashboard/interests" replace />
                        </ProtectedRoute>
                    } />
                    <Route path="buyer/:userId/insights/:range?" element={
                        <ProtectedRoute role={['buyer', 'seller']}>
                            <Navigate to="/dashboard/intelligence" replace />
                        </ProtectedRoute>
                    } />
                </Route>

                <Route path="/checkout" element={<Checkout />} />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/:orderId" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="users/:userId" element={<AdminUsers />} />
                    <Route path="users/:userId/:tab" element={<AdminUsers />} />
                    <Route path="support" element={<AdminSupport />} />
                    <Route path="support/:queryId" element={<AdminSupport />} />
                    <Route path="businesses" element={<AdminBusinesses />} />

                </Route>
            </Routes>
        </div>
    )
}

export default App;
