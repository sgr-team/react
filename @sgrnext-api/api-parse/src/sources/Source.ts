import { ApiError, HandlerEnvironment } from "@sgrnext/api";

export abstract class Source {
  abstract source(): Promise<unknown>;
  abstract getValue(path: string[], key: string): Promise<unknown>;
  
  protected value: unknown;
  protected inited = false;

  constructor(
    protected readonly env: HandlerEnvironment
  ) { }

  async get(
    path: string[],
    key: string
  ): Promise<unknown> {
    if (!this.inited) {
      this.value = await this.source();
      this.inited = true;
    }

    return this.getValue(path, key);
  }

  protected path(path: string[], key: string) {
    if (path.length === 1 && path[0] === '') {
      return this.value;
    }

    if (path.length === 0) {
      path = [ key ];
    }

    let result = this.value;
    for (let i = 0; i < path.length; i++) {
      const part = path[i];

      if (result == null) {
        throw new ApiError(400, `Source (${key}) error: ${path.join(".")} is not a valid path`);
      }

      result = (result as Record<string, unknown>)[part];
    }

    return result;
  }
}
