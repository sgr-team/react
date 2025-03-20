import { ApiError } from "@sgrnext/api";
import { Books } from "./Books";

export class Api {
  books = new Books(this);

  constructor(
    public prefix: string = "",
    public fetchFn: typeof fetch = (...args) => global.fetch(...args),
  ) { }

  async fetch<Req = unknown, Res = unknown>(
    url: string, 
    options: RequestInit,
    body: Req | null = null
  ): Promise<Res> {
    if (body != null) {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await this.fetchFn(`${this.prefix}${url}`, options);

    const text = await response.text();
    if (response.ok) {
      if (text == null || text.length === 0) {
        return null as Res;
      }

      return JSON.parse(text) as Res;
    }

    throw new ApiError(response.status, text);
  }

  async get<Res>(url: string, options: RequestInit = { }): Promise<Res> {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  async post<Req, Res>(url: string, body: Req | null = null, options: RequestInit = { },): Promise<Res> {
    return this.fetch(url, { ...options, method: 'POST' }, body);
  }

  async put<Req, Res>(url: string, body: Req | null = null, options: RequestInit = { }): Promise<Res> {
    return this.fetch(url, { ...options, method: 'PUT' }, body);
  }

  async delete<Req, Res>(url: string, body: Req | null = null, options: RequestInit = { }): Promise<Res> {
    return this.fetch(url, { ...options, method: 'DELETE' }, body);
  }
}