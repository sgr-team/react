---
slug: /plugins/@sgrnext/api-parse/sources/cookies
title: Cookies
sidebar_position: 3
---

# Cookies

The cookies source in @sgrnext/api-parse allows you to extract cookie values from 
a NextRequest, treating them as key-value pairs accessible via the schema. A 
distinctive feature of this source is that it supports property navigation up to 
only one level deep, as cookie values are inherently strings and do not contain 
nested structures.

# Example

```typescript
export POST = handlers.create(async (env) => {
  const { 
    sessionId, // retrieves the value of the "token-key" cookie
    allCookies // retrieves the entire cookies object
  } = await env.parse(SCHEMA, ZOD_SCHEMA);
});

const SCHEMA = compileSchema({ 
  sessionId: 'cookies.token-key', // Targets the "token-key" cookie value
  allCookies: 'cookies.',         // Captures all cookies as an object
});
```