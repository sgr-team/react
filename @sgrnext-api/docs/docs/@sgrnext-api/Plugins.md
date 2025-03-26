---
slug: /@sgrnext/api/plugins
title: Plugins System
sidebar_position: 3
---

# Plugins System

The @sgrnext/api library supports two types of plugins: objects and functions. 
Objects are treated as property donors to create the handler's environment, 
while functions are invoked on the environment object.

A list of existing plugins can be found [here](/docs/plugins).


## Objects

```typescript
import { HandlerFactory } from '@sgrnext/api';

export const handlers = new HandlerFactory()
  .plugin({ pool: myDatabaseConnection })
;

const webHandler = handlers.create(async (env) => {
  // This behavior is reflected in the type definitions, 
  // and now the env object includes a pool property.
  const result = await env.pool.query('...', []);
  ...
});
```

## Functions

The HandlerEnvironmentPluginFn type is defined with three generic type parameters:

- From: Represents the type of the environment object that is expected to be passed as an argument to the plugin function.
- EnvDelta: Defines the additional properties that are introduced to the env object by the plugin, extending its structure.
- EnvOmit: Specifies the properties that are removed from the env object, allowing for selective exclusion of existing fields

```typescript
import { HandlerEnvironment, HandlerEnvironmentPluginFn } from "@sgrnext/api";


export const indexed = <
  Env extends HandlerEnvironment
>(): HandlerEnvironmentPluginFn<Env, IndexedDelta> => {
  let index = 0;
  
  return (env) => {
    const resultEnv = env as HandlerEnvironment & IndexedDelta;
    resultEnv.index = index++;

    return resultEnv;
  }
}


export type IndexedDelta = { index: number; };
```