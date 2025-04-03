import { Tickets } from "@/Tickets";
import { FakeAdapter, FakeAdapterOptions } from "./FakeAdapter";
import { TicketsOptions } from "@/model";

export const createTickets = (
  adapterOptions: FakeAdapterOptions = { },
  ticketsOptions: TicketsOptions = { }
) => {
  return new Tickets(
    new FakeAdapter(adapterOptions),
    ticketsOptions,
    Promise.resolve()
  );
};
