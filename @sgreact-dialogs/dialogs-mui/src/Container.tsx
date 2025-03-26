import MUIDialog, { DialogProps } from "@mui/material/Dialog";
import { ContainerProps, Container } from "@sgreact/dialogs";
import React from "react";

export function MUIContainer({ Dialog, dialogProps, ...props }: MUIContainerProps) {
  return (
    <MUIDialog open={Dialog != null} {...props}>
      <Container Dialog={Dialog} dialogProps={dialogProps} onClose={props.onClose} />
    </MUIDialog>
  )
}

export type MUIContainerProps = 
  ContainerProps 
  & Omit<DialogProps, 'open' | 'onClose' | 'children'>
;