import { Player, Rank, Season } from "../mysql/schema";
import SQ from "sequelize";

const Op = SQ.Op;

/** 검색한 선수 보여주기
 *  @argument name 선수이름
 *  @argument count: 보여줄 선수 갯수
 *  @argument current_page: 현재 페이지
 */
export async function getplayerAllSeason(name: string, count: string, current_page: string) {
  const names = name.split(",").map((p) => p.trim());

  if (!+count) {
    /** 선수 전체 다 보여주기 */
    return await Player.findAll({
      attributes: ["id", "name"],
      where: {
        [Op.or]: names.map((n) => {
          return {
            name: {
              [Op.like]: `%${n}%`,
            },
          };
        }),
      },
      include: [
        {
          model: Rank,
          as: "ranks",
          attributes: ["matchCount"],
        },
        {
          attributes: ["classname", "seasonImg"],
          model: Season,
          required: true,
        },
      ],
    });
  }

  const limit = +count;
  let offset = 0;
  if (+current_page > 1) offset = limit * (+current_page - 1);

  return Player.findAll({
    attributes: ["id", "name"],
    where: {
      [Op.or]: names.map((n) => {
        return {
          name: {
            [Op.like]: `%${n}%`,
          },
        };
      }),
    },
    include: [
      {
        model: Rank,
        as: "ranks",
        required: false,
        attributes: ["matchCount"],
      },
      {
        attributes: ["classname", "seasonImg"],
        model: Season,
        required: true,
      },
    ],
  }).then((data) => {
    const deepCopyData = JSON.parse(JSON.stringify(data));

    deepCopyData.map((player: { ranks: any; count: number }) => {
      let totalCount = 0;
      player.ranks.forEach((count: any) => {
        totalCount += count.matchCount;
      });
      player.count = totalCount;
      delete player.ranks;
    });

    deepCopyData.sort(function (a: any, b: any) {
      return b.count - a.count;
    });
    return deepCopyData.slice(offset, offset + +count);
  });
}

export async function getPlayerInfo(id: string) {
  return Player.findOne({
    where: { id },
  });
}

export async function totalPlayerCount(names: string[]) {
  return Player.findAndCountAll({
    where: {
      [Op.or]: names.map((n) => {
        return {
          name: {
            [Op.like]: `%${n}%`,
          },
        };
      }),
    },
  });
}
