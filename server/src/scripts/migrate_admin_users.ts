import mongoose from "mongoose";
import { config } from "../config/index.js";
import { User } from "../models/User.js";

/**
 * Migration script:
 * 1. Sets `userType: "user"` on any existing users that do not have `userType` set.
 * 2. Promotes users matching `ADMIN_EMAILS` (from env) or CLI email args to `userType: "admin"`.
 *
 * Usage:
 *   npx tsx src/scripts/migrate_admin_users.ts [email1@example.com email2@example.com]
 */
async function migrateAdminUsers() {
  const cliEmails = process.argv.slice(2).map((e) => e.trim().toLowerCase()).filter(Boolean);
  const envEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const adminEmails = Array.from(new Set([...envEmails, ...cliEmails]));

  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");

  try {
    const defaultResult = await User.updateMany(
      { userType: { $exists: false } },
      { $set: { userType: "user" } }
    );
    console.log(`Set default userType="user" on ${defaultResult.modifiedCount} existing user(s).`);

    if (adminEmails.length === 0) {
      console.log("No admin emails provided via ADMIN_EMAILS or CLI arguments. Skipping admin promotion.");
      return;
    }

    const adminResult = await User.updateMany(
      { email: { $in: adminEmails } },
      { $set: { userType: "admin" } }
    );
    console.log(`Promoted ${adminResult.modifiedCount} user(s) to userType="admin" for: ${adminEmails.join(", ")}`);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

migrateAdminUsers().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
