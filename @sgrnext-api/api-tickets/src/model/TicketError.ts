export class TicketError extends Error {
  constructor(public type: TicketErrorType, message: string) {
    super(message);
  }
}

export type TicketErrorType = 
  'CONFLICT_ID' 
  | 'CONFLICT_SECRET' 
  | 'TICKET_NOT_FOUND' 
  | 'TICKET_EXHAUSTED' 
  | 'TICKET_EXPIRED' 
  | 'UNHANDLED'
;
