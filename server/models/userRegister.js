import { pool } from "../config/db.js";

// CREATE - Create a new user
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

// READ - Get all users
export const getAllUsers = async () => {
  const query = `
    SELECT id, name, email, phone, role, created_at
    FROM users
    ORDER BY id ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// READ - Get user by ID
export const getUserById = async (id) => {
  const query = `
    SELECT id, name, email, phone, role, created_at
    FROM users
    WHERE id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// READ - Find user by email
export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

// UPDATE - Update user by ID
export const updateUser = async (id, data) => {
  const { name, email, phone, role, password } = data;
  const query = `
    UPDATE users
    SET
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role = COALESCE($4, role),
      password = COALESCE($5, password)
    WHERE id = $6
    RETURNING id, name, email, phone, role, created_at;
  `;
  const values = [
    name || null,
    email || null,
    phone || null,
    role || null,
    password || null,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// DELETE - Delete user by ID
export const deleteUser = async (id) => {
  const query = `
    DELETE FROM users
    WHERE id = $1
    RETURNING id, name, email;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
