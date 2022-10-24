import express from "express";

import * as cardController from "../controller/card.controller";

const cardRouter = express.Router();

cardRouter.route("/:spid").get(cardController.findCard);

export default cardRouter;
