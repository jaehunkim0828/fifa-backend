import { Request, Response, NextFunction } from "express";

import * as cardService from "../service/card.service";

interface Cards {
  spid: string;
}

export async function findAllCard(req: Request<"", "", "", Cards>, res: Response, next: NextFunction) {
  try {
    const { spid } = req.query;
    const card = await cardService.findCard(spid);
    res.status(201).send(card);
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
}
