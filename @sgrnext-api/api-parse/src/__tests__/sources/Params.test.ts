import { NextRequest } from 'next/server';
import { expect, it } from '@jest/globals';
import { Params } from '@/index';

it('source', async () => {
  const source = new Params(createEnv({ a: "12df" }));
  
  expect(await source.source()).toMatchObject({ a: "12df" });
});

it('get', async () => {
  const source = new Params(createEnv({ a: "q12" }));

  expect(await source.get([ "a" ], "myKey")).toEqual("q12");
});

const createEnv = (params: Record<string, string>) => {
  return {
    request: new NextRequest(
      "http://localhost:3000/api/test", 
      { method: "POST", body: "" }
    ),
    params: Promise.resolve(params)
  };
}
