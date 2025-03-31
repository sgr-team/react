import { it } from "@jest/globals";
import { createUpflow } from "./utils/createUpflow";

it('main', async () => {
  const upload = { };
  const upflow = createUpflow(
    { get: jest.fn().mockResolvedValue(upload) },
  );

  expect(await upflow.get('123')).toBe(upload);
});
