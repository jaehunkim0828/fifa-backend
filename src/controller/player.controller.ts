import { Request, Response, NextFunction } from "express";
import SQ from "sequelize";

import * as playerService from "../service/player.service";
import { Player } from "../mysql/schema";

const Op = SQ.Op;

export async function getPlayerByName(req: Request, res: Response, next: NextFunction) {
  const { name } = req.params;
  const { current_page, count } = req.query;
  try {
    const player = await playerService.findPlayers(name, current_page, count);
    res.status(200).send(player);
  } catch (err) {
    res.status(404).send(err);
  }
}

export async function updateSeason(req: Request, res: Response, next: NextFunction) {
  try {
    await playerService.updateSeason();
    res.status(200).send("season");
  } catch (err) {
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

// export async function a(req: Request, res: Response, next: NextFunction) {
//   const { spid } = req.params;
//   try {
//     interface BB {
//       message?: string;
//     }
//     const seasonId = spid.substring(0, 3);
//     const pid = spid.substring(3);
//     // const a: BB = await getFifaApi(`https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pid}.png`);
//     // console.log(a.message);
//     res.status(200).json(pid);
//   } catch (err) {
//     res.status(404).send(err);
//   }
// }

export async function countAllPlayer(req: Request, res: Response, next: NextFunction) {
  const { name } = req.params;
  try {
    const totalRankPlayer = await playerService.totalPlayerCount(name);

    res.status(200).send(`${totalRankPlayer.rows.length}`);
  } catch (err) {
    if (err instanceof Error) res.status(404).send(err);
  }
}
