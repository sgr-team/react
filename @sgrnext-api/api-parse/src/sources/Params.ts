import { HandlerEnvironment } from "@sgrnext/api";
import { Source } from "./Source";

export class Params extends Source {
  async source(): Promise<unknown> {
    return this.env.params;
  }
  
  async getValue(path: string[], key: string): Promise<unknown> {
    return this.path(path, key);
  }
}
