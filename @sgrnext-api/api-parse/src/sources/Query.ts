import { Source } from "./Source";

export class Query extends Source {
  async source(): Promise<unknown> {
    const sp = new URL(this.env.request.url).searchParams;
    const result = { } as Record<string, unknown>;
    for (const [ key, value ] of sp.entries()) {
      if (result[key] != null && !Array.isArray(result[key])) {
        result[key] = [ result[key], value ];
        continue;
      }

      if (result[key] != null && Array.isArray(result[key])) {
        result[key].push(value);
        continue;
      }
      result[key] = value;
    }

    return result;  
  }
  
  async getValue(path: string[], key: string): Promise<unknown> { 
    if (path.length > 1) {
      throw new Error(`Source (${key}::Query) error: path (${path.join('.')}) is not supported depth > 1`);
    }

    return this.path(path, key);
  }
}
