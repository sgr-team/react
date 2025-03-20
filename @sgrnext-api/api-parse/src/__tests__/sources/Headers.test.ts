import { NextRequest } from 'next/server';
import { expect, it } from '@jest/globals';
import { Headers } from '@/index';
import { parseRequest } from '../parseRequest';

it('source', async () => {
  const source = new Headers(createEnv({ a: "12df" }));
  
  expect(await source.source()).toMatchObject({ a: "12df" });
});

it('get', async () => {
  const source = new Headers(createEnv({ a: "q12" }));

  expect(await source.get([ "a" ], "myKey")).toEqual("q12");
});

it('get: unsupported path', async () => {
  const source = new Headers(createEnv({ a: "q12" }));

  await expect(source.get([ "a", "b" ], "myKey"))
    .rejects
    .toThrow("path (a.b) is not supported");
});

it('parse-request', async () => {
  expect(
    await parseRequest(
      'http://localhost:3000/api/test',
      { token: 'headers', all: 'headers.' },
      null,
      { 
        headers: { token: "scrt", a: "123" }
      }
    )
  ).toEqual({ token: "scrt", all: { token: "scrt", a: "123" } });
});

const createEnv = (headers: Record<string, string>) => {
  const result = {
    request: new NextRequest(
      "http://localhost:3000/api/test", 
      { method: "POST", body: "" }
    ),
    params: Promise.resolve({ })
  };

  for (const [key, value] of Object.entries(headers)) {
    result.request.headers.set(key, value);
  }

  return result;
}
