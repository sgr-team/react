import React from "react";
import { dialog, DialogProps } from "@sgreact/dialogs";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

function Confirm({ title, message, texts, onClose }: ConfirmDialogProps & DialogProps<boolean>) {
  const handleOk = React.useCallback(() => onClose(true), [ onClose ]);
  const handleCancel = React.useCallback(() => onClose(false), [ onClose ]);

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={(handleCancel)} color="secondary">{texts?.cancel ?? 'CANCEL'}</Button>
        <Button onClick={(handleOk)} color="primary">{texts?.ok ?? 'OK'}</Button>
      </DialogActions>
    </>
  );
}

export const ConfirmDialog = dialog(
  Confirm,
  (
    title: string, 
    message: string, 
    props: Omit<ConfirmDialogProps, 'title' | 'message'>
  ) => ({ ...props, title, message } as ConfirmDialogProps),
  false
)

export type ConfirmDialogProps = {
  title: string;
  message: string;
  texts?: {
    ok?: string;
    cancel?: string;
  }
};

export type ConfirmFn = (
  title: string, 
  message: string, 
  props?: Omit<ConfirmDialogProps, 'title' | 'message'>
) => Promise<boolean>;