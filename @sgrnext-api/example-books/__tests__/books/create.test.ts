import { expect, it } from '@jest/globals';
import { BooksEnv } from './BooksEnv';

it('should create a book', async () => {
  const env = new BooksEnv();

  const book1 = await env.api.books.create({ title: 'Test Book', author: 'Author1', description: 'd1' });
  const book2 = await env.api.books.create({ title: 'Another Book', author: 'Author2', description: 'd2' });
  
  expect([ book1, book2 ]).toEqual([ 1, 2 ]);
  expect(await env.list()).toEqual([
    { id: 1, title: 'Test Book', author: 'Author1', description: 'd1' },
    { id: 2, title: 'Another Book', author: 'Author2', description: 'd2' },
  ]);
});