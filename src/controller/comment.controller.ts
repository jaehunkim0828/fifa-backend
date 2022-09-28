import { Request, Response, NextFunction } from "express";

import * as commentService from "../service/comment.service";

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const commentData = req.body;
    const comment = await commentService.createComment(commentData);

    res.status(201).send(comment);
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
}

export async function findCommentByPostId(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId } = req.params;
    const comments = await commentService.findCommentByPostId(postId);
    res.status(200).send(comments);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
}

export async function findCommentByTime(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, createAt } = req.query;
    let id: any = 0;
    if (typeof username === "string" && typeof createAt === "string") {
      id = await commentService.findCommentByTime(username, new Date(createAt));
    }

    res.status(200).send(id?.toString());
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { commentId } = req.params;
    const { password } = req.query;
    if (commentId === "NaN") throw new Error("이미 삭제되었거나, 없는 댓글입니다.");
    if (typeof password === "string") await commentService.deleteComment(commentId, password);
    res.status(204).send("Success!!");
  } catch (err) {
    if (err instanceof Error) res.status(404).send(err.message);
  }
}
