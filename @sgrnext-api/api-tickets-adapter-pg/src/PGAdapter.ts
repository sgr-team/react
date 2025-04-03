import { Pool, QueryResultRow, DatabaseError } from "pg";
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

export class PGAdapter implements TicketsAdapter {
  public pool: Pool;

  constructor(client: Pool | string) {
    this.pool = typeof client === 'string'  ? new Pool({ connectionString: client }) : client;
  }

  async init(): Promise<void> { 
    await this.pool.query(
      `
      CREATE TABLE IF NOT EXISTS "Tickets" (
        "id"        VARCHAR   PRIMARY KEY,
        "secret"    VARCHAR   NOT NULL UNIQUE,
        "type"      VARCHAR   NOT NULL,
        "count"     INTEGER   NOT NULL CONSTRAINT "Tickets_count_non_negative" CHECK ("count" >= 0),
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        "due"       TIMESTAMP NOT NULL,
        "payload"   JSONB     NOT NULL
      );
      `
    );
  }

  async create(options: AdapterCreateOptions): Promise<Ticket> {
    try {
      return await this.executeOne(
        `
        INSERT INTO "Tickets" (id, secret, type, count, "createdAt", "updatedAt", due, payload)
        VALUES ($1, $2, $3, $4, now(), now(), $5, $6)
        RETURNING *;
        `,
        [ options.id, options.secret, options.type, options.count, options.due, options.payload ]
      )
    } catch (error) {
      const e = error as DatabaseError;
      if (typeof e === 'object' && e != null && e.constraint === 'Tickets_pkey') {
        throw new TicketError(
          'CONFLICT_ID', 
          `Ticket with id ${JSON.stringify(options.id)} already exists`
        );
      }

      if (typeof e === 'object' && e != null && e.constraint === 'Tickets_secret_key') {
        throw new TicketError(
          'CONFLICT_SECRET', 
          `Ticket with secret ${JSON.stringify(options.secret)} already exists`
        );
      }

      throw error;
    }
  }

  async use(secret: string, count: number): Promise<Ticket | null> {
    const tickets = await this.list({ secret });
    const ticket = tickets[0];
    if (ticket == null) {
      throw new TicketError(
        'TICKET_NOT_FOUND',
        `Ticket with secret ${JSON.stringify(secret)} not found`
      );
    }

    if (ticket.count < count) {
      throw new TicketError(
        'TICKET_EXHAUSTED',
        `Ticket with secret ${JSON.stringify(secret)} has no required number of uses (${ticket.count} < ${count})`
      );
    }

    if (ticket.due < new Date()) {
      throw new TicketError(
        'TICKET_EXPIRED',
        `Ticket with secret ${JSON.stringify(secret)} has expired`
      );
    }

    try {
      return await this.executeOne<Ticket>(
        `
        UPDATE "Tickets" 
        SET "count" = "count" - $1 
        WHERE 
          "secret" = $2 
          AND "due" > now()
        RETURNING *
        `,
        [ count, secret ]
      );
    } catch (error) {
      const e = error as DatabaseError;
      if (typeof e === 'object' && e != null && e.constraint === 'Tickets_count_non_negative') {
        throw new TicketError(
          'TICKET_EXHAUSTED',
          `Ticket with secret "secret" has no required number of uses`
        );
      }

      throw error;
    }
  }

  async list({ id, secret, type }: TicketListOptions): Promise<Ticket[]> {
    const params: unknown[] = [];

    const where = [];
    if (id != null) {
      where.push(`"id" = $${params.push(id)}`);
    }

    if (secret != null) {
      where.push(`"secret" = $${params.push(secret)}`);
    }

    if (type != null) {
      where.push(`"type" = $${params.push(type)}`);
    }

    const query = `
      SELECT * FROM "Tickets" 
      ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''} 
      ORDER BY "id" ASC;
    `;

    return await this.execute(query, params);
  }

  async update({ type, count, due, payload, ...options }: TicketUpdateOptions): Promise<Ticket> {
    const where = [];
    const params: unknown[] = [ type, count, due, payload ];
    const opt = options as { id?: string, secret?: string };

    if (opt.id != null) {
      where.push(`"id" = $${params.push(opt.id)}`);
    } else {
      where.push(`"secret" = $${params.push(opt.secret)}`);
    }

    const result: Ticket = await this.executeOne(
      `
      UPDATE "Tickets" 
      SET "type" = $1, "count" = $2, "due" = $3, "payload" = $4
      WHERE ${where.join(' AND ')}
      RETURNING *;
      `,
      params
    );

    if (result == null) {
      throw new TicketError('TICKET_NOT_FOUND', `Ticket not found ${JSON.stringify(opt)}`);
    }

    return result;
  }

  async delete(options: TicketDeleteOptions): Promise<void> {
    const where = [];
    const params: unknown[] = [];
    const opt = options as { id?: string, secret?: string };

    if (opt.id != null) {
      where.push(`"id" = $${params.push(opt.id)}`);
    } else {
      where.push(`"secret" = $${params.push(opt.secret)}`);
    }

    const result: Ticket = await this.executeOne(
      `
      DELETE FROM "Tickets" 
      WHERE ${where.join(' AND ')}
      RETURNING *;
      `,
      params
    );

    if (result == null) {
      throw new TicketError('TICKET_NOT_FOUND', `Ticket not found ${JSON.stringify(opt)}`);
    }
  }

  private async execute<T extends QueryResultRow>(query: string, params: unknown[]): Promise<T[]> {
    const { rows } = await this.pool.query<T>(query, params);

    return rows;
  }

  private async executeOne<T extends QueryResultRow>(query: string, params: unknown[]): Promise<T> {
    const { rows } = await this.pool.query<T>(query, params);

    return rows[0];
  }
}

const MAX_DATE = 8.64e15;