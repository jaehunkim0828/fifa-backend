import * as rankRepository from "../repository/rank";
import { RankInput } from "../types/rank/rank.crud";
import { Rank } from "../mysql/schema";
import { getFifaApi } from "../method";
import { AxiosResponse } from "axios";

enum PartStatus {
  GK = "GK",
  DF = "DF",
  MF = "MF",
  FW = "FW",
  SUB = "SUB",
  ALL = "ALL",
}

export async function create(player: RankInput[], name: string) {
  player.forEach(
    async ({
      spId,
      spPosition,
      createDate,
      status: { assist, block, dribble, dribbleSuccess, dribbleTry, effectiveShoot, goal, matchCount, passSuccess, passTry, shoot, tackle },
    }: RankInput) => {
      await createRank({
        spId: +spId,
        spPosition,
        name,
        status: {
          assist,
          block,
          dribble,
          dribbleSuccess,
          dribbleTry,
          effectiveShoot,
          goal,
          matchCount,
          passSuccess,
          passTry,
          shoot,
          tackle,
        },
        createDate,
      });
    }
  );
}

export async function getRankById(spid: string, po: string) {
  const partOfRank = await rankRepository.findRankByIdAndPostion(spid, po);
  if (!partOfRank.length) return;

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
  let saving: number = 0;

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
    saving += rank.saving ?? 0;
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
    saving,
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
  if (ability) {
    ability.data.sort(
      (a: { status: { matchCount: number } }, b: { status: { matchCount: number } }) => b.status.matchCount - a.status.matchCount
    );
  }
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

  const existedRank = await rankRepository.checkRank(createDate, spId, spPosition);

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

    console.log(`${name}(${spId}) 선수 생성 완료.`);
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
    console.log(`${name}(${spId}) 선수 업데이트 완료.`);
  } else console.log(`${name} 선수의 데이터가 이미 존재합니다.`);
}

export async function createRanksEvery() {
  const wait = (times: number) => new Promise((resolve) => setTimeout(resolve, times));

  const players: AxiosResponse<{ id: number; name: string }[]> = await getFifaApi(
    "https://static.api.nexon.co.kr/fifaonline4/latest/spid.json"
  );
  while (true) {
    console.log(new Date().toLocaleString());

    const isToTime = (date: Date) => {
      const now = date.toTimeString().substring(0, 5);
      if (now === "00:00") return true;
      return false;
    };
    if (isToTime(new Date())) {
      /* 해주는 일
        Rank 데이터 추가해주기 
      */
      for (let i = 0; i < players.data.length; i += 1) {
        const { id, name } = players.data[i];
        const playerArr: string[] = [];

        // 특정 시즌 지나치기
        switch (id.toString().substring(0, 3)) {
          case "300":
          case "320":
          case "319":
          case "318":
          case "317":
            console.log("pass");
            continue;

          default:
            break;
        }

        for (let j = 0; j < 26; j += 1) {
          playerArr.push(`{"id":${id},"po":${j}}`);
        }

        let stringify = `[${playerArr}]`;

        const ability = await rankRepository.getrankerInfo(50, stringify);
        if (ability) {
          ability.data.sort(
            (a: { status: { matchCount: number } }, b: { status: { matchCount: number } }) => b.status.matchCount - a.status.matchCount
          );
          for (let i = 0; i < ability.data.length; i += 1) {
            ability.data[i].name = name;

            await createRank(ability.data[i]);
          }
        }
      }
    }

    await wait(10000);
    if (new Date().getMonth() + 1 === 11) {
      break;
    }
  }
}

export async function findAvgByPart(part: string) {
  let partOfRank;
  if (part !== PartStatus.ALL) partOfRank = await rankRepository.findPositionAvg(part);
  else partOfRank = await rankRepository.findAvg();

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

export async function totalRankCount() {
  return rankRepository.totalRankCount();
}
