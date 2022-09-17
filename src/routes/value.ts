import express from "express";

import * as rankController from "../controller/value.controller";

const valueRouter = express.Router();

valueRouter.route("/").get(rankController.getPriceBySpid);

export default valueRouter;
