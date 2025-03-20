import { NextRequest } from 'next/server';
import { expect, it } from '@jest/globals';
import { Query } from '@/index';
import { parseRequest } from '../parseRequest';

it('source', async () => {
  const source = new Query(createEnv("a=12df&b=1&b=2&b=4&b=3"));
  
  expect(await source.source())
    .toEqual({ a: "12df", b: [ "1", "2", "4", "3" ] });
});

it('get', async () => {
  const source = new Query(createEnv("a=12d"));

  expect(await source.get([ "a" ], "myKey")).toEqual("12d");
});

it('parse-request', async () => {
  expect(
    await parseRequest(
      'http://localhost:3000/api/test?token=scrt&a=123',
      { token: 'query', all: 'query.' },
      null
    )
  ).toEqual({ token: "scrt", all: { token: "scrt", a: "123" } });
});

const createEnv = (query: string) => {
  return {
    request: new NextRequest(
      `http://localhost:3000/api/test?${query}`, 
      { method: "POST", body: "" }
    ),
    params: Promise.resolve({ })
  };
}
