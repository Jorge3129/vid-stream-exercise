import * as fs from "fs";
import * as fsPromise from "fs/promises";
import path from "path";
import {
  RequestRange,
  FullRequestRange,
  StreamResponse,
  StreamResponseStats,
} from "./stream-response.type";

export class StreamingService {
  public async streamVideoFile(
    fileName: string,
    range?: string
  ): Promise<StreamResponse> {
    const filePath = path.join(__dirname, "../../public", `${fileName}.mp4`);

    const { size: totalSize } = await fsPromise.stat(filePath);

    const parsedRange = this.parseFullRange(range, totalSize);

    const fileStream = this.createStream(filePath, parsedRange);

    return {
      fileStream,
      fileStats: this.getStats(totalSize, parsedRange),
    };
  }

  private createStream(filePath: string, range: FullRequestRange | null) {
    const readOptions = range
      ? { start: range.start, end: range.end }
      : undefined;

    return fs.createReadStream(filePath, readOptions);
  }

  private getStats(
    totalSize: number,
    range: FullRequestRange | null
  ): StreamResponseStats {
    if (!range) {
      return { contentSize: totalSize };
    }

    const { start, end } = range;

    return {
      contentSize: end - start + 1,
      byteRange: `bytes ${start}-${end}/${totalSize}`,
    };
  }

  private parseFullRange(
    range: string | undefined,
    totalSize: number
  ): FullRequestRange | null {
    if (!range) {
      return null;
    }

    const { start, end = totalSize - 1 } = this.parseRange(range);

    return { start, end };
  }

  private parseRange(range: string): RequestRange {
    const [startRaw, endRaw] = range.split("=")[1].split("-");

    return {
      start: parseInt(startRaw, 10),
      end: endRaw ? parseInt(endRaw, 10) : undefined,
    };
  }
}

export const streamingService = new StreamingService();
