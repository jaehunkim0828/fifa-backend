import express from "express";

import * as rankController from "../controller/rank.controller";

const rankRouter = express.Router();

rankRouter.route("/").post(rankController.PlayerAbility).get(rankController.createPlayerAuto);
rankRouter.route("/all").get(rankController.getAllRank);
rankRouter.route("/player/count").get(rankController.countAllRank);
rankRouter.route("/po").get(rankController.getPosition);
rankRouter.route("/potential").post(rankController.createPlayerRank).get(rankController.getPlayerTotalScorecard);

export default rankRouter;
