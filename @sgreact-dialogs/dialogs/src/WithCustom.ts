import { DialogProps } from "./Dialog";

export type WithCustom = {
  custom: <P, V>(
    dialog: React.FC<P & DialogProps<V>>, 
    props: P
  ) => Promise<V>
};