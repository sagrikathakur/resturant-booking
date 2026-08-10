import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Sparkles, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import { assets } from "../assets/assets";

export default function About() {
    const values = [
        {
            icon: UtensilsCrossed,
            title: "Culinary Precision",
            description: "We partner exclusively with restaurants that view gastronomy as art form, ensuring every dining experience exceeds expectations."
        },
        {
            icon: ShieldCheck,
            title: "Guaranteed Table Reservation",
            description: "Real-time sync with top-tier restaurant booking software guarantees your table is reserved the moment you confirm."
        },
        {
            icon: Sparkles,
            title: "Curated VIP Access",
            description: "From hard-to-get omakase counters to rooftop skyline tables, QuickDine opens doors to coveted culinary destinations."
        },
        {
            icon: Globe,
            title: "Global Gastronomy",
            description: "Connecting discerning diners with world-class chefs, Michelin-starred establishments, and hidden local gems."
        }
    ];

    const stats = [
        { label: "Partner Restaurants", value: "250+" },
        { label: "Tables Reserved", value: "120,000+" },
        { label: "Cities Covered", value: "15" },
        { label: "Customer Rating", value: "4.9 / 5.0" }
    ];

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />
            <AuthModal />

            <main className="flex-1">
                {/* Simple Plain Restaurant Image */}
                <div className="w-full h-72 md:h-[420px] overflow-hidden">
                    <img
                        src={assets.hero_bg_img}
                        alt="Restaurant"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80";
                        }}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Stats Bar */}
                <section className="bg-white border-y border-outline-variant/10 py-10 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="space-y-1">
                                <p className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight">{stat.value}</p>
                                <p className="text-xs text-black/55 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Our Story / Mission */}
                <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <span className="text-xs font-medium text-secondary tracking-widest uppercase">OUR MISSION</span>
                            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary">
                                Connecting Discerning Diners with Unforgettable Experiences
                            </h2>
                            <p className="text-sm text-black/65 leading-relaxed">
                                Founded in 2024, QuickDine bridges the gap between culinary lovers and elite dining rooms. Whether it is an intimate Parisian-inspired bistro, a secretive omakase counter, or a vibrant rooftop lounge, we empower diners to book effortlessly.
                            </p>
                            <p className="text-sm text-black/65 leading-relaxed">
                                We work closely with restaurant owners and head chefs to optimize table availability, eliminate no-shows, and deliver unmatched VIP hospitality from the moment you step through the door.
                            </p>

                            <div className="pt-4 flex gap-4">
                                <Link
                                    to="/search"
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 text-xs font-medium tracking-widest uppercase transition-colors rounded-sm"
                                >
                                    Explore Restaurants <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-6 relative">
                            <div className="relative rounded-lg overflow-hidden ambient-shadow border border-outline-variant/20">
                                <img
                                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
                                    alt="Restaurant Interior"
                                    className="w-full h-[420px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                                    <p className="font-display text-lg font-medium">Curated Ambience & Excellence</p>
                                    <p className="text-xs text-white/80">Every venue on QuickDine is hand-verified for culinary excellence.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Pillars / Values */}
                <section className="bg-surface-container-low/50 py-20 px-6 md:px-10 border-y border-outline-variant/10">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <span className="text-xs font-medium text-secondary tracking-widest uppercase">THE QUICKDINE DIFFERENCE</span>
                            <h2 className="font-display text-3xl font-semibold text-primary">Why Diners & Chefs Trust Us</h2>
                            <p className="text-xs text-black/55">Built upon standard-setting reliability, exquisite design, and culinary passion.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((val, idx) => {
                                const IconComponent = val.icon;
                                return (
                                    <div key={idx} className="bg-white p-8 rounded-md border border-outline-variant/20 shadow-sm space-y-4 hover:border-secondary/50 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                            <IconComponent size={22} />
                                        </div>
                                        <h3 className="font-display text-lg font-medium text-primary">{val.title}</h3>
                                        <p className="text-xs text-black/55 leading-relaxed">{val.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Call to Action Banner */}
                <section className="bg-primary text-white py-16 px-6 md:px-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h2 className="font-display text-3xl md:text-4xl font-semibold">Ready for an Extraordinary Dining Experience?</h2>
                        <p className="text-xs md:text-sm text-white/80 max-w-xl mx-auto">
                            Browse curated tables, reserve instantly, and elevate your next dinner reservation with QuickDine.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/search"
                                className="inline-block bg-secondary hover:bg-white hover:text-primary text-white font-medium text-xs tracking-widest uppercase px-8 py-3.5 transition-colors rounded-sm"
                            >
                                Book Your Table Now
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
