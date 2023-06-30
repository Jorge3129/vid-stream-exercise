import * as fs from "fs";
import * as http from "http";
import path from "path";

const parseRange = (range: string): { start: number; end?: number } => {
  const [startRaw, endRaw] = range.split("=")[1].split("-");

  return {
    start: parseInt(startRaw, 10),
    end: endRaw ? parseInt(endRaw, 10) : undefined,
  };
};

http
  .createServer((req, res) => {
    const filePath = path.join(__dirname, "..", "public", "noflgs.mp4");

    const { size } = fs.statSync(filePath);

    const range = req.headers.range;

    if (range) {
      const { start, end = size - 1 } = parseRange(range);

      res.writeHead(206, {
        "Content-Type": "video/mp4",
        "Content-Length": end - start + 1,
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${size}`,
      });

      const fileStream = fs.createReadStream(filePath, { start, end });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Content-Length": size,
      });

      const fileStream = fs.createReadStream(filePath);

      fileStream.pipe(res);
    }
  })
  .listen(8000, () => {
    console.log(`Server listening on port ${8000}`);
  });
