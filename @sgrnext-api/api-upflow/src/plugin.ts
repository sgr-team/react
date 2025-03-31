import { HandlerEnvironment, HandlerEnvironmentPluginFn } from "@sgrnext/api";
import { UpflowAdapter } from "./UpflowAdapter";
import { UpflowOptions } from "./model";
import { Upflow } from "./Upflow";

export const upflow = <Env extends HandlerEnvironment>(
  adapter: UpflowAdapter,
  options?: UpflowOptions | null | undefined
): HandlerEnvironmentPluginFn<Env, UpflowDelta> => {
  options = options ?? {};
  const inited = new Promise<void>(async (resolve) => {
    await adapter.init(options);
    resolve(undefined);
  });

  return (env) => {
    const resultEnv = env as Env & UpflowDelta;
    resultEnv.upflow = new Upflow(env, adapter, options, inited);
    
    return resultEnv;
  };
}

export type UpflowDelta = { 
  upflow: Upflow;
};
