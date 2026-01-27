import { createContext, useContext, useState } from 'react';

const MarketplaceContext = createContext();

export const useMarketplace = () => {
    return useContext(MarketplaceContext);
};

export const MarketplaceProvider = ({ children }) => {
    const [assets, setAssets] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: ''
    });

    // Reset function for when we specifically want to clear (e.g., manual refresh button, though mostly browser refresh handles this)
    const clearMarketplaceState = () => {
        setAssets([]);
        setHasMore(true);
        setScrollPosition(0);
        setFilters({
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: ''
        });
    };

    return (
        <MarketplaceContext.Provider value={{
            assets, setAssets,
            hasMore, setHasMore,
            scrollPosition, setScrollPosition,
            filters, setFilters,
            clearMarketplaceState
        }}>
            {children}
        </MarketplaceContext.Provider>
    );
};
