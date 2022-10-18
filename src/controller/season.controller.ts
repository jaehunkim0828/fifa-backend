import { Request, Response, NextFunction } from "express";
import * as seasonService from "../service/season.service";

export async function getSeason(req: Request, res: Response, next: NextFunction) {
  try {
    const seasons = await seasonService.getSeason();
    res.status(200).send(seasons);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
}
