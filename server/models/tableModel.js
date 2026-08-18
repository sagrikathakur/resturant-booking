import { pool } from "../config/db.js";

// CREATE - Add a table to a restaurant
export const createTable = async (data) => {
  const { restaurant_id, table_number, capacity } = data;
  const query = `
    INSERT INTO restaurant_tables (restaurant_id, table_number, capacity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [restaurant_id, table_number, capacity];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// READ - Get all tables for a specific restaurant
export const getTablesByRestaurant = async (restaurant_id) => {
  const query = `
    SELECT * FROM restaurant_tables
    WHERE restaurant_id = $1
    ORDER BY table_number ASC;
  `;
  const result = await pool.query(query, [restaurant_id]);
  return result.rows;
};

// READ - Get single table by ID
export const getTableById = async (id) => {
  const query = `SELECT * FROM restaurant_tables WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// UPDATE - Update table details
export const updateTable = async (id, data) => {
  const { table_number, capacity } = data;
  const query = `
    UPDATE restaurant_tables
    SET
      table_number = COALESCE($1, table_number),
      capacity = COALESCE($2, capacity)
    WHERE id = $3
    RETURNING *;
  `;
  const values = [table_number || null, capacity || null, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// DELETE - Delete table
export const deleteTable = async (id) => {
  const query = `DELETE FROM restaurant_tables WHERE id = $1 RETURNING *;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
