import express from "express";
import dataRouter from "./data";

import playerRouter from "./player";
import positionRouter from "./position";
import rankRouter from "./rank";

const rootRouter = express.Router();

rootRouter.use("/player", playerRouter);
rootRouter.use("/rank", rankRouter);
rootRouter.use("/data", dataRouter);
rootRouter.use("/position", positionRouter);

export default rootRouter;
