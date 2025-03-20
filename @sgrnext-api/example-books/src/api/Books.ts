import { Book } from "@/model";
import { Api } from ".";

export class Books {
  constructor(private readonly api: Api) { }

  async list(limit: number, offset: number): Promise<Book[]> {
    return this.api.get(`/api/books?limit=${limit}&offset=${offset}`);
  }

  async get(id: number): Promise<Book> {
    return this.api.get(`/api/books/${id}`);
  }

  async create(book: Omit<Book, 'id'>): Promise<{ id: number }> {
    return this.api.post("/api/books", book);
  }

  async update({ id, ...book }: Book): Promise<void> {
    return this.api.put(`/api/books/${id}`, book);
  }

  async delete(id: number): Promise<void> {
    return this.api.delete(`/api/books/${id}`);
  }
}
