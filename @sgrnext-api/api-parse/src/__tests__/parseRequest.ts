import { NextRequest } from "next/server";
import { HandlerFactory } from "@sgrnext/api";
import { ZodType } from "zod";
import { parse, Cast, Source, CASTS, SOURCES, compileSchema } from "@/index";

export function parseRequest(
  url: string,
  schema: Record<string, string>,
  zodSchema?: ZodType | null | undefined,
  options?: {
    sources?: Record<string, typeof Source>,
    casts?: Record<string, Cast>,
    params?: Record<string, unknown>,
    body?: string,
    cookies?: Record<string, string>,
    headers?: Record<string, string>,
  }
) {
  const request = new NextRequest(url, { method: 'POST', body: options?.body });
  for (const [ key, value ] of Object.entries(options?.cookies ?? {})) {
    request.cookies.set(key, value);
  }

  for (const [ key, value ] of Object.entries(options?.headers ?? {})) {
    request.headers.set(key, value);
  }

  return new Promise((resolve, reject) => {
    const handler = new HandlerFactory()
      .plugin(parse(options?.sources ?? SOURCES, options?.casts ?? CASTS));

    const fn = handler.create(async (env) => {
      try {
        resolve(await env.parse(compileSchema(schema), zodSchema));
      } catch (error) {
        reject(error);
      }
    });

    fn(request, { params: Promise.resolve(options?.params ?? {}) });
  });
}
