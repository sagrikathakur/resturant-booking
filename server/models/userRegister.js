import { pool } from "../config/db.js";

// Create user
export const createUser = async (data) => {
  const { name, email, password, phone, role } = data;
  const query = `
    INSERT INTO users (name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role, created_at;
  `;
  const values = [name, email, password, phone || null, role || "user"];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Find user by email
export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};