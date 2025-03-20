---
slug: /plugins/@sgrnext/api-parse/sources/headers
title: Headers
sidebar_position: 4
---

# Headers

The headers source in @sgrnext/api-parse allows you to extract header values from 
a NextRequest, treating them as key-value pairs accessible via the schema. A 
distinctive feature of this source is that it supports property navigation up to 
only one level deep, as header values are inherently strings and do not contain 
nested structures.

# Example

```typescript
export POST = handlers.create(async (env) => {
  const { 
    sessionId, // retrieves the value of the "my-header" header
    allHeaders // retrieves the entire headers object
  } = await env.parse(SCHEMA, ZOD_SCHEMA);
});

const SCHEMA = compileSchema({ 
  sessionId: 'headers.my-header', // Targets the "my-header" header value
  allHeaders: 'headers.',         // Captures all headers as an object
});
```
