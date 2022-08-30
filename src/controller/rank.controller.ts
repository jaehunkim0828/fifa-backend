import { Request, Response, NextFunction } from "express";

import * as rankService from "../service/rank.service";
import { RankType } from "../types/rank/rank";

export async function PlayerAbility(req: Request<"", "", RankType>, res: Response, next: NextFunction) {
  try {
    const { matchtype, spid } = req.body;
    const ability = await rankService.findNewRank(spid, matchtype);
    res.status(200).send(ability.data);
  } catch (e) {
    console.log(e);
    res.status(404).send("An unexpected error occurred");
  }
}

export async function getPosition(req: Request, res: Response, next: NextFunction) {
  try {
    const po = await rankService.findAllPosition();
    res.status(200).send(po);
  } catch {
    res.status(404).send("I can`t find postion table.");
  }
}

export async function createPlayerRank(req: Request, res: Response, next: NextFunction) {
  const {
    spid,
    position,
    name,
    assist,
    block,
    dribble,
    dribbleSuccess,
    dribbleTry,
    effectiveShoot,
    goal,
    matchCount,
    passSuccess,
    passTry,
    shoot,
    tackle,
    createDate,
  } = req.body;

  // 날짜 spid겹치는거 있는지 확인
  try {
    await rankService.createRank({
      spId: +spid,
      spPosition: position,
      name,
      status: {
        assist,
        block,
        dribble,
        dribbleSuccess,
        dribbleTry,
        effectiveShoot,
        goal,
        matchCount,
        passSuccess,
        passTry,
        shoot,
        tackle,
      },
      createDate,
    });
    res.status(201).send(`${name}선수의 데이터가 생성되었습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).send(err.message);
    }
  }
}

export async function createPlayerAuto(req: Request, res: Response, next: NextFunction) {
  try {
    await rankService.createRanksEvery();
    res.status(200).send("done");
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
}

export async function getPlayerTotalScorecard(req: Request, res: Response, next: NextFunction) {
  const { spid, po } = req.query;
  try {
    if (typeof spid === "string" && typeof po === "string") {
      const data = await rankService.getRankById(spid, po);
      return res.status(200).send(data);
    }
    throw new Error("unexpected error");
  } catch (err) {
    res.status(404).send("An unexpected error occured");
  }
}

export async function getAllRank(req: Request, res: Response, next: NextFunction) {
  try {
    const { current_page, count } = req.query;
    if (typeof current_page === "string" && typeof count === "string") {
      const ranks = await rankService.getRankPlayerPn(+current_page, +count);
      return res.status(200).send(ranks);
    }
    throw new Error("unexpected error");
  } catch (err) {
    if (err instanceof Error) res.status(404).send(err);
  }
}

export async function countAllRank(req: Request, res: Response, next: NextFunction) {
  try {
    const totalRankPlayer = await rankService.totalRankCount();

    res.status(200).send(`${totalRankPlayer.rows.length}`);
  } catch (err) {
    if (err instanceof Error) res.status(404).send(err);
  }
}
