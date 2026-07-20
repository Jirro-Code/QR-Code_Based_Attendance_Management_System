import {drizzle} from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.ts";
import {env, isProd} from "../../env.ts";
import {remember} from "@epic-web/remember"

//connection pool is used reuse the connections to the database instead of creating a new connection for each request.
const createPool = () => {
    return mysql.createPool({
        uri: env.DATABASE_URL,
    })
}

//client is the connectoin pool to the mysql database
//if the app is in production, create a new connection pool
//  otherwise, use the remember function to cache the connection pool
let client

if (isProd()) {
    client = createPool();
} else {
    client = remember(`db`, () => createPool());
}

//exports the drizzle client with the schema and default mode
export const db = drizzle(client, {schema, mode: `default`});

export default db;