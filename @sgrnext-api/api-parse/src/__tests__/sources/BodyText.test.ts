import { NextRequest } from 'next/server';
import { expect, it } from '@jest/globals';
import { BodyText } from '@/index';
import { parseRequest } from '../parseRequest';

it('source', async () => {
  const source = new BodyText(createEnv("qwe123"));
  
  expect(await source.source()).toEqual("qwe123");
});

it('get', async () => {
  const source = new BodyText(createEnv("qwe123"));

  expect(await source.get([ ], "myKey")).toEqual('qwe123');
});

it('get: path is not supported', async () => {
  const source = new BodyText(createEnv("qwe123"));

  await expect(source.get([ "a" ], "myKey")).rejects.toThrow("path (a) is not supported");
});

it('parse-request', async () => {
  expect(
    await parseRequest(
      'http://localhost:3000/api/test',
      { a: 'body[text]' },
      null,
      { body: "qwe123" }
    )
  ).toEqual({ a: "qwe123" });
});

const createEnv = (body: string) => {
  return {
    request: new NextRequest(
      "http://localhost:3000/api/test", 
      { method: "POST", body }
    ),
    params: Promise.resolve({ })
  };
}
