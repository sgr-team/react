# @sgrnext/api-upflow

## Getting started

### Install

```bash
npm install --save @sgrnext/api @sgrnext/api-upflow
```

### Crate handlers factory

```typescript
// src/server/handle.ts
import { upload } from "@sgrnext/api-upflow";

export const handlers = new HandlerFactory()
  .plugin(upload(new UploadMongoAdapter("connection string or connection object")));
```

### Create routes

```typescript
// src/app/api/me/avatar/route.ts
import { handlers } from '@/server/handlers';

export PUT = handlers.create(async (env) => {
  const { id } = await env.upload(`user:${user}`)
  
  return { id, url: '/api/user/avatar/${id}' };
});
```

```typescript
// src/app/api/avatar/route.ts
import { handlers } from '@/server/handlers';

export PUT = handlers.create(async (env) => {
  const { id } = await env.params;

  const result = await env.uploadGet(id);
  if (result == null) {
    throw new ApiError(404, 'Avatar not found')
  }

  return result;
});
```
