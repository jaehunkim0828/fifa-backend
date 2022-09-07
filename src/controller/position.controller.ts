import { Request, Response, NextFunction } from "express";
import Player from "../models/player.model";
import Position from "../models/position.model";

import * as positionService from "../service/position.service";

export async function findPositionAvg(req: Request, res: Response, next: NextFunction) {
  const { part } = req.params;

  try {
    const average = await positionService.findPositionAvg(part);
    res.status(200).send(average);
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function findPositionPartByPlayer(req: Request, res: Response, next: NextFunction) {
  const { spid } = req.params;

  try {
    const position = await positionService.findPartByPlayer(spid);
    res.status(200).send(position);
  } catch (err) {
    res.status(404).send(err);
  }
}
