import { Pool } from "pg";

export const pgPool = new Pool({ connectionString: process.env.PG_CONNECTION_STRING! });
