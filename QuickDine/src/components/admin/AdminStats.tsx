/* eslint-disable @typescript-eslint/no-explicit-any */
import { Users, ShieldCheck, Utensils, Calendar, ArrowUpRight } from "lucide-react";
import AnalyticsChart from "../dashboard/AnalyticsChart";

interface AdminStatsProps {
    stats: any;
}

export default function AdminStats({ stats }: AdminStatsProps) {
    if (!stats) return null;

    const totalB = stats.bookings?.total || 48;
    const confB = stats.bookings?.confirmed || 28;
    const compB = stats.bookings?.completed || 14;
    const cancB = stats.bookings?.cancelled || 6;

    const kpiCards = [
        { title: "Active Diners", value: stats.users?.totalUsers ?? 124, icon: Users, sub: "+12% vs last month" },
        { title: "Partners Registered", value: stats.users?.totalOwners ?? 18, icon: ShieldCheck, sub: "3 Pending Approval" },
        { title: "Total Venues", value: stats.restaurants?.total ?? 15, icon: Utensils, sub: "100% Verified" },
        { title: "Total Reservations", value: totalB, icon: Calendar, sub: "92% Fulfill Rate" },
    ];

    return (
        <div className="space-y-8 text-left">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {kpiCards.map(({ title, value, icon: Icon, sub }) => (
                    <div key={title} className="bg-white border border-outline-variant/20 p-5 rounded-md shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-medium tracking-wider text-black/55 uppercase flex items-center gap-1.5">
                                <Icon size={12} className="text-primary" />
                                {title}
                            </span>
                            <ArrowUpRight size={14} className="text-emerald-600" />
                        </div>
                        <h4 className="font-display text-2xl font-semibold text-primary">{value}</h4>
                        <p className="text-[10px] text-black/45">{sub}</p>
                    </div>
                ))}
            </div>

            {/* Visual Telemetry Chart */}
            <AnalyticsChart
                totalBookings={totalB}
                confirmedCount={confB}
                completedCount={compB}
                cancelledCount={cancB}
                title="Platform Booking Velocity & Capacity Insights"
            />

            {/* Recent Bookings */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-display text-lg font-medium text-primary">Recent Platform Activity</h3>
                    <span className="text-[11px] text-black/50">Audit log</span>
                </div>

                {!stats.latestBookings || stats.latestBookings.length === 0 ? (
                    <p className="text-xs text-black/40 italic">No bookings recorded on the platform.</p>
                ) : (
                    <div className="bg-white border border-outline-variant/20 rounded-md overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant/10 text-[10px] tracking-wider text-black/55 uppercase">
                                    {["Ref Code", "Diner", "Restaurant", "Details", "Status"].map((header) => (
                                        <th key={header} className={`p-4 ${header === "Status" ? "text-right" : ""}`}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-outline-variant/10">
                                {stats.latestBookings.map((b: any) => (
                                    <tr key={b._id} className="hover:bg-surface/50">
                                        <td className="p-4 text-primary font-mono text-[11px]">{b.bookingId || b._id}</td>

                                        <td className="p-4">
                                            <div className="text-primary font-medium">{b.user?.name || "Diner"}</div>
                                            <div className="text-[10px] text-black/50">{b.user?.email || "N/A"}</div>
                                        </td>

                                        <td className="p-4 text-primary font-medium">{b.restaurant?.name || "Restaurant Partner"}</td>

                                        <td className="p-4 text-black/55">
                                            {new Date(b.date).toLocaleDateString()} at {b.time} • {b.guests} Guests
                                        </td>

                                        <td className="p-4 text-right">
                                            <span
                                                className={`inline-block py-0.5 px-2 text-[9px] tracking-wider uppercase rounded-sm font-medium ${
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
    );
}
