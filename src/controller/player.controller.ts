import { Request, Response, NextFunction } from "express";
import { url } from "../config/http";
import { getFifaApi } from "../method";

import * as playerService from "../service/player.service";

export async function createMainPositionEvery(req: Request, res: Response, next: NextFunction) {
  try {
    await playerService.createMainPositionEvery();
    res.status(201).send("done");
  } catch (err) {
    console.error(err);
    if (err instanceof Error) res.status(404).send(err);
  }
}

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

/** 고유번호에 맞는 선수 이미지 얻기
 * @return url;
 */
export async function findImage(spid: string) {
  const pid = spid.substring(3);
  const image1: any = await getFifaApi(`https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pid}.png`)
    .then((data) => data.config.url)
    .catch((data) => data?.status);
  const image2: any = await getFifaApi(`https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${spid}.png`)
    .then((data) => data.config.url)
    .catch((data) => data?.status);
  const image3: any = await getFifaApi(`https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pid}.png`)
    .then((data) => data.config.url)
    .catch((data) => data?.statusa);
  const image4: any = await getFifaApi(`https://fo4.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${spid}.png`)
    .then((data) => data.config.url)
    .catch((data) => data?.status);

  return [image3, image4, image1, image2].filter((img) => img)[0] ?? `${url}/nonperson.png`;
}

export async function findPlayerImage(req: Request, res: Response, next: NextFunction) {
  const { spid } = req.params;
  try {
    const result = await findImage(spid);
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

/**선수에게 main포지션 update, create해주기
 * @params spid
 * @return boolean
 */
export async function updatePosition(req: Request, res: Response, next: NextFunction) {
  const { spid } = req.body;
  try {
    /**업데이트 횟수 체크 ex) [1] */
    const position = await playerService.updatePosition(spid);
    res.status(201).send(!!position[0]);
  } catch (err) {
    if (err instanceof Error) res.status(404).send(err);
  }
}
