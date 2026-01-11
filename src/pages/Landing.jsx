import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Factory, Users, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#0a0f1d] text-white font-sans selection:bg-blue-500/30">
            {/* Hero Section - Full Background */}
            <div className="relative min-h-screen flex flex-col">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop"
                        alt="Industrial Warehouse"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d]/80 via-[#0a0f1d]/50 to-[#0a0f1d] z-0"></div>
                </div>

                {/* Navbar Spacer */}
                <div className="h-16"></div>

                {/* Hero Content */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 -mt-20">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-2xl">
                        Buy & Sell Business Assets.<br />
                        <span className="text-blue-500">Negotiate. Close Deals.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
                        A professional marketplace where companies list real inventory and buyers negotiate directly — no fixed prices, only real deals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto justify-center">
                        {user ? (
                            <Link to="/home" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/register?role=seller" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center">
                                Start Selling
                            </Link>
                        )}
                        <Link to="/register?role=buyer" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-lg font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center">
                            Start Buying
                        </Link>
                    </div>
                </div>

                {/* Feature Cards - Floating */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-16 md:mt-0">
                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureBox
                            icon={<Factory className="text-blue-400 w-8 h-8" />}
                            title="Sell Real Business Inventory"
                            desc="Hardware, bulk stock, machines, office equipment."
                        />
                        <FeatureBox
                            icon={<Users className="text-blue-400 w-8 h-8" />}
                            title="Live Negotiations"
                            desc="Send offers. Counter. Make real deals."
                        />
                        <FeatureBox
                            icon={<ShieldCheck className="text-blue-400 w-8 h-8" />}
                            title="Verified Companies"
                            desc="Only registered businesses. No random buyers."
                        />
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <section className="py-24 relative z-10 bg-[#0a0f1d]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center mb-12">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-700"></div>
                        <h2 className="text-3xl font-bold px-6 text-gray-200 uppercase tracking-wider">How it works</h2>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-700"></div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <StepCard
                            num="01"
                            title="Seller lists assets"
                            img="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                        />
                        <StepCard
                            num="02"
                            title="Buyer sends offer"
                            img="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop"
                        />
                        <StepCard
                            num="03"
                            title="Negotiation happens"
                            img="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2664&auto=format&fit=crop"
                        />
                        <StepCard
                            num="04"
                            title="Deal closes & payment"
                            img="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2574&auto=format&fit=crop"
                        />
                    </div>
                </div>
            </section>

            {/* Split Section: Sellers vs Buyers */}
            <section className="py-12 bg-[#0a0f1d] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Sellers Card */}
                        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0f1629] p-8 md:p-12 hover:border-blue-500/30 transition-all">
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
                        </div>

                        {/* Buyers Card */}
                        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0f1629] p-8 md:p-12 hover:border-blue-500/30 transition-all">
                            <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                            <h3 className="text-2xl font-bold mb-2">For Buyers</h3>
                            <p className="text-gray-400 mb-6 border-b border-white/10 pb-4">Find deals you won't get on Amazon</p>
                            <ul className="space-y-3 mb-8">
                                <ListItem text="Buy in bulk" />
                                <ListItem text="Negotiate prices" />
                                <ListItem text="Verified business assets" />
                            </ul>
                            <Link to="/register?role=buyer" className="inline-block px-6 py-3 bg-[#1e293b] hover:bg-[#283548] text-white border border-white/10 rounded-lg font-bold transition-colors">
                                Start Buying
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Model / Pricing */}
            <section className="py-24 bg-[#0a0f1d] relative">
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-12 bg-gray-700"></div>
                        <h2 className="text-2xl font-bold text-gray-200">Our Business Model</h2>
                        <div className="h-px w-12 bg-gray-700"></div>
                    </div>
                    <p className="text-gray-400 mb-12">We only earn when a deal closes successfully.</p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <PriceCard title="Listing" price="Free" />
                        <PriceCard title="Negotiation" price="Free" />
                        <PriceCard title="Deal Closed" price="Platform Fee" highlight />
                    </div>

                    <div className="mt-20 pt-12 border-t border-white/5">
                        <h2 className="text-3xl font-bold mb-8">Ready to make real business deals?</h2>
                        <div className="flex justify-center gap-4">
                            <Link to="/register?role=seller" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all">
                                Start Selling
                            </Link>
                            <Link to="/register?role=buyer" className="px-8 py-3 bg-[#1e293b] hover:bg-[#283548] text-white border border-white/10 rounded-lg font-bold transition-all">
                                Start Buying
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// UI Components
const FeatureBox = ({ icon, title, desc }) => (
    <div className="bg-[#131b2e]/80 backdrop-blur-md border border-white/10 p-6 rounded-xl hover:bg-[#1a243a] transition-colors group">
        <div className="mb-4 bg-blue-600/10 w-fit p-3 rounded-lg group-hover:bg-blue-600/20 transition-colors">
            {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

const StepCard = ({ num, title, img }) => (
    <div className="group relative rounded-xl overflow-hidden aspect-video md:aspect-[4/3] border border-white/5 bg-[#131b2e]">
        <img src={img} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
            <span className="text-4xl font-bold text-white/20 mb-1 block group-hover:text-blue-500/50 transition-colors">{num}</span>
            <h3 className="text-lg font-bold leading-tight">{title}</h3>
        </div>
    </div>
);

const ListItem = ({ text }) => (
    <li className="flex items-center text-gray-300 text-sm">
        <CheckCircle2 className="w-4 h-4 text-green-500 mr-3" />
        {text}
    </li>
);

const PriceCard = ({ title, price, highlight }) => (
    <div className={`p-6 rounded-xl border ${highlight ? 'border-blue-500/50 bg-blue-900/10' : 'border-white/5 bg-[#131b2e]'} flex flex-col items-center justify-center min-h-[140px]`}>
        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">{title}</h4>
        <div className={`text-2xl font-bold ${highlight ? 'text-amber-400' : 'text-white'}`}>{price}</div>
    </div>
);

export default Landing;
