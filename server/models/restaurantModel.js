import { pool } from "../config/db.js";

// CREATE - Add a new restaurant
export const createRestaurant = async (data) => {
  const { name, address, city, phone, opening_time, closing_time } = data;
  const query = `
    INSERT INTO restaurants (name, address, city, phone, opening_time, closing_time)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [
    name,
    address,
    city,
    phone || null,
    opening_time || null,
    closing_time || null,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// READ - Get all restaurants (with optional city or name search)
export const getAllRestaurants = async (city, search) => {
  let query = `SELECT * FROM restaurants WHERE 1=1`;
  const values = [];

  if (city) {
    values.push(city);
    query += ` AND LOWER(city) = LOWER($${values.length})`;
  }

  if (search) {
    values.push(`%${search}%`);
    query += ` AND (name ILIKE $${values.length} OR address ILIKE $${values.length})`;
  }

  query += ` ORDER BY id ASC;`;

  const result = await pool.query(query, values);
  return result.rows;
};

// READ - Get restaurant by ID
export const getRestaurantById = async (id) => {
  const query = `SELECT * FROM restaurants WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// UPDATE - Update restaurant
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
  const values = [
    name || null,
    address || null,
    city || null,
    phone || null,
    opening_time || null,
    closing_time || null,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// DELETE - Delete restaurant
export const deleteRestaurant = async (id) => {
  const query = `DELETE FROM restaurants WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
