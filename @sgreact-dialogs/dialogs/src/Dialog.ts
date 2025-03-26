import React from "react";

export function dialog<
  Args extends unknown[], 
  Value,
  Props extends Record<string, unknown>
>(
  component: React.FC<Props & DialogProps<Value>>,
  fn: (...args: Args) => Props,
  _value: Value
): Dialog<unknown[], unknown, {}> {
  const result = (() => Promise.resolve(null)) as Dialog<unknown[], unknown, {}>;
  result.Component = component as React.FC<{ } & DialogProps<Value>>;
  result.fn = fn as (...args: unknown[]) => Props;

  return result;
}

export type Dialogs<
  T extends Record<string, Dialog<unknown[], unknown, {}>> = { }
> = {
  [K in keyof T]: () => Promise<T[K]["value"]>;
};

export type Dialog<
  Args extends unknown[], 
  Value,
  Props extends Record<string, unknown>
> = (() => Promise<Value>) & {
  Component: React.FC<Props & DialogProps<Value>>;
  fn: (...args: Args) => Props;
  value: Value;
};

export type DialogProps<Value> = { onClose: (value: Value) => void };
