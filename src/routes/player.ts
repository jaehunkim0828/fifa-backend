import express, { Request, Response, NextFunction } from "express";

import * as playerController from "../controller/player.controller";

const playerRouter = express.Router();

// playerRouter.route("/add/season").get(playerController.updateSeason);
playerRouter.route("/:id").get(playerController.getPlayerById);

playerRouter.route("/spid/search").get(playerController.getPlayer);
playerRouter.route("/image/:spid").get(playerController.findPlayerImage);
playerRouter.route("/count/search").get(playerController.countAllPlayer);
playerRouter.route("/price/:spid").get(playerController.findPlayerPrice);

playerRouter.route("/external/:spid").get(playerController.getPlayerByCrawling);

export default playerRouter;
