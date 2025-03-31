import { ApiError } from "@sgrnext/api";
import { 
  UpflowAdapter,
  UpflowOptions, 
  UploadOptions, 
  Upload, 
  UploadWithStream, 
  UpdateOptions
} from "@sgrnext/api-upflow";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';

export class GridFSAdapter implements UpflowAdapter {
  public client: MongoClient;
  public bucket: GridFSBucket;

  constructor(client: MongoClient | string) {
    switch (typeof client) {
      case 'string':
        this.client = new MongoClient(client);
        break;

      default:
        this.client = client;
        break;
    }
    this.bucket = new GridFSBucket(this.client.db());
  }

  async init(options: UpflowOptions): Promise<void> {
    for (const key of options.metadataIndexes ?? []) {
      await this.client
        .db()
        .collection('fs.files')
        .createIndex({ [`metadata.metadata.${key}`]: 1 }, { background: true });
    }
  }

  async upload(
    stream: ReadableStream, 
    options: UploadOptions, 
  ): Promise<Upload> {
    const createdAt = new Date();
    const externalId = options.externalId ?? uuidv4();
    const filename = options.filename ?? '';
    const contentType = options.contentType ?? '';
    const metadata = options.metadata ?? {};

    let size = 0;

    
    const writeStream = await this.bucket.openUploadStream(
      filename ?? '', 
      { metadata: { externalId, filename, contentType,  size: 0, metadata, createdAt, updatedAt: createdAt } }
    );
    await new Promise(async (resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);

      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          writeStream.end();
          break;
        }

        writeStream.write(value);
      }
    });

    return {
      id: writeStream.id.toString(),
      externalId,
      metadata: options.metadata ?? {},
      filename: options.filename ?? '',
      contentType: options.contentType ?? '',
      size: writeStream.length,
      createdAt,
      updatedAt: createdAt,
    };
  }

  async get(externalId: string): Promise<Upload | null> {
    const cursor = await this.bucket.find({ 'metadata.externalId': { '$eq': externalId } });
    const file = await cursor.next();

    if (!file) {
      return null;
    }

    return {
      id: file._id.toString(),
      externalId: file.metadata?.externalId as string,
      metadata: file.metadata?.metadata,
      filename: file.filename,
      contentType: file.metadata?.contentType as string,
      size: file.length,
      createdAt: file.metadata?.createdAt as Date,
      updatedAt: file.metadata?.updatedAt as Date,
    };
  }

  async getWithStream(externalId: string): Promise<UploadWithStream | null> {
    const result = await this.get(externalId);
    
    if (result == null) {
      return null;
    }

    const readable = this.bucket.openDownloadStream(new ObjectId(result.id));

    return {
      ...result,
      stream: new ReadableStream({
        async start(controller) {
          for await (const chunk of readable) {
            controller.enqueue(chunk);
          }

          controller.close();
        }
      })
    }
  }

  async update({ externalId, filename, contentType, metadata }: UpdateOptions): Promise<Upload> {
    const file = await this.get(externalId);

    if (file == null) {
      throw new ApiError(404, 'File not found');
    }

    if (filename != null) {
      await this.bucket.rename(new ObjectId(file.id), filename);
    }

    const setter = {} as Record<string, any>;
    if (contentType != null) { setter['metadata.contentType'] = contentType; }
    if (metadata != null) { setter['metadata.metadata'] = metadata; }

    await this.client
      .db()
      .collection('fs.files')
      .updateOne(
        { _id: new ObjectId(file.id) }, 
        { $set: setter }
      );

    return {
      ...file,
      filename: filename ?? '',
      contentType: contentType ?? '',
      metadata: metadata ?? {},
    } as Upload;
  }

  async delete(externalId: string): Promise<void> {
    const file = await this.get(externalId);

    if (file == null) {
      throw new ApiError(404, 'File not found');
    }

    await this.bucket.delete(new ObjectId(file.id));
  }

  async getIndexValue(metadataKey: string, value: string): Promise<number> {
    const result = await this.client
      .db()
      .collection('fs.files')
      .aggregate([
        { $match: { [`metadata.metadata.${metadataKey}`]: { '$eq': value } } },
        { $group: { _id: "name", sum: { $sum: "$length" } } }
      ])
      .toArray();

    return result?.[0]?.sum ?? 0;
  }
}
