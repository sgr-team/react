---
slug: /plugins/@sgrnext/api-parse/casts/date
title: Date
sidebar_position: 3
---

# Date

The Date Cast feature in @sgrnext/api enables you to convert any variable into a JavaScript Date object by consistently applying the new Date(value) constructor.

## Example

```typescript
/* 
Url ?past=2023-01-01&future=2025-12-31&timestamp=1698777600000
Body
{
  "iso": "2024-03-18T12:00:00Z",
  "invalid": "not-a-date"
}
*/
export const POST = handlers.create(async (env) => {
  const { 
    past,      // Date object: 2023-01-01T00:00:00.000Z
    future,    // Date object: 2025-12-31T00:00:00.000Z
    timestamp, // Date object: 2023-10-31T18:40:00.000Z
    iso,       // Date object: 2024-03-18T12:00:00.000Z
    invalid,   // Date object: Invalid Date
    und,       // Date object: Invalid Date
  } = await env.parse(SCHEMA, ZOD_SCHEMA);

  return { id };
});

const SCHEMA = compileSchema({ 
  past: "query:date",
  future: "query:date",
  timestamp: "query:number:date",
  iso: "body:date",
  invalid: "body:date",
  und: "body:date",
});
```

## Explanation

- "past": "2023-01-01" becomes a Date object representing 2023-01-01T00:00:00.000Z (query string).
- "future": "2025-12-31" becomes a Date object representing 2025-12-31T00:00:00.000Z (query string).
- "timestamp": "1698777600000" is processed as "1698777600000" (stringified), then cast to a number (1698777600000), and finally wrapped into Date.
- "iso": "2024-03-18T12:00:00Z" becomes a Date object representing 2024-03-18T12:00:00.000Z (ISO string).
- "invalid": "not-a-date" becomes an Invalid Date object (invalid input).
- und (undefined) becomes an Invalid Date object (missing value).
