import puppeteer from "puppeteer";
import axios from "axios";
import iconv from "iconv-lite";
import { load } from "cheerio";

import * as playerRepository from "../repository/player";
import { position } from "../InsertData";

export async function findPlayers(
  search: { name: string; season: string; position: string },
  current_page: string = "0",
  count: string = "9"
) {
  const { name, season, position } = search;
  return playerRepository.getplayerAllSeason({ name: decodeURI(rename(name)), season: season, position: position }, count, current_page);
}

function rename(name: string): string {
  switch (name) {
    case "날강두":
      return "크리스티아누 호날두";
    case "괴물 홀란":
      return "엘링 홀란";
    case "메갓":
      return "리오넬 메시";
    case "호돈":
      return "호나우두";
    case "소니":
      return "손흥민";
    case "쏘니":
      return "손흥민";
    default:
      return name;
  }
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
  const bigSeason = $(".season > img").attr("src");
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

export async function totalPlayerCount({ name, season, position }: { name: string; season: string; position: string }) {
  const names = name
    ? rename(name)
        .split(",")
        .map((p) => p.trim())
    : [""];
  const seasons = season.split(",");
  const positions = position.split(",");
  return playerRepository.totalPlayerCount(names, seasons, positions);
}
