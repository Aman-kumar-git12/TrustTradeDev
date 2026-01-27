import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, MapPin } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const AssetCard = React.forwardRef(({ asset }, ref) => {
    const mainImage = asset.images && asset.images.length > 0 ? asset.images[0] : null;

    return (
        <Link ref={ref} to={`/assets/${asset._id}`} className="group opacity-100 bg-white dark:bg-zinc-900 bluish:bg-[#131b2e] rounded-xl border border-gray-200 dark:border-zinc-800 bluish:border-white/10 overflow-hidden hover:shadow-lg dark:hover:border-blue-500/50 bluish:hover:border-blue-500/50 bluish:hover:shadow-blue-500/10 transition-all h-full flex flex-col relative hover:-translate-y-2 transform-gpu">
            <div className="h-48 bg-gray-200 dark:bg-zinc-800 bluish:bg-[#0a0f1d] relative overflow-hidden">
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

                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 bluish:bg-[#0a0f1d] px-3 py-1 rounded-full bluish:rounded-lg text-sm font-bold text-gray-900 dark:text-white bluish:text-white shadow-sm bluish:shadow-lg bluish:border bluish:border-white/10 z-10">
                    ${asset.price.toLocaleString()}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-blue-600 dark:text-emerald-400 bluish:text-white font-bold uppercase tracking-wider mb-2 bluish:bg-blue-600 bluish:px-2.5 bluish:py-1 bluish:rounded-md bluish:w-fit bluish:shadow-md">
                    <Tag size={12} className="mr-1" /> {asset.category}
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 bluish:text-gray-300 mb-1 truncate">
                    {asset.business?.businessName || asset.seller?.companyName || asset.seller?.fullName}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-400 transition-colors line-clamp-1">{asset.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 bluish:text-gray-400 text-sm truncate mb-4 flex-grow font-light leading-relaxed">{asset.description}</p>

                <div className="flex items-center text-gray-500 dark:text-gray-500 bluish:text-gray-500 text-sm border-t border-gray-100 dark:border-zinc-800 bluish:border-white/5 pt-4 mt-auto">
                    <MapPin size={16} className="mr-1 bluish:text-blue-500" /> {asset.location}
                </div>
            </div>
        </Link>
    );
});

export default React.memo(AssetCard);
