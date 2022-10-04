import axios from "axios";
import iconv from "iconv-lite";
import { load } from "cheerio";

import * as positionRepository from "../repository/position";
import { Position } from "../mysql/schema";

export async function findPositionAvg(part: string) {
  const partOfRank = await positionRepository.findPositionAvg(part);

  let assist: number = 0;
  let block: number = 0;
  let dribble: number = 0;
  let dribbleSuccess: number = 0;
  let dribbleTry: number = 0;
  let effectiveShoot: number = 0;
  let goal: number = 0;
  let passSuccess: number = 0;
  let passTry: number = 0;
  let shoot: number = 0;
  let tackle: number = 0;
  let matchCount: number = 0;

  partOfRank.forEach((rank) => {
    assist += +rank.assist * rank.matchCount;
    block += +rank.block * rank.matchCount;
    dribble += +rank.dribble * rank.matchCount;
    dribbleSuccess += +rank.dribbleSuccess * rank.matchCount;
    dribbleTry += +rank.dribbleTry * rank.matchCount;
    effectiveShoot += +rank.effectiveShoot * rank.matchCount;
    goal += +rank.goal * rank.matchCount;
    passSuccess += +rank.passSuccess * rank.matchCount;
    passTry += +rank.passTry * rank.matchCount;
    shoot += +rank.shoot * rank.matchCount;
    tackle += +rank.tackle * rank.matchCount;
    matchCount += +rank.matchCount;
  });

  return {
    assist: Math.round((assist / matchCount) * 10000) / 10000,
    block: Math.round((block / matchCount) * 10000) / 10000,
    dribble: Math.round((dribble / matchCount) * 10000) / 10000,
    dribbleSuccess: Math.round((dribbleSuccess / matchCount) * 10000) / 10000,
    dribbleTry: Math.round((dribbleTry / matchCount) * 10000) / 10000,
    effectiveShoot: Math.round((effectiveShoot / matchCount) * 10000) / 10000,
    goal: Math.round((goal / matchCount) * 10000) / 10000,
    passSuccess: Math.round((passSuccess / matchCount) * 10000) / 10000,
    passTry: Math.round((passTry / matchCount) * 10000) / 10000,
    shoot: Math.round((shoot / matchCount) * 10000) / 10000,
    tackle: Math.round((tackle / matchCount) * 10000) / 10000,
    matchCount: matchCount,
  };
}

export async function findPartByPlayer(spid: string) {
  const player = await positionRepository.findPartByPlayer(spid);
  if (!player?.position) return "미정";
  return { part: player?.position.part, desc: player?.position.desc };
}

export async function updatePosition(spid: string) {
  //가장 많은 플레이수와 패스시도가 많은 포지션의 선수 데이터 가져오기
  const position = await axios({
    url: `https://fifaonline4.nexon.com/DataCenter/PlayerInfo?spid=${spid}&n1Strong=1`,
    method: "GET",
    responseType: "arraybuffer",
  }).then(async (html) => {
    const content = iconv.decode(html.data, "UTF-8");
    const $ = load(content);

    return $(".info_ab > .position:first-child > .txt").text();
  });

  const positionId = await Position.findOne({
    where: {
      desc: position,
    },
    attributes: ["spposition"],
  });

  return await positionRepository.updatePosition(positionId?.getDataValue("spposition")?.toString() ?? "28", +spid);
}
