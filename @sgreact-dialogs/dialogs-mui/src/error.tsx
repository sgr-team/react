import React from "react";
import { dialog, DialogProps } from "@sgreact/dialogs";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

function Error({ title, error, texts, onClose }: ErrorDialogProps & DialogProps<boolean>) {
  const handleClose = React.useCallback(() => onClose(false), [ onClose ]);

  const [ message, stack ] = React.useMemo(
    () => {
      if (error == null) {
        return [ `Empry error (${JSON.stringify(error)})`, null ];
      }

      const message = typeof error === 'string' ? error : (error as Error).message ?? 'Unknown error';
      const stack = (error as Error).stack ?? null;

      return [ message, stack ];
    },
    [ error ]
  );
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
        {stack != null 
          ? <DialogContentText sx={{ whiteSpace: 'pre' }}>{stack}</DialogContentText>
          : null
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={(handleClose)}>{texts?.close ?? 'CLOSE'}</Button>
      </DialogActions>
    </>
  );
}

export const ErrorDialog = dialog(
  Error,
  (
    title: string, 
    error: unknown, 
    props: Omit<ErrorDialogProps, 'title' | 'message'>
  ) => ({ ...props, title, error } as ErrorDialogProps),
  false
)

export type ErrorDialogProps = {
  title: string;
  error: unknown;
  texts?: {
    close?: string;
  }
};

export type ErrorFn = (
  title: string, 
  error: unknown, 
  props?: Omit<ErrorDialogProps, 'title' | 'message'>
) => Promise<boolean>;