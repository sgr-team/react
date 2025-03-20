import { expect, it } from '@jest/globals';
import { BooksEnv } from './BooksEnv';

it('should get a book', async () => {
  const env = new BooksEnv();

  const books = [
    { id: 1, title: 'Test Book', author: 'Author1', description: 'd1' },
    { id: 2, title: 'Another Book', author: 'Author2', description: 'd2' }
  ];

  await env.insertAll(books);
  
  expect(await env.api.books.get(1)).toEqual(books[0]);
  expect(await env.api.books.get(2)).toEqual(books[1]);
});

it('should return 404 if book not found', async () => {
  const env = new BooksEnv();

  await expect(env.api.books.get(100))
    .rejects
    .toThrow('Book not found');
});
