import { expect, it } from "@jest/globals";
import { createAdapter, streamToString, stringToStream } from "./utils";
import { UpflowOptions } from "@sgrnext/api-upflow";

it('see valid indexes after upload', async () => {
  const adapter = await prepare({ metadataIndexes: [ 'a', 'b', 't' ] });

  await adapter.upload(
    stringToStream('42'), 
    { 
      externalId: 'testextid', 
      contentType: 'text/plain',
      metadata: { a: 'F', b: "2", t: "t_0" } 
    }
  );
  
  expect(await adapter.getIndexValue('a', 'F')).toEqual(5);
  expect(await adapter.getIndexValue('b', '2')).toEqual(2);
  expect(await adapter.getIndexValue('t', 't_0')).toEqual(42);
  expect(await adapter.getIndexValue('t', 't_1')).toEqual(30);
});

it('see valid indexes after update metadata', async () => {
  const adapter = await prepare({ metadataIndexes: [ 'a', 'b', 't' ] });

  await adapter.update(
    { externalId: '0', metadata: { a: 'F' } }
  );
  
  expect(await adapter.getIndexValue('a', 'F')).toEqual(13);
  expect(await adapter.getIndexValue('t', 't_0')).toEqual(30);
});

it('see valid indexes after delete', async () => {
  const adapter = await prepare({ metadataIndexes: [ 'a', 'b', 't' ] });

  await adapter.delete('0');

  expect(await adapter.getIndexValue('t', 't_0')).toEqual(30);
  expect(await adapter.getIndexValue('t', 't_1')).toEqual(30);
});

const prepare = async (options: UpflowOptions) => {
  const adapter = await createAdapter(options);

  await adapter.upload(stringToStream('asd'), { externalId: 'first', metadata: { a: 'F' } });
  await adapter.upload(stringToStream('qwerty'), { externalId: 'second', metadata: { a: 'Q' } });

  for (let i = 0; i < 10; i++) {
    await adapter.upload(
      stringToStream(`0123456789`), 
      { externalId: `${i}`, metadata: { t: `t_${i % 3}` } }
    );
  }

  return adapter;
};