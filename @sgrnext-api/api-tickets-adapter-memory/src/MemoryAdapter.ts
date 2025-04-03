import { 
  AdapterCreateOptions,
  Ticket,
  TicketDeleteOptions,
  TicketError,
  TicketListOptions,
  TicketsAdapter,
  TicketUpdateOptions,
} from "@sgrnext/api-tickets";
import { v4 as uuidv4 } from 'uuid';

export class MemoryAdapter implements TicketsAdapter {
  tickets = new Map<string, Ticket>();
  bySecret = new Map<string, Ticket>();

  async init(): Promise<void> { }

  async create(options: AdapterCreateOptions): Promise<Ticket> {
    const ticket: Ticket = {
      ...options,
      id: options.id ?? uuidv4(),
      due: options.due ?? new Date(MAX_DATE),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.tickets.has(ticket.id)) {
      throw new TicketError(
        'CONFLICT_ID', 
        `Ticket with id ${JSON.stringify(ticket.id)} already exists`
      );
    }

    if (this.bySecret.has(ticket.secret)) {
      throw new TicketError(
        'CONFLICT_SECRET', 
        `Ticket with secret ${JSON.stringify(ticket.secret)} already exists`
      );
    }

    this.tickets.set(ticket.id, ticket);
    this.bySecret.set(ticket.secret, ticket);

    return ticket;
  }

  async use(secret: string, count: number): Promise<Ticket | null> {
    const ticket = this.bySecret.get(secret);

    if (!ticket) {
      throw new TicketError('TICKET_NOT_FOUND', `Ticket with secret ${secret} not found`);
    }

    if (ticket.count < count) {
      throw new TicketError(
        'TICKET_EXHAUSTED', 
        `Ticket with secret ${JSON.stringify(secret)} has no required number of uses (${ticket.count} < ${count})`
      );
    }

    if (ticket.due < new Date()) {
      throw new TicketError('TICKET_EXPIRED', `Ticket with secret ${JSON.stringify(secret)} has expired`);
    }

    ticket.count -= count;

    return ticket;
  }

  async list({ id, secret, type }: TicketListOptions): Promise<Ticket[]> {
    let tickets = [] as Ticket[];
    if (id != null || secret != null) {
      const ticket = id != null ? this.tickets.get(id) : this.bySecret.get(secret!);
      
      if (ticket) {
        tickets.push(ticket);
      }
    } else {
      tickets = Array.from(this.tickets.values());
    }

    if (type != null) {
      tickets = tickets.filter(ticket => ticket.type === type)
    }

    tickets.sort((a, b) => a.id.localeCompare(b.id));

    return tickets;
  }

  async update({ type, count, due, payload, ...options }: TicketUpdateOptions): Promise<Ticket> {
    const ticket = this.getTicket(options);

    ticket.type = type ?? ticket.type;
    ticket.count = count ?? ticket.count;
    ticket.due = due ?? ticket.due;
    ticket.payload = payload ?? ticket.payload;

    return ticket;
  }

  async delete(options: TicketDeleteOptions): Promise<void> {
    const ticket = this.getTicket(options);

    this.tickets.delete(ticket.id);
    this.bySecret.delete(ticket.secret);
  }

  getTicket(options: { id: string } | { secret: string }): Ticket {
    const { id, secret } = options as { id: string | null, secret: string | null };
    const ticket = id != null ? this.tickets.get(id) : this.bySecret.get(secret!);

    if (ticket == null) {
      throw new TicketError('TICKET_NOT_FOUND', `Ticket not found: ${JSON.stringify(options)}`);
    }

    return ticket;
  }
}

const MAX_DATE = 8.64e15;