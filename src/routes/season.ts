import express from "express";

import * as seasonController from "../controller/season.controller";

const seasonRouter = express.Router();

seasonRouter.route("/all").get(seasonController.getSeason);

export default seasonRouter;
