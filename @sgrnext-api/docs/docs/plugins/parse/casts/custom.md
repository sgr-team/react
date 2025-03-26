---
slug: /plugins/@sgrnext/api-parse/casts/custom
title: Custom
sidebar_position: 0
---

# Custom Cast

## Creating a Custom Cast

To define a custom cast, you need to create a class that extends the Cast base class provided 
by @sgrnext/api-parse. The class must implement a cast method, which takes an unknown value as 
input and returns the transformed result.

```typescript title="src/TypeOfCast.ts"
import { Cast } from "@sgrnext/api-parse";

export class TypeOfCast extends Cast {
  public cast(value: unknown): unknown {
    return typeof value; // Returns the type of the value as a string
  }
}
```

## Registration

To use your custom cast, you must register it when configuring the @sgrnext/api-parse plugin. 
This is done by passing an instance of your custom cast class to the plugin’s cast configuration 
during initialization.

```typescript title="src/TypeOfCast.ts"
import { HandlerFactory } from '@sgrnext/api';
import { parse, SOURCES, CASTS } from "@sgrnext/api-parse";
import { TypeOfCast } from './TypeOfCast';

export const handlers = new HandlerFactory()
  // Apply plugins
  .plugin({ pool: myDatabaseConnection })
  .plugin(parse(SOURCES, { ...CASTS, "typeof": new TypeOfCast() }));
```

## Use

```typescript title="src/app/api/books/route.ts"
export const POST = handlers.create(async (env) => {
  const { title, price } = await env.parse(SCHEMA, ZOD_SCHEMA)
  const { id } = await env.pool.execute('...', [ title, price ]);

  return { id };
});

const SCHEMA = compileSchema({ 
  typeofTitle: 'body.title:typeof' 
});
```
