import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    if (hasError) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 text-gray-400 dark:text-zinc-600 ${className}`}>
                <span className="text-xs">Failed to load</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 ${className}`}>
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={handleLoad}
                onError={handleError}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
                {...props}
            />
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-700 bluish:bg-white/10 animate-pulse" />
            )}
        </div>
    );
};

export default React.memo(OptimizedImage);
