import puppeteer from "puppeteer";
import { load } from "cheerio";

import * as valueRepository from "../repository/value";
import * as playerRepository from "../repository/player";

export async function findPrice(spid: string, rating: number) {
  const value = await valueRepository.findValueByRatingAndSpid(spid, rating);

  if (value) return value.price;

  return await getPriceUsingCrawling(spid, rating);
}

async function getPriceUsingCrawling(spid: string, rating: number) {
  const brower = await puppeteer.launch({ headless: true, defaultViewport: null });
  const page = await brower.newPage();

  const player = await playerRepository.getPlayerInfo(spid);

  await Promise.all([
    page.waitForNavigation(),
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

  for (let rating = 1; rating <= 10; rating += 1) {
    let bp = $(content).find(`.span_bp${rating}`).text();
    // price
    const isValue = await valueRepository.findValueByRatingAndSpid(spid, rating);
    if (isValue) {
      await valueRepository.updateValue(bp, spid);
      console.log(`${player?.name} (${rating}+): ${bp} 업데이트 완료`);
    } else {
      await valueRepository.createValue(rating, bp, spid);
      console.log(`${player?.name} (${rating}+): ${bp} 생성 완료`);
    }
  }

  await brower.close();

  return playerPrice;
}
