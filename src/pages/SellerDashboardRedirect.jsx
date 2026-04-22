import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';

const SellerDashboardRedirect = () => {
    const [loading, setLoading] = useState(true);
    const [businessId, setBusinessId] = useState(null);
    const { showSnackbar } = useUI();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const { data } = await api.get('/businesses');
                if (data && data.length > 0) {
                    const lastId = localStorage.getItem('lastBusinessId');
                    const found = lastId ? data.find(b => b._id === lastId) : null;

                    if (found) {
                        setBusinessId(found._id);
                    } else {
                        setBusinessId(data[0]._id);
                    }
                } else {
                    // No businesses found, maybe redirect to create business or stay here with a message?
                    // For now, let's keep the user here to see the empty state or 'Create Business' prompt
                    // Actually, SelectDashboardBusiness handles the "No businesses" case nicely.
                    // If no businesses, we should probably stick to SelectDashboardBusiness or render a "Create Business" view.
                    // Let's decide: If no businesses, navigate to SelectDashboardBusiness (which we might rename to SellerHome).
                    // Or simply return null and let the component render a redirect to a specific 'create' page.

                    // Actually, if we use this component as the element for "/dashboard/seller", 
                    // we can just render the 'SelectDashboardBusiness' component if no auto-redirect happens?
                    // But 'SelectDashboardBusiness' is designed to list businesses.
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch businesses", error);
                showSnackbar("Failed to load dashboard", "error");
                setLoading(false);
            }
        };
        fetchBusinesses();
    }, []);

    if (businessId) {
        return <Navigate to={`/dashboard/seller/${businessId}/leads`} replace />;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Fallback: If no business found, go to the selection/creation page
    // We can import SelectDashboardBusiness here or just navigate to a routed path if we kept it.
    // Let's assume we reuse the existing SelectDashboardBusiness for the "Empty" state.
    return <Navigate to="/dashboard/seller/select" replace />;
};

export default SellerDashboardRedirect;
