import * as playerRepository from "../repository/player";
import players from "../players.json";

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

  if (!player) throw new Error("없는 선수입니다.");
  const rawPlayer = player.getDataValue("ranks");
  if (!rawPlayer.length) throw new Error("선수 데이터가 존재하지 않습니다.");

  return await playerRepository.updatePosition(rawPlayer[0].position, player.get().id);
}

export async function createMainPositionEvery() {
  const wait = (times: number) => new Promise((resolve) => setTimeout(resolve, times));
  while (true) {
    console.log(new Date().toLocaleString());

    const isToTime = (date: Date) => {
      const now = date.getHours();
      if (now === 19) return true;
      return false;
    };
    if (isToTime(new Date())) {
      for (let i = 0; i < players.selectedPlayer.length; i += 1) {
        const player = players.selectedPlayer[i];
        const result = await updatePosition(player.spid + "");
        console.log(`${player.name}의 선수 포지션이 ${!!result[0] ? "변경되었습니다" : "변경되지 않았습니다."}`);
        await wait(100);
      }
    }
    await wait(600000);
    if (new Date().getMonth() + 1 === 9) {
      break;
    }
  }
}
