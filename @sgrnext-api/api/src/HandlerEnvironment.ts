import { NextRequest } from "next/server";

export type HandlerEnvironment = {
  request: NextRequest,
  params: Promise<unknown>,
};
