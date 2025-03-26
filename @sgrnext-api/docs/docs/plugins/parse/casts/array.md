---
slug: /plugins/@sgrnext/api-parse/casts/array
title: Array
sidebar_position: 1
---

# Array

The Array Cast feature in @sgrnext/api allows you to transform any variable into an array. 
This is particularly useful for ensuring consistent data handling by converting incoming 
values—regardless of their original type—into an array format.

## Example

```typescript
/* 
Url ?num=422
Body
{
  "str": "str_exmlp",
  "num": 420,
  "arr": [ 'a', 2 ]
}
*/
export const POST = handlers.create(async (env) => {
  const { 
    str, // [ 'str_exmlp' ]
    num, // [ 420 ]
    num2, // [ 422 ]
    arr, // [ 'a', 2 ]
    und // [ undefined ] 
  } = await env.parse(SCHEMA, ZOD_SCHEMA);

  return { id };
});

const SCHEMA = compileSchema({ 
  str: 'body:array', 
  num: 'body:array',
  num2: 'query.num:number:array',
  arr: 'body:array',
  null: 'body:array',
});
```

## Explanation

Purpose: The array cast ensures that any value from the request body is wrapped into an array. 
If the value is already an array, it remains unchanged; otherwise, it is converted into a 
single-element array. 
Undefined or missing values are transformed into an array containing undefined.

- "str": "str_exmlp" becomes [ 'str_exmlp' ] (string to array)
- "num": 420 becomes [ 420 ] (number to array)
- "num2": 422 is processed as "422" (stringified), then cast to a number (422), and finally wrapped into [ 422 ] (number to array)
- "arr": [ 'a', 2 ] remains [ 'a', 2 ] (array unchanged)
- und (undefined) becomes [ undefined ] (missing value to array)

This feature simplifies working with diverse input types by normalizing them into arrays, 
making downstream processing more predictable and uniform.
