import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLoader from '../components/shimmers/AppLoader';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <AppLoader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based redirection
    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin" replace />;
        case 'seller':
            // Sellers go to the Seller Command Center (Hub)
            return <Navigate to="/dashboard/seller" replace />;
        case 'buyer':
            // Buyers go to the unified buying hub
            return <Navigate to="/dashboard/buyer" replace />;
        default:
            return <Navigate to="/home" replace />;
    }
};

export default Dashboard;
