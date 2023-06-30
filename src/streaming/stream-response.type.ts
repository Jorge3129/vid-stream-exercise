import { ReadStream } from "fs";

export type StreamResponse = {
  fileStream: ReadStream;
  fileStats: StreamResponseStats;
};

export type StreamResponseStats = {
  contentSize: number;
  byteRange?: string;
};

export type RequestRange = {
  start: number;
  end?: number;
};

export type FullRequestRange = Required<RequestRange>;
