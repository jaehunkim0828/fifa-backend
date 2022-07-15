import SQ, { Op } from "sequelize";

import { getFifaApi } from "../method";
import { Position, Rank } from "../mysql/schema";

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
      [SQ.fn("sum", SQ.col("matchCount")), "matchCount"],
      [SQ.fn("AVG", SQ.col("assist")), "assist"],
      [SQ.fn("AVG", SQ.col("block")), "block"],
      [SQ.fn("AVG", SQ.col("dribble")), "dribble"],
      [SQ.fn("AVG", SQ.col("dribbleSuccess")), "dribbleSuccess"],
      [SQ.fn("AVG", SQ.col("dribbleTry")), "dribbleTry"],
      [SQ.fn("AVG", SQ.col("shoot")), "shoot"],
      [SQ.fn("AVG", SQ.col("effectiveShoot")), "effectiveShoot"],
      [SQ.fn("AVG", SQ.col("goal")), "goal"],
      [SQ.fn("AVG", SQ.col("passSuccess")), "passSuccess"],
      [SQ.fn("AVG", SQ.col("passTry")), "passTry"],
      [SQ.fn("AVG", SQ.col("tackle")), "tackle"],
    ],
    where: {
      spid,
      position,
    },
  });
}
