import { ConflictExternalIdResolver } from "./ConflictExternalIdResolver";

export type UpflowOptions = {
  conflictExternalIdResolver?: ConflictExternalIdResolver;
  metadataIndexes?: string[];
};
