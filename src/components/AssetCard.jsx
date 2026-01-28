import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, MapPin } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const AssetCard = React.forwardRef(({ asset }, ref) => {
    const mainImage = asset.images && asset.images.length > 0 ? asset.images[0] : null;

    return (
        <Link ref={ref} to={`/assets/${asset._id}`} className="group opacity-100 bg-white dark:bg-zinc-900 bluish:bg-[#131b2e] rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 overflow-hidden hover:shadow-lg dark:hover:border-blue-500/50 bluish:hover:border-blue-500/50 bluish:hover:shadow-blue-500/10 transition-all h-full flex flex-col relative hover:-translate-y-1 sm:hover:-translate-y-2 transform-gpu">
            <div className="h-32 sm:h-48 bg-gray-200 dark:bg-zinc-800 bluish:bg-[#0a0f1d] relative overflow-hidden">
                {mainImage ? (
                    <OptimizedImage
                        src={mainImage}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bluish:opacity-90 bluish:group-hover:opacity-100"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-zinc-600 bluish:bg-[#0f1629]">No Image</div>
                )}

                {/* Bluish Theme Overlays - Reduced for performance */}
                <div className="hidden bluish:block absolute inset-0 bg-gradient-to-t from-[#131b2e] via-transparent to-transparent opacity-40 pointer-events-none"></div>

                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 dark:bg-black/80 bluish:bg-[#0a0f1d] px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-full bluish:rounded-lg text-xs sm:text-sm font-bold text-gray-900 dark:text-white bluish:text-white shadow-sm bluish:shadow-lg bluish:border bluish:border-white/10 z-10">
                    ${asset.price.toLocaleString()}
                </div>
            </div>

            <div className="p-3 sm:p-6 flex flex-col flex-grow">
                <div className="flex items-center text-[10px] sm:text-xs text-blue-600 dark:text-emerald-400 bluish:text-white font-bold uppercase tracking-wider mb-1 sm:mb-2 bluish:bg-blue-600 bluish:px-2.5 bluish:py-1 bluish:rounded-md bluish:w-fit bluish:shadow-md">
                    <Tag size={10} className="mr-1 sm:hidden" /> <Tag size={12} className="mr-1 hidden sm:inline" /> {asset.category}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 bluish:text-gray-300 mb-0.5 sm:mb-1 truncate">
                    {asset.business?.businessName || asset.seller?.companyName || asset.seller?.fullName}
                </div>
                <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-1 sm:mb-2 group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-400 transition-colors line-clamp-2 sm:line-clamp-1 leading-tight">{asset.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 bluish:text-gray-400 text-xs sm:text-sm truncate mb-2 sm:mb-4 flex-grow font-light leading-relaxed hidden sm:block">{asset.description}</p>
                {/* Mobile description: Show limited text or just hide on very small screens if needed, but keeping hidden sm:block above keeps mobile clean */}

                <div className="flex items-center text-gray-500 dark:text-gray-500 bluish:text-gray-500 text-[10px] sm:text-sm border-t border-gray-100 dark:border-zinc-800 bluish:border-white/5 pt-2 sm:pt-4 mt-auto">
                    <MapPin size={12} className="mr-1 sm:hidden bluish:text-blue-500" /> <MapPin size={16} className="mr-1 hidden sm:inline bluish:text-blue-500" /> <span className="truncate">{asset.location}</span>
                </div>
            </div>
        </Link >
    );
});

export default React.memo(AssetCard);
