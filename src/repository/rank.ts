import SQ, { Op } from "sequelize";

import { getFifaApi } from "../method";
import { Player, Position, Rank, Season } from "../mysql/schema";

export async function getrankerInfo(matchtype: number, stringify: string) {
  return getFifaApi(`https://api.nexon.co.kr/fifaonline4/v1.0/rankers/status?matchtype=${matchtype}&players=${encodeURI(stringify)}`).catch(
    () => console.log("선수 데이터 없음")
  );
}

export async function findAllPo() {
  return await Position.findAll();
}

export async function checkRank(createDate: string, spId: number, spPosition: string) {
  return Rank.findAll({
    where: {
      createDate: {
        [Op.lte]: createDate,
      },
      spidId: spId,
      position: spPosition,
    },
    order: [["createDate", "DESC"]],
  });
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
      "saving",
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

export async function findPositionAvg(part: string) {
  return Rank.findAll({
    attributes: [
      "name",
      "assist",
      "block",
      "dribble",
      "dribbleSuccess",
      "dribbleTry",
      "effectiveShoot",
      "goal",
      "passSuccess",
      "passTry",
      "shoot",
      "tackle",
      "matchCount",
    ],
    include: [
      {
        model: Player,
        attributes: [],
        required: true,
        include: [
          {
            model: Position,
            attributes: [],
            where: {
              part,
            },
          },
        ],
      },
    ],
  });
}

export async function findAvg() {
  return Rank.findAll({
    attributes: [
      "name",
      "assist",
      "block",
      "dribble",
      "dribbleSuccess",
      "dribbleTry",
      "effectiveShoot",
      "goal",
      "passSuccess",
      "passTry",
      "shoot",
      "tackle",
      "matchCount",
    ],
    include: [
      {
        model: Player,
        attributes: [],
        required: true,
        include: [
          {
            model: Position,
            attributes: [],
          },
        ],
      },
    ],
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

export async function findNameById(id: number) {
  return Player.findOne({
    attributes: ["name"],
    where: {
      id,
    },
  });
}
