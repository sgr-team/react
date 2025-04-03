import { it, jest } from "@jest/globals";
import { createTickets } from "./utils/createTickets";
import { Ticket } from "@/model";

it('create', async () => {
  const tickets = createTickets({
    create: jest.fn(async () => TICKET)
  });

  const result = await tickets.create({ type: 'test' });

  expect(result).toMatchObject(TICKET);
  expect(tickets.adapter.create).toHaveBeenCalledWith({
    secret: expect.any(String),
    type: 'test',
    count: 1,
    payload: {},
  });
});

it('use', async () => {
  const tickets = createTickets({
    use: jest.fn(async () => TICKET)
  });

  const result = await tickets.use("secret", 1);

  expect(result).toMatchObject(TICKET);
  expect(tickets.adapter.use).toHaveBeenCalledWith("secret", 1);
});

it('get', async () => {
  const tickets = createTickets({
    list: jest.fn(async () => [ TICKET ])
  });

  const result = await tickets.get('1');

  expect(result).toMatchObject(TICKET);
  expect(tickets.adapter.list).toHaveBeenCalledWith({ id: '1' });
});

it('getBySecret', async () => {
  const tickets = createTickets({
    list: jest.fn(async () => [ TICKET ])
  });

  const result = await tickets.getBySecret('secret');

  expect(result).toMatchObject(TICKET);
  expect(tickets.adapter.list).toHaveBeenCalledWith({ secret: 'secret' });
});

it('getOne', async () => {
  const tickets = createTickets({
    list: jest.fn(async () => [ TICKET ])
  });

  const result = await tickets.getOne({ id: '1', secret: 'secret' });

  expect(result).toMatchObject(TICKET);
  expect(tickets.adapter.list).toHaveBeenCalledWith({ id: '1', secret: 'secret' });
});

it('list', async () => {
  const tickets = createTickets({
    list: jest.fn(async () => [ TICKET ])
  });

  const result = await tickets.list({ id: '1', secret: 'secret' });

  expect(Array.isArray(result) && result.length === 1).toBe(true);
  expect(result[0]).toMatchObject(TICKET);
  expect(tickets.adapter.list).toHaveBeenCalledWith({ id: '1', secret: 'secret' });
});

it('update', async () => {  
  const tickets = createTickets({
    update: jest.fn(async () => TICKET)
  });

  const result = await tickets.update({ id: '1', type: 'test22' });

  expect(result).toMatchObject(TICKET);
  expect(tickets.adapter.update).toHaveBeenCalledWith({ id: '1', type: 'test22' });
});

it('delete', async () => {
  const tickets = createTickets({
    delete: jest.fn(async () => { })
  });

  await tickets.delete({ id: '1' });

  expect(tickets.adapter.delete).toHaveBeenCalledWith({ id: '1' });
});

const TICKET: Ticket = {
  id: '1',
  secret: 'secret',
  type: 'test',
  count: 1,
  due: new Date(2120, 1, 1, 14, 30, 0),
  payload: {},
  createdAt: new Date(2000, 5, 1, 18, 38, 0),
  updatedAt: new Date(2002, 12, 3, 11, 27, 0),
};