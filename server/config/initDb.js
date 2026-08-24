import { pool } from "./db.js";
import bcrypt from "bcrypt";

export async function initializeDatabase() {
  try {
    console.log("Initializing & Verifying Database Schema...");

    // 1. Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Restaurants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        phone VARCHAR(50),
        opening_time VARCHAR(20),
        closing_time VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Restaurant Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurant_tables (
        id SERIAL PRIMARY KEY,
        restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
        table_number INT NOT NULL,
        capacity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (restaurant_id, table_number)
      );
    `);

    // 4. Bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
        table_id INT REFERENCES restaurant_tables(id) ON DELETE SET NULL,
        booking_date DATE NOT NULL,
        booking_time VARCHAR(20) NOT NULL,
        number_of_guests INT NOT NULL,
        status VARCHAR(50) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check counts
    const restCount = parseInt((await pool.query("SELECT COUNT(*) FROM restaurants;")).rows[0].count, 10);
    const userCount = parseInt((await pool.query("SELECT COUNT(*) FROM users;")).rows[0].count, 10);

    if (userCount === 0) {
      console.log("Seeding default users...");
      const hashedPassword = await bcrypt.hash("password123", 10);
      await pool.query(`
        INSERT INTO users (name, email, password, phone, role)
        VALUES 
          ('Alex Mercer', 'alex@example.com', $1, '+101234567788', 'owner'),
          ('Sarah Jenkins', 'sarah@example.com', $1, '+15550001122', 'user'),
          ('Marcus Vance', 'marcus@example.com', $1, '+15553334455', 'user')
        ON CONFLICT (email) DO NOTHING;
      `, [hashedPassword]);
    }

    if (restCount === 0) {
      console.log("Seeding default restaurants, tables, and sample bookings...");
      const restRes = await pool.query(`
        INSERT INTO restaurants (name, address, city, phone, opening_time, closing_time)
        VALUES 
          ('L''Essence', '115 Greenwich St', 'Manhattan, NY', '+1 212-555-0199', '18:00', '23:00'),
          ('Terraza Cielo', '244 Fifth Ave Rooftop', 'Manhattan, NY', '+1 212-555-0188', '12:00', '23:00'),
          ('Kuro Omakase', '18 Orchard St', 'Manhattan, NY', '+1 212-555-0177', '18:00', '22:00'),
          ('Flora Garden', '90 Grand St', 'Manhattan, NY', '+1 212-555-0166', '11:30', '21:00'),
          ('Ember Grille', '320 Bowery', 'Manhattan, NY', '+1 212-555-0155', '17:00', '23:00'),
          ('L''Artiste', '420 Mercer St', 'Manhattan, NY', '+1 212-555-0144', '17:00', '23:00')
        RETURNING id;
      `);

      // Seed tables for each restaurant
      for (const r of restRes.rows) {
        await pool.query(`
          INSERT INTO restaurant_tables (restaurant_id, table_number, capacity)
          VALUES 
            ($1, 1, 2),
            ($1, 2, 4),
            ($1, 3, 4),
            ($1, 4, 6),
            ($1, 5, 8)
          ON CONFLICT (restaurant_id, table_number) DO NOTHING;
        `, [r.id]);
      }

      // Seed initial sample bookings
      const userRes = await pool.query("SELECT id FROM users WHERE role = 'user' LIMIT 1;");
      const userId = userRes.rows[0]?.id;

      if (userId && restRes.rows.length >= 2) {
        const rest1Id = restRes.rows[0].id;
        const table1Id = (await pool.query("SELECT id FROM restaurant_tables WHERE restaurant_id = $1 LIMIT 1;", [rest1Id])).rows[0]?.id;

        const rest2Id = restRes.rows[1].id;
        const table2Id = (await pool.query("SELECT id FROM restaurant_tables WHERE restaurant_id = $1 LIMIT 1;", [rest2Id])).rows[0]?.id;

        await pool.query(`
          INSERT INTO bookings (user_id, restaurant_id, table_id, booking_date, booking_time, number_of_guests, status)
          VALUES 
            ($1, $2, $3, '2026-08-25', '19:00', 2, 'confirmed'),
            ($1, $4, $5, '2026-08-26', '20:00', 4, 'confirmed'),
            ($1, $2, $3, '2026-08-20', '18:00', 2, 'completed');
        `, [userId, rest1Id, table1Id, rest2Id, table2Id]);
      }
    }

    console.log("Database schema initialized and populated successfully.");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
}
