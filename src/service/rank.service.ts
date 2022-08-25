import * as rankRepository from "../repository/rank";
import { RankInput } from "../types/rank/rank.crud";
import players from "../players.json";
import { Op } from "sequelize";
import { Player, Rank } from "../mysql/schema";

export async function getRankById(spid: string, po: string) {
  return rankRepository.findRankByIdAndPostion(spid, po);
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
      if (now === "04:00" || now === "11:01" || now === "16:00" || now == "20:00") return true;
      return false;
    };
    if (isToTime(new Date())) {
      for (let i = 0; i < players.selectedPlayer.length; i += 1) {
        const playerArr: string[] = [];

        for (let j = 0; j < 26; j += 1) {
          playerArr.push(`{"id":${players.selectedPlayer[i].spid},"po":${j}}`);
        }

        let stringify = `[${playerArr}]`;
        const name = await Player.findOne({
          attributes: ["name"],
          where: {
            id: players.selectedPlayer[i].spid,
          },
        });

        const ability = await rankRepository.getrankerInfo(50, stringify);
        ability.data.sort(
          (a: { status: { matchCount: number } }, b: { status: { matchCount: number } }) => b.status.matchCount - a.status.matchCount
        );
        for (let i = 0; i < ability.data.length; i += 1) {
          ability.data[i].name = name?.get().name;

          await createRank(ability.data[i]);
          await wait(100);
        }
      }
    }
    await wait(10000);
    if (new Date().getMonth() + 1 === 9) {
      break;
    }
  }
}

export async function totalRankCount() {
  return rankRepository.totalRankCount();
}
