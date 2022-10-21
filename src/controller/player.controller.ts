import { Request, Response, NextFunction } from "express";

import * as playerService from "../service/player.service";

class Query {
  [x: string]: string;
}

export async function getPlayer(req: Request, res: Response, next: NextFunction) {
  try {
    const { current_page, count, name, season, position } = req.query as unknown as Query;
    const player = await playerService.findPlayers({ name, season, position: position }, current_page, count);
    return res.status(200).send(player);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
}

export async function getPlayerById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const data = await playerService.findPlayerById(id);
    res.send(data);
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function findPlayerImage(req: Request, res: Response, next: NextFunction) {
  const { spid } = req.params;
  try {
    /** 고유번호에 맞는 선수 이미지 얻기
     * @return url;
     */
    const result = await playerService.getPlayerImage(spid);
    res.status(200).send(result);
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function getPlayerByCrawling(req: Request, res: Response, next: NextFunction) {
  const { spid } = req.params;
  try {
    const player = await playerService.getPlayerByCr(spid);
    res.status(200).send(player);
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function findPlayerPrice(req: Request, res: Response, next: NextFunction) {
  const { spid } = req.params;
  try {
    const result = await playerService.findPlayerPrice(spid, 1);
    res.status(200).send(result);
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function countAllPlayer(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, season, position } = req.query as unknown as Query;

    const totalRankPlayer = await playerService.totalPlayerCount({ name, season: season, position });

    res.status(200).send(`${totalRankPlayer.rows.length}`);
  } catch (err) {
    if (err instanceof Error) res.status(404).send(err);
  }
}
