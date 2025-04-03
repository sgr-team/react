export type TicketUpdateOptions = (
  { id: string } | { secret: string }
) &{  
  type?: string;
  count?: number;
  due?: Date;
  payload?: Record<string, unknown>;
};
