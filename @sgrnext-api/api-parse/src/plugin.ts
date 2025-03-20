import { ZodType } from "zod";
import { ApiError, HandlerEnvironment, HandlerEnvironmentPluginFn } from "@sgrnext/api";
import { BodyJson, Source, SOURCES } from "./sources";
import { Cast, CASTS } from "./casts";
import { Schema } from "./schema";

export const parse = <Env extends HandlerEnvironment>(
  sources: Record<string, typeof Source> = SOURCES,
  casts: Record<string, Cast> = CASTS
): HandlerEnvironmentPluginFn<Env, ParseDelta> => {
  return (env) => {
    const resultEnv = env as Env & ParseDelta;
    const envSources = new Map<string, Source>();

    resultEnv.parse = async <T>(
      schema: Schema, 
      zodSchema?: ZodType<T> | null | undefined
    ): Promise<T> => {
      const result = { } as Record<string, unknown>;

      for (const [ key, keySchema ] of Object.entries(schema)) {
        const SourceClass = sources[keySchema.source] as typeof BodyJson;
        if (SourceClass == null) {
          throw new Error(`Source ${JSON.stringify(keySchema.source)} not found`);
        }

        if (!envSources.has(keySchema.source)) {
          envSources.set(keySchema.source, new SourceClass(env));
        }

        const source = envSources.get(keySchema.source)!;
        let value = await source.get(keySchema.path, key);

        for (const castId of keySchema.cast) {
          const cast = casts[castId];
          if (cast == null) {
            throw new Error(`Cast ${JSON.stringify(castId)} not found`);
          }

          value = cast.cast(value);
        }

        result[key] = value;
      }

      if (zodSchema != null) {
        const { error } = zodSchema.safeParse(result);

        if (error != null) {
          throw new ApiError(400, error.message);
        }
      }

      return result as T;
    };

    return resultEnv;
  };
}

export type ParseDelta = { 
  parse: <T>(schema: Schema, zodSchema?: ZodType<T> | null | undefined) => Promise<T>,
};
