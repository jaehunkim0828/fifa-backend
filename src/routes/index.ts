import express from "express";

import playerRouter from "./player";
import rankRouter from "./rank";

const rootRouter = express.Router();

rootRouter.use("/player", playerRouter);
rootRouter.use("/rank", rankRouter);

export default rootRouter;
