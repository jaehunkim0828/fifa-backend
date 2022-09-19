import puppeteer from "puppeteer";
import axios from "axios";
import iconv from "iconv-lite";
import { load } from "cheerio";

import * as playerRepository from "../repository/player";
import * as positionService from "../service/position.service";
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

export async function findPlayerPrice(spid: string, grade: number) {
  // 크롤링하는 부분
  const brower = await puppeteer.launch({ headless: true });
  const page = await brower.newPage();

  await Promise.all([page.goto(`https://fifaonline4.nexon.com/DataCenter/PlayerInfo?spid=${spid}&n1strong=1`), page.waitForNavigation()]);

  const content = await page.content();

  const $ = load(content, { decodeEntities: true });

  const playerPrice = $(content).find("#PlayerPriceGraph > .header > .add_info > .txt > strong").text();

  await brower.close();

  return playerPrice;
}

export async function getPlayerImage(spid: string) {
  const image = await axios({
    url: `https://fifaonline4.nexon.com/DataCenter/PlayerInfo?spid=${spid}&n1Strong=1`,
    method: "GET",
    responseType: "arraybuffer",
  }).then(async (html) => {
    const content = iconv.decode(html.data, "UTF-8");
    const $ = load(content);

    return $(".img > img").attr("src");
  });

  return image;
}

export async function totalPlayerCount(name: string) {
  const names = name.split(",").map((p) => p.trim());
  return playerRepository.totalPlayerCount(names);
}

export async function createMainPositionEvery() {
  const wait = (times: number) => new Promise((resolve) => setTimeout(resolve, times));
  while (true) {
    console.log(new Date().toLocaleString());

    const isToTime = (date: Date) => {
      const now = date.getHours();
      if (now === 15) return true;
      return false;
    };
    if (isToTime(new Date())) {
      for (let i = 0; i < players.selectedPlayer.length; i += 1) {
        const player = players.selectedPlayer[i];
        const result = await positionService.updatePosition(player.spid + "");
        console.log(`${player.name}의 선수 포지션이 ${!!result[0] ? "변경되었습니다" : "변경되지 않았습니다."}`);
      }
    }
    await wait(600000);
    if (new Date().getMonth() + 1 === 9) {
      break;
    }
  }
}
