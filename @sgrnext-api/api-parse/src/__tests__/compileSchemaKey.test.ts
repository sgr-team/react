import { expect, it } from "@jest/globals";
import { compileSchemaKey } from "@/index";

it('should compile schema key', () => {
  expect(compileSchemaKey('body:number:date'))
    .toEqual({ source: 'body', path: [], cast: ['number', 'date'] });
  expect(compileSchemaKey('body.:boolean'))
    .toEqual({ source: 'body', path: [ '' ], cast: ['boolean'] });
  expect(compileSchemaKey('body.deep.path.wth.4:number'))
    .toEqual({ source: 'body', path: [ 'deep', 'path', 'wth', '4' ], cast: ['number'] });
});

it('escape sequences', () => {
  expect(compileSchemaKey(`bo\\.\\:dy.f\\.i\\::bo\\.o\\:lean`))
    .toEqual({ source: 'bo.:dy', path: [ 'f.i:' ], cast: ['bo.o:lean'] });
});