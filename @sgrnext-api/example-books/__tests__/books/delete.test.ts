import { expect, it } from '@jest/globals';
import { BooksEnv } from './BooksEnv';

it('should update a book', async () => {
  const env = new BooksEnv();
  await env.insertAll([
    { id: 1, title: 'Test Book', author: 'Author1', description: 'd1' },
    { id: 2, title: 'Another Book', author: 'Author2', description: 'd2' }
  ]);

  await env.api.books.delete(1);

  expect(await env.list()).toEqual([
    { id: 2, title: 'Another Book', author: 'Author2', description: 'd2' }
  ]);
});

it('should return 404 if book not found', async () => {
  const env = new BooksEnv();

  await expect(env.api.books.delete(100))
    .rejects
    .toThrow('Book not found');
});
