import { Request, Response } from "express";
import { StreamingService, streamingService } from "./streaming-service";
import { ExpressHandler } from "../shared/express-handler.decorator";
import { StreamResponseStats } from "./stream-response.type";

export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @ExpressHandler()
  public async streamVideoFile(req: Request, res: Response): Promise<void> {
    const result = await this.streamingService.streamVideoFile(
      req.params.filename,
      req.headers.range
    );

    const headers = this.createHeaders(result.fileStats);
    const status = this.getStatus(result.fileStats);

    res.status(status).set(headers);

    result.fileStream.pipe(res);
  }

  private createHeaders(fileStats: StreamResponseStats): Record<string, any> {
    const headers: Record<string, any> = {
      "Content-Type": "video/mp4",
      "Content-Length": fileStats.contentSize,
    };

    if (fileStats.byteRange) {
      headers["Accept-Ranges"] = "bytes";
      headers["Content-Range"] = fileStats.byteRange;
    }

    return headers;
  }

  private getStatus(fileStats: StreamResponseStats): number {
    return fileStats.byteRange ? 206 : 200;
  }
}

export const streamingController = new StreamingController(streamingService);
