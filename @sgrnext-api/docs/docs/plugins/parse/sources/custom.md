---
slug: /plugins/@sgrnext/api-parse/sources/custom
title: Custom
sidebar_position: 0
---

# Custom Source

To define a custom source, you need to create a class that extends the Source 
base class and implement the required methods. Below is an example of a custom 
source that parses the request body as XML.

## Creating a Custom Source

```typescript title="BodyXml.ts"
import { Source } from "@sgrnext/api-parse";
import { parseXmlToObject } from 'myxmlparser';

export class BodyXml extends Source {
  async source(): Promise<unknown> {
    return parseXmlToObject(await this.env.request.text());
  }
  
  async getValue(path: string[], key: string): Promise<unknown> {
    return this.path(path, key);
  }
}
```

## Registration

To use your custom source, you must register it when configuring the @sgrnext/api-parse plugin. 
This is done by passing an instance of your custom source class to the plugin’s cast configuration 
during initialization.

```typescript title="src/TypeOfCast.ts"
import { HandlerFactory } from '@sgrnext/api';
import { parse, SOURCES } from "@sgrnext/api-parse";
import { BodyXml } from './BodyXml';

export const handlers = new HandlerFactory()
  // Apply plugins
  .plugin({ pool: myDatabaseConnection })
  .plugin(parse({ ...SOURCES, 'body[xml]': new BodyXml() }));
```

## Use

```typescript title="src/app/api/books/route.ts"
export POST = handlers.create(async (env) => {
  const { title, price } = await env.parse(SCHEMA, ZOD_SCHEMA)
  const { id } = await env.pool.execute('...', [ title, price ]);

  return { id };
});

const SCHEMA = compileSchema({ 
  title: 'body[xml]',
  price: 'body[xml]:number', 
});
```