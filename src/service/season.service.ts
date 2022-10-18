import { InputComment, CommentAttributes } from "../models/comment";
import * as seasonRepository from "../repository/season";

export async function getSeason() {
  return await seasonRepository.getSeason();
}
