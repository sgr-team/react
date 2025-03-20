import { BodyJson } from "./BodyJson";
import { BodyText } from "./BodyText";
import { Cookies } from "./Cookies";
import { Headers } from "./Headers";
import { Params } from "./Params";
import { Query } from "./Query";
import { Source } from "./Source";

export * from "./BodyJson";
export * from "./BodyText";
export * from "./Cookies";
export * from "./Headers";
export * from "./Params";
export * from "./Query";
export * from "./Source";

export const SOURCES: Record<string, typeof Source> = {
  body: BodyJson,
  'body[text]': BodyText,
  cookies: Cookies,
  headers: Headers,
  params: Params,
  query: Query,
}
