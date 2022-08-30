import * as playerRepository from "../repository/position";

export async function findPositionAvg(part: string) {
  const partOfRank = await playerRepository.findPositionAvg(part);

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
