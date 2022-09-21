import { Request, Response, NextFunction } from "express";
import { sendInfoAtGmail } from "../external/mail";

export async function sendQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { question } = req.body;
    await sendInfoAtGmail("유저 문의사항이 도착했습니다.", question);
    res.status(200).send("done");
  } catch (err) {
    res.status(404).send(err);
  }
}
