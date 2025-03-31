import { v4 as uuidv4 } from 'uuid';
import { 
  UpflowAdapter,
  UpflowOptions, 
  UploadOptions, 
  Upload, 
  UploadWithStream, 
  UpdateOptions
} from "@sgrnext/api-upflow";
import { ApiError } from '@sgrnext/api';

export class MemoryAdapter implements UpflowAdapter {
  static async readStream(stream: ReadableStream): Promise<string> {
    const reader = stream.getReader();
    const chunks: string[] = [];
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return chunks.join('');
      }
  
      chunks.push(value);
    }
  }

  static async stringToStream(string: string): Promise<ReadableStream> {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(string);
        controller.close();
      },
    });
  }
  
  indexes = new Map<string, Map<string, number>>();
  data = new Map<string, Upload & { data: string }>();

  async init(options: UpflowOptions): Promise<void> {
    for (const index of options.metadataIndexes ?? []) {
      this.indexes.set(index, new Map<string, number>());
    }
  }

  async upload(
    stream: ReadableStream, 
    options: UploadOptions, 
  ): Promise<Upload> {
    const strategy = options.conflictExternalIdResolver ?? 'replace';
    const externalId = options.externalId ?? uuidv4();

    if (this.data.has(externalId)) {
      if (strategy === 'error') {
        throw new ApiError(409, 'Upload already exists');
      }

      this.delete(externalId);
    }

    const data = await MemoryAdapter.readStream(stream);
    const upload: Upload & { data: string } = {
      id: uuidv4(),
      filename: options.filename ?? '',
      contentType: options.contentType ?? '',
      externalId,
      metadata: options.metadata ?? {},
      createdAt: new Date(),
      updatedAt: new Date(),
      size: data.length,
      data,
    };

    this.data.set(externalId, upload);

    for (const [ key, value ] of Object.entries(upload.metadata)) {
      if (!this.indexes.has(key)) {
        continue;
      }

      const index = this.indexes.get(key)!;
      index.set(value, (index.get(value) ?? 0) + upload.size);
    }

    return upload;
  }

  async get(externalId: string): Promise<Upload | null> {
    return this.data.get(externalId) ?? null;
  }

  async getWithStream(externalId: string): Promise<UploadWithStream | null> {
    const upload = this.data.get(externalId);
    if (upload == null) {
      return null;
    }

    return {
      ...upload,
      stream: await MemoryAdapter.stringToStream(upload.data),
    };
  }

  async update(options: UpdateOptions): Promise<Upload> {
    const upload = this.data.get(options.externalId);
    if (upload == null) {
      throw new ApiError(404, `Upload ${JSON.stringify(options.externalId)} not found`);
    }

    for (const [ key, value ] of Object.entries(upload.metadata)) {
      if (!this.indexes.has(key)) {
        continue;
      }

      const index = this.indexes.get(key)!;
      index.set(value, Math.max(0, (index.get(value) ?? 0) - upload.size));
    }

    for (const [ key, value ] of Object.entries(options.metadata ?? { })) {
      if (!this.indexes.has(key)) {
        continue;
      }

      const index = this.indexes.get(key)!;
      index.set(value, (index.get(value) ?? 0) + upload.size);
    }

    if (options.filename != null) {
      upload.filename = options.filename;
    }
    if (options.contentType != null) {
      upload.contentType = options.contentType;
    }
    if (options.metadata != null) {
      upload.metadata = options.metadata;
    }

    return upload;
  }

  async delete(externalId: string): Promise<void> {
    const upload = this.data.get(externalId);
    if (upload == null) {
      throw new ApiError(404, 'Upload not found');
    }

    for (const [ key, value ] of Object.entries(upload.metadata)) {
      if (!this.indexes.has(key)) {
        continue;
      }

      const index = this.indexes.get(key)!;
      index.set(value, Math.max(0, (index.get(value) ?? 0) - upload.size));
    }

    this.data.delete(externalId);
  }

  async getIndexValue(metadataKey: string, value: string): Promise<number> {
    const index = this.indexes.get(metadataKey);
    if (index == null) {
      throw new Error(`Index ${metadataKey} not found. Use init method to create indexes.`);
    }

    return index.get(value) ?? 0;
  }
}