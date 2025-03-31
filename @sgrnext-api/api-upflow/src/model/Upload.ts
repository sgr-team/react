export type Upload = {
  id: string;
  externalId: string;
  metadata: Record<string, string>;
  filename: string;
  contentType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
};
