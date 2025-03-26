import React from "react";
import { Dialog as DialogType } from "./Dialog";

export function Container({ Dialog, dialogProps, onClose }: ContainerProps) {
  if (Dialog == null) {
    return null;
  }

  return <Dialog.Component {...(dialogProps as { } ?? { })} onClose={onClose} />;
}

export const CONTAINER_SYMBOL = Symbol("CONTAINER");

export type ContainerProps = {
  Dialog: DialogType<unknown[], unknown, { }> | null | undefined;
  dialogProps: unknown;
  onClose: (value: unknown) => void;
};
