export type TicketCreateOptions = {  
  id?: string;
  secret?: string;
  type: string;
  count?: number;
  due?: Date;
  payload?: Record<string, unknown>;
};

export type AdapterCreateOptions = {  
  id?: string;
  secret: string;
  type: string;
  count: number;
  due?: Date;
  payload: Record<string, unknown>;
};
