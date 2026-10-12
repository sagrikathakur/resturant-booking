import bcrypt from "bcrypt";
import * as UserModel from "../models/userRegister.js";
import { runMigrations } from "./migrate.js";


export async function initializeSchema() {
  await runMigrations();
}


export async function bootstrapAdminUser() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@quickdine.com").trim().toLowerCase();
    const existingAdmin = await UserModel.findUserByEmail(adminEmail);

    if (!existingAdmin) {
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Secure2026";
      const adminName = process.env.ADMIN_NAME || "System Administrator";
      const adminPhone = process.env.ADMIN_PHONE || "+10000000000";

      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await UserModel.createUser({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        phone: adminPhone,
        role: "owner",
      });

      console.log(`Initial admin bootstrapped: ${adminEmail}`);
    }
  } catch (err) {
    console.error("Admin bootstrap error:", err.message);
  }
}


export async function initializeDatabase() {
  try {
    await initializeSchema();
    await bootstrapAdminUser();
    return true;
  } catch (err) {
    console.error("Database initialization failed:", err.message);
    return false;
  }
}

const isMainScript = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("initDb.js");
if (isMainScript) {
  initializeDatabase()
    .then((success) => process.exit(success ? 0 : 1))
    .catch((err) => {
      console.error("Fatal initialization error:", err);
      process.exit(1);
    });
}
