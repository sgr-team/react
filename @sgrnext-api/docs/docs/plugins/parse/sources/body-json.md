---
slug: /plugins/@sgrnext/api-parse/sources/body-json
title: Body(json)
sidebar_position: 1
---

# Body (json)

The body source in @sgrnext/api-parse allows you to extract and parse the JSON 
content of a NextRequest body, making it easy to access both top-level properties 
and deeply nested values within the request payload. 
By default, this source treats the body as a JSON object, enabling schema-based 
retrieval of specific fields or the entire structure.

## Example

```typescript
/* 
Body
{
  a: 1,
  answer: 42,
  b: {
    deep: {
      deeper: {
        abc: 2
      }
    }
  }
}
*/
export const POST = handlers.create(async (env) => {
  const { 
    a,      // 1
    answer, // 42
    abc,    // 2
    und     // undefined
    body    // { a: 1, answer: 42, b: { deep: { deeper: { abc: 2 } } } }
  } = await env.parse(SCHEMA, ZOD_SCHEMA);
});

const SCHEMA = compileSchema({ 
  a: 'body.a', 
  answer: 'body',
  abc: 'body.b.deep.deeper.abc',
  und: 'body',
  body: 'body.'
});
```

## Explanation

- a resolves to 1 (top-level property).
- answer resolves to 42 (top-level property).
- abc resolves to 2 (nested property).
- und resolves to undefined (missing property).
- body resolves to the complete JSON object \{ a: 1, answer: 42, b: \{ deep: \{ deeper: \{ abc: 2 \} \} \} \}.
