import { pool } from "../config/db.js";

export const createUser = async ({ name, email, password, phone }) => {
  const cleanPhone = phone && phone.trim() !== "" ? phone.trim() : null;
  const query = `
    INSERT INTO users (name, email, password, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, phone, created_at;
  `;
  const res = await pool.query(query, [name, email, password, cleanPhone]);
  return res.rows[0];
};

export const getAllUsers = async () => {
  const res = await pool.query("SELECT id, name, email, phone, created_at FROM users ORDER BY id ASC");
  return res.rows;
};

export const getUserById = async (id) => {
  const res = await pool.query("SELECT id, name, email, phone, created_at FROM users WHERE id = $1", [id]);
  return res.rows[0];
};

export const findUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE LOWER(email) = LOWER($1)", [email]);
  return res.rows[0];
};

export const updateUser = async (id, { name, email, phone, password }) => {
  const cleanPhone = phone && phone.trim() !== "" ? phone.trim() : null;
  const query = `
    UPDATE users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      password = COALESCE($4, password)
    WHERE id = $5
    RETURNING id, name, email, phone, created_at;
  `;
  const res = await pool.query(query, [name || null, email || null, cleanPhone, password || null, id]);
  return res.rows[0];
};

export const deleteUser = async (id) => {
  const res = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id, name, email", [id]);
  return res.rows[0];
};