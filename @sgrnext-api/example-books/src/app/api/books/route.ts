import { handlers } from "@/server/handlers";
import { compileSchema } from "@sgrnext/api-parse";
import { z } from "zod";

export const GET = handlers.create(async (env) => {
  const { limit, offset } = await env.parse(LIST_SCHEMA, LIST_ZOD_SCHEMA);

  const { rows } = await env.pgPool.query(
    `SELECT * FROM "Books" LIMIT $1 OFFSET $2`, 
    [ limit, offset ]
  );  

  return rows;
});

export const POST = handlers.create(async (env) => {
  const { title, author, description } = await env.parse(CREATE_SCHEMA, CREATE_ZOD_SCHEMA);

  const { rows } = await env.pgPool.query(
    `INSERT INTO "Books" (title, author, description) VALUES ($1, $2, $3) RETURNING id`, 
    [ title, author, description ]
  );

  return rows[0]['id'];
});

const LIST_SCHEMA = compileSchema({
  limit: "query:number",
  offset: "query:number",
});

const LIST_ZOD_SCHEMA = z.object({
  limit: z.number().int().finite().positive(),
  offset: z.number().int().finite().nonnegative(),
});

const CREATE_SCHEMA = compileSchema({
  title: "body",
  author: "body",
  description: "body",
});

const CREATE_ZOD_SCHEMA = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string(),
});
