import {drizzle} from "drizzle-orm/node-postgres";
import * as schema from "./schema.ts";
import {env, isProd} from "../../env.ts";
import {remember} from "@epic-web/remember"
import { Pool } from "pg";
import { sql } from "drizzle-orm";

//connection pool is used reuse the connections to the database instead of creating a new connection for each request.
const createPool = () => {
    return new Pool({
        connectionString: env.DATABASE_URL,
        max: 10, // maximum number of clients in the pool
        connectionTimeoutMillis: 5000, // return an error after 2 seconds if connection could not be established
        idleTimeoutMillis: 20000, // close idle clients after 20 seconds
        maxLifetimeSeconds: 1800, // close clients after 30 minutes
    })
}

//client is the connectoin pool to the postgresql database
//if the app is in production, create a new connection pool
//otherwise, use the remember function to cache the connection pool
let client

if (isProd()) {
    client = createPool();
} else {
    client = remember(`db`, () => createPool());
}

//exports the drizzle client with the schema and default mode
export const db = drizzle({client, schema});

export const initializeDatabase = async () => {
    await db.execute(sql`select 1`);
};

export default db;