import { Ticket } from "@/model";
import { TicketsAdapter } from "@/TicketsAdapter";

export class FakeAdapter implements TicketsAdapter {
  constructor(
    public options: FakeAdapterOptions
  ) { 
    for (const [ key, value ] of Object.entries(options)) {
      (this as Record<string, unknown>)[key] = value;
    }
  }

  async init(): Promise<void> {
    throw new Error('Not implemented');
  }

  async create(): Promise<Ticket> {
    throw new Error('Not implemented');
  }

  async use(): Promise<Ticket | null> {
    throw new Error('Not implemented');
  }

  async list(): Promise<Ticket[]> {
    throw new Error('Not implemented');
  }

  async update(): Promise<Ticket> {
    throw new Error('Not implemented');
  }

  async delete(): Promise<void> {
    throw new Error('Not implemented');
  }
}

export type FakeAdapterOptions = {
  init?: TicketsAdapter['init'];
  create?: TicketsAdapter['create'];
  use?: TicketsAdapter['use'];
  list?: TicketsAdapter['list'];
  update?: TicketsAdapter['update'];
  delete?: TicketsAdapter['delete'];
}
