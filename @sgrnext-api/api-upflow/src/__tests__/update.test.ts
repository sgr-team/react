import { it } from "@jest/globals";
import { createUpflow } from "./utils/createUpflow";

it('main', async () => {
  const upload = { };
  const upflow = createUpflow(
    { update: jest.fn().mockResolvedValue(upload) },
  );

  expect(await upflow.update({ externalId: '123', metadata: { 'key': '42' } })).toBe(upload);
  expect(upflow.adapter.update).toHaveBeenCalledWith({
    externalId: "123", 
    metadata: { key: "42" }
  });
});
