---
slug: /@sgrnext/api/getting-started
title: Getting Started
sidebar_position: 2
---

# Getting Started

## Install

```bash
npm install --save @sgrnext/api
```

## Crate handlers factory

```typescript title="src/server/handlers.ts"
import { HandlerFactory } from '@sgrnext/api';
import { parse } from "@sgrnext/api-parse";

export const handlers = new HandlerFactory()
  // apply plugins
  .plugin({ pool: myDatabaseConnection })
  .plugin(parse())
  ...
;
```

## Create route

```typescript title="src/app/api/books/route.ts"
import { compileSchema } from '@sgrnext/api-parse';
import { z } from "zod";
import { handlers } from '@/server/handlers';

export const POST = handlers.create(async (env) => {
  const { title, price } = await env.parse(SCHEMA, ZOD_SCHEMA)
  const { id } = await env.pool.execute('...', [ title, price ]);

  return { id };
});

const SCHEMA = compileSchema({ title: 'body', price: 'body' });
const ZOD_SCHEMA = z.object({ title: z.string(), price: z.number() });
```
