import { Player, Position, Rank } from "../mysql/schema";
import * as rankRepository from "../repository/rank";
import { RankInput } from "../types/rank/rank.crud";
import { players } from "../playerData";

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

export async function createRank(rankInput: RankInput): Promise<void> {
  const {
    spid,
    position,
    name,
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
    createDate,
  } = rankInput;

  const existedRank = await Rank.findOne({
    where: {
      createDate: createDate,
      spid: spid,
      position,
    },
  });

  if (!existedRank) {
    await Rank.create({
      spid,
      position,
      name,
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
      createDate,
    });
  } else throw new Error(`${name} 선수의 데이터가 이미 존재합니다.`);
}

export async function createRanksEvery() {
  const wait = (times: number) => new Promise((resolve) => setTimeout(resolve, times));
  while (true) {
    console.log(new Date().toLocaleString());

    const isToTime = (date: Date) => {
      const now = date.toTimeString().substring(0, 5);
      if (now === "00:35" || now === "10:00" || now === "16:00" || now == "22:00") return true;
      return false;
    };
    if (isToTime(new Date())) {
      for (let i = 0; i < players.length; i += 1) {
        const playerArr: string[] = [];

        for (let j = 0; j < 26; j += 1) {
          playerArr.push(`{"id":${players[i].spid},"po":${j}}`);
        }

        let stringify = `[${playerArr}]`;
        const name = await Player.findOne({
          attributes: ["name"],
          where: {
            id: players[i].spid,
          },
        });

        const ability = await rankRepository.getrankerInfo(50, stringify);
        ability.data.sort(
          (a: { status: { matchCount: number } }, b: { status: { matchCount: number } }) => b.status.matchCount - a.status.matchCount
        );
        for (let i = 0; i < ability.data.length; i += 1) {
          const {
            spId,
            spPosition,
            status: {
              shoot,
              effectiveShoot,
              assist,
              goal,
              dribble,
              dribbleTry,
              dribbleSuccess,
              passSuccess,
              passTry,
              block,
              tackle,
              matchCount,
            },
            createDate,
          } = ability.data[i];

          const existedRank = await Rank.findOne({
            where: {
              createDate: createDate,
              spid: spId,
              position: spPosition,
            },
          });

          if (!existedRank) {
            await Rank.create({
              spid: spId,
              name: name?.get().name,
              position: spPosition,
              shoot,
              effectiveShoot,
              assist,
              goal,
              dribble,
              dribbleSuccess,
              dribbleTry,
              passSuccess,
              passTry,
              block,
              tackle,
              matchCount,
              createDate,
            });
            console.log(name?.get().name);
          } else {
            console.log(`${name?.get().name} 선수의 데이터가 이미 존재합니다.`);
          }
          await wait(100);
        }
      }
    }
    await wait(10000);
    if (new Date().getMonth() + 1 === 8) {
      break;
    }
  }
}
