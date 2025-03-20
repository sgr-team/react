import { afterAll, beforeAll, beforeEach } from "@jest/globals";
import { pgPool } from "@/server/pg";

beforeEach(async () => {
  await pgPool.query(`
    DELETE FROM "Books";
    ALTER SEQUENCE "Books_id_seq" RESTART WITH 1;
  `);
});

beforeAll(async () => {
   if (pgPool.ended) {  
     await pgPool.connect();
   }
});

afterAll(async () => {
  await pgPool.end();
});
