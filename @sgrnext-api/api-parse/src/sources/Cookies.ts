import { Source } from "./Source";

export class Cookies extends Source {
  async source(): Promise<unknown> {
    const result = { } as Record<string, string>;
    for (const [ key, { value } ] of this.env.request.cookies) {
      result[key] = value;
    }

    return result;
  }
  
  async getValue(path: string[], key: string): Promise<unknown> {
    if (path.length > 1) {
      throw new Error(`Source (${key}::Cookies) error: path (${path.join('.')}) is not supported depth > 1`);
    }

    return this.path(path, key);
  }
}
