import { ReadStream } from "fs";

export type StreamResponse = {
  headers: Record<string, any>;
  status: number;
  fileStream: ReadStream;
};
