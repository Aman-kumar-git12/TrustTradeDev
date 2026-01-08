import { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LeadFilter from '../components/LeadFilter';

const SellerLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Use context from SellerDashboard
    const { isFilterOpen, businessId } = useOutletContext();

    const [filters, setFilters] = useState({
        search: '',
        status: ''
    });

    const fetchLeads = async () => {
        if (!businessId) return;
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);

            const { data } = await api.get(`/dashboard/business/${businessId}/leads?${params.toString()}`);
            setLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Apply just re-fetches
    const handleApplyFilters = () => {
        fetchLeads();
    };


    useEffect(() => {
        // Initial fetch
        fetchLeads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessId]);

    const handleClearFilters = () => {
        setFilters({ search: '', status: '' });
        // We trigger reset immediately
        api.get(`/dashboard/business/${businessId}/leads`).then(res => setLeads(res.data));
    };

    // Auto-clear filters when sidebar is closed
    useEffect(() => {
        if (!isFilterOpen) {
            handleClearFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFilterOpen]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/interests/${id}/status`, { status });
            // Optimistic update
            setLeads(leads.map(l => l._id === id ? { ...l, status } : l));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading && leads.length === 0) return <div className="text-center py-12">Loading Leads...</div>;

    return (
        <div>
            {/* Local filter button removed, now in Dashboard layout */}

            <div className="flex flex-col md:flex-row-reverse gap-8 align-top">
                {/* Filter Sidebar */}
                {isFilterOpen && (
                    <div className="w-full md:w-1/4 flex-shrink-0 transition-all duration-300 ease-in-out block">
                        <LeadFilter
                            filters={filters}
                            onFilterChange={setFilters}
                            onClear={handleClearFilters}
                            onApply={handleApplyFilters}
                            onClose={() => navigate(`/dashboard/seller/${businessId}/leads`)}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-3 animate-fade-in flex-grow transition-all duration-300">
                    {/* Header Row (Optional, good for table-like feel) */}
                    {leads.length > 0 && (
                        <div className="hidden md:grid md:grid-cols-[1.4fr_1.8fr_1fr_1.2fr_0.4fr] px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <div>Asset</div>
                            <div>Buyer</div>
                            <div>Status</div>
                            <div>Date</div>
                            <div className="text-right">Actions</div>
                        </div>
                    )}

                    {leads.map(lead => (
                        <LeadRow
                            key={lead._id}
                            lead={lead}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))}

                    {leads.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <span className="text-2xl">📭</span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900">No leads found</h3>
                            <p className="text-gray-500 text-xs mt-1">
                                {filters.status || filters.search ? 'Try adjusting your filters.' : 'Leads will appear here.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Extracted Component for Expandable Row to manage local 'expanded' state cleanly
const LeadRow = ({ lead, onStatusUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`bg-white rounded-lg border transition-all duration-200 overflow-hidden ${isExpanded ? 'shadow-md border-primary/30 ring-1 ring-primary/10' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>
            {/* Main Compact Row - Using Grid for alignment */}
            <div
                className="p-3 grid grid-cols-1 md:grid-cols-[1.4fr_1.8fr_1fr_1.2fr_0.4fr] gap-3 md:items-center cursor-pointer group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Asset Info */}
                <div className="flex items-center min-w-0">
                    <div className={`mr-3 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                    <div className="min-w-0 overflow-hidden">
                        <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-primary transition-colors" title={lead.asset.title}>{lead.asset.title}</h4>
                        <span className="text-xs text-xs text-gray-400 md:hidden">{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Buyer Info */}
                <div className="flex items-center space-x-2 overflow-hidden min-w-0">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                        {lead.buyer?.fullName?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{lead.buyer?.fullName || 'Unknown Buyer'}</p>
                        <p className="text-[10px] text-gray-400 truncate">{lead.buyer?.companyName || 'No Company'}</p>
                    </div>
                </div>

                {/* Status Badge */}
                <div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wide inline-flex items-center ${lead.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        lead.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                            lead.status === 'negotiating' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {lead.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>}
                        {lead.status}
                    </span>
                </div>

                {/* Date (Desktop) */}
                <div className="hidden md:block text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {(lead.status === 'pending' || lead.status === 'negotiating') ? (
                        <>
                            <button
                                onClick={() => onStatusUpdate(lead._id, 'accepted')}
                                title="Accept"
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            </button>
                            <button
                                onClick={() => onStatusUpdate(lead._id, 'rejected')}
                                title="Reject"
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </>
                    ) : (
                        <div className="text-[10px] font-bold text-gray-300">
                            {lead.status === 'accepted' ? 'ACCEPTED' : 'REJECTED'}
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="bg-slate-50 border-t border-gray-100 p-4 animate-slide-down">
                    {/* Full Asset Title (Visible on Expand) */}
                    <div className="mb-4 pb-2 border-b border-gray-200">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Asset</span>
                        <span className="font-bold text-gray-900 text-base">{lead.asset.title}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Contact Info */}
                        <div className="text-sm space-y-2">
                            <h5 className="text-xs font-bold text-gray-400 uppercase">Contact Info</h5>
                            <div className="flex items-center text-blue-600 text-sm">
                                <span className="font-bold mr-2 w-16">Email:</span>
                                <a href={`mailto:${lead.buyer?.email}`} className="font-medium hover:underline truncate">{lead.buyer?.email}</a>
                            </div>
                            <div className="flex items-center text-blue-600 text-sm">
                                <span className="font-bold mr-2 w-16">Contact:</span>
                                <span className="font-medium">{lead.buyer?.phone || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Full Message */}
                        <div className="md:col-span-2">
                            <h5 className="text-xs font-bold text-gray-400 uppercase mb-1">Message</h5>
                            <p className="text-sm text-gray-600 italic bg-white p-3 rounded border border-gray-200">
                                "{lead.message || 'No message provided.'}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerLeads;
