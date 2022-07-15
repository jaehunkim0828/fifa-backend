import express, { Request, Response, NextFunction } from "express";
import { position, season } from "../InertData";
import { getFifaApi } from "../method";
import { Position, Season, Player } from "../mysql/schema";

const dataRouter = express.Router();

dataRouter.route("/position").get((req: Request, res: Response, next: NextFunction) => {
  position.forEach(async (po) => {
    await Position.create({ spposition: po.position, desc: po.name });
  });
});
dataRouter.route("/season").get((req: Request, res: Response, next: NextFunction) => {
  season.forEach(async (sea) => {
    await Season.create({ seasonId: sea.id, className: sea.name, seasonImg: sea.seasonId });
  });
});
dataRouter.route("/player").get(async (req: Request, res: Response, next: NextFunction) => {
  const wait = (times: number) => new Promise((resolve) => setTimeout(resolve, times));
  const data = await getFifaApi("https://static.api.nexon.co.kr/fifaonline4/latest/spid.json");
  const a = data.data.map((e: { id: number }) => {
    return { ...e, seasonSeasonId: +e.id.toString().slice(0, 3) };
  });
  await wait(10000);
  a.forEach(async (e: any) => {
    await Player.create(e);
  });
  res.send("done");
});

export default dataRouter;
