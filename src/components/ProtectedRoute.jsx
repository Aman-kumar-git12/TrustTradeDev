import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLoader from './shimmers/AppLoader';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <AppLoader />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Support for multiple roles (array or single string)
    if (role) {
        const allowedRoles = Array.isArray(role) ? role : [role];
        if (!allowedRoles.includes(user.role) && user.role !== 'admin') {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
