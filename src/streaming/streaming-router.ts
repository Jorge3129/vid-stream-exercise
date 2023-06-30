import { Router } from "express";
import { streamingController } from "./stream-controller";

const streamingRouter = Router();

streamingRouter.get("/:filename", streamingController.streamVideoFile);

export default streamingRouter;
