import { Request, Response, NextFunction } from "express";

import * as cardService from "../service/card.service";

export async function findCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { spid } = req.params;

    const card = await cardService.findCard(+spid);
    res.status(201).send(card);
  } catch (err) {
    console.error(err);
    res.status(404).send(err);
  }
}
