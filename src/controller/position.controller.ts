import { Request, Response, NextFunction } from "express";
import SQ from "sequelize";

import Ranks from "../models/rank.model";
import Player from "../models/player.model";

import * as positionService from "../service/position.service";
import Position from "../models/position.model";

export async function findPositionAvg(req: Request, res: Response, next: NextFunction) {
  const { part } = req.params;

  try {
    const result = await positionService.findPositionAvg(part);
    res.status(200).send(result);
  } catch (err) {
    res.status(404).send(err);
  }
}
