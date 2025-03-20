import { Source } from "./Source";

export class BodyJson extends Source {
  async source(): Promise<unknown> {
    return this.env.request.json();
  }
  
  async getValue(path: string[], key: string): Promise<unknown> {
    return this.path(path, key);
  }
}
