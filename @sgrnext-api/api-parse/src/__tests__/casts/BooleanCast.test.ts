import { expect, it } from '@jest/globals';
import { BooleanCast } from '@/index';

it('cast', () => {
  const cast = new BooleanCast();
  
  expect(cast.cast(null)).toEqual(null);
  expect(cast.cast(true)).toEqual(true);
  expect(cast.cast(false)).toEqual(false);
  expect(cast.cast(0)).toEqual(false);
  expect(cast.cast(1)).toEqual(true);
  expect(cast.cast("true")).toEqual(true);
  expect(cast.cast("false")).toEqual(false);
});

