import { expect, it } from "@jest/globals";
import { z } from "zod";
import { parseRequest } from "./parseRequest";

it('should parse the request', async () => {
  expect(await parseRequest(
    'http://localhost:3000/api/test?q=query%20string&limit=10&offset=20&user=127',
    {
      q: 'query',
      limit: 'query:number',
      offset: 'query:number',
      user: 'query:number',
      t420: 'body:number',
      deep: 'body.deep.deeper.deepest',
      session: 'cookies',
      apiKey: 'headers.x-api-key',
      dot: 'headers.x\\.dot',
      ck: 'cookies.',
    },
    null,
    {
      body: JSON.stringify({ t420: 422, deep: { deeper: { deepest: 'deepest' } } }),
      cookies: { session: 'secret_session', a: '22' },
      headers: { 'x-api-key': 'api_key', 'x.dot': 'dot.value' },
    }
  )).toEqual({  
    q: 'query string',
    limit: 10,
    offset: 20,
    user: 127,
    t420: 422,
    deep: 'deepest',
    session: 'secret_session',
    apiKey: 'api_key',
    dot: 'dot.value',
    ck: { session: 'secret_session', a: '22' },
  });
});

it('should validate the request', async () => {
  await expect(parseRequest(
    'http://localhost:3000/api/test?q=query%20string&limit=11',
    { q: 'query', limit: 'query' },
    z.object({ q: z.string(), limit: z.number() })
  )).rejects.toThrow("Expected number, received string");
});

