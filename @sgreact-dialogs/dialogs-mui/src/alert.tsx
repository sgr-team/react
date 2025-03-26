import React from "react";
import { dialog, DialogProps } from "@sgreact/dialogs";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

function Alert({ title, message, texts, onClose }: AlertDialogProps & DialogProps<void>) {
  const handleClose = React.useCallback(() => onClose(undefined), [ onClose ]);

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{texts?.close ?? 'Close'}</Button>
      </DialogActions>
    </>
  );
}

export const AlertDialog = dialog(
  Alert,
  (
    title: string, 
    message: string, 
    props: Omit<AlertDialogProps, 'title' | 'message'>
  ) => ({ ...props, title, message } as AlertDialogProps),
  undefined as void
)

export type AlertDialogProps = {
  title: string;
  message: string;
  texts?: {
    close?: string;
  }
};

export type AlertFn = (
  title: string, 
  message: string, 
  props?: Omit<AlertDialogProps, 'title' | 'message'>
) => Promise<void>;