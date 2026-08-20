import { pool } from "../config/db.js";

export const getOwnerStats = async (restaurantId) => {
  try {
    const bRes = await pool.query("SELECT COUNT(*) FROM bookings WHERE restaurant_id = $1;", [restaurantId]);
    const totalBookings = parseInt(bRes.rows[0].count, 10);

    const guestRes = await pool.query("SELECT SUM(number_of_guests) as total_guests FROM bookings WHERE restaurant_id = $1 AND status != 'cancelled';", [restaurantId]);
    const totalGuests = parseInt(guestRes.rows[0].total_guests || 0, 10);

    const statusRes = await pool.query(`
      SELECT status, COUNT(*) as count FROM bookings WHERE restaurant_id = $1 GROUP BY status;
    `, [restaurantId]);

    let confirmed = 0;
    let completed = 0;
    let cancelled = 0;
    statusRes.rows.forEach((row) => {
      if (row.status === "confirmed") confirmed = parseInt(row.count, 10);
      else if (row.status === "completed") completed = parseInt(row.count, 10);
      else if (row.status === "cancelled") cancelled = parseInt(row.count, 10);
    });

    const recentRes = await pool.query(`
      SELECT b.id, b.booking_date, b.booking_time, b.number_of_guests, b.status,
             u.name AS user_name, u.email AS user_email, u.phone AS user_phone
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.restaurant_id = $1
      ORDER BY b.booking_date DESC, b.booking_time DESC
      LIMIT 20;
    `, [restaurantId]);

    const bookings = recentRes.rows.map((b) => ({
      _id: b.id.toString(),
      bookingId: `GR-${b.id}`,
      date: b.booking_date,
      time: b.booking_time,
      guests: b.number_of_guests,
      status: b.status,
      user: { name: b.user_name || "Guest", email: b.user_email || "N/A", phone: b.user_phone },
    }));

    return {
      totalBookings,
      totalGuests,
      confirmed,
      completed,
      cancelled,
      bookings,
    };
  } catch (err) {
    console.error("Error fetching owner stats model:", err);
    throw err;
  }
};
