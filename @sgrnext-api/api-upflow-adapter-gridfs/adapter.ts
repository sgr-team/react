import { GridFSAdapter } from "./src/GridFSAdapter";

const adapter = new GridFSAdapter("mongodb://root:123456@localhost:12181");

export const createAdapter = async () => {
  await adapter.client.db().dropDatabase();
  return adapter;
};

export const end = async () => {
  await adapter.client.close();
}