import { pool } from "./config/db.js";
import bcrypt from "bcrypt";

async function seedDatabase() {
  console.log("Starting database setup & seeding...");
  try {
    // 1. Create tables if not exist
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

    console.log("Tables schema verified/created successfully.");

    // 2. Insert Users
    const defaultPassword = await bcrypt.hash("password123", 10);

    const userRes = await pool.query(`
      INSERT INTO users (name, email, password, phone, role)
      VALUES 
        ('Alex Mercer', 'alex@example.com', $1, '+101234567788', 'owner'),
        ('Sarah Jenkins', 'sarah@example.com', $1, '+15550001122', 'user'),
        ('Marcus Vance', 'marcus@example.com', $1, '+15553334455', 'user')
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id, name, email, role;
    `, [defaultPassword]);

    console.log("Seeded Users:", userRes.rows);

    const userId = userRes.rows.find(u => u.role === 'user')?.id || userRes.rows[0].id;

    // 3. Insert Restaurants
    await pool.query("TRUNCATE TABLE restaurants CASCADE;");

    const restaurantRes = await pool.query(`
      INSERT INTO restaurants (name, address, city, phone, opening_time, closing_time)
      VALUES 
        ('L''Essence', '115 Greenwich St', 'Manhattan, NY', '+1 212-555-0199', '18:00', '23:00'),
        ('Terraza Cielo', '244 Fifth Ave Rooftop', 'Manhattan, NY', '+1 212-555-0188', '12:00', '23:00'),
        ('Kuro Omakase', '18 Orchard St', 'Manhattan, NY', '+1 212-555-0177', '18:00', '22:00'),
        ('Flora Garden', '90 Grand St', 'Manhattan, NY', '+1 212-555-0166', '11:30', '21:00'),
        ('Ember Grille', '320 Bowery', 'Manhattan, NY', '+1 212-555-0155', '17:00', '23:00'),
        ('L''Artiste', '420 Mercer St', 'Manhattan, NY', '+1 212-555-0144', '17:00', '23:00')
      RETURNING id, name, city;
    `);

    console.log("Seeded Restaurants:", restaurantRes.rows);

    // 4. Insert Restaurant Tables
    for (const r of restaurantRes.rows) {
      await pool.query(`
        INSERT INTO restaurant_tables (restaurant_id, table_number, capacity)
        VALUES 
          ($1, 1, 2),
          ($1, 2, 4),
          ($1, 3, 4),
          ($1, 4, 6),
          ($1, 5, 8)
        ON CONFLICT (restaurant_id, table_number) DO UPDATE SET capacity = EXCLUDED.capacity;
      `, [r.id]);
    }

    console.log("Seeded Tables for each restaurant.");

    // 5. Insert Sample Bookings
    const firstRest = restaurantRes.rows[0].id;
    const firstRestTable = (await pool.query("SELECT id FROM restaurant_tables WHERE restaurant_id = $1 LIMIT 1;", [firstRest])).rows[0].id;

    const secondRest = restaurantRes.rows[1].id;
    const secondRestTable = (await pool.query("SELECT id FROM restaurant_tables WHERE restaurant_id = $1 LIMIT 1;", [secondRest])).rows[0].id;

    await pool.query(`
      INSERT INTO bookings (user_id, restaurant_id, table_id, booking_date, booking_time, number_of_guests, status)
      VALUES 
        ($1, $2, $3, '2026-08-25', '19:00', 2, 'confirmed'),
        ($1, $4, $5, '2026-08-26', '20:00', 4, 'confirmed'),
        ($1, $2, $3, '2026-08-20', '18:00', 2, 'completed');
    `, [userId, firstRest, firstRestTable, secondRest, secondRestTable]);

    console.log("Seeded Sample Bookings.");
    console.log("Database successfully seeded!");

  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end();
  }
}

seedDatabase();
