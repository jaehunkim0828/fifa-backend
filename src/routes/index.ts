import express from "express";
import dataRouter from "./data";
import mailRouter from "./mail";

import playerRouter from "./player";
import positionRouter from "./position";
import rankRouter from "./rank";
import valueRouter from "./value";
import commentRouter from "./comment";
import seasonRouter from "./season";
import cardRouter from "./card";

const rootRouter = express.Router();

rootRouter.use("/add", dataRouter);
rootRouter.use("/player", playerRouter);
rootRouter.use("/rank", rankRouter);
rootRouter.use("/position", positionRouter);
rootRouter.use("/value", valueRouter);
rootRouter.use("/mail", mailRouter);
rootRouter.use("/comment", commentRouter);
rootRouter.use("/season", seasonRouter);
rootRouter.use("/card", cardRouter);

export default rootRouter;
