---
slug: /plugins/@sgrnext/api-parse/casts/string
title: String
sidebar_position: 5
---

# String

The String Cast feature in @sgrnext/api enables you to convert any variable into a JavaScript string by consistently applying the String(value) function to all inputs.

## Example

```typescript
/* 
Url ?num=42&bool=1
Body
{
  "int": 123,
  "zero": 0,
  "obj": { "key": "value" }
}
*/
export const POST = handlers.create(async (env) => {
  const { 
    num,    // "42"
    bool,   // "true"
    int,    // "123"
    zero,   // "0"
    obj,    // "[object Object]"
    und,    // "undefined"
  } = await env.parse(SCHEMA, ZOD_SCHEMA);

  return { id };
});

const SCHEMA = compileSchema({ 
  num: "query:string",
  bool: "query:boolean:string",
  int: "body:string",
  zero: "body:string",
  obj: "body:string",
  und: "body:string",
});
```

## Explanation

- "num": "42" becomes "42" (query string remains string).
- "bool": "1" is processed as "1" (stringified), then cast to a boolean (true), and finally wrapped into string.
- "int": 123 becomes "123" (number to string).
- "zero": 0 becomes "0" (zero to string).
- "obj": \{ "key": "value" \} becomes "[object Object]" (object to string).
- und (undefined) becomes "undefined" (missing value to string).

