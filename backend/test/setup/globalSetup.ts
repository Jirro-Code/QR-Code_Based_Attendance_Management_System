import db from "../../src/db/connections.ts";
import { users, events, attendance } from "../../src/db/schema.ts";
import { sql } from "drizzle-orm";
import { execSync } from "child_process"; 

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

const assertIsolatedTestDatabase = () => {
    if (!testDatabaseUrl || !testDatabaseUrl.startsWith("postgresql://") || testDatabaseUrl.includes("******")) {
        throw new Error("TEST_DATABASE_URL must be set to an isolated PostgreSQL test database before running integration tests.");
    }
    
    const databaseName = new URL(testDatabaseUrl).pathname.slice(1);
    if (databaseName !== "attendscan_test") {
        throw new Error(`Refusing destructive test setup for database "${databaseName}". TEST_DATABASE_URL must target attendscan_test.`);
    }
};

export default async function setUp() {
    console.log("Setting up test environment...");
    
    assertIsolatedTestDatabase();
    
    try{
        await db.execute(sql`select 1`);
        
        const tablestToDrop = [attendance, events, users];
        
        for (const table of tablestToDrop) {
            await db.execute(sql`DROP TABLE IF EXISTS ${table} CASCADE`);
        };
        
        console.log("Pushing schema using drizzle...");
        execSync("npx drizzle-kit push --force", {
            // inherit used to visually see the normal output of the command in the console
            stdio: "inherit",
            cwd: process.cwd()
        });
        
        console.log("Test environment setup complete.");
    }
    catch (e){
        console.error("Error setting up test environment:", e);
        throw e;
    }
    
    return async () => {
        try{
            const tablestToDrop = [attendance, events, users];
            
            for (const table of tablestToDrop) {
                await db.execute(sql`DROP TABLE IF EXISTS ${table} CASCADE`);
            };
            
            console.log("Test environment cleanup complete.");
        }
        catch (e){
            console.error("Error during test environment cleanup:", e);
            throw e;
        }
    }
}