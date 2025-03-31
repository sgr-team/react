import { afterAll } from '@jest/globals';
import { end } from "./utils";

afterAll(async () => {
  await end();
});
