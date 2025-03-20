---
slug: /plugins/@sgrnext/api-parse/introduction
title: "@sgrnext/api-parse"
sidebar_position: 1
---

# @sgrnext/api-parse

The @sgrnext/api-parse plugin is designed to streamline the extraction and validation 
of data from NextRequest objects using a schema-based approach. 

This plugin enables developers to efficiently parse data from various parts of a NextRequest 
such as the body or query parameters—into a structured object, while ensuring type safety 
and correctness through seamless integration with the [zod](https://zod.dev). With its 
flexible schema definitions, @sgrnext/api-parse reduces boilerplate code, simplifies request 
data handling, and allows developers to focus on application logic with confidence in the 
integrity of their validated data.

## Install

```bash
npm install --save @sgrnext/api @sgrnext/api-parse
```

or

```bash
npm install --save @sgrnext/api-parse
```

## Example

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

```typescript title="src/app/api/books/route.ts"
import { compileSchema } from '@sgrnext/api-parse';
import { z } from "zod";
import { handlers } from '@/server/handlers';

export POST = handlers.create(async (env) => {
  const { title, price } = await env.parse(SCHEMA, ZOD_SCHEMA)
  const { id } = await env.pool.execute('...', [ title, price ]);

  return { id };
});

const SCHEMA = compileSchema({ 
  title: 'body', 
  price: 'body:number' 
});
const ZOD_SCHEMA = z.object({ title: z.string(), price: z.number() });
```

## Schema

The schema in @sgrnext/api-parse is a core concept represented as an object where each 
key corresponds to a property name in the resulting parsed object.  The value associated 
with each key is a specially formatted string that defines how data is extracted and 
transformed, following the pattern "source.path.deep:cast:another_cast"

The @sgrnext/api-parse plugin not only provides built-in [sources](./sources/index.md) 
(e.g., query, body) and [casts](./casts/index.md) (e.g., number, date) but also offers 
the flexibility to define custom [sources](./sources/custom.md) and [casts](./casts/custom.md).

```typescript
import { compileSchema } from '@sgrnext/api-parse';

const SCHEMA = compileSchema({
  // Retrieves the "q" property from the query portion of the URL
  q: "query.q",
  // Extracts the "from" property from the query, casts it to a number, then to a Date
  from: "query:number:date",
  // Extracts the "to" property from the query, casts it to a number, then to a Date
  to: "query:number:date",
  // Retrieves the "limit" property from the query and casts it to a number
  limit: "query:number",
  // Retrieves the "offset" property from the query and casts it to a number
  offset: "query:number",
  // Captures the entire JSON-parsed body object from the request
  body: "body.",
});
```

### Path Conventions

#### \{ id: "source" \} === \{ id: "source.key" \}

If a key’s schema string omits the path segment, it is implicitly treated as if 
the path matches the key name in the resulting object. 

#### \{ id: "source." \}

In @sgrnext/api-parse, prefixing a schema value with "source." allows you to retrieve 
the entire object from the specified. 

For instance, using "body." provides access to the complete body object rather than 
targeting a specific property. This feature enables developers to capture and work with 
the full data structure from a given source, offering flexibility when the entire object 
is needed rather than individual fields.
