import { Request, Response, NextFunction } from "express";
import puppeteer, { Page } from "puppeteer";
import { config } from "../config/config";
import { sendErrorAtGmail } from "../external/mail";

import * as rankService from "../service/rank.service";
import { RankType } from "../types/rank/rank";
import { RankInput } from "../types/rank/rank.crud";

export async function createPlayerRank(req: Request, res: Response, next: NextFunction) {
  const { player, name } = req.body;

  // 날짜 spid겹치는거 있는지 확인
  try {
    const playerName = await rankService.create(player, name);
    res.status(201).send(`${playerName}선수의 데이터가 생성되었습니다.`);
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).send(err.message);
    }
  }
}

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

export async function createPlayerAuto(req: Request, res: Response, next: NextFunction) {
  try {
    await rankService.createRanksEvery();
    res.status(200).send("done");
  } catch (e) {
    if (e instanceof Error) {
      await sendErrorAtGmail("데이터 축척하던중 에러 발생했습니다.", e.message);
    }
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
