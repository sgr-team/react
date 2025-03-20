import { handlers } from "@/server/handlers";
import { ApiError } from "@sgrnext/api";
import { compileSchema } from "@sgrnext/api-parse";
import { z } from "zod";

export const GET = handlers.create(async (env) => {
  const { id } = await env.parse(ID_SCHEMA, ID_ZOD_SCHEMA);

  const { rows } = await env.pgPool.query(`SELECT * FROM "Books" WHERE id = $1`, [ id ]);

  if (rows.length === 0) {
    throw new ApiError(404, "Book not found");
  }

  return rows[0];
});

export const PUT = handlers.create(async (env) => {
  const { id, title, author, description } = await env.parse(PUT_SCHEMA, PUT_ZOD_SCHEMA);
  const { rows } = await env.pgPool.query(
    `
    UPDATE "Books"
    SET title = $2, author = $3, description = $4 
    WHERE id = $1
    RETURNING id
    `, 
    [ id, title, author, description ]
  );

  if (rows.length === 0) {
    throw new ApiError(404, "Book not found");
  }
});

export const DELETE = handlers.create(async (env) => {
  const { id } = await env.parse(ID_SCHEMA, ID_ZOD_SCHEMA);

  const { rows } = await env.pgPool.query(
    `
    DELETE FROM "Books" WHERE id = $1
    RETURNING id
    `, 
    [ id ]
  );

  if (rows.length === 0) {
    throw new ApiError(404, "Book not found");
  }
});

const ID_SCHEMA = compileSchema({
  id: "params:number"
});

const ID_ZOD_SCHEMA = z.object({
  id: z.number()
});

const PUT_SCHEMA = compileSchema({
  id: "params:number",
  title: "body",
  author: "body",
  description: "body" 
});

const PUT_ZOD_SCHEMA = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  description: z.string()
});
