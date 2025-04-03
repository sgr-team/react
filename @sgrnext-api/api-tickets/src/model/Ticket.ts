export type Ticket = {
  id: string;
  secret: string;
  type: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
  due: Date;
  payload: Record<string, unknown>;
};
