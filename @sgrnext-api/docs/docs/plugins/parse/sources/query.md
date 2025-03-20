---
slug: /plugins/@sgrnext/api-parse/sources/query
title: Query
sidebar_position: 6
---

# Query

The query source in @sgrnext/api-parse allows you to extract query parameters from 
the URL of a NextRequest, providing access to key-value pairs appended after 
the *?* in the request URL. This source is ideal for handling data passed via query 
strings, with support for optional type casting.

# Example

```typescript
// URL: ?q=my_search_qeury&limit=10&offset=100
export const POST = handlers.create(async (env) => {
  const { 
    q,      // "my_search_qeury"
    limit,  // 10 
    offset  // 100
  } = await env.parse(SCHEMA, ZOD_SCHEMA);
});

const SCHEMA = compileSchema({ 
  q: 'query.q',             // Retrieves the "q" query parameter as a string
  limit: 'query:number',    // Retrieves the "limit" query parameter and casts it to a number
  offset: 'query:number',   // Retrieves the "offset" query parameter and casts it to a number
});
```
