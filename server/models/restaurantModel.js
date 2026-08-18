import { pool } from "../config/db.js";

export const createRestaurant = async (data) => {
  const { name, address, city, phone, opening_time, closing_time } = data;
  const query = `
    INSERT INTO restaurants (name, address, city, phone, opening_time, closing_time)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const res = await pool.query(query, [name, address, city, phone || null, opening_time || null, closing_time || null]);
  return res.rows[0];
};

export const getAllRestaurants = async (city, search) => {
  let query = "SELECT * FROM restaurants WHERE 1=1";
  const params = [];

  if (city) {
    params.push(city);
    query += ` AND LOWER(city) = LOWER($${params.length})`;
  }
  if (search) {
    params.push(`%${search}%`);
    query += ` AND (name ILIKE $${params.length} OR address ILIKE $${params.length})`;
  }
  query += " ORDER BY id ASC";

  const res = await pool.query(query, params);
  return res.rows;
};

export const getRestaurantById = async (id) => {
  const res = await pool.query("SELECT * FROM restaurants WHERE id = $1", [id]);
  return res.rows[0];
};

export const updateRestaurant = async (id, data) => {
  const { name, address, city, phone, opening_time, closing_time } = data;
  const query = `
    UPDATE restaurants
    SET
      name = COALESCE($1, name),
      address = COALESCE($2, address),
      city = COALESCE($3, city),
      phone = COALESCE($4, phone),
      opening_time = COALESCE($5, opening_time),
      closing_time = COALESCE($6, closing_time)
    WHERE id = $7
    RETURNING *;
  `;
  const res = await pool.query(query, [
    name || null, address || null, city || null, phone || null, opening_time || null, closing_time || null, id
  ]);
  return res.rows[0];
};

export const deleteRestaurant = async (id) => {
  const res = await pool.query("DELETE FROM restaurants WHERE id = $1 RETURNING *", [id]);
  return res.rows[0];
};
