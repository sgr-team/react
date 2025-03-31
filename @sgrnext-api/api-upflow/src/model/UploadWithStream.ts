import { Upload } from "./Upload";

export type UploadWithStream = Upload & {
  stream: ReadableStream;
};