import express from "express";

import * as rankController from "../controller/rank.controller";

const rankRouter = express.Router();

rankRouter.route("/").post(rankController.createPlayerRank).get(rankController.createPlayerAuto);
rankRouter.route("/all").get(rankController.getAllRank);
rankRouter.route("/player/count").get(rankController.countAllRank);
rankRouter.route("/average/:part").get(rankController.findPositionAvg);
rankRouter.route("/average/ALL").get(rankController.findPositionAvg);
// rankRouter.route("/po").get(rankController.getPosition);
rankRouter.route("/potential").get(rankController.getPlayerTotalScorecard);

export default rankRouter;
