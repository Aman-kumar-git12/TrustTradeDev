import { motion } from 'framer-motion';

const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#050505] bluish:bg-[#0a0f1d] overflow-hidden">
            {/* Background Dotted Pattern (Matches App.jsx) */}
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none"></div>

            {/* Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 dark:bg-emerald-600/10 bluish:bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 dark:bg-emerald-600/10 bluish:bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Pulse Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: [0.8, 1.1, 1],
                        opacity: 1
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "easeOut",
                    }}
                    className="mb-8"
                >
                    <div className="h-20 w-20 rounded-2xl bg-blue-600 dark:bg-emerald-500 bluish:bg-blue-600 flex items-center justify-center shadow-[0_0_40px_-5px_rgba(59,130,246,0.6)] dark:shadow-[0_0_40px_-5px_rgba(16,185,129,0.4)]">
                        <span className="text-4xl font-black text-white">T</span>
                    </div>
                </motion.div>

                {/* Brand Name with Staggered Text Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-3xl font-extrabold tracking-tighter text-gray-900 dark:text-white bluish:text-white mb-2">
                        Trust<span className="text-blue-600 dark:text-emerald-500 bluish:text-blue-500">Trade</span>
                    </h1>
                    <div className="flex items-center gap-1.5 justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-emerald-500 bluish:bg-blue-500 animate-pulse"></div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 bluish:text-gray-400 uppercase tracking-[0.2em]">
                            Initializing Secure Portal
                        </p>
                    </div>
                </motion.div>

                {/* Progress Bar Loader */}
                <div className="mt-12 w-48 h-1 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                        className="h-full w-full bg-gradient-to-r from-transparent via-blue-600 dark:via-emerald-500 bluish:via-blue-500 to-transparent"
                    />
                </div>
            </div>

            {/* Quote or Status (Optional but adds premium feel) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 text-[10px] font-medium text-gray-400 dark:text-zinc-600 bluish:text-white/20 uppercase tracking-widest"
            >
                AI Powered Business Exchange
            </motion.div>
        </div>
    );
};

export default SplashScreen;
