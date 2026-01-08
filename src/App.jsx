import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Marketplace from './pages/Marketplace'
import AssetDetails from './pages/AssetDetails'
import PostAsset from './pages/PostAsset'
import SellerDashboard from './pages/SellerDashboard'
import SellerLeads from './pages/SellerLeads'
import SellerListings from './pages/SellerListings'
import SellerAssetDetails from './pages/SellerAssetDetails'
import SellerOverview from './pages/SellerOverview'
import BuyerDashboard from './pages/BuyerDashboard'
import Profile from './pages/Profile'
import SelectBusinessPost from './pages/SelectBusinessPost'
import SelectDashboardBusiness from './pages/SelectDashboardBusiness'
import DashboardRedirect from './pages/DashboardRedirect'
import MyBusinesses from './pages/MyBusinesses'
import BusinessDetails from './pages/BusinessDetails'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/filter" element={<Marketplace />} />
                <Route path="/assets/:id" element={<AssetDetails />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/my-businesses" element={
                    <ProtectedRoute role="seller">
                        <MyBusinesses />
                    </ProtectedRoute>
                } />
                <Route path="/my-businesses/:id" element={
                    <ProtectedRoute role="seller">
                        <BusinessDetails />
                    </ProtectedRoute>
                } />

                {/* Protected Routes */}
                <Route path="/post-asset" element={
                    <ProtectedRoute role="seller">
                        <SelectBusinessPost />
                    </ProtectedRoute>
                } />
                <Route path="/post-assets/:businessId" element={
                    <ProtectedRoute role="seller">
                        <PostAsset />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/seller" element={
                    <ProtectedRoute role="seller">
                        <DashboardRedirect />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/seller/select" element={
                    <ProtectedRoute role="seller">
                        <SelectDashboardBusiness />
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
                    <Route path="overview" element={<SellerOverview />} />
                </Route>
                {/* Specific Asset Details Route (Standalone) */}
                <Route path="/dashboard/seller/:businessId/listings/:id" element={
                    <ProtectedRoute role="seller">
                        <SellerAssetDetails />
                    </ProtectedRoute>
                } />
                <Route path="/dashboard/buyer" element={
                    <ProtectedRoute role="buyer">
                        <BuyerDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    )
}

export default App
