import { Request, Response, NextFunction } from "express";
import { sendInfoAtGmail } from "../external/mail";

export async function sendQuestion(req: Request, res: Response, next: NextFunction) {
  try {
    const { question, mail } = req.body;
    await sendInfoAtGmail("유저 문의사항이 도착했습니다.", `${question} \n 회신 이메일: ${mail}`);
    res.status(200).send("done");
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function sendMail(req: Request, res: Response, next: NextFunction) {
  try {
    const { ip } = req.body;
    await sendInfoAtGmail("새로운 유저가 입장했습니다.", `${ip} 아이피에서 접속했습니다.`);
    res.status(200).send("welcome!!");
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
}
