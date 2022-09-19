import puppeteer, { Page } from "puppeteer";
import { CheerioAPI, load } from "cheerio";

import * as valueRepository from "../repository/value";
import * as playerRepository from "../repository/player";

export async function findPrice(spid: string, rating: number) {
  const value = await valueRepository.findValueByRatingAndSpid(spid, rating);

  // 가격을 생성한지 2일이 지나지 않으면 기존 가격 보여주기.
  if (value) {
    const a = value.getDataValue("createdAt");
    if (Math.floor((Date.now() - Date.parse(a.toString())) / 1000) <= 259200) return value.price;
  }

  return await getPriceUsingCrawling(spid, rating);
}

async function getPriceUsingCrawling(spid: string, rating: number) {
  const brower = await puppeteer.launch({ headless: true, defaultViewport: null });
  const page = await brower.newPage();

  const player = await playerRepository.getPlayerInfo(spid);

  await Promise.all([
    page.goto(`https://fifaonline4.nexon.com/DataCenter/index?strSeason=%2C${spid.substring(0, 3)}%2C&strPlayerName=${player?.name}`, {
      waitUntil: "networkidle2",
      timeout: 0,
    }),
    page.waitForNavigation(),
    page.waitForSelector(".span_bp1"),
  ]);

  const content = await page.content();

  const $ = load(content, { decodeEntities: true });

  let playerPrice = $(content).find(`.span_bp${rating}`).text();

  if (player) await updateValue($, content, player.name, spid);
  else throw new Error("선수가 존재하지않습니다.");

  await brower.close();

  return playerPrice;
}

export async function updateValue($: CheerioAPI, content: string, name: string, spid: string) {
  for (let rating = 1; rating <= 10; rating += 1) {
    let bp = $(content).find(`.span_bp${rating}`).text();
    // price
    const isValue = await valueRepository.findValueByRatingAndSpid(spid, rating);
    if (isValue) {
      await valueRepository.updateValue(bp, spid, rating);
      console.log(`${name} (${rating}+): ${bp} 업데이트 완료`);
    } else {
      await valueRepository.createValue(rating, bp, spid);
      console.log(`${name} (${rating}+): ${bp} 생성 완료`);
    }
  }
}
