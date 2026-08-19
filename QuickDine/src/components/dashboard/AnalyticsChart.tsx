import { TrendingUp, Calendar, Users, Award, Clock } from "lucide-react";

interface AnalyticsChartProps {
    totalBookings?: number;
    confirmedCount?: number;
    completedCount?: number;
    cancelledCount?: number;
    title?: string;
}

export default function AnalyticsChart({
    totalBookings = 48,
    confirmedCount = 28,
    completedCount = 14,
    cancelledCount = 6,
    title = "Weekly Booking Trends & Volume Distribution",
}: AnalyticsChartProps) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const bookingCounts = [4, 6, 8, 12, 18, 24, 15];
    const maxCount = Math.max(...bookingCounts, 1);

    const peakHours = [
        { time: "12:00 PM - 2:00 PM", label: "Lunch Peak", percentage: 35 },
        { time: "5:00 PM - 7:00 PM", label: "Early Dinner", percentage: 25 },
        { time: "7:00 PM - 9:30 PM", label: "Prime Dinner", percentage: 40 },
    ];

    const confirmedPct = Math.round((confirmedCount / (totalBookings || 1)) * 100);
    const completedPct = Math.round((completedCount / (totalBookings || 1)) * 100);
    const cancelledPct = Math.round((cancelledCount / (totalBookings || 1)) * 100);

    return (
        <div className="bg-white border border-outline-variant/20 rounded-md p-6 shadow-sm space-y-6 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant/10 pb-4">
                <div>
                    <h3 className="font-display text-base font-medium text-primary flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" />
                        {title}
                    </h3>
                    <p className="text-xs text-black/55 mt-0.5">Real-time reservation velocity and status breakdown.</p>
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-primary uppercase bg-black/5 px-2.5 py-1 rounded-sm">
                    Live Telemetry
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Bar Chart */}
                <div className="lg:col-span-7 space-y-3">
                    <div className="flex justify-between items-center text-xs text-black/60 font-medium">
                        <span>Daily Reservations (7 Days)</span>
                        <span className="text-[11px] text-black/40">Peak: Saturday (24)</span>
                    </div>

                    <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-3 bg-surface/50 border border-outline-variant/10 rounded-md">
                        {days.map((day, idx) => {
                            const count = bookingCounts[idx];
                            const heightPct = Math.round((count / maxCount) * 100);
                            const isPeak = count === maxCount;

                            return (
                                <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                                    <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        {count}
                                    </span>
                                    <div className="w-full max-w-[28px] bg-outline-variant/15 rounded-t-sm overflow-hidden h-full flex items-end">
                                        <div
                                            style={{ height: `${heightPct}%` }}
                                            className={`w-full rounded-t-sm transition-all duration-500 ${
                                                isPeak ? "bg-primary" : "bg-primary/70 group-hover:bg-primary"
                                            }`}
                                        />
                                    </div>
                                    <span className="text-[10px] text-black/55 font-medium">{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Status Breakdown & Peak Hours */}
                <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
                    {/* Status Ratio Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-medium text-primary">
                            <span>Status Distribution</span>
                            <span>{totalBookings} Total</span>
                        </div>

                        <div className="w-full h-3 bg-surface rounded-full overflow-hidden flex">
                            <div style={{ width: `${confirmedPct}%` }} className="bg-blue-600 h-full" title={`Confirmed: ${confirmedCount}`} />
                            <div style={{ width: `${completedPct}%` }} className="bg-emerald-600 h-full" title={`Completed: ${completedCount}`} />
                            <div style={{ width: `${cancelledPct}%` }} className="bg-rose-500 h-full" title={`Cancelled: ${cancelledCount}`} />
                        </div>

                        <div className="flex justify-between text-[10px] text-black/60 pt-1">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Confirmed ({confirmedPct}%)
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Completed ({completedPct}%)
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Cancelled ({cancelledPct}%)
                            </span>
                        </div>
                    </div>

                    {/* Peak Dining Slot Insights */}
                    <div className="bg-surface-container-low p-4 rounded-md border border-outline-variant/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-medium text-primary">
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} /> Peak Slot Traffic
                            </span>
                            <span className="text-[10px] text-black/40 uppercase">Distribution</span>
                        </div>

                        <div className="space-y-1.5">
                            {peakHours.map((slot) => (
                                <div key={slot.label} className="flex justify-between items-center text-[11px]">
                                    <span className="text-black/70 font-medium">{slot.time} ({slot.label})</span>
                                    <span className="font-semibold text-primary">{slot.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
