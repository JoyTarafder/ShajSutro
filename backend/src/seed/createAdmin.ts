/**
 * Run once to create the admin account:
 *   npx ts-node src/seed/createAdmin.ts
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const ADMIN = {
  name: "ShajSutro Admin",
  email: "admin@shajsutro.com",
  password: "Admin@1234",
  role: "admin" as const,
};

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: "shajsutro" });
  console.log("Connected to MongoDB");

  // Upsert — delete and recreate so password is always fresh
  await User.deleteOne({ email: ADMIN.email });
  await User.create(ADMIN);
  console.log("✓ Admin created successfully");
  console.log(`  Email   : ${ADMIN.email}`);
  console.log(`  Password: ${ADMIN.password}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
