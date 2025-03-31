import { it } from "@jest/globals";
import { createUpflow } from "./utils/createUpflow";

it('without any options', async () => {
  const upload = { };
  const upflow = createUpflow(
    { upload: jest.fn().mockResolvedValue(upload) },
    'body content'
  );

  const result = await upflow.upload();

  expect(result).toBe(upload);
  expect(upflow.adapter.upload).toHaveBeenCalledWith(
    expect.any(ReadableStream),
    expect.objectContaining({ })
  );
});

it('upload with externalId', async () => {
  const upload = { };
  const upflow = createUpflow(
    { upload: jest.fn().mockResolvedValue(upload) },
    'body content'
  );

  const result = await upflow.upload('42');

  expect(result).toBe(upload);
  expect(upflow.adapter.upload).toHaveBeenCalledWith(
    expect.any(ReadableStream),
    expect.objectContaining({ externalId: '42' })
  );
});

it('upload without body', async () => {
  const upflow = createUpflow(
    { upload: jest.fn().mockResolvedValue({}) }
  );

  await expect(upflow.upload())
    .rejects
    .toThrow('Request body is required to upload a file');
});
