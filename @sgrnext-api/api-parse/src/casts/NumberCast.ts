import { Cast } from "./Cast";

export class NumberCast extends Cast {
  public cast(value: unknown): unknown {
    if (value == null) {
      return value;
    }

    return typeof value === "number" ? value : Number(value);
  }
}
