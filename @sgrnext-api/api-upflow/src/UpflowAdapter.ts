import { 
  UpdateOptions,
  UpflowOptions, 
  Upload, 
  UploadOptions, 
  UploadWithStream 
} from "./model";

export interface UpflowAdapter {
  init(options: UpflowOptions): Promise<void>;
  upload(stream: ReadableStream, options: UploadOptions): Promise<Upload>;
  get(externalId: string): Promise<Upload | null>;
  getWithStream(externalId: string): Promise<UploadWithStream | null>;
  update(options: UpdateOptions): Promise<Upload>;
  delete(externalId: string): Promise<void>;
  getIndexValue(metadataKey: string, value: string): Promise<number>;
}
