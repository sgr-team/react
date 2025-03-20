import { Cast } from "./Cast";

export class BooleanCast extends Cast {
  public cast(value: unknown): unknown {
    if (value == null) return value;
    if (value === "false") return false;

    return typeof value === "boolean" ? value : Boolean(value);
  }
}
