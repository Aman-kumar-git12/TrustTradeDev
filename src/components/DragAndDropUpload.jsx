import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

const DragAndDropUpload = ({ 
    onFilesSelected, 
    loading, 
    multiple = false, 
    children, 
    className = '',
    activeClassName = 'ring-4 ring-blue-500/20 border-blue-500 bg-blue-50/30 dark:bg-blue-500/10',
    accept = 'image/*',
    showOverlay = true
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!loading) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Only stop dragging if we're actually leaving the component (not just a child)
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (loading) return;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
    };

    const handleClick = () => {
        if (!loading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
        // Reset input so the same file can be selected again if needed
        e.target.value = '';
    };

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative group ${className} cursor-pointer transition-all duration-300 ${isDragging ? activeClassName : ''} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={accept}
                multiple={multiple}
                onChange={handleFileInputChange}
            />
            
            {/* Base Content */}
            <div className={`w-full h-full transition-opacity duration-300 ${isDragging && showOverlay ? 'opacity-20 blur-[1px]' : 'opacity-100'}`}>
                {children}
            </div>

            {/* Drop Overlay */}
            {isDragging && showOverlay && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-blue-50/40 dark:bg-blue-900/20 backdrop-blur-[2px] rounded-inherit animate-in zoom-in-95 duration-200 ring-2 ring-blue-500 ring-inset">
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-xl shadow-blue-500/20 flex flex-col items-center">
                        <UploadCloud size={32} className="text-blue-500 animate-bounce mb-2" />
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Drop to Upload</span>
                    </div>
                </div>
            )}
            
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-40 bg-white/20 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center rounded-inherit">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default DragAndDropUpload;
