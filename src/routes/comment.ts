import express from "express";

import * as commentController from "../controller/comment.controller";

const commentRouter = express.Router();

commentRouter.route("/create").post(commentController.createComment);
commentRouter.route("/read/:postId").get(commentController.findCommentByPostId);
commentRouter.route("/read/newid/id").get(commentController.findCommentByTime);
// commentRouter.route("/update").post(commentController);
commentRouter.route("/delete/:commentId").get(commentController.deleteComment);

export default commentRouter;
