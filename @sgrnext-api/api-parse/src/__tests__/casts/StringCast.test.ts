import { expect, it } from '@jest/globals';
import { StringCast } from '@/index';

it('cast', () => {
  const cast = new StringCast();
  
  expect(cast.cast(null)).toEqual(null);
  expect(cast.cast(1)).toEqual("1");
  expect(cast.cast("abs")).toEqual("abs");
});

