import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle2, Factory, Users, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';

const Landing = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/home');
        }
    }, [user, loading, navigate]);

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1d] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Hero Section - Full Background */}
            <div className="relative min-h-screen flex flex-col">
                {/* Background Image with Slow Pan/Zoom */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.img
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.1 }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop"
                        alt="Industrial Warehouse"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d]/80 via-[#0a0f1d]/50 to-[#0a0f1d] z-0"></div>
                </div>

                {/* Navbar Spacer */}
                <div className="h-16"></div>

                {/* Hero Content */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 -mt-20"
                >
                    <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-2xl">
                        Buy & Sell Business Assets.<br />
                        <span className="text-blue-500 inline-block">Negotiate. Close Deals.</span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
                        A professional marketplace where companies list real inventory and buyers negotiate directly — no fixed prices, only real deals.
                    </motion.p>
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto justify-center">
                        {user ? (
                            <Link to="/home" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center hover:scale-105 active:scale-95">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/register?role=seller" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center hover:scale-105 active:scale-95">
                                Start Selling
                            </Link>
                        )}
                        <Link to="/register?role=buyer" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-lg font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center hover:scale-105 active:scale-95">
                            Start Buying
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Feature Cards - Floating */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-16 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="grid md:grid-cols-3 gap-6"
                    >
                        <Tilt options={{ max: 15, scale: 1.02, speed: 400, glare: true, 'max-glare': 0.1 }}>
                            <FeatureBox
                                icon={<Factory className="text-blue-400 w-8 h-8" />}
                                title="Sell Real Business Inventory"
                                desc="Hardware, bulk stock, machines, office equipment."
                            />
                        </Tilt>
                        <Tilt options={{ max: 15, scale: 1.02, speed: 400, glare: true, 'max-glare': 0.1 }}>
                            <FeatureBox
                                icon={<Users className="text-blue-400 w-8 h-8" />}
                                title="Live Negotiations"
                                desc="Send offers. Counter. Make real deals."
                            />
                        </Tilt>
                        <Tilt options={{ max: 15, scale: 1.02, speed: 400, glare: true, 'max-glare': 0.1 }}>
                            <FeatureBox
                                icon={<ShieldCheck className="text-blue-400 w-8 h-8" />}
                                title="Verified Companies"
                                desc="Only registered businesses. No random buyers."
                            />
                        </Tilt>
                    </motion.div>
                </div>
            </div>

            {/* How It Works Section */}
            <section className="py-24 relative z-10 bg-[#0a0f1d]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="flex items-center justify-center mb-12"
                    >
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-700"></div>
                        <h2 className="text-3xl font-bold px-6 text-gray-200 uppercase tracking-wider">How it works</h2>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-700"></div>
                    </motion.div>

                    {/* Interactive Liquid Money Flow */}
                    <LiquidFlow steps={[
                        { num: "01", title: "Seller lists assets", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" },
                        { num: "02", title: "Buyer sends offer", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop" },
                        { num: "03", title: "Negotiation happens", img: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2664&auto=format&fit=crop" },
                        { num: "04", title: "Deal closes & payment", img: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2574&auto=format&fit=crop" }
                    ]} />
                </div>
            </section>


            {/* Split Section: Sellers vs Buyers */}
            < section className="py-12 bg-[#0a0f1d] border-t border-white/5" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Sellers Card */}
                        <Tilt options={{ max: 5, scale: 1.01, speed: 1000, glare: true, 'max-glare': 0.05 }} className="h-full">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative group h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f1629] p-8 md:p-12 hover:border-blue-500/30 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                                <h3 className="text-2xl font-bold mb-2">For Sellers</h3>
                                <p className="text-gray-400 mb-6 border-b border-white/10 pb-4">Turn idle assets into revenue</p>
                                <ul className="space-y-3 mb-8">
                                    <ListItem text="Sell excess inventory" />
                                    <ListItem text="Sell used equipment" />
                                    <ListItem text="Find bulk buyers" />
                                </ul>
                                <Link to="/register?role=seller" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">
                                    Start Selling
                                </Link>
                            </motion.div>
                        </Tilt>

                        {/* Buyers Card */}
                        <Tilt options={{ max: 5, scale: 1.01, speed: 1000, glare: true, 'max-glare': 0.05 }} className="h-full">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative group h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f1629] p-8 md:p-12 hover:border-blue-500/30 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                                <h3 className="text-2xl font-bold mb-2">For Buyers</h3>
                                <p className="text-gray-400 mb-6 border-b border-white/10 pb-4">Find deals you won&apos;t get on Amazon</p>
                                <ul className="space-y-3 mb-8">
                                    <ListItem text="Buy in bulk" />
                                    <ListItem text="Negotiate prices" />
                                    <ListItem text="Verified business assets" />
                                </ul>
                                <Link to="/register?role=buyer" className="inline-block px-6 py-3 bg-[#1e293b] hover:bg-[#283548] text-white border border-white/10 rounded-lg font-bold transition-colors">
                                    Start Buying
                                </Link>
                            </motion.div>
                        </Tilt>
                    </div>
                </div>
            </section >

            {/* Business Model / Pricing */}
            < section className="py-24 bg-[#0a0f1d] relative" >
                {/* Glow Effect */}
                < div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" ></div >

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="h-px w-12 bg-gray-700"></div>
                            <h2 className="text-2xl font-bold text-gray-200">Our Business Model</h2>
                            <div className="h-px w-12 bg-gray-700"></div>
                        </div>
                        <p className="text-gray-400 mb-12">We only earn when a deal closes successfully.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Tilt options={{ max: 15, scale: 1.05, speed: 400 }}>
                            <PriceCard title="Listing" price="Free" />
                        </Tilt>
                        <Tilt options={{ max: 15, scale: 1.05, speed: 400 }}>
                            <PriceCard title="Negotiation" price="Free" />
                        </Tilt>
                        <Tilt options={{ max: 20, scale: 1.1, speed: 400, glare: true }}>
                            <PriceCard title="Deal Closed" price="Platform Fee" highlight />
                        </Tilt>
                    </div>

                    <div className="mt-20 pt-12 border-t border-white/5">
                        <h2 className="text-3xl font-bold mb-8">Ready to make real business deals?</h2>
                        <div className="flex justify-center gap-4">
                            <Link to="/register?role=seller" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20">
                                Start Selling
                            </Link>
                            <Link to="/register?role=buyer" className="px-8 py-3 bg-[#1e293b] hover:bg-[#283548] text-white border border-white/10 rounded-lg font-bold transition-all hover:scale-105 active:scale-95">
                                Start Buying
                            </Link>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
};

// UI Components
const FeatureBox = ({ icon, title, desc }) => (
    <div className="bg-[#131b2e]/80 backdrop-blur-md border border-white/10 p-6 rounded-xl hover:bg-[#1a243a] transition-colors group h-full">
        <div className="mb-4 bg-blue-600/10 w-fit p-3 rounded-lg group-hover:bg-blue-600/20 transition-colors">
            {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

const StepCard = ({ num, title, img, active, completed, progress }) => (
    <div className={`group relative rounded-2xl overflow-hidden h-96 bg-[#131b2e] shadow-2xl transition-all duration-500 ${active ? 'ring-2 ring-blue-500/50' : 'border border-gray-800'}`}>
        {active && (
            <div className="absolute inset-0 rounded-2xl border-4 border-blue-500/30 animate-ping opacity-20 pointer-events-none"></div>
        )}
        <div className="absolute inset-0">
            <img
                src={img}
                alt={title}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${active ? 'scale-110 grayscale-0' : 'scale-100 grayscale-[50%]'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/80 to-transparent opacity-90"></div>
        </div>
        <motion.div className="absolute top-4 right-4 z-20 w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)] border border-white/30"
            initial={{ opacity: 0, scale: 0, y: -20 }}
            animate={completed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <CheckCircle2 className="w-4 h-4 text-white" />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end h-full">
            <span className={`text-5xl font-black mb-2 transition-all duration-500 block ${active ? 'text-blue-500 translate-x-2 scale-110' : 'text-white/10'}`}>
                {num}
            </span>
            <h3 className={`text-xl font-bold leading-tight mb-2 transition-colors duration-300 ${active ? 'text-white' : 'text-gray-400'}`}>
                {title}
            </h3>
            <p className={`text-sm text-gray-400 leading-relaxed transition-all duration-500 ${active ? 'opacity-100 max-h-20 translate-y-0' : 'opacity-0 max-h-0 translate-y-4'}`}>
                Everything connects in the {title} phase.
            </p>
            <div className={`mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden transition-opacity duration-300 ${active || completed ? 'opacity-100' : 'opacity-0'}`}>
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${progress}%`, transition: active ? 'none' : 'width 0.4s ease' }}
                ></div>
            </div>
        </div>
    </div>
);

const ListItem = ({ text }) => (
    <li className="flex items-center text-gray-300 text-sm">
        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-3" />
        {text}
    </li>
);

const PriceCard = ({ title, price, highlight }) => (
    <div className={`p-6 rounded-xl border ${highlight ? 'border-blue-500/50 bg-blue-900/10 shadow-blue-500/20 shadow-lg' : 'border-white/5 bg-[#131b2e]'} flex flex-col items-center justify-center min-h-[140px] h-full transition-colors`}>
        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">{title}</h4>
        <div className={`text-2xl font-bold ${highlight ? 'text-blue-400' : 'text-white'}`}>{price}</div>
    </div>
);

// Sequential Progress Animation Component
const LiquidFlow = ({ steps }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const stepDuration = 3500;
    const updateInterval = 30;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + (updateInterval / stepDuration) * 100;
                if (newProgress >= 100) {
                    setCurrentStep(curr => (curr + 1) % steps.length);
                    return 0;
                }
                return newProgress;
            });
        }, updateInterval);
        return () => clearInterval(interval);
    }, [steps.length]);

    const handleStepClick = (index) => {
        setCurrentStep(index);
        setProgress(0);
    };

    return (
        <div className="relative">
            <div className="grid md:grid-cols-4 gap-6 relative z-10 text-left">
                {steps.map((step, index) => {
                    const isActive = currentStep === index;
                    const isPast = index < currentStep;

                    return (
                        <motion.div
                            key={index}
                            className="relative cursor-pointer"
                            onClick={() => handleStepClick(index)}
                            initial={false}
                            animate={{
                                scale: isActive ? 1.05 : isPast ? 0.98 : 0.95,
                                opacity: isActive ? 1 : isPast ? 0.8 : 0.6,
                                y: isActive ? -10 : 0
                            }}
                            transition={{ duration: 0.4 }}
                        >
                            <StepCard
                                {...step}
                                active={isActive}
                                completed={isPast}
                                progress={isActive ? progress : isPast ? 100 : 0}
                            />
                        </motion.div>
                    );
                })}
            </div>
            <div className="relative mt-12 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>
    );
};

export default Landing;
