import { expect, it } from '@jest/globals';
import { NumberCast } from '@/index';

it('cast', () => {
  const cast = new NumberCast();
  
  expect(cast.cast(null)).toEqual(null);
  expect(cast.cast(1)).toEqual(1);
  expect(cast.cast("12")).toEqual(12);
  expect(cast.cast("12s")).toEqual(NaN);
});

