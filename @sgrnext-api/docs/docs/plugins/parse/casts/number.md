---
slug: /plugins/@sgrnext/api-parse/casts/number
title: Number
sidebar_position: 4
---

# Number

The Number Cast feature in @sgrnext/api allows you to convert any variable into a JavaScript 
number by applying the Number(value) function consistently across all inputs.

## Example

```typescript
/* 
Url ?float=3.14&neg=-42
Body
{
  "int": "123",
  "zero": "0",
  "text": "not-a-number"
}
*/
export const POST = handlers.create(async (env) => {
  const { 
    float,  // 3.14
    neg,    // -42
    int,    // 123
    zero,   // 0
    text,   // NaN
    und,    // NaN
  } = await env.parse(SCHEMA, ZOD_SCHEMA);

  return { id };
});

const SCHEMA = compileSchema({ 
  float: "query:number",
  neg: "query:number",
  int: "body:number",
  zero: "body:number",
  text: "body:number",
  und: "body:number",
});
```

## Explanation

Purpose: The number cast transforms any input value into a number by invoking Number(value). 
This ensures that all specified fields are represented as numbers, even if the input cannot 
be converted meaningfully.

- "float": "3.14" becomes 3.14 (query string to float).
- "neg": "-42" becomes -42 (query string to negative integer).
- "int": "123" becomes 123 (string to integer).
- "zero": "0" becomes 0 (string to zero).
- "text": "not-a-number" becomes NaN (invalid input).
- und (undefined) becomes NaN (missing value).

This casting mechanism provides a uniform way to convert diverse inputs into numbers, 
relying on JavaScript’s Number() function, while leaving validation of the resulting value 
(e.g., checking for NaN) to the developer’s discretion.



