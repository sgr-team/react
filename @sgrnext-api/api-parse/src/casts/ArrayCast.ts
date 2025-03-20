import { Cast } from "./Cast";

export class ArrayCast extends Cast {
  public cast(value: unknown): unknown {
    return Array.isArray(value) ? value : [ value ];
  }
}
