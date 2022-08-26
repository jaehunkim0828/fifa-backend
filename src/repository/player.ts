import SQ from "sequelize";
import { PlayerInstance } from "../models/player.model";
import Position from "../models/position.model";
import { Player, Rank, Season } from "../mysql/schema";

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
    attributes: {
      include: ["id", "name", [SQ.fn("Sum", SQ.col("ranks.matchCount")), "total"]],
    },
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
        attributes: [],
      },
      {
        attributes: ["classname", "seasonImg"],
        model: Season,
        required: true,
      },
      {
        attributes: ["desc", "part"],
        model: Position,
        required: false,
      },
    ],
    order: [[SQ.fn("Sum", SQ.col("ranks.matchCount")), "DESC"]],
    group: ["spids.id"],
  }).then((data) => data.slice(offset, offset + limit));
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

/** 경기수가 가장 많은 포지션중 패스 시도가 가장많은 포지션
   * @return: {
        "id": nubmer,
        "name": string,
        "positionId": null | number,
        "ranks": [
            {
                "matchCount": number,
                "position": number
            }
        ]
    }
  */
export async function findPostionByMc(spid: string): Promise<PlayerInstance | null> {
  return Player.findOne({
    attributes: ["id", "name", "positionId"],
    where: {
      id: spid,
    },
    include: [
      {
        model: Rank,
        as: "ranks",
        required: true,
        attributes: ["matchCount", "position"],
        separate: true,
        limit: 1,
        order: [
          ["matchCount", "DESC"],
          ["passTry", "DESC"],
        ],
      },
    ],
  });
}
/** 특정 선수 메인 포지션 업데이트해주기*/
export async function updatePosition(position: string, id: number) {
  return Player.update({ positionId: position }, { where: { id } });
}
