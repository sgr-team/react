import { Cast } from "./Cast";

export class DateCast extends Cast {
  public cast(value: unknown): unknown {
    if (value == null) {
      return value;
    }

    return new Date(value as string);
  }
}
