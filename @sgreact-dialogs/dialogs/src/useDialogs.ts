import React from "react";
import { DialogsContext } from "./context";
import { WithCustom } from "./WithCustom";

export const useBaseDialogs = <T>() => {
  return React.useContext(DialogsContext) as unknown as T & WithCustom;
};
