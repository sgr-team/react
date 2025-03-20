import { Source } from "./Source";

export class BodyText extends Source {
  async source(): Promise<unknown> {
    return this.env.request.text();
  }
  
  async getValue(path: string[], key: string): Promise<unknown> {
    if (path.length !== 0) {
      throw new Error(`Source (${key}::BodyText) error: path (${path.join('.')}) is not supported`);
    }

    return this.value;
  }
}
