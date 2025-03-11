import { HandlerEnvironment } from "./HandlerEnvironment";

export type HandlerEnvironmentPlugin<
  From extends HandlerEnvironment = HandlerEnvironment, 
  Delta = { }
> = Delta | HandlerEnvironmentPluginFn<From, Delta>;

export type HandlerEnvironmentPluginFn<
  From extends HandlerEnvironment = HandlerEnvironment,
  Delta = { }
> = (env: From) => From & Delta;
