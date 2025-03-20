import { expect, it } from '@jest/globals';
import { DateCast } from '@/index';

it('cast', () => {
  const cast = new DateCast();
  
  expect(cast.cast(null)).toEqual(null);
  expect(cast.cast(new Date("2021-01-01"))).toEqual(new Date("2021-01-01"));
  expect(cast.cast("2021-01-01")).toEqual(new Date("2021-01-01"));
  expect(cast.cast(1612156800000)).toEqual(new Date(1612156800000));
});

