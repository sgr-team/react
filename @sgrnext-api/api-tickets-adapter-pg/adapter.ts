import { PGAdapter } from "./src/PGAdapter";

const adapter = new PGAdapter("postgres://postgres:123456@localhost:15433/main");

export const createAdapter = async () => {
  await adapter.pool.query(`DROP TABLE IF EXISTS "Tickets";`);

  return adapter;
};

export const end = async () => {
  await adapter.pool.end();
};