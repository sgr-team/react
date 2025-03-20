import { Api } from "@/api";
import { Book } from "@/model";
import { pgPool } from "@/server/pg";

export class BooksEnv {
  api = new Api("http://localhost:3000");
  
  async list(): Promise<Book[]> {
    const { rows } = await pgPool.query(`SELECT * FROM "Books" ORDER BY "id"`);
    return rows as Book[];
  }

  async insertAll(books: Book | Book[]): Promise<void> {
    if (!Array.isArray(books)) {
      return this.insertAll([ books ]);
    }

    if (books.length === 0) {
      return;
    }

    const maxId = books.reduce((max, book) => Math.max(max, book.id), 0);
    await pgPool.query(
      `
        INSERT INTO "Books" (id, title, author, description)
        SELECT * FROM json_populate_recordset(null::"Books", $1)
      `, 
      [ JSON.stringify(books) ] 
    );
    await pgPool.query(`ALTER SEQUENCE "Books_id_seq" RESTART WITH ${maxId + 1};`);
  }
}
