import express, { Request, Response, NextFunction } from "express";

import * as playerController from "../controller/player.controller";

const playerRouter = express.Router();

// playerRouter.route("/add/season").get(playerController.updateSeason);
playerRouter.route("/add/position/:spid").get(playerController.updatePosition);
playerRouter.route("/position").get(playerController.createMainPositionEvery);
playerRouter.route("/:id").get(playerController.getPlayerById);
playerRouter.route("/spid/:name").get(playerController.getPlayerByName);
// playerRouter.route("/image/:spid").get(playerController.a);
playerRouter.route("/count/:name").get(playerController.countAllPlayer);

export default playerRouter;
