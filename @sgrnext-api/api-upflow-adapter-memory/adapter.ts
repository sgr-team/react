import { MemoryAdapter } from "./src/MemoryAdapter";

export const createAdapter = () => {
  return new MemoryAdapter();
};
