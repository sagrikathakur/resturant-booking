/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Calendar, Users, Clock, CheckCircle2, AlertCircle, Percent, Search } from "lucide-react";
import toast from "react-hot-toast";

interface OwnerBookingsProps {
    bookings: any[];
    setBookings: React.Dispatch<React.SetStateAction<any[]>>;
    totalSeats: number;
}

export default function OwnerBookings({ bookings, setBookings, totalSeats }: OwnerBookingsProps) {
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
        try {
            setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)));
            toast.success(`Booking status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Update status failed");
        }
    };

    // Analytics calculations
    const activeBookings = bookings.filter((b) => b.status === "confirmed");
    const completedBookings = bookings.filter((b) => b.status === "completed");
    const totalReservedGuests = activeBookings.reduce((acc, b) => acc + (b.guests || 1), 0);
    const capacityOccupancyPct = Math.min(100, Math.round((totalReservedGuests / (totalSeats || 50)) * 100));

    const filteredBookings = bookings.filter((b) => {
        const matchesStatus = filterStatus === "all" ? true : b.status === filterStatus;
        const queryLower = searchQuery.toLowerCase();
        const matchesQuery =
            searchQuery === ""
                ? true
                : (b.user?.name || "").toLowerCase().includes(queryLower) ||
                  (b.bookingId || "").toLowerCase().includes(queryLower);
        return matchesStatus && matchesQuery;
    });

    return (
        <div className="space-y-6 text-left">
            {/* KPI Metric Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-1.5">
                    <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                        <Users size={14} className="text-primary" />
                        Today's Cover (Guests)
                    </span>
                    <h4 className="font-display text-2xl font-semibold text-primary">{totalReservedGuests} Guests</h4>
                    <p className="text-[10px] text-black/45">Active confirmed dining seats</p>
                </div>

                <div className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-1.5">
                    <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                        <Percent size={14} className="text-primary" />
                        Capacity Usage
                    </span>
                    <h4 className="font-display text-2xl font-semibold text-primary">{capacityOccupancyPct}%</h4>
                    <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden mt-1">
                        <div style={{ width: `${capacityOccupancyPct}%` }} className="bg-primary h-full" />
                    </div>
                </div>

                <div className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-1.5">
                    <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-primary" />
                        Completed Diners
                    </span>
                    <h4 className="font-display text-2xl font-semibold text-emerald-700">{completedBookings.length}</h4>
                    <p className="text-[10px] text-black/45">Seated & completed parties</p>
                </div>

                <div className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-1.5">
                    <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-primary" />
                        Total Bookings
                    </span>
                    <h4 className="font-display text-2xl font-semibold text-primary">{bookings.length}</h4>
                    <p className="text-[10px] text-black/45">Total capacity limit: {totalSeats} seats</p>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-outline-variant/20 p-4 rounded-md shadow-sm">
                <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-medium text-primary">Live Reservations</h3>
                    <span className="text-[10px] bg-black/5 text-primary px-2 py-0.5 rounded-sm font-semibold">
                        {filteredBookings.length} Records
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-52">
                        <Search size={14} className="absolute left-3 top-2.5 text-black/40" />
                        <input
                            type="text"
                            placeholder="Search guest or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-outline-variant/30 rounded-sm focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div className="flex gap-1 bg-surface p-1 rounded-sm border border-outline-variant/20">
                        {["all", "confirmed", "completed", "cancelled"].map((st) => (
                            <button
                                key={st}
                                onClick={() => setFilterStatus(st)}
                                className={`px-2.5 py-1 text-[10px] font-medium uppercase rounded-xs transition-colors cursor-pointer ${
                                    filterStatus === st ? "bg-primary text-white" : "text-black/60 hover:text-primary"
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <div className="bg-white border border-outline-variant/10 p-12 text-center rounded-md">
                    <Calendar size={32} className="mx-auto text-outline-variant mb-2" />
                    <p className="text-xs text-black/55 italic">No matching booking records found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((b) => (
                        <div
                            key={b._id}
                            className="bg-white border border-outline-variant/20 rounded-md p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                        >
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-display text-base font-medium text-primary">{b.user?.name || "Diner Guest"}</h4>
                                    <span className="text-[9px] text-black/50 border border-outline-variant/30 px-1.5 py-0.5 font-mono">
                                        {b.bookingId || b._id}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black/55">
                                    <span className="flex items-center gap-1 font-medium text-primary">
                                        <Users size={12} /> {b.guests} Guests
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {b.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} /> {new Date(b.date).toLocaleDateString()}
                                    </span>
                                </div>
                                {b.specialRequests && (
                                    <p className="text-xs text-black/70 bg-black/5 px-3 py-1.5 rounded-sm border-l-2 border-primary mt-2">
                                        <strong>Special Requests:</strong> {b.specialRequests}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                                <span
                                    className={`text-[9px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-sm ${
                                        b.status === "confirmed"
                                            ? "bg-blue-100 text-blue-800"
                                            : b.status === "completed"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-error-container text-on-error-container"
                                    }`}
                                >
                                    {b.status}
                                </span>

                                {b.status === "confirmed" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateBookingStatus(b._id, "completed")}
                                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer"
                                        >
                                            Mark Seated
                                        </button>
                                        <button
                                            onClick={() => handleUpdateBookingStatus(b._id, "cancelled")}
                                            className="px-3 py-1.5 bg-error hover:bg-error/85 text-white text-[9px] font-medium tracking-wider uppercase transition-colors rounded-sm cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
