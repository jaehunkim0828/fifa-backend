import { Request, Response, NextFunction } from "express";

import * as valueService from "../service/value.srvice";
import { Player, Value } from "../mysql/schema";

export async function getPriceBySpid(req: Request, res: Response, next: NextFunction) {
  const { spid, rating } = req.query;
  try {
    if (typeof spid === "string" && typeof rating === "string") {
      const price = await valueService.findPrice(spid, +rating);
      res.status(200).send(price);
      return;
    }
    throw new Error("Unexpected error.");
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
}
