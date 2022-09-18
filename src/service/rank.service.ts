import { Op } from "sequelize";
import { load } from "cheerio";

import * as rankRepository from "../repository/rank";
import * as valueRepository from "../repository/value";
import { RankInput } from "../types/rank/rank.crud";
import players from "../players.json";
import { Rank, Value } from "../mysql/schema";
import puppeteer, { Page } from "puppeteer";

export async function getRankById(spid: string, po: string) {
  const partOfRank = await rankRepository.findRankByIdAndPostion(spid, po);
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
    seasonImg: partOfRank[0].spid?.season?.seasonImg,
  };
}

export async function findNewRank(spid: string, matchtype: string) {
  const playerArr: string[] = [];

  for (let i = 0; i < 26; i += 1) {
    playerArr.push(`{"id":${spid},"po":${i}}`);
  }

  let stringify = `[${playerArr}]`;
  const ability = await rankRepository.getrankerInfo(+matchtype, stringify);
  ability.data.sort(
    (a: { status: { matchCount: number } }, b: { status: { matchCount: number } }) => b.status.matchCount - a.status.matchCount
  );
  return ability;
}

export async function findAllPosition() {
  return rankRepository.findAllPo();
}

export async function getRankPlayerPn(current_page: number, count: number) {
  return rankRepository.findRankWithPlayer(current_page, count);
}

export async function createRank(rankInput: RankInput): Promise<void> {
  const {
    spId,
    spPosition,
    name,
    status: { assist, block, dribble, dribbleSuccess, dribbleTry, effectiveShoot, goal, matchCount, passSuccess, passTry, shoot, tackle },
    createDate,
  } = rankInput;

  const existedRank = await Rank.findAll({
    where: {
      createDate: {
        [Op.lte]: createDate,
      },
      spidId: spId,
      position: spPosition,
    },
    order: [["createDate", "DESC"]],
  });

  const prev = existedRank[0]?.get();

  function addDecimalPoint(a: number, b: number) {
    return +(a + b).toFixed(12);
  }

  function calculateAverage(prevData: number, newData: number): string {
    return (
      Math.round(
        (Math.round(addDecimalPoint(prevData * +prev.matchCount, newData * +matchCount)) / (+prev.matchCount + +matchCount)) * 10000
      ) / 10000
    ).toString();
  }

  // 지금 날짜 보다 전 날짜면 update, 없으면 create
  if (!existedRank.length) {
    await Rank.create({
      spidId: spId,
      position: spPosition,
      name,
      assist,
      block,
      dribble,
      dribbleSuccess,
      dribbleTry,
      effectiveShoot,
      goal,
      matchCount: +matchCount,
      passSuccess,
      passTry,
      shoot,
      tackle,
      createDate,
    });
  } else if (prev.createDate < createDate) {
    await Rank.update(
      {
        assist: calculateAverage(+prev.assist, +assist),
        block: calculateAverage(+prev.block, +block),
        dribble: calculateAverage(+prev.dribble, +dribble),
        dribbleSuccess: calculateAverage(+prev.dribbleSuccess, +dribbleSuccess),
        dribbleTry: calculateAverage(+prev.dribbleTry, +dribbleTry),
        effectiveShoot: calculateAverage(+prev.effectiveShoot, +effectiveShoot),
        goal: calculateAverage(+prev.goal, +goal),
        passSuccess: calculateAverage(+prev.passSuccess, +passSuccess),
        passTry: calculateAverage(+prev.passTry, +passTry),
        shoot: calculateAverage(+prev.shoot, +shoot),
        tackle: calculateAverage(+prev.tackle, +tackle),
        matchCount: prev.matchCount + +matchCount,
        createDate,
      },
      {
        where: {
          id: prev.id,
        },
      }
    );
  } else console.log(`${name} 선수의 데이터가 이미 존재합니다.`);
}

export async function createRanksEvery() {
  const wait = (times: number) => new Promise((resolve) => setTimeout(resolve, times));
  while (true) {
    console.log(new Date().toLocaleString());

    const isToTime = (date: Date) => {
      const now = date.toTimeString().substring(0, 5);
      if (now === "00:00") return true;
      return false;
    };
    if (isToTime(new Date())) {
      /* 해주는 일
        1. Rank 데이터 추가해주기 
        2. 선수 가격 추가해주기
      */
      const brower = await puppeteer.launch({ headless: true });
      const page = await brower.newPage();

      for (let i = 0; i < players.selectedPlayer.length; i += 1) {
        const { spid, name } = players.selectedPlayer[i];
        const playerArr: string[] = [];

        for (let j = 0; j < 26; j += 1) {
          playerArr.push(`{"id":${spid},"po":${j}}`);
        }

        let stringify = `[${playerArr}]`;

        const ability = await rankRepository.getrankerInfo(50, stringify);
        ability.data.sort(
          (a: { status: { matchCount: number } }, b: { status: { matchCount: number } }) => b.status.matchCount - a.status.matchCount
        );
        for (let i = 0; i < ability.data.length; i += 1) {
          ability.data[i].name = name;

          await createRank(ability.data[i]);
        }
        // 가격 추가해주기
        await getPlayerPrice(page, name, spid.toString().substring(0, 3), spid.toString());
      }
      await brower.close();
    }

    await wait(10000);
    if (new Date().getMonth() + 1 === 11) {
      break;
    }
  }
}

export async function totalRankCount() {
  return rankRepository.totalRankCount();
}

export async function getPlayerPrice(page: Page, name: string, seasonId: string, spid: string) {
  const wait = (times: number) => new Promise((resolve) => setTimeout(resolve, times));
  await Promise.all([
    page.waitForNavigation(),
    page.goto(`https://fifaonline4.nexon.com/DataCenter/index?strSeason=%2C${seasonId}%2C&strPlayerName=${name}`, {
      waitUntil: "networkidle2",
      timeout: 0,
    }),
    page.waitForNavigation(),
    page.waitForSelector(".span_bp1"),
  ]);

  const content = await page.content();

  const $ = load(content);

  for (let rating = 1; rating <= 10; rating += 1) {
    let bp = $(content).find(`.span_bp${rating}`).text();
    // price
    const isValue = await valueRepository.findValueByRatingAndSpid(spid, rating);
    if (isValue) {
      await valueRepository.updateValue(bp, spid);
      console.log(`${name}(${rating}+): ${bp} 업데이트 완료`);
    } else {
      await valueRepository.createValue(rating, bp, spid);
      console.log(`${name}(${rating}+): ${bp} 생성 완료`);
    }
  }
  await wait(5000);
}
