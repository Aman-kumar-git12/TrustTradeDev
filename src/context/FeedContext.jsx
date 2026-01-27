import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const FeedContext = createContext();

export const useFeed = () => {
    return useContext(FeedContext);
};

export const FeedProvider = ({ children }) => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: ''
    });

    const fetchAssets = useCallback(async (activeFilters = filters, pageNum = 1) => {
        if (pageNum === 1) setLoading(true);
        else setIsFetchingMore(true);

        try {
            // Build query string
            const params = new URLSearchParams();
            params.append('page', pageNum);
            params.append('limit', 12);

            if (activeFilters.search) params.append('search', activeFilters.search);
            if (activeFilters.category) params.append('category', activeFilters.category);
            if (activeFilters.minPrice) params.append('minPrice', activeFilters.minPrice);
            if (activeFilters.maxPrice) params.append('maxPrice', activeFilters.maxPrice);
            if (activeFilters.condition) params.append('condition', activeFilters.condition);
            params.append('_t', Date.now()); // Prevent caching

            const { data } = await api.get(`/assets?${params.toString()}`);

            // Handle both new pagination format ({ assets: [...] }) and old format ([...])
            const fetchedAssets = Array.isArray(data) ? data : (data.assets || []);
            const totalPages = data.pages || 1;
            const currentPage = data.page || 1;

            if (pageNum === 1) {
                setAssets(fetchedAssets);
            } else {
                setAssets(prev => [...prev, ...fetchedAssets]);
            }

            setHasMore(currentPage < totalPages);
            setPage(pageNum);

        } catch (error) {
            console.error("Failed to fetch assets", error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [filters]);

    // Initial load only if empty? Or always rely on component trigger?
    // We want to PERSIST. So we should NOT auto-fetch if we already have data, 
    // UNLESS filters changed. 
    // Actually, simpler approach: Expose fetchAssets and let Marketplace call it on mount IF empty.

    const refreshFeed = () => {
        setPage(1);
        fetchAssets(filters, 1);
    };

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        // When filters change, we usually want to trigger a fetch immediately
        // But let's leave that orchestration to the component or do it here.
        // Doing it here is safer for consistency.
    };

    const clearFilters = () => {
        const emptyFilters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: ''
        };
        setFilters(emptyFilters);
        setPage(1);
        fetchAssets(emptyFilters, 1);
    };

    const loadMore = () => {
        if (!loading && !isFetchingMore && hasMore) {
            fetchAssets(filters, page + 1);
        }
    };

    return (
        <FeedContext.Provider value={{
            assets,
            loading,
            isFetchingMore,
            hasMore,
            filters,
            updateFilters,
            clearFilters,
            refreshFeed,
            fetchAssets,
            loadMore
        }}>
            {children}
        </FeedContext.Provider>
    );
};
