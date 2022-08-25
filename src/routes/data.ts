import express, { Request, Response, NextFunction } from "express";
import { position, season } from "../InsertData";
import { getFifaApi } from "../method";
import { Player, Position, Season } from "../mysql/schema";

const dataRouter = express.Router();

let gett: any[];
const result: any[] = [];
dataRouter.route("/position").get((req: Request, res: Response, next: NextFunction) => {
  position.forEach(async (po) => {
    await Position.create({ spposition: +po.position, desc: po.name });
  });
});
dataRouter.route("/season").get((req: Request, res: Response, next: NextFunction) => {
  season.forEach(async (sea) => {
    await Season.create({ seasonId: +sea.id, className: sea.name, seasonImg: sea.seasonId });
  });
});

dataRouter.route("/player1").get(async (req: Request, res: Response, next: NextFunction) => {
  const data = await getFifaApi("https://static.api.nexon.co.kr/fifaonline4/latest/spid.json");

  gett = data.data;
  res.send(data.data);
});

dataRouter.route("/player2").get(async (req: Request, res: Response, next: NextFunction) => {
  for (let i = 0; i < gett.length; i += 1) {
    result.push({ ...gett[i], seasonSeasonId: +gett[i].id.toString().slice(0, 3) });
  }

  res.send(result);
});

dataRouter.route("/player3").get(async (req: Request, res: Response, next: NextFunction) => {
  for (let i = 0; i < result.length; i += 1) {
    await Player.create(result[i]);
  }
  res.send("done");
});

export default dataRouter;
