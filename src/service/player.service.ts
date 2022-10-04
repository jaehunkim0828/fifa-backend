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

export async function getPlayerByCr(spid: string) {
  const html = await axios({
    url: `https://fifaonline4.nexon.com/DataCenter/PlayerInfo?spid=${spid}&n1Strong=1`,
    method: "GET",
    responseType: "arraybuffer",
  });

  const content = iconv.decode(html.data, "UTF-8");
  const $ = load(content);

  const image = $(".img > img").attr("src");
  const border = $(".card_back > img").attr("src");
  let ovr = $(".info_ab > .position:first-child > .value").text();
  const nation = $(".nation > img").attr("src");
  const bigSeason = $(".card_back > .season > img").attr("src");
  const position = $(".info_ab > .position:first-child > .txt").text();
  const seasonImg = $(".name_wrap > .season > img").attr("src");
  const pay = $(".side_utils > .pay_side ").text();

  return {
    image,
    border,
    ovr: +ovr + 3,
    nation,
    bigSeason,
    position,
    seasonImg,
    pay,
  };
}

export async function totalPlayerCount(name: string) {
  const names = name.split(",").map((p) => p.trim());
  return playerRepository.totalPlayerCount(names);
}
