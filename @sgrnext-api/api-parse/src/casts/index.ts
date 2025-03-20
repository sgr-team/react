import { ArrayCast } from "./ArrayCast";
import { BooleanCast } from "./BooleanCast";
import { Cast } from "./Cast";
import { DateCast } from "./DateCast";
import { NumberCast } from "./NumberCast";
import { StringCast } from "./StringCast";

export * from "./ArrayCast";
export * from "./BooleanCast";
export * from "./Cast";
export * from "./DateCast";
export * from "./NumberCast";
export * from "./StringCast";

export const CASTS: Record<string, Cast> = {
  array: new ArrayCast(),
  boolean: new BooleanCast(),
  date: new DateCast(),
  number: new NumberCast(),
  string: new StringCast(),
};
