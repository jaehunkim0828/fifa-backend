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

/**선수에게 main포지션 update, create해주기
 * @params spid
 * @return boolean
 */
export async function updatePosition(req: Request, res: Response, next: NextFunction) {
  const { spid } = req.body;
  try {
    /**업데이트 횟수 체크 ex) [1] */
    const position = await positionService.updatePosition(spid);
    res.status(201).send(!!position[0]);
  } catch (err) {
    if (err instanceof Error) res.status(404).send(err);
  }
}
