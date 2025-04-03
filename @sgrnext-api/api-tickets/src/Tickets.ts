import { TicketsAdapter } from "./TicketsAdapter";
import { 
  Ticket, 
  TicketCreateOptions, 
  TicketDeleteOptions, 
  TicketListOptions, 
  TicketsOptions, 
  TicketUpdateOptions 
} from "./model";
import { v4 as uuidv4 } from 'uuid';

export class Tickets {
  constructor(
    public adapter: TicketsAdapter,
    public options: TicketsOptions,
    public inited: Promise<void>
  ) { }

  async create({ id, secret, type, count, due, payload }: TicketCreateOptions): Promise<Ticket> {
    await this.inited;
    secret = secret ?? uuidv4();
    count = count ?? 1;
    payload = payload ?? { };

    return await this.adapter.create({ id, secret, type, count, due, payload });
  }

  async use(secret: string, count: number): Promise<Ticket | null> {
    await this.inited;

    return await this.adapter.use(secret, count);
  }

  async get(id: string): Promise<Ticket | null> {
    return await this.getOne({ id });
  }

  async getBySecret(secret: string): Promise<Ticket | null> {
    return await this.getOne({ secret });
  }

  async getOne(options: TicketListOptions): Promise<Ticket | null> {
    return (await this.list(options))[0] ?? null;
  }
  
  async list(options: TicketListOptions): Promise<Ticket[]> {
    await this.inited;

    return await this.adapter.list(options);
  }

  async update(options: TicketUpdateOptions): Promise<Ticket> {
    await this.inited;

    return await this.adapter.update(options);
  }

  async delete(options: TicketDeleteOptions): Promise<void> {
    await this.inited;

    return await this.adapter.delete(options);
  }
}
