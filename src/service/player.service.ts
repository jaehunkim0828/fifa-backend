import { getFifaApi } from "../method";
import { Player, Season } from "../mysql/schema";
import * as playerRepository from "../repository/player";

export async function updateSeason() {
  const season = {};
  await Season.create(season);
  const data = await getFifaApi("https://static.api.nexon.co.kr/fifaonline4/latest/spid.json");

  const result = data.data
    .map((e: any) => {
      return e.id.toString().startsWith("new season id") ? { ...e, seasonSeasonId: "seasonid" } : false;
    })
    .filter((e: any) => e);

  result.forEach(async (data: any) => {
    await Player.create(data);
  });
}

export async function findPlayers(name: string) {
  return playerRepository.getplayerAllSeason(decodeURI(name));
}

export async function findPlayerById(id: string) {
  return await playerRepository.getPlayerInfo(id);
}
