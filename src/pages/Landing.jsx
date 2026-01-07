import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
                            The Premium Marketplace for <span className="text-accent">B2B Assets</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Buy and sell high-value industrial equipment, vehicles, and business assets with confidence. Verified networking, secure leads.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="/marketplace" className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 flex items-center">
                                Browse Assets <ArrowRight className="ml-2" />
                            </Link>
                            <Link to="/register" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold text-lg transition-all">
                                Start Selling
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-primary mb-4">Why AssetDirect?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">We bridge the gap between enterprise sellers and verified buyers.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <FeatureCard
                            icon={<ShieldCheck className="h-12 w-12 text-accent" />}
                            title="Verified Trust"
                            description="Every seller is vetted. Deal with legitimate businesses only."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="h-12 w-12 text-accent" />}
                            title="High Value Flow"
                            description="Streamlined specifically for high-ticket asset liquidation and acquisition."
                        />
                        <FeatureCard
                            icon={<Users className="h-12 w-12 text-accent" />}
                            title="Direct Connections"
                            description="No middlemen. Connect directly with decision makers after lead acceptance."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-8 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-xl transition-shadow">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default Landing;
