import { pool } from "../config/db.js";

export const checkTableAvailability = async (table_id, booking_date, booking_time) => {
  const query = `
    SELECT id FROM bookings
    WHERE table_id = $1 AND booking_date = $2 AND booking_time = $3 AND status IN ('confirmed', 'pending');
  `;
  const res = await pool.query(query, [table_id, booking_date, booking_time]);
  return res.rows.length === 0;
};

export const createBooking = async (data) => {
  const { user_id, restaurant_id, table_id, booking_date, booking_time, number_of_guests, status } = data;
  const query = `
    INSERT INTO bookings (user_id, restaurant_id, table_id, booking_date, booking_time, number_of_guests, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const res = await pool.query(query, [
    user_id, restaurant_id, table_id, booking_date, booking_time, number_of_guests, status || "confirmed"
  ]);
  return res.rows[0];
};

export const getBookingById = async (id) => {
  const query = `
    SELECT b.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone,
           r.name AS restaurant_name, r.address AS restaurant_address, r.city AS restaurant_city,
           t.table_number, t.capacity AS table_capacity
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN restaurants r ON b.restaurant_id = r.id
    JOIN restaurant_tables t ON b.table_id = t.id
    WHERE b.id = $1;
  `;
  const res = await pool.query(query, [id]);
  return res.rows[0];
};

export const getUserBookings = async (user_id) => {
  const query = `
    SELECT b.*, r.name AS restaurant_name, r.address AS restaurant_address, r.city AS restaurant_city, t.table_number
    FROM bookings b
    JOIN restaurants r ON b.restaurant_id = r.id
    JOIN restaurant_tables t ON b.table_id = t.id
    WHERE b.user_id = $1
    ORDER BY b.booking_date DESC, b.booking_time DESC;
  `;
  const res = await pool.query(query, [user_id]);
  return res.rows;
};

export const getRestaurantBookings = async (restaurant_id, date) => {
  let query = `
    SELECT b.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone, t.table_number
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN restaurant_tables t ON b.table_id = t.id
    WHERE b.restaurant_id = $1
  `;
  const params = [restaurant_id];
  if (date) {
    params.push(date);
    query += " AND b.booking_date = $2";
  }
  query += " ORDER BY b.booking_date ASC, b.booking_time ASC";

  const res = await pool.query(query, params);
  return res.rows;
};

export const getAllBookings = async () => {
  const query = `
    SELECT b.*, u.name AS user_name, r.name AS restaurant_name, t.table_number
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN restaurants r ON b.restaurant_id = r.id
    JOIN restaurant_tables t ON b.table_id = t.id
    ORDER BY b.created_at DESC;
  `;
  const res = await pool.query(query);
  return res.rows;
};

export const updateBookingStatus = async (id, status) => {
  const res = await pool.query(
    "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return res.rows[0];
};

export const deleteBooking = async (id) => {
  const res = await pool.query("DELETE FROM bookings WHERE id = $1 RETURNING *", [id]);
  return res.rows[0];
};
