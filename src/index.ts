import * as http from "http";
import { streamingService } from "./streaming/streaming-service";

http
  .createServer(async (req, res) => {
    try {
      const result = await streamingService.streamVideoFile(
        req.url + "",
        req.headers.range
      );

      res.writeHead(result.status, result.headers);

      result.fileStream.pipe(res);
    } catch (e) {
      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: 500,
          message: "Internal server error",
          description: (e as any).message,
        })
      );
    }
  })
  .listen(8000, () => {
    console.log(`Server listening on port ${8000}`);
  });
