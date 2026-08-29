import { db } from "./connections.ts";
import { users } from "./schema.ts";
import { hashPassword } from "../utils/password.ts";


const seedAdmin = async () => {
  try {
    await db.delete(users).execute();
    console.log("Deleted all existing users.");

    // Hash admin password
    const adminPassword = await hashPassword("fake46");

    // Create admin
    await db.insert(users).values({
      username: "Jirro Admin",
      email: "fake46@gmail.com",
      password: adminPassword,
      role: "admin",
    });

    console.log("Created: Admin");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();