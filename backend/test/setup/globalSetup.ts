import db from "../../src/db/connections.ts";
import { users, events, attendance } from "../../src/db/schema.ts";
import { sql } from "drizzle-orm";
import { execSync } from "child_process"; 

export default async function setUp() {
    console.log("Setting up test environment...");
    
    try{
        const tablestToDrop = [attendance, events, users];
        
        for (const table of tablestToDrop) {
            await db.execute(sql`DROP TABLE IF EXISTS ${table} CASCADE`);
        };
        
        console.log("Pushing schema using drizzle...");
        execSync("npx drizzle-kit push", {
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
            
            process.exit(0);
        }
        catch (e){
            console.error("Error during test environment cleanup:", e);
            throw e;
        }
    }
}