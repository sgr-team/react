import { HandlerFactory } from '@sgrnext/api';
import { parse } from "@sgrnext/api-parse";
import { pgPool } from '../pg';

export const handlers = new HandlerFactory()
  .plugin({ pgPool })
  .plugin(parse())
;