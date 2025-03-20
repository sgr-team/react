import { Cast } from "./Cast";

export class StringCast extends Cast {
  public cast(value: unknown): unknown {
    if (value == null) {
      return value;
    }

    return typeof value === "string" ? value : String(value);
  }
}
