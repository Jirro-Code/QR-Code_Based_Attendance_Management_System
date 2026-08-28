import { db } from "./connections.ts";
import { users } from "./schema.ts";
import { hashPassword } from "../utils/password.ts";

const strands = [
  "ICT",
  "HRCTO",
  "HUMSS",
  "STEM",
  "GAS",
  "AAD",
  "ABM",
] as const;

const roles = ["user", "admin"] as const;

const sections = [
  "12-1",
  "12-2",
  "12-3",
  "12-4",
  "12-5",
  "12-6",
  "12-7",
  "12-8",
  "12-9",
];

const seedUsers = async () => {
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
      role: roles[1],
    });

    console.log("Created: Admin");

    // Hash student password once
    const studentPassword = await hashPassword("icpicp");

    let count = 1;

    for (const strand of strands) {
      for (let i = 0; i < 50; i++) {
        const number = count.toString().padStart(3, "0");

        const studentLRN = count
          .toString()
          .padStart(12, "0");

        // 2025-0001-ICP, 2025-0002-ICP ... 2025-0700-ICP
        const studentId = `2025-${count
          .toString()
          .padStart(4, "0")}-ICP`;

        // 12-1 hanggang 12-9, then balik sa 12-1
        const section = sections[i % sections.length];

        await db.insert(users).values({
          username: `Test${number}`,
          email: `test${count}@gmail.com`,
          password: studentPassword,
          role: roles[0],
          studentId,
          studentLRN,
          studentStrand: strand,
          studentSection: section,
        });

        count++;
      }
    }

    console.log("Successfully seeded students + 1 admin.");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();