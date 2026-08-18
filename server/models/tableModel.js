import { pool } from "../config/db.js";

export const createTable = async ({ restaurant_id, table_number, capacity }) => {
  const query = `
    INSERT INTO restaurant_tables (restaurant_id, table_number, capacity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const res = await pool.query(query, [restaurant_id, table_number, capacity]);
  return res.rows[0];
};

export const getTablesByRestaurant = async (restaurant_id) => {
  const res = await pool.query(
    "SELECT * FROM restaurant_tables WHERE restaurant_id = $1 ORDER BY table_number ASC",
    [restaurant_id]
  );
  return res.rows;
};

export const getTableById = async (id) => {
  const res = await pool.query("SELECT * FROM restaurant_tables WHERE id = $1", [id]);
  return res.rows[0];
};

export const updateTable = async (id, { table_number, capacity }) => {
  const query = `
    UPDATE restaurant_tables
    SET table_number = COALESCE($1, table_number), capacity = COALESCE($2, capacity)
    WHERE id = $3
    RETURNING *;
  `;
  const res = await pool.query(query, [table_number || null, capacity || null, id]);
  return res.rows[0];
};

export const deleteTable = async (id) => {
  const res = await pool.query("DELETE FROM restaurant_tables WHERE id = $1 RETURNING *", [id]);
  return res.rows[0];
};
