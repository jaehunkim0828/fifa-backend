import SQ from "sequelize";
import { PlayerInstance } from "../models/player.model";
import Position from "../models/position.model";
import { Player, Rank, Season, Nation, Team } from "../mysql/schema";

const Op = SQ.Op;

/** 검색한 선수 보여주기
 *  @argument search: { name: 선수이름, season: 시즌 아이디 }
 *  @argument count: 보여줄 선수 갯수
 *  @argument current_page: 현재 페이지
 */
export async function getplayerAllSeason(
  search: { name: string; season: string; position: string; nation: string; team: string },
  count: string,
  current_page: string
) {
  const names = search.name.split(",").map((p) => p.trim());
  const season = search.season.split(",");
  const position = search.position.split(",");

  if (!+count) {
    /** 선수 전체 다 보여주기 */
    return await Player.findAll({
      attributes: ["id", "name"],
      where: {
        [Op.and]: [
          {
            [Op.or]: names.map((n) => {
              return {
                name: {
                  [Op.like]: `%${n}%`,
                },
              };
            }),
          },
          hasValue(season, "seasonSeasonId"),
          hasValue(position, "positionId"),
        ],
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
      [Op.and]: [
        {
          [Op.or]: names.map((n) => {
            return {
              name: {
                [Op.like]: `%${n}%`,
              },
            };
          }),
        },
        hasValue(season, "seasonSeasonId"),
        hasPosition(position),
      ],
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
      hasNation(search.nation),
      havTeam(search.team),
    ],
    order: [["ovr", "DESC"]],
    group: ["spids.id", "teams.id"],
  }).then((data) => data.slice(offset, offset + limit));
}

function hasValue(value: string[], type: string) {
  if (value[0] === "") return {};
  return {
    [Op.or]: value.map((n) => {
      return {
        [type]: {
          [Op.like]: n,
        },
      };
    }),
  };
}

export async function getPlayerInfo(id: string) {
  return Player.findOne({
    where: { id },
  });
}

function hasPosition(value: string[]) {
  if (value[0] === "0") {
    return {
      positionId: {
        [Op.like]: value[0],
      },
    };
  } else if (value[0] === "") {
    return {
      positionId: {
        [Op.not]: "0", //골키퍼 빼기
      },
    };
  } else {
    return {
      [Op.or]: value.map((n) => {
        return {
          positionId: {
            [Op.like]: n,
          },
        };
      }),
    };
  }
}

function hasNation(value: string) {
  if (value !== "")
    return {
      model: Nation,
      where: {
        name: {
          [Op.like]: `%${value}%`,
        },
      },
    };
  return {
    model: Nation,
  };
}

function havTeam(value: string) {
  if (value !== "")
    return {
      model: Team,
      where: {
        name: {
          [Op.like]: `%${value}%`,
        },
      },
    };
  return {
    model: Team,
  };
}

export async function totalPlayerCount(names: string[], season: string[], position: string[], nation: string, team: string) {
  return Player.findAndCountAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: names.map((n) => {
            return {
              name: {
                [Op.like]: `%${n}%`,
              },
            };
          }),
        },
        hasValue(season, "seasonSeasonId"),
        hasPosition(position),
      ],
    },
    include: [hasNation(nation), havTeam(team)],
    group: ["spids.id", "teams.id"],
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
