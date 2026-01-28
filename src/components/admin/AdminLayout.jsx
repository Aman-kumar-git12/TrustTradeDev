import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0a0a0a] bluish:bg-[#0a0f1d] text-gray-900 dark:text-gray-100 transition-colors">
            <AdminSidebar />
            <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
