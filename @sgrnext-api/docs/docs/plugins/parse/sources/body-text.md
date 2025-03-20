---
slug: /plugins/@sgrnext/api-parse/sources/body-text
title: Body(text)
sidebar_position: 2
---

# Body (text)

The body[text] source in @sgrnext/api-parse provides access to the raw text content 
of a NextRequest body, treating it as a single string rather than a structured object. 
A key distinguishing feature of this source is that it does not support 
the path section in schema definitions, as it returns the entire body as a single 
value without nested property navigation.

```typescript
/* 
Body
42
*/
export PUT = handlers.create(async (env) => {
  const { 
    price // 42
  } = await env.parse(SCHEMA, ZOD_SCHEMA);
});

const SCHEMA = compileSchema({ 
  price: 'body[text]:number'
});
```

## Explanation

- price resolves to 42, where the body text "42" is retrieved and then cast to a number using the :number cast.
