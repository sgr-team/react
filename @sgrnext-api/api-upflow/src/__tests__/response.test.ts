import { it } from "@jest/globals";
import { createUpflow } from "./utils/createUpflow";

it('main', async () => {
  await testResponse({
    upload: {
      id: '123',
      externalId: '123',
      filename: 'test.txt',
      contentType: 'text/plain',
      size: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      stream: stringToStream('test_content'),
    }, 
    status: 200, 
    body: 'test_content', 
    headers: { 'content-type': 'text/plain' }
  });
});

it('not found', async () => {
  await testResponse({
    upload: null, 
    status: 404, 
    body: 'not_found_message_from_test', 
  });
});

const testResponse = async ({ upload, status, body, headers }: {
  upload: unknown,
  status: number,
  body: string | null,
  headers?: Record<string, string> | null,
}
) => {
  const upflow = createUpflow(
    { getWithStream: jest.fn().mockResolvedValue(upload) },
  );

  const response = await upflow.response('123', "not_found_message_from_test");

  expect(response.status).toBe(status);
  expect(response.body == null ? null : await readStream(response.body)).toBe(body);
  if (headers != null) {
    expect(Object.fromEntries(response.headers)).toEqual(headers);
  }
}

const readStream = async (stream: ReadableStream): Promise<string> => {
  const reader = stream.getReader();
  const chunks: string[] = [];
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return chunks.join('');
    }

    if (typeof value !== 'string') {
      chunks.push(decoder.decode(value as unknown as ArrayBuffer));
      continue;
    }

    chunks.push(value);
  }
}

const stringToStream = (string: string): ReadableStream => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(string);
      controller.close();
    },
  });
}