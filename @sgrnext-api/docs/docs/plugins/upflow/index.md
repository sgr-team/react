---
slug: /plugins/@sgrnext/api-upflow/introduction
title: "@sgrnext/api-upflow"
sidebar_position: 2
---

# @sgrnext/api-upflow

## Install

```bash
npm install --save @sgrnext/api @sgrnext/api-upflow
```

or

```bash
npm install --save @sgrnext/api-upflow
```

## Example

```typescript title="src/server/handlers.ts"
import { HandlerFactory } from '@sgrnext/api';
import { upflow } from "@sgrnext/api-upflow";
import { GridFSAdapter } from "@sgrnext/api-upflow-adapter-gridfs";

export const handlers = new HandlerFactory()
  // apply plugins
  .plugin({ pool: myDatabaseConnection })
  .plugin(upflow(new GridFSAdapter("mongo_connection_string_or_client")))
  ...
;
```

```typescript title="src/app/api/books/cover/route.ts"
import { compileSchema } from '@sgrnext/api-parse';
import { z } from "zod";
import { handlers } from '@/server/handlers';

export const PUT = handlers.create(async (env) => {
  const { book_id } = env.parse();
  // Upload file from request
  await env.upflow.upload(`book:${book_id}`);
});

export const GET = handlers.create(async (env) => {
  const { book_id } = env.parse();
  // Get file from storage
  return env.upflow.response(`book:${book_id}`);
});

const SCHEMA = compileSchema({ 
  book_id: 'body.id', 
});
```
