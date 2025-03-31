import { ApiError, HandlerEnvironment } from "@sgrnext/api";
import { UpflowAdapter } from "./UpflowAdapter";
import { UpdateOptions, UpflowOptions } from "./model";
import { LimitError, Upload, UploadOptions, UploadWithStream } from "./model";

export class Upflow {
  constructor(
    public env: HandlerEnvironment,
    public adapter: UpflowAdapter,
    public options: UpflowOptions,
    public inited: Promise<void>
  ) { }

  async upload(
    options: string | UploadOptions = { }, 
    stream: ReadableStream = this.env.request.body as ReadableStream,
  ): Promise<Upload> {
    await this.inited;

    if (stream == null) {
      throw new ApiError(400, 'Request body is required to upload a file');
    }

    if (options == null) {
      options = { };
    }

    if (typeof options === 'string') {
      options = { externalId: options };
    }

    try {
      return await this.adapter.upload(
        stream, 
        { 
          ...options, 
          conflictExternalIdResolver: options.conflictExternalIdResolver ?? this.options.conflictExternalIdResolver,
        }
      );
    } catch (error) {
      if (error instanceof LimitError) {
        throw new ApiError(402, error.message);
      }

      throw error;
    }
  }
  
  async get(externalId: string): Promise<Upload | null> {
    await this.inited;

    return await this.adapter.get(externalId);
  }

  async getWithStream(externalId: string): Promise<UploadWithStream | null> {
    await this.inited;

    return await this.adapter.getWithStream(externalId);
  }

  async response(externalId: string, notFoundErrorMessage: string): Promise<Response> {
    await this.inited;

    const result = await this.adapter.getWithStream(externalId);
    return result == null 
      ? new Response(notFoundErrorMessage, { status: 404 }) 
      : new Response(
        result.stream, 
        { 
          status: 200,
          headers: { 'Content-Type': result.contentType },
        }
      );
  }

  async update(options: UpdateOptions): Promise<Upload> {
    await this.inited;

    return await this.adapter.update(options);
  }

  async delete(externalId: string): Promise<void> {
    await this.inited;

    return await this.adapter.delete(externalId);
  }
}
