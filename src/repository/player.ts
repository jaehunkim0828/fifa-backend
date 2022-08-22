import { Player, Season } from "../mysql/schema";
import SQ from "sequelize";

const Op = SQ.Op;

export async function getplayerAllSeason(name: string, count: string, current_page: string) {
  const names = name.split(",").map((p) => p.trim());
  console.log(count);

  if (!+count) {
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
    limit: limit,
    offset: offset,
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
        attributes: ["classname", "seasonImg"],
        model: Season,
        required: true,
      },
    ],
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
