import React from "react";
import { DialogsContext } from "./context";
import { dialog, Dialog, DialogProps } from "./Dialog";
import { CONTAINER_SYMBOL, Container as DefaultContainer } from "./Container";

export function Provider<
  T extends Record<string, Dialog<unknown[], unknown, {}>>
>({ children, dialogs }: ProviderProps<T>) {
  const [ dialogState, dispatch ] = React.useReducer(reducer, null);
  const Container = dialogs[CONTAINER_SYMBOL] ?? DefaultContainer;

  const onClose = React.useCallback((value: unknown) => dispatch({ value }), [ dispatch ]);

  const dialogsValue = React.useMemo(
    () => {
      const result = { 
        custom: async (component: Dialog<unknown[], unknown, { }>["Component"], props: unknown) => new Promise((resolve) => {
          dispatch({ 
            state: { 
              Dialog: dialog(component, () => ({ }), null), 
              DialogProps: { onClose, ...(props ?? {}) }, 
              resolve
            }
          });
        })
      } as Record<string, (...args: unknown[]) => Promise<unknown>>;

      for (const [ key, Dialog ] of Object.entries(dialogs)) {
        if (typeof key !== "string") {
          continue;
        }

        result[key] = (...args: unknown[]) => new Promise((resolve) => {
          dispatch({ 
            state: { 
              Dialog, 
              DialogProps: { onClose, ...Dialog.fn(...args) }, 
              resolve
            }
          });
        });
      }

      return result;
    }, 
    [ dialogs, dispatch, onClose ]
  );

  return (
    <DialogsContext.Provider value={dialogsValue as unknown as null}>
      <Container 
        Dialog={dialogState?.Dialog} 
        dialogProps={dialogState?.DialogProps} 
        onClose={onClose} 
      />
      {children}
    </DialogsContext.Provider>
  );
}

export type ProviderProps<T extends Record<string, Dialog<unknown[], unknown, {}>>> = {
  children: React.ReactNode;
  dialogs: T & { [CONTAINER_SYMBOL]?: typeof DefaultContainer };
};

const reducer = (state: State, action: Action) => {
  if (state != null) {
    state.resolve(action.value);
  }

  return action.state ?? null;
}

type Action = {
  state?: State;
  value?: unknown;
};

type State = null | {
  Dialog: Dialog<unknown[], unknown, {}>;
  DialogProps: DialogProps<unknown>;
  resolve: (value: unknown) => void;
};
