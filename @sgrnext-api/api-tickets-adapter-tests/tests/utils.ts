import path from 'path';
import { TicketsAdapter, TicketsOptions } from "@sgrnext/api-tickets";

export const createAdapter = async (options: TicketsOptions = { }): Promise<TicketsAdapter> => {
  if (process.env.ADAPTER_PATH == null) {
    throw new Error('ADAPTER_PATH is not set');
  }

  const adapterPath = path.join(process.env.ADAPTER_PATH!, 'adapter.ts');
  const factory = await import(adapterPath);
  const result: TicketsAdapter = await factory.createAdapter();

  await result.init(options);

  return result;
};

export const end = async () => {
  if (process.env.ADAPTER_PATH == null) {
    throw new Error('ADAPTER_PATH is not set');
  }

  const adapterPath = path.join(process.env.ADAPTER_PATH!, 'adapter.ts');
  const factory = await import(adapterPath);

  if (typeof factory.end !== 'function') {
    return;
  }

  await factory.end();
}

export const stringToStream = (string: string): ReadableStream => {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(string);
      controller.close();
    },
  });
};

export const streamToString = async (stream: ReadableStream): Promise<string> => {
  const reader = stream.getReader();
  const chunks: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return chunks.join('');
    }

    chunks.push(value);
  }
};
