import { initializeSchema, bootstrapAdminUser } from "./config/initDb.js";


export async function seedDatabase() {
  console.log("Starting Production Database Bootstrap...");

  // 1. Verify schema & indexes
  await initializeSchema();

  // 2. Bootstrap initial administrator account
  await bootstrapAdminUser();

  console.log("Production Database Bootstrap completed successfully.");
}

// Allows running directly via `npm run seed` or `node seedDb.js`
const isMainScript = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("seedDb.js");
if (isMainScript) {
  seedDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("Bootstrap error:", err.message);
      process.exit(1);
    });
}
