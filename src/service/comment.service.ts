import { InputComment, CommentAttributes } from "../models/comment";
import * as commentRepository from "../repository/comment";

/**댓글 생성하기
 * @arg commentData 댓글 생성할때 필요한 구성요소
 */
export async function createComment(commentData: CommentAttributes) {
  // 대댓글이면
  if (!!commentData.groupNum && commentData.hierarchy === 1) {
    return await commentRepository.createComment(commentData);
  }

  const newComment = new InputComment();
  newComment.postId = commentData.postId;
  newComment.hierarchy = commentData.hierarchy;

  const comment = await commentRepository.createComment(newComment);
  const commentId = comment.getDataValue("id");
  if (!commentId) throw new Error("댓글 생성 실패");
  commentData.groupNum = commentId;

  return await commentRepository.updateComment(commentData, commentId);
}

export async function findCommentByTime(username: string, createAt: Date) {
  const comment = await commentRepository.findCommentByTime(username, createAt);
  return comment?.getDataValue("id");
}

export async function checkCommentByPassword(commentId: string, password: string) {
  const result = await commentRepository.findCommentByPassword(commentId, password);
  return !!result;
}

/** 특정 게시글의 모든 댓글 불러오기
 * @arg postId 게시글 Id
 */
export async function findCommentByPostId(postId: string) {
  const comments = await commentRepository.findCommentByPostId(postId);
  const reply = await commentRepository.findReplyById(postId);

  comments.forEach((c, i) => {
    const replys = reply.filter((r) => r.getDataValue("groupNum") === c.getDataValue("groupNum"));

    const comment = c.get();
    comment.addChat = replys;
    return comment;
  });
  return comments;
}

/** 댓글 삭제 */
export async function deleteComment(commentId: string, password: string) {
  const isPass = await checkCommentByPassword(commentId, password);
  if (!isPass) throw new Error("비번 틀림");
  const comment = await commentRepository.findCommentById(commentId);
  if (comment?.getDataValue("hierarchy") === 0) {
    //댓글 일때 대댓글 다 삭제하기
    return await commentRepository.deleteCommentByGroupNum(comment.getDataValue("groupNum"));
  }
  return await commentRepository.deleteComment(commentId);
}
