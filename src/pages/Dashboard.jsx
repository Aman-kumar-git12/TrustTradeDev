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
            // Admins go to the specialized Admin Panel
            return <Navigate to="/admin" replace />;
        case 'seller':
            // Sellers go to the seller dashboard (which handles business selection)
            return <Navigate to="/dashboard/seller" replace />;
        case 'buyer':
            // Buyers go to their specific buyer dashboard
            return <Navigate to={`/dashboard/buyer/${user._id}`} replace />;
        default:
            return <Navigate to="/home" replace />;
    }
};

export default Dashboard;
