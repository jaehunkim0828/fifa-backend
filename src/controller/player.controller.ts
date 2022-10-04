import { Request, Response, NextFunction } from "express";

import * as playerService from "../service/player.service";

export async function getPlayerByName(req: Request, res: Response, next: NextFunction) {
  const { name } = req.params;
  const { current_page, count } = req.query;
  try {
    if (typeof current_page === "string" && typeof count === "string") {
      const player = await playerService.findPlayers(name, current_page, count);
      return res.status(200).send(player);
    }
    throw new Error("unexpected error");
  } catch (err) {
    res.status(404).send(err);
  }
}

// export async function updateSeason(req: Request, res: Response, next: NextFunction) {
//   try {
//     await playerService.updateSeason();
//     res.status(200).send("season");
//   } catch (err) {
//     res.status(404).send(err);
//   }
// }

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
  const { name } = req.params;
  try {
    const totalRankPlayer = await playerService.totalPlayerCount(name);

    res.status(200).send(`${totalRankPlayer.rows.length}`);
  } catch (err) {
    if (err instanceof Error) res.status(404).send(err);
  }
}
