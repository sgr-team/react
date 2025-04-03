import { expect, it } from "@jest/globals";
import { createAdapter } from "./utils";
import { TicketsAdapter } from "@sgrnext/api-tickets";

it('create', async () => {
  const adapter = await createAdapter();
  const result = await adapter.create({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 1,
    due: new Date(2020, 4, 11),
    payload: { a: 'b' },
  });

  const tickets = await adapter.list({ id: '1' });

  expect(result).toMatchObject({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 1,
    payload: { a: 'b' },
  })
  expect(Array.isArray(tickets) && tickets.length === 1).toBeTruthy();
  expect(tickets[0]).toMatchObject({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 1,
    payload: { a: 'b' },
  })
});

it('create (conflict id/secret)', async () => {
  const adapter = await createAdapter();
  await adapter.create({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 1,
    due: new Date(2020, 4, 11),
    payload: { a: 'b' },
  });

  await expect(adapter.create({
    id: '1',
    secret: 'another',
    type: 'test',
    count: 1,
    due: new Date(2020, 4, 11),
    payload: { a: 'b' },
  }))
    .rejects
    .toThrow('Ticket with id "1" already exists');

  await expect(adapter.create({
    id: '22',
    secret: 'secret',
    type: 'test',
    count: 1,
    due: new Date(2020, 4, 11),
    payload: { a: 'b' },
  }))
    .rejects
    .toThrow('Ticket with secret "secret" already exists');

  expect((await adapter.list({ }))[0]).toMatchObject({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 1,
    payload: { a: 'b' },
  })
});

it('use', async () => {
  const adapter = await createAdapter();
  await adapter.create({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 3,
    due: new Date(2125, 4, 11),
    payload: { a: 'b' },
  });

  const result = await adapter.use('secret', 2);
  const tickets = await adapter.list({ id: '1' });

  expect(result).toMatchObject({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 1,
    payload: { a: 'b' },
  })
  expect(tickets[0]).toMatchObject({ count: 1 });
});

it('use (exhausted)', async () => {
  const adapter = await createAdapter();
  await adapter.create({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 3,
    due: new Date(2125, 4, 11),
    payload: { a: 'b' },
  });

  await expect(adapter.use('secret', 5))
    .rejects
    .toThrow('Ticket with secret "secret" has no required number of uses');
  expect((await adapter.list({ id: '1' }))[0]).toMatchObject({ count: 3 });
});

it('use (expired)', async () => {
  const adapter = await createAdapter();
  await adapter.create({
    id: '1',
    secret: 'secret',
    type: 'test',
    count: 3,
    due: new Date(2000, 4, 11),
    payload: { a: 'b' },
  });

  await expect(adapter.use('secret', 1))
    .rejects
    .toThrow('Ticket with secret "secret" has expired');
  expect((await adapter.list({ id: '1' }))[0]).toMatchObject({ count: 3 });
});

it('update', async () => {
  const adapter = await createAdapter();
  await prepareTickets(adapter);

  const result = await adapter.update({
    id: 'a_3',
    type: 'updated-type',
    count: 121,
    due: new Date(2225, 4, 11),
    payload: { b: 'a' },
  });
  
  expect(result).toMatchObject({
    id: 'a_3',
    type: 'updated-type',
    count: 121,
    due: new Date(2225, 4, 11),
    payload: { b: 'a' },
  });
  expect((await adapter.list({ }))[2]).toMatchObject({  
    id: 'a_2',
    type: 'auto',
    count: 1,
    due: new Date(2125, 4, 11),
    payload: { index: 2 },
  });
  expect((await adapter.list({ }))[3]).toMatchObject({  
    id: 'a_3',
    type: 'updated-type',
    count: 121,
    due: new Date(2225, 4, 11),
    payload: { b: 'a' },
  });
});

it('delete', async () => {
  const adapter = await createAdapter();
  await prepareTickets(adapter);

  await adapter.delete({ id: 'a_3' });
  await adapter.delete({ secret: '1' });
  
  expect((await adapter.list({ })).map(x => x.id))
    .toEqual([ 'a_0', 'a_2', 'a_4', 'a_5', 'a_6', 'a_7', 'a_8', 'a_9' ]);
});

it('list', async () => {
  const adapter = await createAdapter();
  await prepareTickets(adapter);

  expect((await adapter.list({ })).map(x => x.id))
    .toEqual([ 'a_0', 'a_1', 'a_2', 'a_3', 'a_4', 'a_5', 'a_6', 'a_7', 'a_8', 'a_9' ]);
  expect((await adapter.list({ id: 'a_1' })).map(x => x.id))
    .toEqual([ 'a_1' ]);
  expect((await adapter.list({ secret: '7' })).map(x => x.id))
    .toEqual([ 'a_7' ]);
  expect((await adapter.list({ type: 'auto' })).map(x => x.id))
    .toEqual([ 'a_0', 'a_2', 'a_4', 'a_6', 'a_8' ]);
});

const prepareTickets = async (adapter: TicketsAdapter, tickets = tickets10()) => {
  for (const ticket of tickets) {
    await adapter.create(ticket);
  }
}

const tickets10 = () => Array.from({ length: 10 }, (_, i) => ({
  id: `a_${i}`,
  secret: `${i}`,
  type: i % 2 === 0 ? 'auto' : 'auto2',
  count: 1,
  due: new Date(2125, 4, 11),
  payload: { index: i },
}));