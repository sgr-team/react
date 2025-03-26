---
slug: /plugins/@sgrnext/api-parse/casts/boolean
title: Boolean
sidebar_position: 2
---

# Boolean

The boolean cast transforms any input value into a boolean. It applies special 
handling for the string "false" and otherwise delegates to JavaScript’s native 
Boolean(value) mechanism.

## Example

```typescript
/* 
Url ?t2&f=false&t=true
Body
{
  "empty_str": "",
  "zero": 0,
  "one": 1
}
*/
export const POST = handlers.create(async (env) => {
  const { 
    empty_str, // false
    zero,      // false
    one,       // true
    und,       // false
    f,         // false
    t,         // true
    t2,        // true
  } = await env.parse(SCHEMA, ZOD_SCHEMA);

  return { id };
});

const SCHEMA = compileSchema({ 
  empty_str: "body:boolean",
  zero: "body:boolean",
  one: "body:boolean",
  und: "body:boolean",
  f: "query:boolean",
  t: "query:boolean",
  t2: "query:boolean",
});
```

## Explanation

- "empty_str": "" becomes false (Boolean("")).
- "zero": 0 becomes false (Boolean(0)).
- "one": 1 becomes true (Boolean(1)).
- und (undefined) becomes false (Boolean(undefined)).
- "f": "false" becomes false (explicit string "false").
- "t": "true" becomes true (Boolean(true)).
- "t2" true becomes true (Boolean(true)).

This casting mechanism provides a robust way to normalize diverse input values into booleans, 
with special handling for the "false" string to align with common expectations, while leveraging 
JavaScript’s built-in coercion for flexibility.
