# @sgrnext/api

@sgrnext/api is a lightweight and developer-friendly library designed 
to simplify the creation of API handlers in Next.js applications.

## Motivaton

The @sgrnext/api library simplifies API development by abstracting common, 
repetitive logic involved in handler creation. It provides tools to encapsulate 
tasks such as request parsing, validation, and the collection of web method statistics, 
enabling developers to concentrate on core business logic while ensuring a clean, efficient, 
and maintainable codebase.

The plugin system in @sgrnext/api offers flexible customization of the handler environment, 
enabling developers to tailor it to their needs. Additionally, it supports the integration 
of project-specific functionality, enhancing adaptability across diverse use cases.

## Plugins

| Plugin                      | Description                               |
| --------------------------- | ----------------------------------------- |
| @sgrnext/api-parse          | Request Parsing and Validation            |

## Getting started

### Install

```bash
npm install --save @sgrnext/api
```

### Crate handlers factory

```typescript
// src/server/handle.ts
import { HandlerFactory } from '@sgrnext/api';
import { parse } from "@sgrnext/api-parse";

export const handler = new HandlerFactory()
  // apply plugins
  .plugin({ pool: myDatabaseConnection })
  .plugin(parse())
  ...
;
```

### Create route

```typescript
// src/app/api/books/route.ts
import { compileSchema } from '@sgrnext/api-parse';
import { z } from "zod";
import { handler } from '@/server/handler';

export POST = handler.create(async (env) => {
  const { title, price } = await env.parse(SCHEMA, ZOD_SCHEMA)
  const { id } = await env.pool.execute('...', [ title, price ]);

  return { id };
});

const SCHEMA = compileSchema({ title: 'body', price: 'body' });
const ZOD_SCHEMA = z.object({ title: z.string(), price: z.number() });
```
