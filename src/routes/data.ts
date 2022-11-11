import axios from "axios";
import iconv from "iconv-lite";
import { load } from "cheerio";
import express, { Request, Response, NextFunction } from "express";

import requestIp from "request-ip";
import { sendInfoAtGmail } from "../external/mail";
import { position } from "../InsertData";
import { getFifaApi } from "../method";
import { Nation, Player, Position, Season, Team } from "../mysql/schema";
import Card from "../models/card.model";

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

    //해줘야 할일 1. positionId, 2. nationId, 3 ovr

    for (let i = 0; i < player.data.length; i += 1) {
      const p: { id: number; name: string } = player.data[i];
      const isPlayer = await Player.findOne({
        where: {
          id: p.id,
        },
      });
      if (p.id && !isPlayer) {
        const { image, border, nationImg, bigSeason, salary, nationId, ovr, positionId, team } = await axios({
          url: `https://fifaonline4.nexon.com/DataCenter/PlayerInfo?spid=${p.id}&n1Strong=1`,
          method: "GET",
          responseType: "arraybuffer",
        }).then(async (html) => {
          const content = iconv.decode(html.data, "UTF-8");
          const $ = load(content);
          const image = $(".img > img").attr("src");
          const border = $(".card_back > img").attr("src");
          const nationImg = $(".nation > img").attr("src");
          const bigSeason = $(".season > img").attr("src");
          const pay = $(".side_utils > .pay_side ").text();
          const ovr = $(".thumb > .ovr").text();
          const nation = $(".nation > .txt").text();
          const position = $(".info_ab > .position:first-child > .txt").text();
          const team = $(".data_table > ul > li ").text();
          const positionId = await Position.findOne({
            where: {
              desc: position,
            },
          });

          const nationId = await Nation.findOne({
            where: {
              name: nation,
            },
          });
          if (!nationId?.getDataValue("id")) {
            await Nation.create({
              name: nation,
            });
          }

          return {
            image,
            border,
            nationImg,
            nationId: nationId?.getDataValue("id"),
            bigSeason,
            salary: pay,
            ovr: +ovr + 3,
            positionId: positionId?.getDataValue("spposition"),
            team,
          };
        });

        await Player.create({
          id: p.id,
          name: p.name,
          seasonSeasonId: p.id.toString().slice(0, 3),
          positionId: positionId?.toString(),
          ovr,
          nationId: nationId?.toString(),
        }).catch(() => console.log("선수생성중에 오류 발생"));

        await Card.create({
          id: p.id,
          image: image ?? "",
          salary: +salary ?? 0,
          border: border ?? "",
          bigSeason: bigSeason ?? "",
          nation: nationImg ?? "",
        }).catch((data) => console.log(data, "카드생성중에 오류 발생"));

        team
          .trim()
          .split("\n")
          .forEach(async (e, i) => {
            if (i % 4 === 1) {
              await Team.create({
                name: e.trim(),
                spidId: p.id,
              }).catch(() => console.log("팀생성중에 오류 발생"));
            }
          });

        console.log(`${p.id}[${p.name}] 시즌${p.id.toString().slice(0, 3)}`);
      }
    }

    await sendInfoAtGmail("선수 업데이트", "새로운 시즌 선수들 업데이트 성공했습니다.");

    res.status(201).send("done");
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

dataRouter.route("/getseason").get(async (req: Request, res: Response, next: NextFunction) => {
  const seasons = await Season.findAll({}).then((data) => {
    return data.map((e) => {
      const result = {
        id: e.seasonId,
        name: e.className?.split("(")[0].trim(),
        seasonImg: e.seasonImg,
      };
      return result;
    });
  });

  res.send(seasons);
});

export default dataRouter;
