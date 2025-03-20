import { NextResponse } from "next/server";

export type HandlerFactoryOptions = {
  response?: (result: unknown) => NextResponse,
  error?: (error: unknown) => NextResponse,
};
