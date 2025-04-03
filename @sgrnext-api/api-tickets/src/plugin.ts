import { HandlerEnvironment, HandlerEnvironmentPluginFn } from "@sgrnext/api";
import { TicketsAdapter } from "./TicketsAdapter";
import { TicketsOptions } from "./model";
import { Tickets } from "./Tickets";

export const tickets = <Env extends HandlerEnvironment>(
  adapter: TicketsAdapter,
  options?: TicketsOptions | null | undefined
): HandlerEnvironmentPluginFn<Env, TicketsDelta> => {
  options = options ?? {};
  const inited = new Promise<void>(async (resolve) => {
    await adapter.init(options);
    resolve(undefined);
  });
  const tickets = new Tickets(adapter, options, inited);

  return (env) => {
    const resultEnv = env as Env & TicketsDelta;
    resultEnv.tickets = tickets;
    
    return resultEnv;
  };
}

export type TicketsDelta = { 
  tickets: Tickets;
};
