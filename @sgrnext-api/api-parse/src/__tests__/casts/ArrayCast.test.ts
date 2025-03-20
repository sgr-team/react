import { expect, it } from '@jest/globals';
import { ArrayCast } from '@/index';

it('cast', () => {
  const cast = new ArrayCast();
  
  expect(cast.cast(null)).toEqual([ null ]);
  expect(cast.cast([ 1, 2 ])).toEqual([ 1, 2 ]);
  expect(cast.cast(3)).toEqual([ 3 ]);
});

