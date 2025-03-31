import { expect, it } from "@jest/globals";
import { createAdapter, streamToString, stringToStream } from "./utils";

it('can get after upload', async () => {
  const adapter = await createAdapter();

  const uploadResult = await adapter.upload(
    stringToStream('asd'), 
    { 
      externalId: 'testextid', 
      contentType: 'text/plain',
      metadata: { test: 'test' } 
    }
  );
  const getResult = await adapter.get(uploadResult.externalId);
  
  expect(uploadResult.externalId).toBe("testextid");
  expect(uploadResult.contentType).toBe("text/plain");
  expect(uploadResult.metadata).toEqual({ test: 'test' });
  expect(uploadResult.size).toBe(3);

  expect(getResult).toBeDefined();
  expect(getResult!.externalId).toBe("testextid");
  expect(getResult!.contentType).toBe("text/plain");
  expect(getResult!.metadata).toEqual({ test: 'test' });
  expect(getResult!.size).toBe(3);
});

it('can get stream after upload', async () => {
  const adapter = await createAdapter();

  const uploadResult = await adapter.upload(
    stringToStream('asd'), 
    { 
      externalId: 'testextid', 
      contentType: 'text/plain',
      metadata: { test: 'test' } 
    }
  );
  const getResult = await adapter.getWithStream(uploadResult.externalId);
  
  expect(getResult).toBeDefined();
  expect(await streamToString(getResult!.stream)).toBe("asd");
});

it('can update', async () => {
  const adapter = await createAdapter();

  await adapter.upload(
    stringToStream('asd'), 
    { 
      externalId: 'testextid', 
      contentType: 'text/plain',
      metadata: { test: 'test' } 
    }
  );

  const updateResult = await adapter.update({ 
    externalId: 'testextid', 
    filename: 'another-filename.txt',
    contentType: 'another/content-type',
    metadata: { test: 'test2' } 
  });
  const getResult = await adapter.get("testextid");

  expect(updateResult.filename).toEqual('another-filename.txt');
  expect(updateResult.contentType).toEqual('another/content-type');
  expect(updateResult.metadata).toEqual({ test: 'test2' });
  
  expect(getResult!.filename).toEqual('another-filename.txt');
  expect(getResult!.contentType).toEqual('another/content-type');
  expect(getResult!.metadata).toEqual({ test: 'test2' });
});

it('can delete', async () => {
  const adapter = await createAdapter();

  await adapter.upload(stringToStream('asd'), { externalId: 'testextid' });
  await adapter.delete("testextid");

  const getResult = await adapter.get("testextid");
  expect(getResult).toBeNull();
});
