import { NextRequest, NextResponse } from "next/server"
import { ApiError } from "./ApiError";
import { HandlerFactoryOptions } from "./HandlerFactoryOptions";
import { HandlerEnvironment } from "./HandlerEnvironment";
import { HandlerEnvironmentPlugin, NEVER_SYMBOL } from "./HandlerEnvironmentPlugin";

export class HandlerFactory<Env extends HandlerEnvironment = HandlerEnvironment> {
  plugins: HandlerEnvironmentPlugin<Env, unknown>[] = [];

  constructor(
    public options: HandlerFactoryOptions = { }
  ) { }

  plugin<
    Delta, 
    EnvOmit extends string | number | symbol = typeof NEVER_SYMBOL
  >(
    plugin: HandlerEnvironmentPlugin<Env, Delta, EnvOmit>
  ): HandlerFactory<HandlerEnvironment & Omit<Env & Delta, EnvOmit>> {
    this.plugins.push(plugin);

    return this as unknown as HandlerFactory<HandlerEnvironment & Omit<Env & Delta, EnvOmit>>;
  }

  create(handler: (env: Env) => unknown) {
    return async (request: NextRequest, { params }: { params: Promise<unknown> }) => {
      let env = { request, params } as Env;
      
      for (const plugin of this.plugins) {
        if (typeof plugin === "function") {
          env = plugin(env);
        }

        env = { ...env, ...(plugin as { }) };
      }

      try {
        return this.response(await handler(env));
      } catch (error) {
        return this.error(error);
      }
    }
  }

  response(result: unknown) {
    if (typeof this.options.response === "function") {
      return this.options.response(result);
    }

    if (result == null) {
      return new NextResponse(null, { status: 200 });
    }

    if (result instanceof NextResponse) {
      return result;
    }

    return NextResponse.json(result);
  }

  error(error: unknown) {
    if (typeof this.options.error === "function") {
      return this.options.error(error);
    }

    if (error == null) {
      console.error("HandlerFactory.error: error is null");
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    const apiError = error as ApiError;
    if (typeof apiError.message === "string" && typeof apiError.statusCode === "number") {
      return new NextResponse(apiError.message, { status: apiError.statusCode });
    }

    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
