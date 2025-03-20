import { NextRequest } from 'next/server';
import { expect, it } from '@jest/globals';
import { BodyJson } from '@/index';
import { parseRequest } from '../parseRequest';

it('source', async () => {
  const source = new BodyJson(createEnv(JSON.stringify({ a: 1 })));
  
  expect(await source.source()).toEqual({ a: 1 });
});

it('source: invalid json', async () => {
  const source = new BodyJson(createEnv("asdasdas"));
  
  await expect(source.source())
    .rejects
    .toThrow();
});

it('get', async () => {
  const source = new BodyJson(createEnv(JSON.stringify({ a: { b: 42 } })));

  expect(await source.get([ "a", "b" ], "myKey")).toEqual(42);
  expect(await source.get([ "" ], "myKey")).toEqual({ a: { b: 42 } });
});

it('parse-request', async () => {
  expect(
    await parseRequest(
      'http://localhost:3000/api/test',
      { 
        a: 'body.a', 
        answer: 'body',
        abc: 'body.b.deep.deeper.abc',
        und: 'body',
        body: 'body.'
      },
      null,
      {
        body: JSON.stringify({ 
          a: 1,
          answer: 42,
          b: { deep: { deeper: { abc: 2 } } }
        }),
      }
    )
  ).toEqual({
    a: 1,
    answer: 42,
    abc: 2,
    und: undefined,
    body: { a: 1, answer: 42, b: { deep: { deeper: { abc: 2 } } } },
  });
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
