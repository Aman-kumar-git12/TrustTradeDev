import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import Profile from './pages/Profile'
import BuyerInsights from './pages/BuyerInsights'
import SellerSelectBusinessPost from './pages/SellerSelectBusinessPost'
import SellerSelectDashboardBusiness from './pages/SellerSelectDashboardBusiness'
import SellerDashboardRedirect from './pages/SellerDashboardRedirect'
import SellerMyBusinesses from './pages/SellerMyBusinesses'
import SellerBusinessDetails from './pages/SellerBusinessDetails'
import PublicBusinessDetails from './pages/PublicBusinessDetails'
import PublicBusinessListings from './pages/PublicBusinessListings'
import PublicUserProfile from './pages/PublicUserProfile'
import Checkout from './pages/checkout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'

import AdminSupport from './pages/admin/AdminSupport'
import AdminBusinesses from './pages/admin/AdminBusinesses'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

function App() {
    const location = useLocation();

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

        if (path.includes('/dashboard/buyer/insights')) {
            return true;
        }

        // 6. Admin Panel
        if (path.startsWith('/admin')) {
            return true;
        }

        return false;
    };

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-black bluish:bg-[#0a0f1d] text-gray-900 dark:text-gray-200 transition-colors duration-300 relative overflow-x-hidden ${!shouldHideNavbar() ? 'pt-16' : ''}`}>
            {/* Global Dotted Background */}
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>

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
                <Route path="/dashboard/seller" element={
                    <ProtectedRoute role="seller">
                        <SellerDashboardRedirect />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/seller/select" element={
                    <ProtectedRoute role="seller">
                        <SellerSelectDashboardBusiness />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/dashboard/seller/:user_id" element={
                    <ProtectedRoute role="seller">
                        <SellerDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/dashboard/seller/:businessId" element={
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
                {/* Specific Asset Details Route (Standalone) */}
                <Route path="/dashboard/seller/:businessId/listings/:id" element={
                    <ProtectedRoute role="seller">
                        <SellerAssetDetails />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/buyer/:userId" element={
                    <ProtectedRoute role="buyer">
                        <BuyerDashboard />
                    </ProtectedRoute>
                }>
                    <Route path="filter" element={<div />} />
                </Route>
                <Route path="/dashboard/buyer/:userId/insights/:range?" element={
                    <ProtectedRoute role="buyer">
                        <BuyerInsights />
                    </ProtectedRoute>
                } />
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
