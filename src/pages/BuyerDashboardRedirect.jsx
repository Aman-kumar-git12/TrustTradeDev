import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BuyerDashboardRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (user) {
        return <Navigate to={`/dashboard/buyer/${user._id}/orders`} replace />;
    }

    return <Navigate to="/login" replace />;
};

export default BuyerDashboardRedirect;
