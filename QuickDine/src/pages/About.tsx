import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Sparkles, Globe, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { assets } from "../assets/assets";

export default function About() {
    const values = [
        {
            icon: UtensilsCrossed,
            title: "Culinary Quality",
            description: "We work directly with top-rated restaurants, ensuring every dining experience meets high standards of food, service, and ambiance."
        },
        {
            icon: ShieldCheck,
            title: "Guaranteed Booking",
            description: "Real-time table synchronization directly with restaurant systems ensures your table is secured the moment you confirm."
        },
        {
            icon: Sparkles,
            title: "Exclusive Table Access",
            description: "From neighborhood favorites to prime rooftop and omakase spots, QuickDine opens doors to coveted dining destinations."
        },
        {
            icon: Globe,
            title: "Seamless Convenience",
            description: "Instant booking confirmation, easy calendar sync, and hassle-free reservation management all in one place."
        }
    ];

    const stats = [
        { label: "Partner Restaurants", value: "250+" },
        { label: "Tables Reserved", value: "120,000+" },
        { label: "Cities Covered", value: "15" },
        { label: "Customer Rating", value: "4.9 / 5.0" }
    ];

    const highlights = [
        "100% verified instant table reservations",
        "Direct integration with restaurant management software",
        "Curated selection across fine dining, rooftop, and casual concepts",
        "Zero hidden booking fees for diners"
    ];

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-0">
            <Navbar />
            <AuthModal />

            <main className="flex-1">
                {/* Hero Section - Matched to Home Page Hero Style */}
                <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={assets.hero_bg_img}
                            alt="Elegant Dining Room"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80";
                            }}
                            className="w-full h-full object-cover brightness-70"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-7xl px-6 md:px-10 text-center pt-16">
                        <span className="text-xs md:text-sm text-white/80 tracking-[0.25em] uppercase block mb-4">
                            ABOUT QUICKDINE
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl text-white mb-6 max-w-3xl mx-auto leading-[1.15] font-medium tracking-tight drop-shadow-md">
                            Connecting Diners with Unforgettable Experiences
                        </h1>
                        <p className="text-sm md:text-base text-white/85 max-w-2xl mx-auto leading-relaxed font-normal mb-8">
                            QuickDine simplifies table bookings for food lovers and partner restaurants—delivering instant reservations, live availability, and exceptional hospitality.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/search"
                                className="bg-primary text-white text-xs font-medium tracking-widest uppercase px-8 py-3.5 hover:bg-neutral-800 transition-colors cursor-pointer rounded-sm"
                            >
                                EXPLORE RESTAURANTS
                            </Link>
                        </div>
                    </div>
                </section>

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

                {/* Our Story / Mission Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <span className="text-xs font-medium text-black/60 tracking-widest uppercase block">OUR MISSION</span>
                            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary leading-tight">
                                Making Every Table Booking Effortless & Reliable
                            </h2>
                            <p className="text-sm text-black/65 leading-relaxed">
                                QuickDine was created to bridge the gap between food enthusiasts and top restaurant dining rooms. Whether you are searching for an intimate bistro, a vibrant rooftop lounge, or a premium omakase counter, we make discovering and reserving tables simple.
                            </p>
                            <p className="text-sm text-black/65 leading-relaxed">
                                We work hand-in-hand with restaurant managers and chefs to optimize table availability, eliminate double bookings, and ensure seamless guest experiences from arrival to dessert.
                            </p>

                            <div className="pt-2 space-y-2.5">
                                {highlights.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-xs text-black/75">
                                        <CheckCircle2 size={16} className="text-primary shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Link
                                    to="/search"
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-neutral-800 text-white px-6 py-3 text-xs font-medium tracking-widest uppercase transition-colors rounded-sm"
                                >
                                    Find a Table <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-6">
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

                {/* Core Pillars / Values Section */}
                <section className="bg-surface-container-low/50 py-20 px-6 md:px-10 border-y border-outline-variant/10">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <span className="text-xs font-medium text-black/60 tracking-widest uppercase">THE QUICKDINE DIFFERENCE</span>
                            <h2 className="font-display text-3xl font-semibold text-primary">Why Diners & Chefs Trust Us</h2>
                            <p className="text-xs text-black/55">Built upon standard-setting reliability, exquisite design, and culinary passion.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((val, idx) => {
                                const IconComponent = val.icon;
                                return (
                                    <div key={idx} className="bg-white p-8 rounded-md border border-outline-variant/20 shadow-sm space-y-4 hover:border-primary/50 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-primary">
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
                                className="inline-block bg-white hover:bg-neutral-200 text-primary font-medium text-xs tracking-widest uppercase px-8 py-3.5 transition-colors rounded-sm"
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
