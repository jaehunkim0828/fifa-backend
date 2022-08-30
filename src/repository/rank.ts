import SQ, { Op } from "sequelize";

import { getFifaApi } from "../method";
import { Player, Position, Rank, Season } from "../mysql/schema";

export async function getrankerInfo(matchtype: number, stringify: string) {
  return getFifaApi(`https://api.nexon.co.kr/fifaonline4/v1.0/rankers/status?matchtype=${matchtype}&players=${encodeURI(stringify)}`);
}

export async function findAllPo() {
  return await Position.findAll();
}

export async function findRankByIdAndPostion(spid: string, po: string) {
  const position = po === "50" ? { [Op.ne]: "50" } : po;

  return Rank.findAll({
    attributes: [
      "matchCount",
      "assist",
      "block",
      "dribble",
      "dribbleSuccess",
      "dribbleTry",
      "shoot",
      "effectiveShoot",
      "goal",
      "passSuccess",
      "passTry",
      "tackle",
    ],
    where: {
      spidId: spid,
      position,
    },
    include: {
      model: Player,
      attributes: ["id"],
      include: [
        {
          model: Season,
          attributes: ["seasonImg"],
        },
      ],
    },
  });
}

export async function findRankWithPlayer(current_page: number, count: number) {
  const limit = count;
  let offset = 0;
  if (current_page > 1) offset = limit * (current_page - 1);

  return Player.findAll({
    attributes: {
      include: ["id", "name", [SQ.fn("Sum", SQ.col("ranks.matchCount")), "total"]],
    },
    include: [
      {
        model: Rank,
        as: "ranks",
        required: true,
        attributes: [],
      },
      {
        model: Season,
        attributes: ["className", "seasonImg"],
      },
      {
        model: Position,
        attributes: ["desc", "part"],
        required: false,
      },
    ],
    order: [[SQ.fn("Sum", SQ.col("ranks.matchCount")), "DESC"]],
    group: ["spids.id"],
  }).then((data) => data.slice(offset, offset + limit));
}

export async function totalRankCount() {
  return Player.findAndCountAll({
    include: [
      {
        model: Rank,
        required: true,
        attributes: [],
      },
    ],
  });
}
