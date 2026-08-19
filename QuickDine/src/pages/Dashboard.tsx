/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RestaurantCard from "../components/RestaurantCard";
import AuthModal from "../components/AuthModal";
import { CalendarIcon, UsersIcon, ClockIcon, MapPinIcon, CalendarDaysIcon, UtensilsCrossed, Award, SearchIcon } from "lucide-react";
import toast from "react-hot-toast";
import { dummyFeaturedRestaurants } from "../assets/assets.ts";

export default function Dashboard() {
    const { user, myBookings, cancelBooking } = useAppContext();

    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchRecommendations = async () => {
            setRecommendations(dummyFeaturedRestaurants);
        };
        fetchRecommendations();
    }, []);

    const handleCancelBooking = async (bookingId: string) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            await cancelBooking(bookingId);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    };

    if (!user) return null;

    // Filter bookings into upcoming and past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allBookings = myBookings || [];

    const upcomingBookings = allBookings.filter((b) => {
        const bDate = new Date(b.date);
        return bDate >= today && b.status === "confirmed";
    });

    const pastBookings = allBookings.filter((b) => {
        const bDate = new Date(b.date);
        return bDate < today || b.status !== "confirmed";
    });

    const totalGuestsCount = allBookings.reduce((acc, b) => acc + (b.guests || 1), 0);

    const filteredBookings = allBookings.filter((b) => {
        const matchesStatus = statusFilter === "all" ? true : b.status === statusFilter;
        const matchesQuery = searchQuery === "" ? true : b.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesQuery;
    });

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />
            <AuthModal />

            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                <div className="grow space-y-10">
                    {/* Welcoming header & KPI cards */}
                    <div className="space-y-6">
                        <div className="pb-4 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary">
                                    Welcome back, {user.name.split(" ")[0]}
                                </h2>
                                <p className="text-xs text-black/55 mt-1">Manage your dining reservations, history, and table requests.</p>
                            </div>

                            <Link
                                to="/search"
                                className="bg-primary hover:bg-neutral-800 text-white text-[11px] font-medium tracking-widest uppercase px-6 py-3 transition-colors rounded-sm flex items-center gap-2"
                            >
                                <UtensilsCrossed size={14} />
                                Reserve New Table
                            </Link>
                        </div>

                        {/* Customer Dashboard Metric Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-1.5">
                                <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                                    <CalendarDaysIcon size={14} className="text-primary" />
                                    Upcoming Bookings
                                </span>
                                <h4 className="font-display text-2xl font-semibold text-primary">{upcomingBookings.length}</h4>
                                <p className="text-[10px] text-black/45">Scheduled reservations</p>
                            </div>

                            <div className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-1.5">
                                <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                                    <CalendarIcon size={14} className="text-primary" />
                                    Total Reservations
                                </span>
                                <h4 className="font-display text-2xl font-semibold text-primary">{allBookings.length}</h4>
                                <p className="text-[10px] text-black/45">Lifetime dining activity</p>
                            </div>

                            <div className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-1.5">
                                <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                                    <UsersIcon size={14} className="text-primary" />
                                    Total Guests Hosted
                                </span>
                                <h4 className="font-display text-2xl font-semibold text-primary">{totalGuestsCount}</h4>
                                <p className="text-[10px] text-black/45">Cumulative party size</p>
                            </div>

                            <div className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-1.5">
                                <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                                    <Award size={14} className="text-primary" />
                                    Membership Tier
                                </span>
                                <h4 className="font-display text-lg font-semibold text-primary">Gourmet Preferred</h4>
                                <p className="text-[10px] text-emerald-600 font-medium">VIP Priority Dining Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Upcoming Reservations */}
                        <div className="space-y-4">
                            <h3 className="font-display text-lg font-medium text-primary">Upcoming Bookings</h3>

                            {upcomingBookings.length === 0 ? (
                                <div className="bg-white border border-outline-variant/10 p-12 text-center rounded-md">
                                    <CalendarDaysIcon size={36} className="mx-auto text-outline-variant mb-2" />

                                    <p className="text-xs text-black/55 italic">No upcoming reservations scheduled.</p>

                                    <Link
                                        to="/search"
                                        className="inline-block mt-4 bg-primary hover:bg-neutral-800 text-white text-[10px] font-medium tracking-widest uppercase px-6 py-2.5 transition-colors"
                                    >
                                        Book a Table
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.map((b) => (
                                        <div
                                            key={b._id}
                                            className="bg-white border border-outline-variant/20 rounded-md p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 bg-surface">
                                                    <img
                                                        src={b.restaurant?.image || "/restaurant_1.png"}
                                                        alt={b.restaurant?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-medium text-black/60 tracking-widest uppercase">
                                                        {b.restaurant?.cuisine || "Fine Dining"}
                                                    </span>
                                                    <h4 className="font-display text-base font-medium text-primary">
                                                        {b.restaurant?.name}
                                                    </h4>
                                                    <p className="text-xs text-black/55 flex items-center gap-1">
                                                        <MapPinIcon size={12} />
                                                        {b.restaurant?.location || "Manhattan, NY"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-6 text-xs text-on-surface bg-surface-container-low p-4 rounded-md border border-outline-variant/10 w-full md:w-auto">
                                                <div className="flex items-center gap-2 pr-4 md:border-r border-outline-variant/20">
                                                    <CalendarIcon size={14} className="text-primary" />
                                                    <span className="font-medium">{new Date(b.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 pr-4 md:border-r border-outline-variant/20">
                                                    <ClockIcon size={14} className="text-primary" />
                                                    <span className="font-medium">{b.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <UsersIcon size={14} className="text-primary" />
                                                    <span className="font-medium">{b.guests} Guests</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 w-full md:w-auto justify-end">
                                                <button
                                                    onClick={() => handleCancelBooking(b._id)}
                                                    className="px-5 py-2.5 text-[10px] font-medium tracking-widest uppercase text-error hover:bg-error-container/20 border border-outline-variant/40 rounded-sm cursor-pointer transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All Bookings & History section with Filter Bar */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/10 pb-3">
                                <h3 className="font-display text-lg font-medium text-primary">Dining Records & History</h3>

                                {/* Filter Controls */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="relative">
                                        <SearchIcon size={14} className="absolute left-3 top-2.5 text-black/40" />
                                        <input
                                            type="text"
                                            placeholder="Search restaurant..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-8 pr-3 py-1.5 text-xs border border-outline-variant/30 rounded-sm focus:outline-none focus:border-primary w-44"
                                        />
                                    </div>

                                    <div className="flex gap-1 bg-surface p-1 rounded-sm border border-outline-variant/20">
                                        {["all", "confirmed", "completed", "cancelled"].map((st) => (
                                            <button
                                                key={st}
                                                onClick={() => setStatusFilter(st)}
                                                className={`px-2.5 py-1 text-[10px] font-medium uppercase rounded-xs transition-colors cursor-pointer ${
                                                    statusFilter === st ? "bg-primary text-white" : "text-black/60 hover:text-primary"
                                                }`}
                                            >
                                                {st}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {filteredBookings.length === 0 ? (
                                <p className="text-xs text-black/40 italic py-4">No reservations match the selected filter criteria.</p>
                            ) : (
                                <div className="bg-white border border-outline-variant/20 rounded-md overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] font-medium tracking-wider text-black/55 uppercase">
                                                <th className="p-4">Ref ID</th>
                                                <th className="p-4">Restaurant</th>
                                                <th className="p-4">Date & Time</th>
                                                <th className="p-4">Party</th>
                                                <th className="p-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/10">
                                            {filteredBookings.map((b) => (
                                                <tr key={b._id} className="hover:bg-surface/50">
                                                    <td className="p-4 text-primary font-mono text-[11px]">{b.bookingId || b._id}</td>
                                                    <td className="p-4 font-medium text-primary">
                                                        <Link
                                                            to={`/restaurant/${b.restaurant?.slug || b.restaurant?._id || "essence"}`}
                                                            className="hover:text-primary"
                                                        >
                                                            {b.restaurant?.name}
                                                        </Link>
                                                    </td>
                                                    <td className="p-4">
                                                        {new Date(b.date).toLocaleDateString()} at {b.time}
                                                    </td>
                                                    <td className="p-4">
                                                        {b.guests} {b.guests === 1 ? "Guest" : "Guests"}
                                                    </td>
                                                    <td className="p-4">
                                                        <span
                                                            className={`inline-block py-0.5 px-2 text-[9px] font-medium tracking-wider uppercase rounded-sm ${
                                                                b.status === "confirmed"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : b.status === "completed"
                                                                      ? "bg-green-100 text-green-800"
                                                                      : "bg-error-container text-on-error-container"
                                                            }`}
                                                        >
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recommendations Section */}
                    {recommendations.length > 0 && (
                        <div className="space-y-4 pt-10 border-t border-outline-variant/10">
                            <h3 className="font-display text-lg font-medium text-primary">Recommended for You</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendations.slice(0, 3).map((r) => (
                                    <RestaurantCard key={r._id} restaurant={r} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
