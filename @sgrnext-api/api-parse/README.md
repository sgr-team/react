# @sgrnext/api-parse

## Getting started

### Install

```bash
npm install --save @sgrnext/api @sgrnext/api-parse
```

### Crate handlers factory

```typescript
// src/server/handle.ts
import { parse } from "@sgrnext/api-parse";

const handler = new HandlerFactory()
  .plugin(parse());
```

### Create route

```typescript
// src/app/api/books/route.ts
import { compileSchema } from '@sgrnext/api-parse';
import { z } from "zod";
import { handler } from '@/server/handlers';

export POST = handler.create(async (env) => {
  const { title, price } = await env.parse(SCHEMA, ZOD_SCHEMA)
  const { id } = await env.pool.execute('...', [ title, price ]);

  return { id };
});

const SCHEMA = compileSchema({ 
  // Get title property from body
  title: 'body', 
  // Get price property from body and cast to number
  price: 'body:number',
});

const ZOD_SCHEMA = z.object({ title: z.string(), price: z.number() });
```
