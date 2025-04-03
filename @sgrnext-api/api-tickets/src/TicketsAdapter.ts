import { 
  AdapterCreateOptions,
  Ticket, 
  TicketDeleteOptions, 
  TicketListOptions, 
  TicketsOptions, 
  TicketUpdateOptions 
} from "./model";

export interface TicketsAdapter {
  init(options: TicketsOptions): Promise<void>;
  create(options: AdapterCreateOptions): Promise<Ticket>;
  use(secret: string, count: number): Promise<Ticket | null>;
  list(options: TicketListOptions): Promise<Ticket[]>;
  update(options: TicketUpdateOptions): Promise<Ticket>;
  delete(options: TicketDeleteOptions): Promise<void>;
}
