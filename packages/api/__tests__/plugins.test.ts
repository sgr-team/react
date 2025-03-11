import { expect, it } from '@jest/globals';
import { HandlerFactory, HandlerEnvironment, HandlerEnvironmentPlugin } from '@/index';
import { NextRequest } from 'next/server';

it('plugins are applied to the environment', async () => {
  expect(await getEnv([
    { objPlugin: 68 },
    (env: HandlerEnvironment) => ({
      ...env, 
      objPlugin: (env as unknown as { objPlugin: number }).objPlugin + 1, 
      fnPlugin: 420 
    }),
  ])).toEqual({ 
    request: { request: 'next' },
    params: Promise.resolve({}),
    objPlugin: 69, 
    fnPlugin: 420 
  });
});

function getEnv(plugins: HandlerEnvironmentPlugin[]) {
  const factory = new HandlerFactory();
  for (const plugin of plugins) {
    factory.plugin(plugin);
  }

  return new Promise((resolve) => {
    const handler = factory.create((env) => resolve(env));

    handler({ request: 'next' } as unknown as NextRequest, { params: Promise.resolve({ }) });
  });
}
