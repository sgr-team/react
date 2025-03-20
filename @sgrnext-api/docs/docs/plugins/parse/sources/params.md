---
slug: /plugins/@sgrnext/api-parse/sources/params
title: Params
sidebar_position: 5
---

# Params

The params source in @sgrnext/api-parse enables you to extract route parameters 
from a NextRequest, typically used in dynamic routes within a Next.js application. 
This source provides access to the key-value pairs defined in the URL structure, 
allowing you to retrieve specific parameters or the entire params object.

# Example

```typescript title="src/app/api/books/[id]/route.ts"
// URL: /api/books/123
export GET = handlers.create(async (env) => {
  const { 
    id, // 123,
    p   // { id: 123 }
  } = await env.parse(SCHEMA, ZOD_SCHEMA);
});

const SCHEMA = compileSchema({ 
  id: 'params:number', // Retrieves the "id" parameter and casts it to a number,
  p: 'params.'         // Captures the entire params object
});
```
