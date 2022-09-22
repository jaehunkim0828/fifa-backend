import express, { Request, Response, NextFunction } from "express";

import requestIp from "request-ip";
import { sendInfoAtGmail } from "../external/mail";
import { position } from "../InsertData";
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
dataRouter.route("/season").get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const season = await getFifaApi("https://static.api.nexon.co.kr/fifaonline4/latest/seasonid.json");

    season.data.forEach(async (s: { seasonId: number; className: string; seasonImg: string }, i: number) => {
      const isSeason = await Season.findOne({
        where: {
          seasonId: s.seasonId,
        },
      });

      if (s.seasonId && !isSeason) {
        console.log(`${s.className} 생성`);
        await Season.create({ seasonId: +s.seasonId, className: s.className, seasonImg: s.seasonImg });
      }
    });

    res.status(201).send("season done");
  } catch (err) {
    res.status(404).send(err);
  }
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

dataRouter.route("/newPlayer").get(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const player: any = await getFifaApi("https://static.api.nexon.co.kr/fifaonline4/latest/spid.json");

    player.data.forEach(async (p: { id: number; name: string }, i: number) => {
      const isPlayer = await Player.findOne({
        where: {
          id: p.id,
        },
      });
      if (p.id && !isPlayer) {
        console.log(`${p.name}(${p.id})플레이어 생성`);
        return await Player.create({
          id: p.id,
          name: p.name,
          seasonSeasonId: p.id.toString().slice(0, 3),
          positionId: null,
        });
      }
    });

    await sendInfoAtGmail("선수 업데이트", "새로운 시즌 선수들 업데이트 성공했습니다.");

    res.status(201).send("done");
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

export default dataRouter;
