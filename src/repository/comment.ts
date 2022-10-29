import { CommentAttributes } from "../models/comment.model";
import { Comment } from "../mysql/schema";

export async function createComment({ username, content, role, createAt, groupNum, hierarchy, postId, password }: CommentAttributes) {
  return await Comment.create({
    username,
    content,
    role,
    createAt,
    groupNum,
    postId,
    hierarchy,
    password,
  }).catch((err) => {
    throw new Error(err.message);
  });
}

export async function findCommentById(commentId: string) {
  return await Comment.findOne({
    where: {
      id: commentId,
    },
  });
}

export async function findCommentByPostId(postId: string) {
  return await Comment.findAll({
    where: {
      hierarchy: 0,
      postId: postId,
    },
    order: [["createAt", "ASC"]],
  });
}

export async function findReplyById(postId: string) {
  return await Comment.findAll({
    where: {
      hierarchy: 1,
      postId,
    },
    order: [
      ["groupNum", "ASC"],
      ["createAt", "ASC"],
    ],
  });
}

export async function findCommentByTime(username: string, createAt: Date) {
  return Comment.findOne({
    where: {
      username,
      createAt,
    },
  });
}

export async function findCommentByPassword(commentId: string, password: string) {
  return Comment.findOne({
    where: {
      id: commentId,
      password,
    },
  });
}

export async function updateComment(commentData: CommentAttributes, commentId: number) {
  return Comment.update(commentData, {
    where: {
      id: commentId,
    },
  });
}

export async function deleteComment(commentId: string) {
  return Comment.destroy({
    where: { id: commentId },
  });
}

export async function deleteCommentByGroupNum(groupNum: number) {
  return Comment.destroy({
    where: {
      groupNum,
    },
  });
}
