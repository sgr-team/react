import { HandlerEnvironment } from "./HandlerEnvironment";

export type HandlerEnvironmentPlugin<
  From extends HandlerEnvironment = HandlerEnvironment, 
  EnvDelta = { },
  EnvOmit extends string | number | symbol = typeof NEVER_SYMBOL
> = EnvDelta | HandlerEnvironmentPluginFn<From, EnvDelta, EnvOmit>;

export type HandlerEnvironmentPluginFn<
  From extends HandlerEnvironment = HandlerEnvironment,
  EnvDelta = { },
  EnvOmit extends string | number | symbol = typeof NEVER_SYMBOL
> = (env: Omit<From & EnvDelta, EnvOmit>) => Omit<From & EnvDelta, EnvOmit>;

export const NEVER_SYMBOL = Symbol('never');