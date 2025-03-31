import { UpdateOptions, UpflowOptions, Upload, UploadWithStream } from "@/model";
import { UploadOptions } from "@/model";
import { UpflowAdapter } from "@/UpflowAdapter";

export class FakeAdapter implements UpflowAdapter {
  constructor(
    public options: FakeAdapterOptions
  ) { 
    for (const [ key, value ] of Object.entries(options)) {
      (this as Record<string, unknown>)[key] = value;
    }
  }

  async init(_options: UpflowOptions): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async upload(_stream: ReadableStream, _options: UploadOptions): Promise<Upload> {
    throw new Error("Method not implemented.");
  }

  async get(_externalId: string): Promise<Upload | null> {
    throw new Error("Method not implemented.");
  }

  async getWithStream(_externalId: string): Promise<UploadWithStream | null> {
    throw new Error("Method not implemented.");
  }

  async update(_options: UpdateOptions): Promise<Upload> {
    throw new Error("Method not implemented.");
  }

  async delete(_externalId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getIndexValue(metadataKey: string, value: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
}

export type FakeAdapterOptions = {
  init?: UpflowAdapter['init'];
  upload?: UpflowAdapter['upload'];
  get?: UpflowAdapter['get'];
  getWithStream?: UpflowAdapter['getWithStream'];
  update?: UpflowAdapter['update'];
  delete?: UpflowAdapter['delete'];
  getIndexValue?: UpflowAdapter['getIndexValue'];
}
