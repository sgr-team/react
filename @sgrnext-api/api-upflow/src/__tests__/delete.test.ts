import { it } from "@jest/globals";
import { createUpflow } from "./utils/createUpflow";

it('main', async () => {
  const upload = { };
  const upflow = createUpflow(
    { delete: jest.fn().mockResolvedValue(upload) },
  );

  expect(await upflow.delete('123')).toBe(upload);
  expect(upflow.adapter.delete).toHaveBeenCalledWith('123');
});
