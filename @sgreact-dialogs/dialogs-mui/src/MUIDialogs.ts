import { CONTAINER_SYMBOL, Dialogs } from "@sgreact/dialogs";

import { AlertDialog } from "./alert";
import { ConfirmDialog } from "./confirm";
import { ErrorDialog } from "./error";
import { MUIContainer } from "./Container";

export const MUIDialogs: Dialogs = {
  alert: AlertDialog,
  confirm: ConfirmDialog,
  error: ErrorDialog,
  [CONTAINER_SYMBOL]: MUIContainer,
};
