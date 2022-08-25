import * as playerRepository from "../repository/player";

// export async function updateSeason() {
//   const season = {};
//   await Season.create(season);
//   const data = await getFifaApi("https://static.api.nexon.co.kr/fifaonline4/latest/spid.json");

//   const result = data.data
//     .map((e: any) => {
//       return e.id.toString().startsWith("new season id") ? { ...e, seasonSeasonId: "seasonid" } : false;
//     })
//     .filter((e: any) => e);

//   result.forEach(async (data: any) => {
//     await Player.create(data);
//   });
// }

export async function findPlayers(name: string, current_page: string, count: string) {
  return playerRepository.getplayerAllSeason(decodeURI(name), count, current_page);
}

export async function findPlayerById(id: string) {
  return await playerRepository.getPlayerInfo(id);
}

export async function totalPlayerCount(name: string) {
  const names = name.split(",").map((p) => p.trim());
  return playerRepository.totalPlayerCount(names);
}

export async function updatePosition(spid: string) {
  //가장 많은 플레이수와 패스시도가 많은 포지션의 선수 데이터 가져오기
  const player = await playerRepository.findPostionByMc(spid);

  if (!player) throw new Error("선수 데이터가 존재하지않습니다.");

  return player;
}
