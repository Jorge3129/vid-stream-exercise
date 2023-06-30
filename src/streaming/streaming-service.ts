import * as fs from "fs";
import * as fsPromise from "fs/promises";
import path from "path";
import { StreamResponse } from "./stream-response.type";

export class StreamingService {
  public async streamVideoFile(
    fileName: string,
    range?: string
  ): Promise<StreamResponse> {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      `${fileName}.mp4`
    );

    const { size } = await fsPromise.stat(filePath);

    if (range) {
      const { start, end = size - 1 } = this.parseRange(range);

      const headers = {
        "Content-Type": "video/mp4",
        "Content-Length": end - start + 1,
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${size}`,
      };

      const fileStream = fs.createReadStream(filePath, { start, end });

      return { fileStream, status: 206, headers };
    } else {
      const headers = {
        "Content-Type": "video/mp4",
        "Content-Length": size,
      };

      const fileStream = fs.createReadStream(filePath);

      return { fileStream, status: 200, headers };
    }
  }

  private parseRange(range: string): { start: number; end?: number } {
    const [startRaw, endRaw] = range.split("=")[1].split("-");

    return {
      start: parseInt(startRaw, 10),
      end: endRaw ? parseInt(endRaw, 10) : undefined,
    };
  }
}

export const streamingService = new StreamingService();
