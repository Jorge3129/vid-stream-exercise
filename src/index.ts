import express from "express";
import streamingRouter from "./streaming/streaming-router";

const app = express();
const port = 8000;

app.use("/videos", streamingRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
