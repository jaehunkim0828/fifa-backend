import express, { Request, Response, NextFunction } from "express";

import * as playerController from "../controller/player.controller";

const playerRouter = express.Router();

playerRouter.route("/add/season").get(playerController.updateSeason);
playerRouter.route("/:id").get(playerController.getPlayerById);
playerRouter.route("/spid/:name").get(playerController.getPlayerByName);

export default playerRouter;
