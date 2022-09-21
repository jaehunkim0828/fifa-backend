import express from "express";

import * as mailController from "../controller/mail.controller";

const mailRouter = express.Router();

mailRouter.route("/inquiry").post(mailController.sendQuestion);

export default mailRouter;
