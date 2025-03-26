import { useBaseDialogs, WithCustom } from "@sgreact/dialogs";
import { AlertFn } from "./alert";
import { ConfirmFn } from "./confirm";
import { ErrorFn } from "./error";

export const useMUIDialogs = () => {
  return useBaseDialogs() as WithCustom & {
    alert: AlertFn,
    confirm: ConfirmFn,
    error: ErrorFn,
  };
}
