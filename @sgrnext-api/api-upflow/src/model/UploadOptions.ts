import { ConflictExternalIdResolver } from "./ConflictExternalIdResolver";

export type UploadOptions = {
  externalId?: string;
  filename?: string;
  contentType?: string;
  metadata?: Record<string, string>;
  maxSize?: number;
  limits?: Record<string, number | { limit: number, error: string }>;
  conflictExternalIdResolver?: ConflictExternalIdResolver;
};
