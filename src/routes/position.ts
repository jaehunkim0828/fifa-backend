import express from "express";

import * as positionController from "../controller/position.controller";

const positionRouter = express.Router();

positionRouter.route("/average/:part").get(positionController.findPositionAvg);

export default positionRouter;
