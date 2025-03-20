import { expect, it } from '@jest/globals';
import { BooksEnv } from './BooksEnv';

it('should get a list of books', async () => {
  const env = new BooksEnv();

  const books = Array.from(
    { length: 100 }, 
    (_, id) => ({ id, title: `Book ${id}`, author: `Author ${id}`, description: `Description ${id}` })
  );

  await env.insertAll(books);
  
  expect(await env.api.books.list(10, 0)).toEqual(books.slice(0, 10));
  expect(await env.api.books.list(10, 10)).toEqual(books.slice(10, 20));
  expect(await env.api.books.list(10, 95)).toEqual(books.slice(95, 100));
});
