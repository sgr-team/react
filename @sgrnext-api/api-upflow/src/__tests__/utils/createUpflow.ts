import { Upflow } from "@/Upflow";
import { NextRequest } from "next/server";
import { FakeAdapter, FakeAdapterOptions } from "./FakeAdapter";
import { UpflowOptions } from "@/model";

export const createUpflow = (
  adapterOptions: FakeAdapterOptions = { },
  body: string | null = null,
  upflowOptions: UpflowOptions = { }
) => {
  return new Upflow(
    {
      request: new NextRequest('http://localhost:3000/api/upload', { method: 'POST', body }),
      params: Promise.resolve({ }),
    },
    new FakeAdapter(adapterOptions),
    upflowOptions,
    Promise.resolve()
  );
};